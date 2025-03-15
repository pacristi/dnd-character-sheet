/**
 * Attacks Module
 * Handles weapon attacks, creation, and dice rolls
 */

// Constants for weapon data
const WEAPONS_DATABASE = {
    // Melee weapons
    "Espada larga": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
    "Espada corta": { damage: "1d6", type: "perforante", properties: "Ligera, Sutil" },
    "Daga": { damage: "1d4", type: "perforante", properties: "Ligera, Sutil, Arrojadiza (alcance 6/18)" },
    "Estoque": { damage: "1d8", type: "perforante", properties: "Sutil" },
    "Hacha de mano": { damage: "1d6", type: "cortante", properties: "Ligera, Arrojadiza (alcance 6/18)" },
    "Bastón": { damage: "1d6", type: "contundente", properties: "Versátil (1d8)" },

    // Ranged weapons
    "Arco largo": { damage: "1d8", type: "perforante", properties: "Munición (alcance 45/180), Dos manos, Pesada" },
    "Arco corto": { damage: "1d6", type: "perforante", properties: "Munición (alcance 24/96), Dos manos" },
    "Ballesta ligera": { damage: "1d8", type: "perforante", properties: "Munición (alcance 24/96), Carga, Dos manos" },
    "Ballesta pesada": { damage: "1d10", type: "perforante", properties: "Munición (alcance 30/120), Carga, Pesada, Dos manos" }
};

// Initialize module
document.addEventListener('DOMContentLoaded', function () {
    setupAttacksEventListeners();
});

/**
 * Set up event listeners for the attacks section
 */
function setupAttacksEventListeners() {
    // Add attack on Enter key in the name field
    const nameField = document.getElementById("new-attack-name");
    if (nameField) {
        nameField.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addAttack();
            }
        });
    }

    // Auto-suggest weapon data when entering weapon name
    if (nameField) {
        nameField.addEventListener('input', function () {
            autoSuggestWeaponData(this.value);
        });
    }

    // Add button for auto-generating attacks from equipment
    const attacksSection = document.querySelector('.section h2:contains("Ataques y Armas")');
    if (attacksSection) {
        const autoGenButton = document.createElement('button');
        autoGenButton.textContent = 'Generar desde equipo';
        autoGenButton.className = 'secondary-button';
        autoGenButton.style.marginLeft = '10px';
        autoGenButton.addEventListener('click', generateAttacksFromEquipment);
        attacksSection.appendChild(autoGenButton);
    }
}

/**
 * Auto-suggests weapon data when entering a weapon name
 * @param {string} weaponName - Partial or complete weapon name
 */
function autoSuggestWeaponData(weaponName) {
    if (!weaponName) return;

    // Check for matching weapon in database
    for (const [name, data] of Object.entries(WEAPONS_DATABASE)) {
        if (name.toLowerCase().includes(weaponName.toLowerCase())) {
            // Auto-fill weapon data
            document.getElementById("new-attack-damage").value = data.damage;
            document.getElementById("new-attack-type").value = data.type;
            document.getElementById("new-attack-properties").value = data.properties;

            // Auto-fill range if it's a ranged weapon
            const isRanged = data.properties.includes("Munición") || data.properties.includes("alcance");
            document.getElementById("new-attack-range").value = isRanged ? "Distancia" : "Cuerpo a cuerpo";

            // Auto-calculate attack bonus
            const attackBonus = calculateAttackBonus(name, !isRanged);
            document.getElementById("new-attack-bonus").value = attackBonus;

            break;
        }
    }
}

/**
 * Adds a new attack to the character sheet
 */
function addAttack() {
    // Get form values
    const name = document.getElementById("new-attack-name").value.trim();
    const bonus = document.getElementById("new-attack-bonus").value.trim();
    const damage = document.getElementById("new-attack-damage").value.trim();
    const type = document.getElementById("new-attack-type").value;
    const range = document.getElementById("new-attack-range").value.trim();
    const properties = document.getElementById("new-attack-properties").value.trim();

    // Validate name
    if (!name) {
        showNotification("El ataque debe tener un nombre", "error");
        return;
    }

    // Create attack item
    const attacksList = document.getElementById("attacks-list");
    if (!attacksList) return;

    const attackItem = createAttackElement(name, bonus, damage, type, range, properties);
    attacksList.appendChild(attackItem);

    // Clear the form
    clearAttackForm();

    // Notify success
    showNotification(`Ataque añadido: ${name}`, "info");
}

/**
 * Creates an attack element with the given data
 * @param {string} name - Attack name
 * @param {string} bonus - Attack bonus
 * @param {string} damage - Damage formula
 * @param {string} type - Damage type
 * @param {string} range - Attack range
 * @param {string} properties - Weapon properties
 * @returns {HTMLElement} The attack element
 */
