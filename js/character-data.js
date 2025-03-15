/**
 * Módulo de gestión de datos de personaje
 * Maneja la recopilación, guardado, carga y aplicación de datos del personaje
 */

// Recopilar todos los datos del personaje
function collectCharacterData() {
    return {
        portrait: typeof getPortraitData === 'function' ? getPortraitData() : null,
        basicInfo: collectBasicInfo(),
        abilities: collectAbilities(),
        combat: collectCombatStats(),
        savingThrows: collectSavingThrows(),
        skills: collectSkills(),
        languages: collectLanguages(),
        proficiencies: collectProficiencies(),
        features: collectFeatures(),
        // Llamamos a la función en spells.js en lugar de definirla aquí
        spells: typeof collectSpells === 'function' ? collectSpells() : {},
        equipment: collectEquipment(),
        attacks: typeof collectAttacks === 'function' ? collectAttacks() : [],
        money: collectMoney(),
        personality: collectPersonality(),
        notes: document.getElementById("notes").value
    };
}

// Aplicar datos de personaje a la ficha
function applyCharacterData(data) {
    if (!data) return;

    // Aplicar la imagen del personaje si existe la función
    if (data.portrait && typeof applyPortraitData === 'function')
        applyPortraitData(data.portrait);

    // Aplicar cada sección de los datos
    if (data.basicInfo) applyBasicInfo(data.basicInfo);
    if (data.abilities) applyAbilities(data.abilities);
    if (data.combat) applyCombatStats(data.combat);
    if (data.savingThrows) applySavingThrows(data.savingThrows);
    if (data.skills) applySkills(data.skills);
    if (data.languages) applyLanguages(data.languages);
    if (data.proficiencies) applyProficiencies(data.proficiencies);
    if (data.features) applyFeatures(data.features);

    // Llamamos a la función en spells.js en lugar de definirla aquí
    if (data.spells && typeof applySpells === 'function')
        applySpells(data.spells);

    if (data.equipment) applyEquipment(data.equipment);

    // Aplicar los ataques si existe la función
    if (data.attacks && typeof applyAttacks === 'function')
        applyAttacks(data.attacks);

    if (data.money) applyMoney(data.money);
    if (data.personality) applyPersonality(data.personality);
    if (data.notes !== undefined) document.getElementById("notes").value = data.notes;

    // Actualizar todos los modificadores después de cargar los datos
    updateAllModifiers();
}

// Recopilar información básica
function collectBasicInfo() {
    return {
        name: document.getElementById("character-name").value,
        level: document.getElementById("level").textContent,
        race: document.getElementById("race").value,
        class: document.getElementById("class").value,
        background: document.getElementById("background").value,
        alignment: document.getElementById("alignment").value
    };
}

// Recopilar características
function collectAbilities() {
    const abilities = {};
    document.querySelectorAll(".ability").forEach((ability) => {
        const abilityType = ability.dataset.ability;
        const score = ability.querySelector(".ability-score").value;
        abilities[abilityType] = parseInt(score);
    });
    return abilities;
}

// Recopilar estadísticas de combate
function collectCombatStats() {
    return {
        armorClass: document.getElementById("armor-class").value,
        initiative: document.getElementById("initiative").value,
        speed: document.getElementById("speed").value,
        hp: {
            current: document.getElementById("current-hp").value,
            max: document.getElementById("max-hp").value
        }
    };
}

// Recopilar tiradas de salvación
function collectSavingThrows() {
    const savingThrows = {};
    document.querySelectorAll("#saving-throws .skill-item").forEach((save) => {
        const saveType = save.dataset.skill;
        const isProficient = save.querySelector(".proficient").classList.contains("is-proficient");
        savingThrows[saveType] = isProficient;
    });
    return savingThrows;
}

// Recopilar habilidades
function collectSkills() {
    const skills = {};
    document.querySelectorAll("#skills-list .skill-item").forEach((skill) => {
        const skillName = skill.dataset.skill;
        const isProficient = skill.querySelector(".proficient").classList.contains("is-proficient");
        skills[skillName] = isProficient;
    });
    return skills;
}

// Recopilar idiomas
function collectLanguages() {
    const languages = [];
    document.querySelectorAll("#languages-list .tag").forEach((tag) => {
        languages.push(tag.querySelector("span").textContent);
    });
    return languages;
}

