/**
 * Character Data Management Module
 * Handles character data collection, storing, loading, and application
 */

// Module scope collection of function references from other modules
const moduleRegistry = {
    portrait: {
        get: null,
        apply: null
    },
    spells: {
        collect: null,
        apply: null
    },
    attacks: {
        collect: null,
        apply: null
    }
};

// Register external module functions
function registerModuleFunction(module, functionName, func) {
    if (!moduleRegistry[module]) {
        moduleRegistry[module] = {};
    }
    moduleRegistry[module][functionName] = func;
}

// Initialize module registrations when document is ready
document.addEventListener('DOMContentLoaded', function () {
    // Register portrait functions
    if (typeof getPortraitData === 'function') {
        registerModuleFunction('portrait', 'get', getPortraitData);
    }

    if (typeof applyPortraitData === 'function') {
        registerModuleFunction('portrait', 'apply', applyPortraitData);
    }

    // Register spells functions
    if (typeof collectSpells === 'function') {
        registerModuleFunction('spells', 'collect', collectSpells);
    }

    if (typeof applySpells === 'function') {
        registerModuleFunction('spells', 'apply', applySpells);
    }

    // Register attacks functions
    if (typeof collectAttacks === 'function') {
        registerModuleFunction('attacks', 'collect', collectAttacks);
    }

    if (typeof applyAttacks === 'function') {
        registerModuleFunction('attacks', 'apply', applyAttacks);
    }
});

/**
 * Collects all character data from the sheet
 * @returns {Object} Complete character data object
 */
function collectCharacterData() {
    const data = {
        portrait: moduleRegistry.portrait.get ? moduleRegistry.portrait.get() : null,
        basicInfo: collectBasicInfo(),
        abilities: collectAbilities(),
        combat: collectCombatStats(),
        savingThrows: collectSavingThrows(),
        skills: collectSkills(),
        languages: collectLanguages(),
        proficiencies: collectProficiencies(),
        features: collectFeatures(),
        spells: moduleRegistry.spells.collect ? moduleRegistry.spells.collect() : {},
        equipment: collectEquipment(),
        attacks: moduleRegistry.attacks.collect ? moduleRegistry.attacks.collect() : [],
        money: collectMoney(),
        personality: collectPersonality(),
        notes: safeGetElementValue("notes", "")
    };

    // Save the character data to localStorage for recovery
    try {
        localStorage.setItem('lastCharacter', JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to save character to localStorage:', error);
    }

    return data;
}

/**
 * Applies character data to the sheet
 * @param {Object} data - Character data to apply
 */
function applyCharacterData(data) {
    if (!data) return;

    // Apply portrait if available
    if (data.portrait && moduleRegistry.portrait.apply) {
        moduleRegistry.portrait.apply(data.portrait);
    }

    // Apply each section data
    if (data.basicInfo) applyBasicInfo(data.basicInfo);
    if (data.abilities) applyAbilities(data.abilities);
    if (data.combat) applyCombatStats(data.combat);
    if (data.savingThrows) applySavingThrows(data.savingThrows);
    if (data.skills) applySkills(data.skills);
    if (data.languages) applyLanguages(data.languages);
    if (data.proficiencies) applyProficiencies(data.proficiencies);
    if (data.features) applyFeatures(data.features);

    // Apply spells if available
    if (data.spells && moduleRegistry.spells.apply) {
        moduleRegistry.spells.apply(data.spells);
    }

    // Apply equipment
    if (data.equipment) applyEquipment(data.equipment);

    // Apply attacks if available
    if (data.attacks && moduleRegistry.attacks.apply) {
        moduleRegistry.attacks.apply(data.attacks);
    }

    if (data.money) applyMoney(data.money);
    if (data.personality) applyPersonality(data.personality);

    // Apply notes
    const notesElement = document.getElementById("notes");
    if (notesElement && data.notes !== undefined) {
        notesElement.value = data.notes;
    }

    // Update all calculated values
    updateAllModifiers();
}

/**
 * Safely gets the value of an element, with fallback
 * @param {string} elementId - ID of the element
 * @param {*} defaultValue - Default value if element doesn't exist
 * @returns {*} Element value or default
 */
function safeGetElementValue(elementId, defaultValue = '') {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        return element.value;
    } else {
        return element.textContent;
    }
}

