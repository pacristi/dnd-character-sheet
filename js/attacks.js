/**
 * Módulo de Ataques y Armas
 * Maneja la creación, edición y eliminación de ataques de armas
 */

// Añadir nuevo ataque
function addAttack() {
    const name = document.getElementById("new-attack-name").value.trim();
    const bonus = document.getElementById("new-attack-bonus").value.trim();
    const damage = document.getElementById("new-attack-damage").value.trim();
    const type = document.getElementById("new-attack-type").value;
    const range = document.getElementById("new-attack-range").value.trim();
    const properties = document.getElementById("new-attack-properties").value.trim();

    if (!name) {
        alert("El ataque debe tener un nombre");
        return;
    }

    const attacksList = document.getElementById("attacks-list");
    const attackItem = document.createElement("div");
    attackItem.className = "attack-item";

    attackItem.innerHTML = `
      <div class="attack-col-name">${name}</div>
      <div class="attack-col-bonus">${bonus}</div>
      <div class="attack-col-damage">${damage}</div>
      <div class="attack-col-type">${type}</div>
      <div class="attack-col-range">${range}</div>
      <div class="attack-col-properties">${properties}</div>
      <div class="attack-col-actions">
        <button onclick="rollAttack(this)" title="Tirar ataque">🎲</button>
        <button onclick="this.parentElement.parentElement.remove()" title="Eliminar">✕</button>
      </div>
    `;

    attacksList.appendChild(attackItem);

    // Limpiar los campos
    document.getElementById("new-attack-name").value = "";
    document.getElementById("new-attack-bonus").value = "";
    document.getElementById("new-attack-damage").value = "";
    document.getElementById("new-attack-range").value = "";
    document.getElementById("new-attack-properties").value = "";
}

// Función para calcular automáticamente el bonificador de ataque
function calculateAttackBonus(weapon, isMelee = true) {
    // Obtener mod de FUE o DES según si es cuerpo a cuerpo o a distancia
    const abilityEl = document.querySelector(`.ability[data-ability="${isMelee ? 'str' : 'dex'}"]`);
    const abilityMod = parseInt(abilityEl.querySelector(".ability-mod").textContent.replace("+", "")) || 0;

    // Obtener bonificador de competencia
    const level = parseInt(document.getElementById("level").textContent) || 1;
    const profBonus = level < 5 ? 2 : (level < 9 ? 3 : (level < 13 ? 4 : (level < 17 ? 5 : 6)));

    // Suponemos que el personaje es competente con el arma
    return `+${abilityMod + profBonus}`;
}

// Tirar un ataque
function rollAttack(button) {
    const attackItem = button.parentElement.parentElement;
    const name = attackItem.querySelector(".attack-col-name").textContent;
    const bonus = attackItem.querySelector(".attack-col-bonus").textContent;
    const damage = attackItem.querySelector(".attack-col-damage").textContent;

    // Tirar d20 para el ataque
    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const bonusNum = parseInt(bonus) || 0;
    const attackTotal = attackRoll + bonusNum;

    // Crítico en 20 natural
    let critText = "";
    if (attackRoll === 20) {
        critText = " - ¡CRÍTICO!";
    } else if (attackRoll === 1) {
        critText = " - ¡PIFIA!";
    }

    // Preparar mensaje de resultado
    let resultMessage = `Ataque con ${name}: ${attackRoll} ${bonus} = ${attackTotal}${critText}`;

    // Tirar daño si hay un valor
    if (damage) {
        // Parsear la expresión de daño (por ejemplo, "1d8+3")
        const damageMatch = damage.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/i);

        if (damageMatch) {
            const diceCount = parseInt(damageMatch[1]) || 1;
            const diceSides = parseInt(damageMatch[2]) || 6;
            const damageBonus = parseInt(damageMatch[3]) || 0;

            // Tirar dados de daño
            let damageRolls = [];
            let damageTotal = 0;

            // Si es crítico, duplicamos los dados
            const actualDiceCount = attackRoll === 20 ? diceCount * 2 : diceCount;

            for (let i = 0; i < actualDiceCount; i++) {
                const roll = Math.floor(Math.random() * diceSides) + 1;
                damageRolls.push(roll);
                damageTotal += roll;
            }

            // Añadir el bonificador al daño total
            damageTotal += damageBonus;

            // Añadir el resultado del daño al mensaje
            const critDamageText = attackRoll === 20 ? " (dados duplicados por crítico)" : "";
            resultMessage += `\nDaño: [${damageRolls.join(', ')}] + ${damageBonus} = ${damageTotal}${critDamageText}`;
        }
    }

    // Mostrar el resultado en una alerta
    alert(resultMessage);
}

