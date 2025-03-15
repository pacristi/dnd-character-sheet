// Añadir nuevos hechizos
function addSpell() {
    const spellName = document.getElementById("new-spell").value.trim();
    const spellLevel = document.getElementById("spell-level-select").value;

    if (!spellName) return;

    const spellsContainer = document.getElementById("spells-container");

    // Verificar si ya existe el nivel de hechizo
    let spellLevelContainer = document.querySelector(
        `.spell-level-container[data-level="${spellLevel}"]`
    );

    // Si no existe, crear el contenedor para ese nivel
    if (!spellLevelContainer) {
        spellLevelContainer = document.createElement("div");
        spellLevelContainer.className = "spell-level-container";
        spellLevelContainer.dataset.level = spellLevel;

        let levelTitle = "";
        let slotsHtml = "";

        if (spellLevel === "cantrip") {
            levelTitle = "Trucos (a voluntad)";
        } else {
            const levelNum = parseInt(spellLevel);
            const numSlots = getDefaultSlots(levelNum);
            levelTitle = `Nivel ${levelNum} (${numSlots} espacios)`;

            slotsHtml = '<div class="spell-slots">';
            for (let i = 0; i < numSlots; i++) {
                slotsHtml +=
                    '<div class="spell-slot" onclick="toggleSpellSlot(this)"></div>';
            }
            slotsHtml += "</div>";
        }

        spellLevelContainer.innerHTML = `
        <div class="spell-level">${levelTitle}</div>
        ${slotsHtml}
        <div class="spell-items"></div>
      `;

        // Insertar en el orden correcto
        let inserted = false;
        const containers = document.querySelectorAll(
            ".spell-level-container"
        );

        for (let container of containers) {
            const currentLevel = container.dataset.level;

            if (currentLevel === "cantrip") continue;

            if (
                spellLevel === "cantrip" ||
                parseInt(spellLevel) < parseInt(currentLevel)
            ) {
                spellsContainer.insertBefore(spellLevelContainer, container);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            spellsContainer.appendChild(spellLevelContainer);
        }
    }

    // Añadir el hechizo
    const spellItemsContainer =
        spellLevelContainer.querySelector(".spell-items");
    const spellItem = document.createElement("div");
    spellItem.className = "spell-item";
    spellItem.innerHTML = `
      <input type="checkbox" class="spell-checkbox">
      <span>${spellName}</span>
      <button onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
    `;

    spellItemsContainer.appendChild(spellItem);

    // Limpiar el campo
    document.getElementById("new-spell").value = "";
}

// Obtener el número por defecto de espacios de hechizo según el nivel
function getDefaultSlots(level) {
    const charLevel =
        parseInt(document.getElementById("level").textContent) || 1;

    // Simplificado para nivel 1-3 de personaje
    switch (level) {
        case 1:
            return charLevel < 3 ? 2 : 4;
        case 2:
            return charLevel < 5 ? 0 : 2;
        default:
            return 0; // Niveles superiores
    }
}

// Toggle para marcar/desmarcar espacios de hechizos
function toggleSpellSlot(element) {
    element.classList.toggle("used");
}