/**
 * Safely sets the value of an element
 * @param {string} elementId - ID of the element
 * @param {*} value - Value to set
 */
function safeSetElementValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = value;
    } else {
        element.textContent = value;
    }
}

/**
 * Collects basic character information
 * @returns {Object} Basic character info
 */
function collectBasicInfo() {
    return {
        name: safeGetElementValue("character-name"),
        level: safeGetElementValue("level", "1"),
        race: safeGetElementValue("race"),
        class: safeGetElementValue("class"),
        background: safeGetElementValue("background"),
        alignment: safeGetElementValue("alignment")
    };
}

/**
 * Collects character abilities
 * @returns {Object} Character abilities scores
 */
function collectAbilities() {
    const abilities = {};
    document.querySelectorAll(".ability").forEach((ability) => {
        const abilityType = ability.dataset.ability;
        const score = ability.querySelector(".ability-score").value;
        abilities[abilityType] = parseInt(score) || 10;
    });
    return abilities;
}

/**
 * Collects combat stats
 * @returns {Object} Combat statistics
 */
function collectCombatStats() {
    return {
        armorClass: safeGetElementValue("armor-class", "10"),
        initiative: safeGetElementValue("initiative", "0"),
        speed: safeGetElementValue("speed", "9m"),
        hp: {
            current: safeGetElementValue("current-hp", "10"),
            max: safeGetElementValue("max-hp", "10")
        }
    };
}

/**
 * Collects saving throw proficiencies
 * @returns {Object} Saving throw proficiencies
 */
function collectSavingThrows() {
    const savingThrows = {};
    document.querySelectorAll("#saving-throws .skill-item").forEach((save) => {
        const saveType = save.dataset.skill;
        const isProficient = save.querySelector(".proficient").classList.contains("is-proficient");
        savingThrows[saveType] = isProficient;
    });
    return savingThrows;
}

/**
 * Collects skill proficiencies
 * @returns {Object} Skill proficiencies
 */
function collectSkills() {
    const skills = {};
    document.querySelectorAll("#skills-list .skill-item").forEach((skill) => {
        const skillName = skill.dataset.skill;
        const isProficient = skill.querySelector(".proficient").classList.contains("is-proficient");
        skills[skillName] = isProficient;
    });
    return skills;
}

/**
 * Collects known languages
 * @returns {Array} List of languages
 */
function collectLanguages() {
    const languages = [];
    document.querySelectorAll("#languages-list .tag").forEach((tag) => {
        const langText = tag.querySelector("span").textContent;
        if (langText) languages.push(langText);
    });
    return languages;
}

/**
 * Collects proficiencies
 * @returns {Array} List of proficiencies
 */
function collectProficiencies() {
    const proficiencies = [];
    document.querySelectorAll("#proficiencies-list .tag").forEach((tag) => {
        const profText = tag.querySelector("span").textContent;
        if (profText) proficiencies.push(profText);
    });
    return proficiencies;
}

/**
 * Collects character features
 * @returns {Array} Character features
 */
function collectFeatures() {
    const features = [];
    document.querySelectorAll("#features-container .trait").forEach((feature) => {
        const nameInput = feature.querySelector('input[type="text"]');
        const descInput = feature.querySelector("textarea");
        const hasLimitedUse = feature.querySelector('input[type="checkbox"]').checked;

        let usesData = null;
        if (hasLimitedUse) {
            usesData = {
                current: parseInt(feature.querySelector(".counter-value").textContent) || 0,
                max: parseInt(feature.querySelector('.counter-container input[type="number"]').value) || 1
            };
        }

        features.push({
            name: nameInput.value,
            description: descInput.value,
            limitedUse: hasLimitedUse,
            uses: usesData
        });
    });
    return features;
}

