/**
 * Módulo de Hechizos
 * Maneja la creación, visualización y gestión de hechizos
 */

// Variable global para almacenar el hechizo que se está editando actualmente
let currentEditingSpell = null;

// Añadir nuevo hechizo
function addSpell() {
    const spellName = document.getElementById("new-spell").value.trim();
    const spellLevel = document.getElementById("spell-level-select").value;
    const castTime = document.getElementById("new-spell-cast-time").value.trim();
    const range = document.getElementById("new-spell-range").value.trim();
    const duration = document.getElementById("new-spell-duration").value.trim();
    const components = document.getElementById("new-spell-components").value.trim();
    const school = document.getElementById("new-spell-school").value;
    const description = document.getElementById("new-spell-description").value.trim();

    if (!spellName) {
        alert("El hechizo debe tener un nombre");
        return;
    }

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

    // Crear el objeto de datos del hechizo
    const spellData = {
        name: spellName,
        level: spellLevel,
        castTime: castTime,
        range: range,
        duration: duration,
        components: components,
        school: school,
        description: description,
        prepared: false
    };

    // Añadir el hechizo
    const spellItemsContainer = spellLevelContainer.querySelector(".spell-items");
    const spellItem = document.createElement("div");
    spellItem.className = "spell-item";
    spellItem.dataset.spell = JSON.stringify(spellData);

    spellItem.innerHTML = `
    <input type="checkbox" class="spell-checkbox" onchange="toggleSpellPrepared(this)">
    <span class="spell-name" onclick="showSpellDetails(this)">${spellName}</span>
    <button class="spell-info-button" onclick="showSpellDetails(this.parentElement)" title="Ver detalles">ℹ️</button>
    <button onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
  `;

    spellItemsContainer.appendChild(spellItem);

    // Limpiar los campos
    clearSpellForm();
}

// Limpiar el formulario de hechizos
function clearSpellForm() {
    document.getElementById("new-spell").value = "";
    document.getElementById("new-spell-cast-time").value = "";
    document.getElementById("new-spell-range").value = "";
    document.getElementById("new-spell-duration").value = "";
    document.getElementById("new-spell-components").value = "";
    document.getElementById("new-spell-description").value = "";
}

