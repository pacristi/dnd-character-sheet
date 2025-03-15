/**
 * Features Module
 * Handles character features, traits, languages, and proficiencies
 */

// Initialize module
document.addEventListener('DOMContentLoaded', function () {
    setupFeaturesEventListeners();
});

/**
 * Sets up event listeners for the features module
 */
function setupFeaturesEventListeners() {
    // Add keyboard support for language and proficiency input fields
    const languageInput = document.getElementById('new-language');
    const proficiencyInput = document.getElementById('new-proficiency');

    if (languageInput) {
        languageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addLanguage();
                e.preventDefault();
            }
        });
    }

    if (proficiencyInput) {
        proficiencyInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addProficiency();
                e.preventDefault();
            }
        });
    }
}

/**
 * Adds a new feature to the character sheet
 */
function addFeature() {
    const featuresContainer = document.getElementById("features-container");
    if (!featuresContainer) return;

    const featureId = `feature-${Date.now()}`;

    const featureDiv = document.createElement("div");
    featureDiv.className = "trait";
    featureDiv.dataset.id = featureId;

    featureDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <input type="text" placeholder="Nombre del rasgo" aria-label="Feature name" style="width: auto; flex-grow: 1;">
        <button type="button" aria-label="Remove feature" onclick="removeFeature(this)" style="margin-left: 10px;">✕</button>
      </div>
      
      <textarea placeholder="Descripción del rasgo" aria-label="Feature description" style="width: 100%; margin-top: 5px; min-height: 60px;"></textarea>
      
      <div class="limited-uses" style="margin-top: 5px;">
        <div class="limited-use-item">
          <label>
            <input type="checkbox" aria-label="Limited use feature"> Uso limitado
          </label>
          <div class="counter-container" style="margin-left: 10px; display: none;">
            <button type="button" class="counter-button" aria-label="Decrease uses" onclick="adjustFeatureUses(this, -1)">-</button>
            <span class="counter-value" aria-live="polite">0</span>
            <button type="button" class="counter-button" aria-label="Increase uses" onclick="adjustFeatureUses(this, 1)">+</button>
            <span> / </span>
            <input type="number" value="1" min="1" aria-label="Maximum uses" style="width: 40px;">
          </div>
        </div>
      </div>
    `;

    featuresContainer.appendChild(featureDiv);

    // Set up toggle for counter visibility
    const checkbox = featureDiv.querySelector('input[type="checkbox"]');
    const counterContainer = featureDiv.querySelector(".counter-container");

    checkbox.addEventListener("change", function () {
        counterContainer.style.display = this.checked ? "flex" : "none";
    });

    // Focus on the name input
    setTimeout(() => {
        featureDiv.querySelector('input[type="text"]').focus();
    }, 0);

    return featureDiv;
}

/**
 * Removes a feature from the character sheet
 * @param {HTMLElement} button - The remove button
 */
function removeFeature(button) {
    const feature = button.closest('.trait');
    if (feature) {
        feature.remove();
    }
}

/**
 * Adjusts the uses remaining for a feature
 * @param {HTMLElement} button - The counter button
 * @param {number} change - Amount to change the counter by
 */
function adjustFeatureUses(button, change) {
    const counterValue = button.parentElement.querySelector(".counter-value");
    if (!counterValue) return;

    let currentValue = parseInt(counterValue.textContent) || 0;
    const maxInput = button.parentElement.querySelector('input[type="number"]');
    const maxValue = parseInt(maxInput?.value) || 1;

    // Adjust within bounds (0 to max)
    currentValue = Math.max(0, Math.min(maxValue, currentValue + change));

    // Update counter display
    counterValue.textContent = currentValue;
}

/**
 * Adds a new language to the character sheet
 */
function addLanguage() {
    const languageText = document.getElementById("new-language").value.trim();
    if (!languageText) return;

    const languagesList = document.getElementById("languages-list");
    if (!languagesList) return;

    // Create and add the language tag
    languagesList.appendChild(createTagElement(languageText));

    // Clear the input field
    document.getElementById("new-language").value = "";
}

/**
 * Adds a new proficiency to the character sheet
 */
function addProficiency() {
    const proficiencyText = document.getElementById("new-proficiency").value.trim();
    if (!proficiencyText) return;

    const proficienciesList = document.getElementById("proficiencies-list");
    if (!proficienciesList) return;

    // Create and add the proficiency tag
    proficienciesList.appendChild(createTagElement(proficiencyText));

    // Clear the input field
    document.getElementById("new-proficiency").value = "";
}

/**
 * Creates a tag element for languages or proficiencies
 * @param {string} text - Text for the tag
 * @returns {HTMLElement} Tag element
 */
function createTagElement(text) {
    const tagEl = document.createElement("div");
    tagEl.className = "tag";

    tagEl.innerHTML = `
      <span>${escapeHTML(text)}</span>
      <button type="button" aria-label="Remove ${escapeHTML(text)}" 
              onclick="this.parentElement.remove()">✕</button>
    `;

    return tagEl;
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