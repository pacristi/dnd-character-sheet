/**
 * Skills Module
 * Handles character skills, ability modifiers, and proficiencies
 */

// Constants for ability names and abbreviations
const ABILITY_ABBREVIATIONS = {
    str: "FUE",
    dex: "DES",
    con: "CON",
    int: "INT",
    wis: "SAB",
    cha: "CAR"
};

// Standard skills list with associated abilities
const SKILLS_LIST = [
    { name: "Acrobacias", ability: "dex" },
    { name: "Manejo de Animales", ability: "wis" },
    { name: "Arcanos", ability: "int" },
    { name: "Atletismo", ability: "str" },
    { name: "Engaño", ability: "cha" },
    { name: "Historia", ability: "int" },
    { name: "Perspicacia", ability: "wis" },
    { name: "Intimidación", ability: "cha" },
    { name: "Investigación", ability: "int" },
    { name: "Medicina", ability: "wis" },
    { name: "Naturaleza", ability: "int" },
    { name: "Percepción", ability: "wis" },
    { name: "Interpretación", ability: "cha" },
    { name: "Persuasión", ability: "cha" },
    { name: "Religión", ability: "int" },
    { name: "Juego de Manos", ability: "dex" },
    { name: "Sigilo", ability: "dex" },
    { name: "Supervivencia", ability: "wis" },
];

// Initialize module
document.addEventListener('DOMContentLoaded', function () {
    setupSkillsModule();
});

/**
 * Sets up the skills module
 */
function setupSkillsModule() {
    // Generate skills list
    generateSkillsList();

    // Add event listeners for ability score changes
    document.querySelectorAll(".ability-score").forEach(input => {
        input.addEventListener("change", function () {
            updateAbilityMod(this);
        });

        input.addEventListener("input", function () {
            validateAbilityScore(this);
        });
    });

    // Add event listener for character level changes
    const levelElement = document.getElementById("level");
    if (levelElement) {
        const levelObserver = new MutationObserver(() => updateAllModifiers());
        levelObserver.observe(levelElement, { childList: true, characterData: true, subtree: true });
    }
}

/**
 * Validates an ability score input
 * @param {HTMLElement} inputElement - The ability score input
 */
function validateAbilityScore(inputElement) {
    if (!inputElement) return;

    // Ensure the value is a number between 1 and 30
    let value = parseInt(inputElement.value) || 0;
    value = Math.max(1, Math.min(30, value));
    inputElement.value = value;
}

/**
 * Gets the abbreviation for an ability
 * @param {string} ability - Ability code
 * @returns {string} Ability abbreviation
 */
function getAbilityAbbreviation(ability) {
    return ABILITY_ABBREVIATIONS[ability] || ability.toUpperCase();
}

/**
 * Generates the skills list in the UI
 */
function generateSkillsList() {
    const skillsContainer = document.getElementById("skills-list");
    if (!skillsContainer) return;

    // Clear existing skills
    skillsContainer.innerHTML = "";

    // Create skill items
    SKILLS_LIST.forEach((skill) => {
        const abilityAbbrev = getAbilityAbbreviation(skill.ability);
        const skillId = skill.name.toLowerCase().replace(/\s+/g, "-");

        const skillItem = document.createElement("div");
        skillItem.className = "skill-item";
        skillItem.dataset.skill = skillId;
        skillItem.dataset.ability = skill.ability;

        skillItem.innerHTML = `
        <div class="proficient" role="checkbox" aria-checked="false" tabindex="0" aria-label="Proficiency in ${skill.name}" onclick="toggleProficiency(this)" onkeypress="if(event.key==='Enter'||event.key===' ')toggleProficiency(this)"></div>
        <span>${skill.name} (${abilityAbbrev})</span>
        <span class="skill-mod">+0</span>
      `;

        skillsContainer.appendChild(skillItem);
    });

    // Update all skill modifiers
    updateAllModifiers();
}

/**
 * Toggles proficiency for a skill or saving throw
 * @param {HTMLElement} element - The proficiency indicator element
 */
function toggleProficiency(element) {
    if (!element) return;

    const wasProficient = element.classList.contains("is-proficient");
    element.classList.toggle("is-proficient");

    // Update ARIA attributes
    element.setAttribute("aria-checked", !wasProficient);

    // Update all modifiers to reflect the change
    updateAllModifiers();
}

/**
 * Updates the modifier for an ability score
 * @param {HTMLElement} inputElement - The ability score input
 */
function updateAbilityMod(inputElement) {
    if (!inputElement) return;

    const score = parseInt(inputElement.value) || 0;
    const modifier = Math.floor((score - 10) / 2);

    const abilityEl = inputElement.closest(".ability");
    if (!abilityEl) return;

    const modElement = abilityEl.querySelector(".ability-mod");
    if (!modElement) return;

    modElement.textContent = modifier >= 0 ? `+${modifier}` : modifier;

    // Update all skills and saving throws related to this ability
    updateAllModifiers();
}

/**
 * Updates all skill and saving throw modifiers
 */
function updateAllModifiers() {
    // Get ability modifiers
    const abilityMods = {};
    document.querySelectorAll(".ability").forEach((ability) => {
        const abilityType = ability.dataset.ability;
        const modText = ability.querySelector(".ability-mod")?.textContent || "+0";
        abilityMods[abilityType] = parseInt(modText.replace("+", "")) || 0;
    });

    // Get proficiency bonus based on character level
    const level = parseInt(document.getElementById("level")?.textContent) || 1;
    const profBonus = calculateProficiencyBonus(level);

    // Update saving throws
    document.querySelectorAll("#saving-throws .skill-item").forEach((save) => {
        updateModifier(save, abilityMods, profBonus);
    });

    // Update skills
    document.querySelectorAll("#skills-list .skill-item").forEach((skill) => {
        updateModifier(skill, abilityMods, profBonus);
    });
}

/**
 * Updates a single modifier element
 * @param {HTMLElement} element - The skill or saving throw element
 * @param {Object} abilityMods - Object with ability modifiers
 * @param {number} profBonus - Proficiency bonus
 */
function updateModifier(element, abilityMods, profBonus) {
    // Get the relevant ability
    const ability = element.dataset.ability || element.dataset.skill?.split("-")[0];
    if (!ability) return;

    // Check if proficient
    const isProficient = element.querySelector(".proficient")?.classList.contains("is-proficient") || false;

    // Calculate the modifier
    const baseModifier = abilityMods[ability] || 0;
    const totalModifier = isProficient ? baseModifier + profBonus : baseModifier;

    // Update the display
    const modElement = element.querySelector(".skill-mod");
    if (modElement) {
        modElement.textContent = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;
    }
}

/**
 * Calculates proficiency bonus based on character level
 * @param {number} level - Character level
 * @returns {number} Proficiency bonus
 */
function calculateProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2;
}

/**
 * Adjusts a counter (level, inspiration, etc.)
 * @param {string} counterId - ID of the counter element
 * @param {number} change - Amount to change the counter by
 */
function adjustCounter(counterId, change) {
    const counterElement = document.getElementById(counterId);
    if (!counterElement) return;

    let currentValue = parseInt(counterElement.textContent) || 0;
    let newValue = currentValue + change;

    // Minimum value depends on counter
    let minValue = 1;  // Default for level

    // Apply range limits
    newValue = Math.max(minValue, newValue);

    // Update the counter
    counterElement.textContent = newValue;

    // If this is the level counter, update all modifiers
    if (counterId === "level") {
        updateAllModifiers();
    }
}