// Recopilar competencias
function collectProficiencies() {
    const proficiencies = [];
    document.querySelectorAll("#proficiencies-list .tag").forEach((tag) => {
        proficiencies.push(tag.querySelector("span").textContent);
    });
    return proficiencies;
}

// Recopilar rasgos y habilidades
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

// Recopilar equipo
function collectEquipment() {
    const equipment = [];
    document.querySelectorAll("#equipment-list .equipment-item").forEach((item) => {
        equipment.push({
            name: item.querySelector("span").textContent,
            equipped: item.querySelector(".equipment-checkbox").checked
        });
    });
    return equipment;
}

// Recopilar monedas
function collectMoney() {
    return {
        gold: document.getElementById("gold").value,
        silver: document.getElementById("silver").value,
        copper: document.getElementById("copper").value
    };
}

// Recopilar rasgos de personalidad
function collectPersonality() {
    return {
        traits: document.getElementById("personality-traits").value,
        ideals: document.getElementById("ideals").value,
        bonds: document.getElementById("bonds").value,
        flaws: document.getElementById("flaws").value
    };
}

// Aplicar información básica
function applyBasicInfo(basicInfo) {
    document.getElementById("character-name").value = basicInfo.name || "";
    document.getElementById("level").textContent = basicInfo.level || "1";
    document.getElementById("race").value = basicInfo.race || "";
    document.getElementById("class").value = basicInfo.class || "";
    document.getElementById("background").value = basicInfo.background || "";
    document.getElementById("alignment").value = basicInfo.alignment || "";
}

// Aplicar características
function applyAbilities(abilities) {
    for (const [ability, score] of Object.entries(abilities)) {
        const abilityEl = document.querySelector(`.ability[data-ability="${ability}"]`);
        if (abilityEl) {
            abilityEl.querySelector(".ability-score").value = score;
            updateAbilityMod(abilityEl.querySelector(".ability-score"));
        }
    }
}

// Aplicar estadísticas de combate
function applyCombatStats(combat) {
    document.getElementById("armor-class").value = combat.armorClass || "10";
    document.getElementById("initiative").value = combat.initiative || "0";
    document.getElementById("speed").value = combat.speed || "9m";

    if (combat.hp) {
        document.getElementById("current-hp").value = combat.hp.current || "10";
        document.getElementById("max-hp").value = combat.hp.max || "10";
    }
}

// Aplicar tiradas de salvación
function applySavingThrows(savingThrows) {
    for (const [save, isProficient] of Object.entries(savingThrows)) {
        const saveEl = document.querySelector(`#saving-throws .skill-item[data-skill="${save}"]`);
        if (saveEl) {
            const profEl = saveEl.querySelector(".proficient");
            if (isProficient) {
                profEl.classList.add("is-proficient");
            } else {
                profEl.classList.remove("is-proficient");
            }
        }
    }
}

// Aplicar habilidades
function applySkills(skills) {
    for (const [skill, isProficient] of Object.entries(skills)) {
        const skillEl = document.querySelector(`#skills-list .skill-item[data-skill="${skill}"]`);
        if (skillEl) {
            const profEl = skillEl.querySelector(".proficient");
            if (isProficient) {
                profEl.classList.add("is-proficient");
            } else {
                profEl.classList.remove("is-proficient");
            }
        }
    }
}

// Aplicar idiomas
function applyLanguages(languages) {
    if (languages.length > 0) {
        const languagesList = document.getElementById("languages-list");
        languagesList.innerHTML = "";

        languages.forEach((language) => {
            const languageTag = document.createElement("div");
            languageTag.className = "tag";
            languageTag.style.backgroundColor = "#f0e0c0";
            languageTag.style.padding = "4px 8px";
            languageTag.style.borderRadius = "4px";
            languageTag.style.display = "flex";
            languageTag.style.alignItems = "center";

            languageTag.innerHTML = `
          <span>${language}</span>
          <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 14px; margin-left: 5px; cursor: pointer; padding: 0;">✕</button>
        `;

            languagesList.appendChild(languageTag);
        });
    }
}

