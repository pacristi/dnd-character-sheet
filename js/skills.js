// Lista de habilidades para cargar dinámicamente
const skillsList = [
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

// Obtener la abreviación de la característica
function getAbilityAbbreviation(ability) {
    const abbrevMap = {
        str: "FUE",
        dex: "DES",
        con: "CON",
        int: "INT",
        wis: "SAB",
        cha: "CAR",
    };

    return abbrevMap[ability] || ability.toUpperCase();
}

// Generar la lista de habilidades dinámicamente
function generateSkillsList() {
    const skillsContainer = document.getElementById("skills-list");
    skillsContainer.innerHTML = "";

    skillsList.forEach((skill) => {
        const abilityAbbrev = getAbilityAbbreviation(skill.ability);
        const skillItem = document.createElement("div");
        skillItem.className = "skill-item";
        skillItem.dataset.skill = skill.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        skillItem.innerHTML = `
            <div class="proficient" onclick="toggleProficiency(this)"></div>
            <span>${skill.name} (${abilityAbbrev})</span>
            <span class="skill-mod">+0</span>
        `;

        skillsContainer.appendChild(skillItem);
    });

    // Actualizar todos los modificadores
    updateAllModifiers();
}

// Toggle para marcar/desmarcar competencias
function toggleProficiency(element) {
    element.classList.toggle("is-proficient");
    updateAllModifiers();
}

// Actualizar el modificador de una característica
function updateAbilityMod(inputElement) {
    const score = parseInt(inputElement.value) || 0;
    const modifier = Math.floor((score - 10) / 2);
    const abilityEl = inputElement.closest(".ability");
    const modElement = abilityEl.querySelector(".ability-mod");

    modElement.textContent = modifier >= 0 ? `+${modifier}` : modifier;

    // Actualizar todas las habilidades relacionadas
    updateAllModifiers();
}

// Actualizar todos los modificadores de salvaciones y habilidades
function updateAllModifiers() {
    // Obtener todos los modificadores de características
    const abilityMods = {};
    document.querySelectorAll(".ability").forEach((ability) => {
        const abilityType = ability.dataset.ability;
        const modText = ability.querySelector(".ability-mod").textContent;
        abilityMods[abilityType] = parseInt(modText.replace("+", ""));
    });

    // Actualizar salvaciones
    document
        .querySelectorAll("#saving-throws .skill-item")
        .forEach((save) => {
            const saveType = save.dataset.skill.split("-")[0];
            const isProficient = save
                .querySelector(".proficient")
                .classList.contains("is-proficient");
            const profBonus =
                parseInt(document.getElementById("level").textContent) >= 5
                    ? 3
                    : 2;

            let modValue = abilityMods[saveType] || 0;
            if (isProficient) {
                modValue += profBonus;
            }

            save.querySelector(".skill-mod").textContent =
                modValue >= 0 ? `+${modValue}` : modValue;
        });

    // Actualizar habilidades
    skillsList.forEach((skill) => {
        const skillEl = document.querySelector(
            `[data-skill="${skill.name.toLowerCase().replace(/\s+/g, "-")}"]`
        );
        if (skillEl) {
            const isProficient = skillEl
                .querySelector(".proficient")
                .classList.contains("is-proficient");
            const profBonus =
                parseInt(document.getElementById("level").textContent) >= 5
                    ? 3
                    : 2;

            let modValue = abilityMods[skill.ability] || 0;
            if (isProficient) {
                modValue += profBonus;
            }

            skillEl.querySelector(".skill-mod").textContent =
                modValue >= 0 ? `+${modValue}` : modValue;
        }
    });
}

// Ajustar contadores (nivel, inspiraciones, etc.)
function adjustCounter(counterId, change) {
    const counterElement = document.getElementById(counterId);
    let currentValue = parseInt(counterElement.textContent) || 0;

    currentValue = Math.max(1, currentValue + change);

    counterElement.textContent = currentValue;

    // Si es nivel, actualizar los modificadores que dependen de nivel
    if (counterId === "level") {
        updateAllModifiers();
    }
}