// Recopilar todos los ataques
function collectAttacks() {
    const attacks = [];
    document.querySelectorAll("#attacks-list .attack-item").forEach((item) => {
        attacks.push({
            name: item.querySelector(".attack-col-name").textContent,
            bonus: item.querySelector(".attack-col-bonus").textContent,
            damage: item.querySelector(".attack-col-damage").textContent,
            type: item.querySelector(".attack-col-type").textContent,
            range: item.querySelector(".attack-col-range").textContent,
            properties: item.querySelector(".attack-col-properties").textContent
        });
    });
    return attacks;
}

// Aplicar ataques guardados a la ficha
function applyAttacks(attacks) {
    if (!attacks || !attacks.length) return;

    const attacksList = document.getElementById("attacks-list");
    attacksList.innerHTML = "";

    attacks.forEach(attack => {
        const attackItem = document.createElement("div");
        attackItem.className = "attack-item";

        attackItem.innerHTML = `
        <div class="attack-col-name">${attack.name}</div>
        <div class="attack-col-bonus">${attack.bonus}</div>
        <div class="attack-col-damage">${attack.damage}</div>
        <div class="attack-col-type">${attack.type}</div>
        <div class="attack-col-range">${attack.range}</div>
        <div class="attack-col-properties">${attack.properties}</div>
        <div class="attack-col-actions">
          <button onclick="rollAttack(this)" title="Tirar ataque">🎲</button>
          <button onclick="this.parentElement.parentElement.remove()" title="Eliminar">✕</button>
        </div>
      `;

        attacksList.appendChild(attackItem);
    });
}

// Evento para generar automáticamente ataques a partir del equipo
function generateAttacksFromEquipment() {
    // Obtener lista de armas comunes
    const commonWeapons = {
        "Espada larga": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
        "Espada corta": { damage: "1d6", type: "perforante", properties: "Ligera, Sutil" },
        "Daga": { damage: "1d4", type: "perforante", properties: "Ligera, Sutil, Arrojadiza (alcance 6/18)" },
        "Estoque": { damage: "1d8", type: "perforante", properties: "Sutil" },
        "Hacha de mano": { damage: "1d6", type: "cortante", properties: "Ligera, Arrojadiza (alcance 6/18)" },
        "Arco largo": { damage: "1d8", type: "perforante", properties: "Munición (alcance 45/180), Dos manos, Pesada" },
        "Arco corto": { damage: "1d6", type: "perforante", properties: "Munición (alcance 24/96), Dos manos" },
        "Bastón": { damage: "1d6", type: "contundente", properties: "Versátil (1d8)" },
        "Ballesta ligera": { damage: "1d8", type: "perforante", properties: "Munición (alcance 24/96), Carga, Dos manos" },
        "Ballesta pesada": { damage: "1d10", type: "perforante", properties: "Munición (alcance 30/120), Carga, Pesada, Dos manos" }
    };

    // Buscar en el equipo si hay armas
    document.querySelectorAll("#equipment-list .equipment-item").forEach(item => {
        const itemName = item.querySelector("span").textContent;

        // Buscar si la descripción del item contiene alguna arma común
        for (const [weaponName, weaponData] of Object.entries(commonWeapons)) {
            if (itemName.toLowerCase().includes(weaponName.toLowerCase())) {
                // Verificar si ya existe un ataque con este nombre
                const existingAttack = Array.from(document.querySelectorAll(".attack-col-name")).some(
                    nameCol => nameCol.textContent === weaponName
                );

                if (!existingAttack) {
                    // Determinar si es cuerpo a cuerpo o a distancia
                    const isRanged = weaponData.properties.includes("Munición") ||
                        weaponData.properties.includes("alcance") ||
                        weaponName.includes("Arco") ||
                        weaponName.includes("Ballesta");

                    // Calcular bonus de ataque
                    const attackBonus = calculateAttackBonus(weaponName, !isRanged);

                    // Crear el ataque
                    const attacksList = document.getElementById("attacks-list");
                    const attackItem = document.createElement("div");
                    attackItem.className = "attack-item";

                    attackItem.innerHTML = `
              <div class="attack-col-name">${weaponName}</div>
              <div class="attack-col-bonus">${attackBonus}</div>
              <div class="attack-col-damage">${weaponData.damage}</div>
              <div class="attack-col-type">${weaponData.type}</div>
              <div class="attack-col-range">${isRanged ? "Distancia" : "Cuerpo a cuerpo"}</div>
              <div class="attack-col-properties">${weaponData.properties}</div>
              <div class="attack-col-actions">
                <button onclick="rollAttack(this)" title="Tirar ataque">🎲</button>
                <button onclick="this.parentElement.parentElement.remove()" title="Eliminar">✕</button>
              </div>
            `;

                    attacksList.appendChild(attackItem);
                }
            }
        }
    });
}