function createAttackElement(name, bonus, damage, type, range, properties) {
    const attackItem = document.createElement("div");
    attackItem.className = "attack-item";

    attackItem.innerHTML = `
      <div class="attack-col-name">${escapeHTML(name)}</div>
      <div class="attack-col-bonus">${escapeHTML(bonus)}</div>
      <div class="attack-col-damage">${escapeHTML(damage)}</div>
      <div class="attack-col-type">${escapeHTML(type)}</div>
      <div class="attack-col-range">${escapeHTML(range)}</div>
      <div class="attack-col-properties">${escapeHTML(properties)}</div>
      <div class="attack-col-actions">
        <button type="button" onclick="rollAttack(this)" title="Tirar ataque" aria-label="Roll attack with ${name}">🎲</button>
        <button type="button" onclick="this.parentElement.parentElement.remove()" title="Eliminar" aria-label="Remove attack">✕</button>
      </div>
    `;

    return attackItem;
}

/**
 * Clears the attack form inputs
 */
function clearAttackForm() {
    document.getElementById("new-attack-name").value = "";
    document.getElementById("new-attack-bonus").value = "";
    document.getElementById("new-attack-damage").value = "";
    document.getElementById("new-attack-range").value = "";
    document.getElementById("new-attack-properties").value = "";
}

/**
 * Calculates the attack bonus for a weapon
 * @param {string} weapon - Weapon name
 * @param {boolean} isMelee - Whether the weapon is melee
 * @returns {string} The calculated attack bonus
 */
function calculateAttackBonus(weapon, isMelee = true) {
    // Get ability modifier (STR for melee, DEX for ranged)
    const abilityType = isMelee ? 'str' : 'dex';
    const abilityEl = document.querySelector(`.ability[data-ability="${abilityType}"]`);
    const abilityMod = abilityEl ?
        parseInt(abilityEl.querySelector(".ability-mod").textContent.replace("+", "")) || 0 : 0;

    // Get proficiency bonus based on character level
    const level = parseInt(document.getElementById("level")?.textContent) || 1;
    const profBonus = level < 5 ? 2 : (level < 9 ? 3 : (level < 13 ? 4 : (level < 17 ? 5 : 6)));

    // Calculate total bonus
    return `+${abilityMod + profBonus}`;
}

/**
 * Rolls an attack and shows the result
 * @param {HTMLElement} button - The button that triggered the roll
 */
function rollAttack(button) {
    if (!button) return;

    const attackItem = button.parentElement.parentElement;
    if (!attackItem) return;

    // Get attack data
    const name = attackItem.querySelector(".attack-col-name").textContent;
    const bonus = attackItem.querySelector(".attack-col-bonus").textContent;
    const damage = attackItem.querySelector(".attack-col-damage").textContent;

    // Roll attack
    const attackRoll = rollDice(1, 20)[0];
    const bonusNum = parseInt(bonus.replace(/[^\d-]/g, '')) || 0;
    const attackTotal = attackRoll + bonusNum;

    // Check for critical hit or miss
    let critText = "";
    let critDamageMultiplier = 1;

    if (attackRoll === 20) {
        critText = " - ¡CRÍTICO!";
        critDamageMultiplier = 2;
    } else if (attackRoll === 1) {
        critText = " - ¡PIFIA!";
    }

    // Prepare result message
    let resultMessage = `Ataque con ${name}: ${attackRoll} ${bonus} = ${attackTotal}${critText}`;

    // Roll damage if available
    if (damage) {
        const damageResult = rollDamageFormula(damage, critDamageMultiplier);

        if (damageResult) {
            const critDamageText = critDamageMultiplier > 1 ? " (dados duplicados por crítico)" : "";
            resultMessage += `\nDaño: [${damageResult.rolls.join(', ')}] + ${damageResult.modifier} = ${damageResult.total}${critDamageText}`;
        }
    }

    // Show the result
    showDiceResult(resultMessage);
}

/**
 * Rolls dice for a damage formula
 * @param {string} formula - Damage formula (e.g. "1d8+3")
 * @param {number} diceMultiplier - Multiplier for number of dice (for crits)
 * @returns {Object|null} Damage roll results or null if invalid
 */
function rollDamageFormula(formula, diceMultiplier = 1) {
    // Parse the damage formula (e.g. "1d8+3")
    const damageMatch = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/i);

    if (!damageMatch) return null;

    const diceCount = parseInt(damageMatch[1]) || 1;
    const diceSides = parseInt(damageMatch[2]) || 6;
    const damageBonus = parseInt(damageMatch[3]) || 0;

    // Roll the dice
    const actualDiceCount = diceCount * diceMultiplier;
    const damageRolls = rollDice(actualDiceCount, diceSides);
    const damageTotal = damageRolls.reduce((sum, roll) => sum + roll, 0) + damageBonus;

    return {
        rolls: damageRolls,
        modifier: damageBonus,
        total: damageTotal
    };
}

/**
 * Rolls multiple dice
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides on the dice
 * @returns {Array} Array of roll results
 */
function rollDice(count, sides) {
    const rolls = [];

    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    return rolls;
}

/**
 * Shows a dice roll result to the user
 * @param {string} message - Result message to display
 */
