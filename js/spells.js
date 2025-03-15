/**
 * Spells Module
 * Handles spell management, creation, and visualization
 */

// Module state
const spellsState = {
    currentEditingSpell: null,
    spellDatabase: {} // For future implementation of spell lookup functionality
};

// Initialize the spells module
document.addEventListener('DOMContentLoaded', function () {
    setupSpellsEventHandlers();
});

/**
 * Sets up event handlers for the spells section
 */
function setupSpellsEventHandlers() {
    // Close spell modal on outside click
    const spellModal = document.getElementById('spell-detail-modal');
    if (spellModal) {
        window.addEventListener('click', function (event) {
            if (event.target === spellModal) {
                closeSpellModal();
            }
        });
    }

    // Add key handler for Escape to close modal
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && spellModal && spellModal.style.display === 'block') {
            closeSpellModal();
        }
    });
}

/**
 * Adds a new spell to the character sheet
 */
function addSpell() {
    const spellName = document.getElementById("new-spell").value.trim();

    if (!spellName) {
        showNotification("Please enter a spell name", "error");
        return;
    }

    const spellLevel = document.getElementById("spell-level-select").value;
    const castTime = document.getElementById("new-spell-cast-time").value.trim();
    const range = document.getElementById("new-spell-range").value.trim();
    const duration = document.getElementById("new-spell-duration").value.trim();
    const components = document.getElementById("new-spell-components").value.trim();
    const school = document.getElementById("new-spell-school").value;
    const description = document.getElementById("new-spell-description").value.trim();

    const spellsContainer = document.getElementById("spells-container");
    if (!spellsContainer) return;

    // Get or create the spell level container
    let spellLevelContainer = document.querySelector(
        `.spell-level-container[data-level="${spellLevel}"]`
    );

    // If this level doesn't exist yet, create it
    if (!spellLevelContainer) {
        spellLevelContainer = createSpellLevelContainer(spellLevel);
        insertSpellLevelInOrder(spellsContainer, spellLevelContainer);
    }

    // Create the spell data object
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

    // Add the spell to the container
    addSpellToContainer(spellLevelContainer, spellData);

    // Clear the form
    clearSpellForm();

    // Show success notification
    showNotification(`Added spell: ${spellName}`, "info");
}

/**
 * Creates a container for a spell level
 * @param {string} level - The spell level
 * @returns {HTMLElement} The spell level container
 */
function createSpellLevelContainer(level) {
    const container = document.createElement("div");
    container.className = "spell-level-container";
    container.dataset.level = level;

    let levelTitle = "";
    let slotsHtml = "";

    if (level === "cantrip") {
        levelTitle = "Trucos (a voluntad)";
    } else {
        const levelNum = parseInt(level);
        const numSlots = getDefaultSlots(levelNum);
        levelTitle = `Nivel ${levelNum} (${numSlots} espacios)`;

        slotsHtml = '<div class="spell-slots">';
        for (let i = 0; i < numSlots; i++) {
            slotsHtml += '<div class="spell-slot" onclick="toggleSpellSlot(this)" role="button" tabindex="0" aria-label="Spell slot"></div>';
        }
        slotsHtml += "</div>";
    }

    container.innerHTML = `
      <div class="spell-level">${levelTitle}</div>
      ${slotsHtml}
      <div class="spell-items"></div>
    `;

    return container;
}

/**
 * Inserts a spell level container in the correct order
 * @param {HTMLElement} parentContainer - The parent container for all spell levels
 * @param {HTMLElement} newContainer - The new spell level container to insert
 */
function insertSpellLevelInOrder(parentContainer, newContainer) {
    const level = newContainer.dataset.level;
    let inserted = false;

    // Get all existing containers
    const containers = parentContainer.querySelectorAll(".spell-level-container");

    // Insert in proper order (cantrips first, then numerically)
    for (let container of containers) {
        const currentLevel = container.dataset.level;

        // Skip past cantrips
        if (currentLevel === "cantrip") continue;

        // If our new container is a cantrip or its level is lower than current, insert before
        if (level === "cantrip" || (level !== "cantrip" && parseInt(level) < parseInt(currentLevel))) {
            parentContainer.insertBefore(newContainer, container);
            inserted = true;
            break;
        }
    }

    // If we didn't find a place to insert, append at the end
    if (!inserted) {
        parentContainer.appendChild(newContainer);
    }
}

/**
 * Adds a spell to its level container
 * @param {HTMLElement} container - The spell level container
 * @param {Object} spellData - The spell data object
 */