/**
 * Collects equipment
 * @returns {Array} Equipment items
 */
function collectEquipment() {
    const equipment = [];
    document.querySelectorAll("#equipment-list .equipment-item").forEach((item) => {
        const nameSpan = item.querySelector("span");
        const checkbox = item.querySelector(".equipment-checkbox");

        if (nameSpan) {
            equipment.push({
                name: nameSpan.textContent,
                equipped: checkbox ? checkbox.checked : false
            });
        }
    });
    return equipment;
}

/**
 * Collects money amounts
 * @returns {Object} Money amounts
 */
function collectMoney() {
    return {
        gold: safeGetElementValue("gold", "0"),
        silver: safeGetElementValue("silver", "0"),
        copper: safeGetElementValue("copper", "0")
    };
}

/**
 * Collects personality traits
 * @returns {Object} Personality traits
 */
function collectPersonality() {
    return {
        traits: safeGetElementValue("personality-traits"),
        ideals: safeGetElementValue("ideals"),
        bonds: safeGetElementValue("bonds"),
        flaws: safeGetElementValue("flaws")
    };
}

/**
 * Applies basic info to the character sheet
 * @param {Object} basicInfo - Basic info to apply
 */
function applyBasicInfo(basicInfo) {
    if (!basicInfo) return;

    safeSetElementValue("character-name", basicInfo.name || "");
    safeSetElementValue("level", basicInfo.level || "1");
    safeSetElementValue("race", basicInfo.race || "");
    safeSetElementValue("class", basicInfo.class || "");
    safeSetElementValue("background", basicInfo.background || "");
    safeSetElementValue("alignment", basicInfo.alignment || "");
}

/**
 * Applies abilities to the character sheet
 * @param {Object} abilities - Abilities to apply
 */
function applyAbilities(abilities) {
    if (!abilities) return;

    for (const [ability, score] of Object.entries(abilities)) {
        const abilityEl = document.querySelector(`.ability[data-ability="${ability}"]`);
        if (abilityEl) {
            const scoreInput = abilityEl.querySelector(".ability-score");
            if (scoreInput) {
                scoreInput.value = score;
                updateAbilityMod(scoreInput);
            }
        }
    }
}

/**
 * Applies combat stats to the character sheet
 * @param {Object} combat - Combat stats to apply
 */
function applyCombatStats(combat) {
    if (!combat) return;

    safeSetElementValue("armor-class", combat.armorClass || "10");
    safeSetElementValue("initiative", combat.initiative || "0");
    safeSetElementValue("speed", combat.speed || "9m");

    if (combat.hp) {
        safeSetElementValue("current-hp", combat.hp.current || "10");
        safeSetElementValue("max-hp", combat.hp.max || "10");
    }
}

/**
 * Applies saving throw proficiencies to the character sheet
 * @param {Object} savingThrows - Saving throw proficiencies to apply
 */
function applySavingThrows(savingThrows) {
    if (!savingThrows) return;

    for (const [save, isProficient] of Object.entries(savingThrows)) {
        const saveEl = document.querySelector(`#saving-throws .skill-item[data-skill="${save}"]`);
        if (saveEl) {
            const profEl = saveEl.querySelector(".proficient");
            if (profEl) {
                if (isProficient) {
                    profEl.classList.add("is-proficient");
                } else {
                    profEl.classList.remove("is-proficient");
                }
            }
        }
    }
}

/**
 * Applies skill proficiencies to the character sheet
 * @param {Object} skills - Skill proficiencies to apply
 */