// Obtener el número por defecto de espacios de hechizo según el nivel
function getDefaultSlots(level) {
    const charLevel = parseInt(document.getElementById("level").textContent) || 1;

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

// Toggle para marcar/desmarcar hechizos preparados
function toggleSpellPrepared(checkbox) {
    const spellItem = checkbox.closest(".spell-item");
    const spellData = JSON.parse(spellItem.dataset.spell);

    spellData.prepared = checkbox.checked;
    spellItem.dataset.spell = JSON.stringify(spellData);
}

// Mostrar detalles del hechizo
function showSpellDetails(element) {
    const spellItem = element.closest(".spell-item");
    const spellData = JSON.parse(spellItem.dataset.spell);

    // Guardar referencia al hechizo actual
    currentEditingSpell = spellItem;

    // Rellenar el modal con los datos del hechizo
    document.getElementById("modal-spell-name").textContent = spellData.name;
    document.getElementById("modal-spell-level").textContent =
        spellData.level === "cantrip" ? "Truco" : `Nivel ${spellData.level}`;
    document.getElementById("modal-spell-school").textContent = spellData.school || "Desconocida";
    document.getElementById("modal-spell-time").textContent = spellData.castTime || "1 acción";
    document.getElementById("modal-spell-range").textContent = spellData.range || "A ti mismo";
    document.getElementById("modal-spell-duration").textContent = spellData.duration || "Instantáneo";
    document.getElementById("modal-spell-components").textContent = spellData.components || "V, S";
    document.getElementById("modal-spell-description").textContent = spellData.description || "Sin descripción.";

    // Mostrar el modal
    document.getElementById("spell-detail-modal").style.display = "block";
}

// Cerrar el modal de detalles del hechizo
function closeSpellModal() {
    document.getElementById("spell-detail-modal").style.display = "none";
    currentEditingSpell = null;
}

// Editar hechizo en el modal
function editSpellInModal() {
    if (!currentEditingSpell) return;

    const spellData = JSON.parse(currentEditingSpell.dataset.spell);

    // Llenar el formulario con los datos del hechizo
    document.getElementById("new-spell").value = spellData.name;
    document.getElementById("spell-level-select").value = spellData.level;
    document.getElementById("new-spell-cast-time").value = spellData.castTime || "";
    document.getElementById("new-spell-range").value = spellData.range || "";
    document.getElementById("new-spell-duration").value = spellData.duration || "";
    document.getElementById("new-spell-components").value = spellData.components || "";
    document.getElementById("new-spell-school").value = spellData.school || "Abjuración";
    document.getElementById("new-spell-description").value = spellData.description || "";

    // Eliminar el hechizo actual
    currentEditingSpell.remove();
    currentEditingSpell = null;

    // Cerrar el modal
    closeSpellModal();

    // Hacer scroll hasta el formulario
    document.querySelector(".spell-add").scrollIntoView({ behavior: 'smooth' });
}

// Buscar hechizo en la base de datos (función de placeholder)
function searchSpellDatabase() {
    alert("Esta función permitiría buscar hechizos en una base de datos predefinida. Por ahora, puedes ingresar manualmente los datos del hechizo.");
}

// Recopilar datos de hechizos para guardar
function collectSpells() {
    const spells = {};
    document.querySelectorAll(".spell-level-container").forEach((container) => {
        const level = container.dataset.level;
        const spellItems = [];

        container.querySelectorAll(".spell-item").forEach((item) => {
            // Obtener los datos completos del hechizo
            const spellData = JSON.parse(item.dataset.spell);

            // Asegurarse de que el estado de preparado está actualizado
            spellData.prepared = item.querySelector(".spell-checkbox").checked;

            // Añadir el hechizo a la lista
            spellItems.push(spellData);
        });

        // Obtener información de espacios de hechizo
        let slots = null;
        if (level !== "cantrip") {
            const slotElements = container.querySelectorAll(".spell-slot");
            slots = {
                total: slotElements.length,
                used: [...slotElements].filter((slot) => slot.classList.contains("used")).length
            };
        }

        // Guardar la información del nivel
        spells[level] = {
            spells: spellItems,
            slots: slots
        };
    });

    return spells;
}

// Aplicar datos de hechizos guardados
function applySpells(spellsData) {
    if (!spellsData) return;

    const spellsContainer = document.getElementById("spells-container");
    spellsContainer.innerHTML = "";

    // Ordenar los niveles para que aparezcan en orden correcto
    const orderedLevels = Object.keys(spellsData).sort((a, b) => {
        if (a === "cantrip") return -1;
        if (b === "cantrip") return 1;
        return parseInt(a) - parseInt(b);
    });

    // Procesar cada nivel de hechizo
    orderedLevels.forEach(level => {
        const spellData = spellsData[level];

        // Crear el contenedor para este nivel
        const spellLevelContainer = document.createElement("div");
        spellLevelContainer.className = "spell-level-container";
        spellLevelContainer.dataset.level = level;

        let levelTitle = "";
        let slotsHtml = "";

        // Configurar título y espacios según nivel
        if (level === "cantrip") {
            levelTitle = "Trucos (a voluntad)";
        } else {
            const levelNum = parseInt(level);
            const slots = spellData.slots || { total: 0, used: 0 };
            levelTitle = `Nivel ${levelNum} (${slots.total} espacios)`;

            // Crear slots de hechizos
            slotsHtml = '<div class="spell-slots">';
            for (let i = 0; i < slots.total; i++) {
                const usedClass = i < slots.used ? "used" : "";
                slotsHtml += `<div class="spell-slot ${usedClass}" onclick="toggleSpellSlot(this)"></div>`;
            }
            slotsHtml += "</div>";
        }

        // Crear el HTML para los hechizos de este nivel
        let spellItemsHtml = '<div class="spell-items">';

        // Añadir cada hechizo
        spellData.spells.forEach(spell => {
            const spellItem = document.createElement("div");
            spellItem.className = "spell-item";
            spellItem.dataset.spell = JSON.stringify(spell);

            spellItem.innerHTML = `
        <input type="checkbox" class="spell-checkbox" onchange="toggleSpellPrepared(this)" ${spell.prepared ? "checked" : ""}>
        <span class="spell-name" onclick="showSpellDetails(this)">${spell.name}</span>
        <button class="spell-info-button" onclick="showSpellDetails(this.parentElement)" title="Ver detalles">ℹ️</button>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
      `;

            spellItemsHtml += spellItem.outerHTML;
        });

        spellItemsHtml += '</div>';

        // Construir el contenedor completo
        spellLevelContainer.innerHTML = `
      <div class="spell-level">${levelTitle}</div>
      ${slotsHtml}
      ${spellItemsHtml}
    `;

        // Añadir el contenedor al DOM
        spellsContainer.appendChild(spellLevelContainer);
    });

    // Asegurarse de que los eventos están asociados correctamente
    document.querySelectorAll(".spell-checkbox").forEach(checkbox => {
        checkbox.onchange = function () { toggleSpellPrepared(this); };
    });

    document.querySelectorAll(".spell-name").forEach(name => {
        name.onclick = function () { showSpellDetails(this); };
    });
}