function addSpellToContainer(container, spellData) {
    const spellItemsContainer = container.querySelector(".spell-items");
    if (!spellItemsContainer) return;

    const spellItem = document.createElement("div");
    spellItem.className = "spell-item";
    spellItem.dataset.spell = JSON.stringify(spellData);

    spellItem.innerHTML = `
      <input type="checkbox" class="spell-checkbox" aria-label="Prepare ${spellData.name}" onchange="toggleSpellPrepared(this)">
      <span class="spell-name" role="button" tabindex="0" onclick="showSpellDetails(this)">${escapeHTML(spellData.name)}</span>
      <button class="spell-info-button" onclick="window.open('https://dnd5e.wikidot.com/spell:' + encodeURIComponent('${spellData.name}'), '_blank')" title="Ver detalles" aria-label="View spell details">ℹ️</button>
      <button onclick="removeSpell(this.parentElement)" aria-label="Remove spell" style="margin-left: auto; font-size: 10px;">✕</button>
    `;

    spellItemsContainer.appendChild(spellItem);
}

/**
 * Removes a spell from the character sheet
 * @param {HTMLElement} spellElement - The spell element to remove
 */
function removeSpell(spellElement) {
    if (!spellElement) return;

    // Get the spell data for the notification
    let spellName = "spell";
    try {
        const spellData = JSON.parse(spellElement.dataset.spell || "{}");
        spellName = spellData.name || "spell";
    } catch (e) {
        console.error("Error parsing spell data:", e);
    }

    // Remove the spell element
    spellElement.remove();

    // Show notification
    showNotification(`Removed spell: ${spellName}`, "info");

    // Check if the level container is now empty and remove it if needed
    cleanupEmptySpellLevels();
}

/**
 * Removes empty spell level containers
 */
function cleanupEmptySpellLevels() {
    const emptyContainers = document.querySelectorAll(".spell-level-container");

    emptyContainers.forEach(container => {
        const spellItems = container.querySelector(".spell-items");
        if (spellItems && !spellItems.hasChildNodes()) {
            // Only remove non-cantrip empty containers to avoid flickering
            if (container.dataset.level !== "cantrip") {
                container.remove();
            }
        }
    });
}

/**
 * Clears the spell form inputs
 */
function clearSpellForm() {
    document.getElementById("new-spell").value = "";
    document.getElementById("new-spell-cast-time").value = "";
    document.getElementById("new-spell-range").value = "";
    document.getElementById("new-spell-duration").value = "";
    document.getElementById("new-spell-components").value = "";
    document.getElementById("new-spell-description").value = "";
}

/**
 * Gets the default number of spell slots based on character level
 * @param {number} spellLevel - The spell level
 * @returns {number} The number of slots
 */
function getDefaultSlots(spellLevel) {
    const charLevel = parseInt(document.getElementById("level").textContent) || 1;

    // Simplified table based on standard spell slot progression
    const slotsByLevel = {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1st level character
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2nd level character
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3rd level character
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4th level character
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5th level character
        // Add more levels as needed
    };

    // Get slots for character level or use 1st level if not found
    const slots = slotsByLevel[charLevel] || slotsByLevel[1];

    // Spell level is 1-indexed in the array (level 1 spells at index 0)
    return spellLevel <= slots.length ? slots[spellLevel - 1] : 0;
}

/**
 * Toggles a spell slot between used and available
 * @param {HTMLElement} element - The spell slot element
 */
function toggleSpellSlot(element) {
    if (!element) return;
    element.classList.toggle("used");
    element.setAttribute("aria-checked", element.classList.contains("used"));
}

/**
 * Toggles a spell's prepared status
 * @param {HTMLElement} checkbox - The prepared checkbox
 */
function toggleSpellPrepared(checkbox) {
    if (!checkbox) return;

    const spellItem = checkbox.closest(".spell-item");
    if (!spellItem) return;

    try {
        const spellData = JSON.parse(spellItem.dataset.spell || "{}");
        spellData.prepared = checkbox.checked;
        spellItem.dataset.spell = JSON.stringify(spellData);
    } catch (e) {
        console.error("Error updating spell prepared status:", e);
    }
}

/**
 * Shows the spell details in the modal
 * @param {HTMLElement} element - The element that triggered the display
 */
function showSpellDetails(element) {
    if (!element) return;

    const spellItem = element.closest(".spell-item");
    if (!spellItem) return;

    try {
        const spellData = JSON.parse(spellItem.dataset.spell || "{}");

        // Save reference to the current spell for editing
        spellsState.currentEditingSpell = spellItem;

        // Fill the modal with spell data
        document.getElementById("modal-spell-name").textContent = spellData.name || "";
        document.getElementById("modal-spell-level").textContent =
            spellData.level === "cantrip" ? "Truco" : `Nivel ${spellData.level}`;
        document.getElementById("modal-spell-school").textContent = spellData.school || "Desconocida";
        document.getElementById("modal-spell-time").textContent = spellData.castTime || "1 acción";
        document.getElementById("modal-spell-range").textContent = spellData.range || "A ti mismo";
        document.getElementById("modal-spell-duration").textContent = spellData.duration || "Instantáneo";
        document.getElementById("modal-spell-components").textContent = spellData.components || "V, S";
        document.getElementById("modal-spell-description").textContent = spellData.description || "Sin descripción.";

        // Show the modal
        const modal = document.getElementById("spell-detail-modal");
        if (modal) modal.style.display = "block";

    } catch (e) {
        console.error("Error showing spell details:", e);
        showNotification("Error displaying spell details", "error");
    }
}