function applySkills(skills) {
    if (!skills) return;

    for (const [skill, isProficient] of Object.entries(skills)) {
        const skillEl = document.querySelector(`#skills-list .skill-item[data-skill="${skill}"]`);
        if (skillEl) {
            const profEl = skillEl.querySelector(".proficient");
            if (profEl) {
                if (isProficient) {
                    profEl.classList.add("is-proficient");
                } else {
                    profEl.classList.remove("is-proficient");
                }
            }
        }
    }
}

/**
 * Creates a tag element for languages or proficiencies
 * @param {string} text - Text content for the tag
 * @returns {HTMLElement} Tag element
 */
function createTagElement(text) {
    const tagEl = document.createElement("div");
    tagEl.className = "tag";

    tagEl.innerHTML = `
      <span>${text}</span>
      <button type="button" aria-label="Remove ${text}">✕</button>
    `;

    // Add click event to remove button
    const removeBtn = tagEl.querySelector("button");
    removeBtn.addEventListener("click", function () {
        tagEl.remove();
    });

    return tagEl;
}

/**
 * Applies languages to the character sheet
 * @param {Array} languages - Languages to apply
 */
function applyLanguages(languages) {
    if (!languages || !languages.length) return;

    const languagesList = document.getElementById("languages-list");
    if (!languagesList) return;

    // Clear existing languages
    languagesList.innerHTML = "";

    // Add each language as a tag
    languages.forEach(language => {
        languagesList.appendChild(createTagElement(language));
    });
}

/**
 * Applies proficiencies to the character sheet
 * @param {Array} proficiencies - Proficiencies to apply
 */
function applyProficiencies(proficiencies) {
    if (!proficiencies || !proficiencies.length) return;

    const proficienciesList = document.getElementById("proficiencies-list");
    if (!proficienciesList) return;

    // Clear existing proficiencies
    proficienciesList.innerHTML = "";

    // Add each proficiency as a tag
    proficiencies.forEach(proficiency => {
        proficienciesList.appendChild(createTagElement(proficiency));
    });
}

/**
 * Applies features to the character sheet
 * @param {Array} features - Features to apply
 */