// Aplicar competencias
function applyProficiencies(proficiencies) {
    if (proficiencies.length > 0) {
        const proficienciesList = document.getElementById("proficiencies-list");
        proficienciesList.innerHTML = "";

        proficiencies.forEach((proficiency) => {
            const proficiencyTag = document.createElement("div");
            proficiencyTag.className = "tag";
            proficiencyTag.style.backgroundColor = "#f0e0c0";
            proficiencyTag.style.padding = "4px 8px";
            proficiencyTag.style.borderRadius = "4px";
            proficiencyTag.style.display = "flex";
            proficiencyTag.style.alignItems = "center";

            proficiencyTag.innerHTML = `
          <span>${proficiency}</span>
          <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 14px; margin-left: 5px; cursor: pointer; padding: 0;">✕</button>
        `;

            proficienciesList.appendChild(proficiencyTag);
        });
    }
}

// Aplicar rasgos y habilidades
function applyFeatures(features) {
    const featuresContainer = document.getElementById("features-container");
    featuresContainer.innerHTML = "";

    features.forEach((feature) => {
        const featureDiv = document.createElement("div");
        featureDiv.className = "trait";

        let usesHtml = "";
        if (feature.limitedUse && feature.uses) {
            usesHtml = `
          <div class="limited-uses">
            <div class="limited-use-item">
              <label><input type="checkbox" checked> Uso limitado</label>
              <div class="counter-container" style="margin-left: 10px;">
                <button class="counter-button" onclick="adjustFeatureUses(this, -1)">-</button>
                <span class="counter-value">${feature.uses.current}</span>
                <button class="counter-button" onclick="adjustFeatureUses(this, 1)">+</button>
                <span> / </span>
                <input type="number" value="${feature.uses.max}" style="width: 40px;">
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
                <button class="counter-button" onclick="adjustFeatureUses(this, -1)">-</button>
                <span class="counter-value">0</span>
                <button class="counter-button" onclick="adjustFeatureUses(this, 1)">+</button>
                <span> / </span>
                <input type="number" value="1" style="width: 40px;">
              </div>
            </div>
          </div>
        `;
        }

        featureDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <input type="text" placeholder="Nombre del rasgo" style="width: auto; flex-grow: 1;" value="${feature.name || ''}">
          <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 10px;">✕</button>
        </div>
        <textarea placeholder="Descripción del rasgo" style="width: 100%; margin-top: 5px; min-height: 60px;">${feature.description || ''}</textarea>
        ${usesHtml}
      `;

        featuresContainer.appendChild(featureDiv);

        // Configurar el toggle para mostrar/ocultar contador de usos
        const checkbox = featureDiv.querySelector('input[type="checkbox"]');
        const counterContainer = featureDiv.querySelector(".counter-container");

        checkbox.addEventListener("change", function () {
            counterContainer.style.display = this.checked ? "flex" : "none";
        });
    });
}

// Aplicar equipo
function applyEquipment(equipment) {
    const equipmentList = document.getElementById("equipment-list");
    equipmentList.innerHTML = "";

    equipment.forEach((item) => {
        const equipmentItem = document.createElement("div");
        equipmentItem.className = "equipment-item";
        equipmentItem.innerHTML = `
        <input type="checkbox" class="equipment-checkbox" ${item.equipped ? "checked" : ""}>
        <span>${item.name || ''}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
      `;

        equipmentList.appendChild(equipmentItem);
    });
}

// Aplicar monedas
function applyMoney(money) {
    document.getElementById("gold").value = money.gold || "0";
    document.getElementById("silver").value = money.silver || "0";
    document.getElementById("copper").value = money.copper || "0";
}

// Aplicar rasgos de personalidad
function applyPersonality(personality) {
    document.getElementById("personality-traits").value = personality.traits || "";
    document.getElementById("ideals").value = personality.ideals || "";
    document.getElementById("bonds").value = personality.bonds || "";
    document.getElementById("flaws").value = personality.flaws || "";
}

// Exportar personaje a JSON
function exportCharacterToJson() {
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
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Importar personaje desde JSON
function importCharacterFromJson(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const characterData = JSON.parse(e.target.result);
            applyCharacterData(characterData);
        } catch (error) {
            console.error("Error al importar el personaje:", error);
            alert(
                "Error al leer el archivo JSON. Asegúrate de que es un archivo válido."
            );
        }
    };

    reader.readAsText(file);
    fileInput.value = ""; // Resetear para permitir cargar el mismo archivo varias veces
}

// Cargar datos del personaje inicial si se provee
function loadInitialCharacterData(jsonData) {
    try {
        const characterData =
            typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        applyCharacterData(characterData);
    } catch (error) {
        console.error(
            "Error al cargar los datos iniciales del personaje:",
            error
        );
    }
}