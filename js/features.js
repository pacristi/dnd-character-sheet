// Añadir nuevos rasgos
function addFeature() {
    const featuresContainer = document.getElementById("features-container");
    const featureId = `feature-${Date.now()}`;

    const featureDiv = document.createElement("div");
    featureDiv.className = "trait";
    featureDiv.dataset.id = featureId;
    featureDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
          <input type="text" placeholder="Nombre del rasgo" style="width: auto; flex-grow: 1;">
          <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 10px;">✕</button>
      </div>
      <textarea placeholder="Descripción del rasgo" style="width: 100%; margin-top: 5px; min-height: 60px;"></textarea>
      <div class="limited-uses" style="margin-top: 5px;">
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

    featuresContainer.appendChild(featureDiv);

    // Configurar el toggle para mostrar/ocultar contador de usos
    const checkbox = featureDiv.querySelector('input[type="checkbox"]');
    const counterContainer = featureDiv.querySelector(".counter-container");

    checkbox.addEventListener("change", function () {
        counterContainer.style.display = this.checked ? "flex" : "none";
    });
}

// Ajustar los usos de un rasgo
function adjustFeatureUses(button, change) {
    const counterValue =
        button.parentElement.querySelector(".counter-value");
    let currentValue = parseInt(counterValue.textContent) || 0;
    const maxValue =
        parseInt(
            button.parentElement.querySelector('input[type="number"]').value
        ) || 1;

    currentValue = Math.max(0, Math.min(maxValue, currentValue + change));

    counterValue.textContent = currentValue;
}

function addLanguage() {
    const languageText = document
        .getElementById("new-language")
        .value.trim();
    if (!languageText) return;

    const languagesList = document.getElementById("languages-list");
    const languageTag = document.createElement("div");
    languageTag.className = "tag";
    languageTag.style.backgroundColor = "#f0e0c0";
    languageTag.style.padding = "4px 8px";
    languageTag.style.borderRadius = "4px";
    languageTag.style.display = "flex";
    languageTag.style.alignItems = "center";

    languageTag.innerHTML = `
      <span>${languageText}</span>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 14px; margin-left: 5px; cursor: pointer; padding: 0;">✕</button>
    `;

    languagesList.appendChild(languageTag);
    document.getElementById("new-language").value = "";
}

function addProficiency() {
    const proficiencyText = document
        .getElementById("new-proficiency")
        .value.trim();
    if (!proficiencyText) return;

    const proficienciesList = document.getElementById("proficiencies-list");
    const proficiencyTag = document.createElement("div");
    proficiencyTag.className = "tag";
    proficiencyTag.style.backgroundColor = "#f0e0c0";
    proficiencyTag.style.padding = "4px 8px";
    proficiencyTag.style.borderRadius = "4px";
    proficiencyTag.style.display = "flex";
    proficiencyTag.style.alignItems = "center";

    proficiencyTag.innerHTML = `
      <span>${proficiencyText}</span>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 14px; margin-left: 5px; cursor: pointer; padding: 0;">✕</button>
    `;

    proficienciesList.appendChild(proficiencyTag);
    document.getElementById("new-proficiency").value = "";
}