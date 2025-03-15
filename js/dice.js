/**
 * Dice Rolling Module
 * Handles dice rolling animations and calculations
 */

// Store dice rolling configurations
const diceConfig = {
    animationDuration: 800, // in milliseconds
    maxDiceCount: 10,
    defaultCount: 1
};

// Initialize dice roller when the page loads
document.addEventListener('DOMContentLoaded', function () {
    setupDiceEventListeners();
});

/**
 * Setup event listeners for the dice roller
 */
function setupDiceEventListeners() {
    // Add keyboard support for custom dice
    const diceCountInput = document.getElementById('dice-count');
    const diceModifierInput = document.getElementById('dice-modifier');

    if (diceCountInput && diceModifierInput) {
        // Roll on Enter key
        [diceCountInput, diceModifierInput].forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    rollCustomDice();
                }
            });

            // Ensure only numbers are entered
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^\d-]/g, '');
            });
        });
    }

    // Add button for quick advantage/disadvantage rolls
    const diceOptions = document.querySelector('.dice-options');
    if (diceOptions) {
        const advantageBtn = document.createElement('button');
        advantageBtn.className = 'dice-button';
        advantageBtn.textContent = 'Ventaja';
        advantageBtn.setAttribute('aria-label', 'Roll with advantage');
        advantageBtn.onclick = () => rollWithAdvantage(true);

        const disadvantageBtn = document.createElement('button');
        disadvantageBtn.className = 'dice-button';
        disadvantageBtn.textContent = 'Desventaja';
        disadvantageBtn.setAttribute('aria-label', 'Roll with disadvantage');
        disadvantageBtn.onclick = () => rollWithAdvantage(false);

        diceOptions.appendChild(advantageBtn);
        diceOptions.appendChild(disadvantageBtn);
    }
}

/**
 * Roll a single die with the specified number of sides
 * @param {number} sides - Number of sides on the die
 */
function rollDie(sides) {
    rollDice(diceConfig.defaultCount, sides, 0);
}

/**
 * Roll custom dice based on form inputs
 */
function rollCustomDice() {
    const diceCount = parseInt(document.getElementById("dice-count").value) || diceConfig.defaultCount;
    const sides = parseInt(document.getElementById("dice-type").value) || 20;
    const modifier = parseInt(document.getElementById("dice-modifier").value) || 0;

    rollDice(diceCount, sides, modifier);
}

/**
 * Roll with advantage or disadvantage (two d20s, take highest/lowest)
 * @param {boolean} isAdvantage - True for advantage, false for disadvantage
 */
function rollWithAdvantage(isAdvantage) {
    // Roll two d20s
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;

    // Determine which one to use
    const selectedRoll = isAdvantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
    const otherRoll = isAdvantage ? Math.min(roll1, roll2) : Math.max(roll1, roll2);

    // Get modifier
    const modifier = parseInt(document.getElementById("dice-modifier").value) || 0;
    const total = selectedRoll + modifier;

    // Show animation for the selected die
    showDiceAnimation(20, selectedRoll);

    // Show the results
    setTimeout(() => {
        const resultText = `Resultado: ${total}`;
        const detailsText = `${isAdvantage ? 'Ventaja' : 'Desventaja'}: [${selectedRoll}, ${otherRoll}]${modifier ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;

        document.getElementById("dice-result").textContent = resultText;
        document.getElementById("dice-details").textContent = detailsText;
    }, diceConfig.animationDuration);
}

/**
 * Main dice rolling function
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides on the dice
 * @param {number} modifier - Modifier to add to the roll
 */
function rollDice(count, sides, modifier) {
    // Validate and limit inputs
    count = Math.min(Math.max(count, 1), diceConfig.maxDiceCount);
    sides = Math.max(sides, 2);

    // Generate roll results
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    // Calculate total
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

    // Show animation for the first die
    showDiceAnimation(sides, rolls[0]);

    // Update results after animation completes
    setTimeout(() => {
        updateDiceResults(rolls, modifier, total);
    }, diceConfig.animationDuration);
}

/**
 * Shows the dice animation
 * @param {number} sides - Number of sides on the die
 * @param {number} result - Roll result
 */
function showDiceAnimation(sides, result) {
    const animationContainer = document.getElementById("dice-animation");
    if (!animationContainer) return;

    // Clear previous animation
    animationContainer.innerHTML = "";

    // Create the appropriate die element
    const diceElement = createDiceElement(sides);
    animationContainer.appendChild(diceElement);

    // Start the animation
    diceElement.classList.add("rolling");

    // Set result after animation
    const resultElement = sides === 20 ?
        diceElement.querySelector(".result-number") :
        diceElement.querySelector(".dice-face");

    if (resultElement) {
        setTimeout(() => {
            resultElement.textContent = result;
            diceElement.classList.remove("rolling");
        }, diceConfig.animationDuration * 0.9);
    }
}

/**
 * Creates a die element based on the number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {HTMLElement} The created die element
 */
function createDiceElement(sides) {
    let diceElement;

    if (sides === 20) {
        // Create a d20 (simplified to triangle)
        diceElement = document.createElement("div");
        diceElement.className = "d20";

        const resultNumber = document.createElement("div");
        resultNumber.className = "result-number";
        resultNumber.textContent = "?";
        resultNumber.setAttribute('aria-label', 'Dice roll result');
        resultNumber.setAttribute('aria-live', 'polite');

        diceElement.appendChild(resultNumber);
    } else {
        // Create a generic die
        diceElement = document.createElement("div");
        diceElement.className = "dice";

        const face = document.createElement("div");
        face.className = "dice-face";
        face.textContent = "?";
        face.setAttribute('aria-label', 'Dice roll result');
        face.setAttribute('aria-live', 'polite');

        diceElement.appendChild(face);
    }

    return diceElement;
}

/**
 * Updates the dice results display
 * @param {Array} rolls - Array of roll results
 * @param {number} modifier - Modifier added to the roll
 * @param {number} total - Total result
 */
function updateDiceResults(rolls, modifier, total) {
    const resultElement = document.getElementById("dice-result");
    const detailsElement = document.getElementById("dice-details");

    if (!resultElement || !detailsElement) return;

    // Update result display
    resultElement.textContent = `Resultado: ${total}`;

    // Create details text
    let detailsText = "";
    if (rolls.length > 1 || modifier !== 0) {
        detailsText = `Tiradas: [${rolls.join(", ")}]`;
        if (modifier !== 0) {
            const modifierSign = modifier > 0 ? "+" : "";
            detailsText += ` ${modifierSign}${modifier}`;
        }
    }

    detailsElement.textContent = detailsText;
}