function applyFeatures(features) {
    if (!features || !features.length) return;

    const featuresContainer = document.getElementById("features-container");
    if (!featuresContainer) return;

    // Clear existing features
    featuresContainer.innerHTML = "";

    // Add each feature
    features.forEach(feature => {
        const featureDiv = document.createElement("div");
        featureDiv.className = "trait";

        let usesHtml = "";
        if (feature.limitedUse && feature.uses) {
            usesHtml = `
          <div class="limited-uses">
            <div class="limited-use-item">
              <label><input type="checkbox" checked> Uso limitado</label>
              <div class="counter-container" style="margin-left: 10px;">
                <button type="button" class="counter-button" aria-label="Decrease uses" onclick="adjustFeatureUses(this, -1)">-</button>
                <span class="counter-value">${feature.uses.current}</span>
                <button type="button" class="counter-button" aria-label="Increase uses" onclick="adjustFeatureUses(this, 1)">+</button>
                <span> / </span>
                <input type="number" value="${feature.uses.max}" min="1" aria-label="Maximum uses" style="width: 40px;">
              </div>
            </div>
          </div>
        `;
        } else {
            usesHtml = `
          <div class="limited-uses">
            <div class="limited-use-item">
              <label><input type="checkbox"> Uso limitado</label>
              <div class="counter-container" style="margin-left: 10px; display: none;">
                <button type="button" class="counter-button" aria-label="Decrease uses" onclick="adjustFeatureUses(this, -1)">-</button>
                <span class="counter-value">0</span>
                <button type="button" class="counter-button" aria-label="Increase uses" onclick="adjustFeatureUses(this, 1)">+</button>
                <span> / </span>
                <input type="number" value="1" min="1" aria-label="Maximum uses" style="width: 40px;">
              </div>
            </div>
          </div>
        `;
        }

        featureDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <input type="text" placeholder="Nombre del rasgo" aria-label="Feature name" style="width: auto; flex-grow: 1;" value="${escapeHTML(feature.name || '')}">
          <button type="button" aria-label="Remove feature" onclick="this.parentElement.parentElement.remove()" style="margin-left: 10px;">✕</button>
        </div>
        <textarea placeholder="Descripción del rasgo" aria-label="Feature description" style="width: 100%; margin-top: 5px; min-height: 60px;">${escapeHTML(feature.description || '')}</textarea>
        ${usesHtml}
      `;

        featuresContainer.appendChild(featureDiv);

        // Configure the toggle for showing/hiding the use counter
        const checkbox = featureDiv.querySelector('input[type="checkbox"]');
        const counterContainer = featureDiv.querySelector(".counter-container");

        checkbox.addEventListener("change", function () {
            counterContainer.style.display = this.checked ? "flex" : "none";
        });
    });
}

/**
 * Applies equipment to the character sheet
 * @param {Array} equipment - Equipment to apply
 */
function applyEquipment(equipment) {
    if (!equipment || !equipment.length) return;

    const equipmentList = document.getElementById("equipment-list");
    if (!equipmentList) return;

    // Clear existing equipment
    equipmentList.innerHTML = "";

    // Add each equipment item
    equipment.forEach(item => {
        const equipmentItem = document.createElement("div");
        equipmentItem.className = "equipment-item";
        equipmentItem.innerHTML = `
        <input type="checkbox" class="equipment-checkbox" aria-label="Equipped ${item.name}" ${item.equipped ? "checked" : ""}>
        <span>${escapeHTML(item.name || '')}</span>
        <button type="button" aria-label="Remove item" onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
      `;

        equipmentList.appendChild(equipmentItem);
    });
}

/**
 * Applies money values to the character sheet
 * @param {Object} money - Money values to apply
 */
function applyMoney(money) {
    if (!money) return;

    safeSetElementValue("gold", money.gold || "0");
    safeSetElementValue("silver", money.silver || "0");
    safeSetElementValue("copper", money.copper || "0");
}

/**
 * Applies personality traits to the character sheet
 * @param {Object} personality - Personality traits to apply
 */
function applyPersonality(personality) {
    if (!personality) return;

    safeSetElementValue("personality-traits", personality.traits || "");
    safeSetElementValue("ideals", personality.ideals || "");
    safeSetElementValue("bonds", personality.bonds || "");
    safeSetElementValue("flaws", personality.flaws || "");
}

/**
 * Exports character data to a JSON file for download
 */
function exportCharacterToJson() {
    try {
        const characterData = collectCharacterData();
        const characterName = characterData.basicInfo.name || "personaje";
        const characterClass = characterData.basicInfo.class || "clase";
        const filename = `${characterName}-${characterClass}.json`;

        const jsonBlob = new Blob([JSON.stringify(characterData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(jsonBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        }, 100);

        showNotification('Character saved successfully!');
    } catch (error) {
        console.error('Error exporting character:', error);
        showNotification('Failed to save character. Please try again.', 'error');
    }
}

/**
 * Imports character data from a JSON file
 * @param {Event} event - The change event from the file input
 */
function importCharacterFromJson(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const characterData = JSON.parse(e.target.result);
            applyCharacterData(characterData);
            showNotification('Character loaded successfully!');
        } catch (error) {
            console.error("Error importing character:", error);
            showNotification('Error loading character. The file may be corrupted.', 'error');
        }
    };

    reader.onerror = function () {
        showNotification('Error reading file. Please try again.', 'error');
    };

    reader.readAsText(file);
    fileInput.value = ""; // Reset to allow loading the same file again
}

/**
 * Shows a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info/error)
 */
function showNotification(message, type = 'info') {
    // Check if function exists in global scope
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback to alert for critical errors
        if (type === 'error') {
            alert(message);
        } else {
            console.log(message);
        }
    }
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