function showDiceResult(message) {
    // Create custom result dialog
    const resultDialog = document.createElement('div');
    resultDialog.className = 'dice-result-dialog';
    resultDialog.style.position = 'fixed';
    resultDialog.style.top = '50%';
    resultDialog.style.left = '50%';
    resultDialog.style.transform = 'translate(-50%, -50%)';
    resultDialog.style.backgroundColor = '#f5e9d9';
    resultDialog.style.border = '3px solid #75482e';
    resultDialog.style.borderRadius = '10px';
    resultDialog.style.padding = '15px 20px';
    resultDialog.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    resultDialog.style.zIndex = '1000';
    resultDialog.style.maxWidth = '80%';
    resultDialog.style.whiteSpace = 'pre-wrap';

    // Format the message with some styling
    resultDialog.innerHTML = `
      <h3 style="margin-top: 0; color: #75482e; border-bottom: 1px solid #a58e62; padding-bottom: 5px;">
        Resultado de la tirada
      </h3>
      <div>${escapeHTML(message).replace(/\n/g, '<br>')}</div>
      <div style="text-align: right; margin-top: 15px;">
        <button type="button" onclick="this.parentElement.parentElement.remove()">Cerrar</button>
      </div>
    `;

    // Add to document
    document.body.appendChild(resultDialog);

    // Auto-remove after a timeout
    setTimeout(() => {
        if (resultDialog.parentNode) {
            resultDialog.remove();
        }
    }, 15000);
}

/**
 * Generates attacks from equipment items
 */
function generateAttacksFromEquipment() {
    let weaponsAdded = 0;

    // Get all equipment items
    document.querySelectorAll("#equipment-list .equipment-item").forEach(item => {
        const itemNameElement = item.querySelector("span");
        if (!itemNameElement) return;

        const itemName = itemNameElement.textContent;

        // Check all weapons in database
        for (const [weaponName, weaponData] of Object.entries(WEAPONS_DATABASE)) {
            if (itemName.toLowerCase().includes(weaponName.toLowerCase())) {
                // Skip if attack already exists
                const existingAttack = Array.from(document.querySelectorAll(".attack-col-name")).some(
                    nameCol => nameCol.textContent.toLowerCase() === weaponName.toLowerCase()
                );

                if (!existingAttack) {
                    // Determine if ranged
                    const isRanged = weaponData.properties.includes("Munición") ||
                        weaponData.properties.includes("alcance") ||
                        weaponName.includes("Arco") ||
                        weaponName.includes("Ballesta");

                    // Add the attack
                    const attacksList = document.getElementById("attacks-list");
                    if (attacksList) {
                        const attackBonus = calculateAttackBonus(weaponName, !isRanged);
                        const attackElement = createAttackElement(
                            weaponName,
                            attackBonus,
                            weaponData.damage,
                            weaponData.type,
                            isRanged ? "Distancia" : "Cuerpo a cuerpo",
                            weaponData.properties
                        );

                        attacksList.appendChild(attackElement);
                        weaponsAdded++;
                    }
                }
            }
        }
    });

    // Show result message
    if (weaponsAdded > 0) {
        showNotification(`Se han añadido ${weaponsAdded} ataques desde el equipo.`, "info");
    } else {
        showNotification("No se han encontrado armas nuevas en el equipo.", "info");
    }
}

/**
 * Collects all attacks from the character sheet
 * @returns {Array} Array of attack objects
 */
function collectAttacks() {
    const attacks = [];

    document.querySelectorAll("#attacks-list .attack-item").forEach((item) => {
        attacks.push({
            name: item.querySelector(".attack-col-name")?.textContent || "",
            bonus: item.querySelector(".attack-col-bonus")?.textContent || "",
            damage: item.querySelector(".attack-col-damage")?.textContent || "",
            type: item.querySelector(".attack-col-type")?.textContent || "",
            range: item.querySelector(".attack-col-range")?.textContent || "",
            properties: item.querySelector(".attack-col-properties")?.textContent || ""
        });
    });

    return attacks;
}

/**
 * Applies attacks to the character sheet
 * @param {Array} attacks - Array of attack objects
 */
function applyAttacks(attacks) {
    if (!attacks || !attacks.length) return;

    const attacksList = document.getElementById("attacks-list");
    if (!attacksList) return;

    // Clear existing attacks
    attacksList.innerHTML = "";

    // Add each attack
    attacks.forEach(attack => {
        const attackElement = createAttackElement(
            attack.name,
            attack.bonus,
            attack.damage,
            attack.type,
            attack.range,
            attack.properties
        );

        attacksList.appendChild(attackElement);
    });
}

/**
 * Escapes HTML special characters
 * @param {string} unsafe - String to escape
 * @returns {string} Escaped string
 */
function escapeHTML(unsafe) {
    if (typeof unsafe !== 'string') return '';

    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Shows a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Notification type (info/error)
 */
function showNotification(message, type = 'info') {
    // Use global function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback for critical errors
        if (type === 'error') {
            alert(message);
        } else {
            console.log(message);
        }
    }
}