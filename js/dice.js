function rollDie(sides) {
    const diceCount = 1;
    const modifier = 0;
    rollDice(diceCount, sides, modifier);
}

// Función para tirar dados personalizados
function rollCustomDice() {
    const diceCount =
        parseInt(document.getElementById("dice-count").value) || 1;
    const sides = parseInt(document.getElementById("dice-type").value);
    const modifier =
        parseInt(document.getElementById("dice-modifier").value) || 0;

    rollDice(diceCount, sides, modifier);
}

// Función principal para tirar dados
function rollDice(count, sides, modifier) {
    // Limitar la cantidad de dados
    count = Math.min(Math.max(count, 1), 10);

    // Generar resultados
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    // Calcular el total
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

    // Mostrar la animación
    showDiceAnimation(sides, rolls[0]);

    // Actualizar resultados
    const resultText = `Resultado: ${total}`;

    // Construir detalles
    let detailsText = "";
    if (count > 1 || modifier !== 0) {
        detailsText = `Tiradas: [${rolls.join(", ")}]`;
        if (modifier !== 0) {
            const modifierSign = modifier > 0 ? "+" : "";
            detailsText += ` ${modifierSign}${modifier}`;
        }
    }

    // Actualizar los elementos después de un breve retraso para la animación
    setTimeout(() => {
        document.getElementById("dice-result").textContent = resultText;
        document.getElementById("dice-details").textContent = detailsText;
    }, 900);
}

// Función para mostrar la animación de dados
function showDiceAnimation(sides, result) {
    const animationContainer = document.getElementById("dice-animation");
    animationContainer.innerHTML = "";

    let diceElement;

    if (sides === 20) {
        // Crear un d20 (con forma de triángulo para simplificar)
        diceElement = document.createElement("div");
        diceElement.className = "d20";

        const resultNumber = document.createElement("div");
        resultNumber.className = "result-number";
        resultNumber.textContent = "?";

        diceElement.appendChild(resultNumber);
    } else {
        // Crear un dado genérico (cubo)
        diceElement = document.createElement("div");
        diceElement.className = "dice";

        // Añadir una cara con interrogante
        const face = document.createElement("div");
        face.className = "dice-face";
        face.textContent = "?";

        diceElement.appendChild(face);
    }

    // Añadir el dado al contenedor
    animationContainer.appendChild(diceElement);

    // Iniciar la animación
    diceElement.classList.add("rolling");

    // Actualizar el resultado después de la animación
    setTimeout(() => {
        if (sides === 20) {
            diceElement.querySelector(".result-number").textContent = result;
        } else {
            diceElement.querySelector(".dice-face").textContent = result;
        }
        diceElement.classList.remove("rolling");
    }, 800);
}