/**
 * Closes the spell detail modal
 */
function closeSpellModal() {
    // Hide the modal
    const modal = document.getElementById("spell-detail-modal");
    if (modal) modal.style.display = "none";

    // Clear the current spell reference
    spellsState.currentEditingSpell = null;
}

/**
 * Edits the current spell in the modal
 */
function editSpellInModal() {
    if (!spellsState.currentEditingSpell) return;

    try {
        const spellData = JSON.parse(spellsState.currentEditingSpell.dataset.spell || "{}");

        // Fill the form with the spell data
        document.getElementById("new-spell").value = spellData.name || "";
        document.getElementById("spell-level-select").value = spellData.level || "cantrip";
        document.getElementById("new-spell-cast-time").value = spellData.castTime || "";
        document.getElementById("new-spell-range").value = spellData.range || "";
        document.getElementById("new-spell-duration").value = spellData.duration || "";
        document.getElementById("new-spell-components").value = spellData.components || "";
        document.getElementById("new-spell-school").value = spellData.school || "Abjuración";
        document.getElementById("new-spell-description").value = spellData.description || "";

        // Delete the spell
        spellsState.currentEditingSpell.remove();
        cleanupEmptySpellLevels();

        // Clear the reference
        spellsState.currentEditingSpell = null;

        // Close the modal
        closeSpellModal();

        // Scroll to the form
        const spellAddForm = document.querySelector(".spell-add");
        if (spellAddForm) {
            spellAddForm.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (e) {
        console.error("Error editing spell:", e);
        showNotification("Error editing spell", "error");
    }
}

/**
 * Placeholder for spell database search
 */
function searchSpellDatabase() {
    // In a future implementation, this would connect to a spells API or database
    showNotification("Spell database search will be implemented in a future version.", "info");
}

/**
 * Collects all spell data from the character sheet
 * @returns {Object} Organized spell data
 */
function collectSpells() {
    const spells = {};

    document.querySelectorAll(".spell-level-container").forEach((container) => {
        const level = container.dataset.level;
        const spellItems = [];

        // Collect spell items
        container.querySelectorAll(".spell-item").forEach((item) => {
            try {
                // Get the complete spell data
                const spellData = JSON.parse(item.dataset.spell || "{}");

                // Update prepared status
                const preparedCheckbox = item.querySelector(".spell-checkbox");
                if (preparedCheckbox) {
                    spellData.prepared = preparedCheckbox.checked;
                }

                // Add to collection
                spellItems.push(spellData);
            } catch (e) {
                console.error("Error collecting spell data:", e);
            }
        });

        // Collect spell slot usage
        let slots = null;
        if (level !== "cantrip") {
            const slotElements = container.querySelectorAll(".spell-slot");
            slots = {
                total: slotElements.length,
                used: [...slotElements].filter(slot => slot.classList.contains("used")).length
            };
        }

        // Store level data
        spells[level] = {
            spells: spellItems,
            slots: slots
        };
    });

    return spells;
}

/**
 * Applies spell data to the character sheet
 * @param {Object} spellsData - The organized spell data
 */
function applySpells(spellsData) {
    if (!spellsData) return;

    const spellsContainer = document.getElementById("spells-container");
    if (!spellsContainer) return;

    // Clear existing spells
    spellsContainer.innerHTML = "";

    // Sort levels for proper order (cantrips first, then numerical)
    const orderedLevels = Object.keys(spellsData).sort((a, b) => {
        if (a === "cantrip") return -1;
        if (b === "cantrip") return 1;
        return parseInt(a) - parseInt(b);
    });

    // Add each level of spells
    orderedLevels.forEach(level => {
        const spellData = spellsData[level];

        // Only create containers for levels with spells
        if (spellData.spells && spellData.spells.length > 0) {
            // Create level container
            const spellLevelContainer = createSpellLevelContainer(level);

            // Set up spell slots if they exist
            if (level !== "cantrip" && spellData.slots) {
                const slotElements = spellLevelContainer.querySelectorAll(".spell-slot");
                for (let i = 0; i < Math.min(slotElements.length, spellData.slots.used); i++) {
                    slotElements[i].classList.add("used");
                    slotElements[i].setAttribute("aria-checked", "true");
                }
            }

            // Add each spell
            spellData.spells.forEach(spell => {
                addSpellToContainer(spellLevelContainer, spell);
            });

            // Add the container to the DOM
            spellsContainer.appendChild(spellLevelContainer);
        }
    });
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} unsafe - Unsafe string
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
 * Shows a notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification
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