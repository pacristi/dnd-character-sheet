<template>
    <div class="section" id="dice-roller-section">
      <h2>Tirador de Dados</h2>
      <div class="dice-container">
        <div class="dice-options">
          <button
            v-for="sides in diceTypes"
            :key="`d${sides}`"
            type="button"
            @click="rollDie(sides)"
            class="dice-button"
            :aria-label="`Tirar d${sides}`"
          >
            d{{ sides }}
          </button>
        </div>
        <div class="custom-roll">
          <input
            type="number"
            v-model.number="diceCount"
            min="1"
            :max="maxDiceCount"
            class="dice-input"
            aria-label="Número de dados"
          />
          <span>d</span>
          <select
            v-model.number="diceType"
            class="dice-select"
            aria-label="Tipo de dado"
          >
            <option v-for="sides in diceTypes" :key="`option-${sides}`" :value="sides">{{ sides }}</option>
          </select>
          <button
            type="button"
            @click="rollCustomDice"
            class="dice-button"
            aria-label="Tirar dados custom"
          >
            Tirar dados
          </button>
          <input
            type="number"
            v-model.number="diceModifier"
            class="dice-input"
            aria-label="Modificador"
          />
          <span>Modificador</span>
        </div>
        <div class="roll-options">
          <button
            type="button"
            @click="rollWithAdvantage(true)"
            class="dice-button"
            aria-label="Roll with advantage"
          >
            Ventaja
          </button>
          <button
            type="button"
            @click="rollWithAdvantage(false)"
            class="dice-button"
            aria-label="Roll with disadvantage"
          >
            Desventaja
          </button>
        </div>
        <div class="dice-result-container">
          <div
            class="dice-animation"
            aria-hidden="true"
            ref="diceAnimation"
          >
            <!-- Dice animation will be rendered here -->
          </div>
          <div class="dice-result" aria-live="polite">
            {{ resultText }}
          </div>
          <div
            v-if="detailsText"
            class="dice-details"
            aria-live="polite"
          >
            {{ detailsText }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {rollDice, rollWithAdvantage, rollWithDisadvantage } from '@/utils/dice'
  
  export default {
    name: 'DiceRoller',
    data() {
      return {
        diceTypes: [4, 6, 8, 10, 12, 20, 100],
        diceCount: 1,
        diceType: 20,
        diceModifier: 0,
        maxDiceCount: 10,
        resultText: 'Resultado: -',
        detailsText: '',
        isRolling: false,
        animationDuration: 800 // in milliseconds
      }
    },
    methods: {
      /**
       * Roll a single die
       * @param {number} sides - Number of sides on the die
       */
      rollDie(sides) {
        this.rollDice(1, sides, 0)
      },
      
      /**
       * Roll custom dice based on form inputs
       */
      rollCustomDice() {
        // Validate inputs
        const count = Math.min(Math.max(this.diceCount, 1), this.maxDiceCount)
        const sides = this.diceType
        const modifier = this.diceModifier || 0
        
        this.rollDice(count, sides, modifier)
      },
      
      /**
       * Roll with advantage or disadvantage (two d20s, take highest/lowest)
       * @param {boolean} isAdvantage - True for advantage, false for disadvantage
       */
      rollWithAdvantage(isAdvantage) {
        // Don't roll during animation
        if (this.isRolling) return
        
        // Mark as rolling for animation
        this.isRolling = true
        
        // Get modifier
        const modifier = this.diceModifier || 0
        
        // Roll with advantage/disadvantage
        const result = isAdvantage ? 
          rollWithAdvantage(20) : 
          rollWithDisadvantage(20)
        
        // Calculate final result with modifier
        const total = result.result + modifier
        
        // Show animation
        this.showDiceAnimation(20, result.result)
        
        // Update results after animation completes
        setTimeout(() => {
          this.resultText = `Resultado: ${total}`
          this.detailsText = `${isAdvantage ? 'Ventaja' : 'Desventaja'}: [${result.rolls.join(', ')}]${modifier ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`
          this.isRolling = false
        }, this.animationDuration)
      },
      
      /**
       * Main dice rolling function
       * @param {number} count - Number of dice to roll
       * @param {number} sides - Number of sides on the dice
       * @param {number} modifier - Modifier to add to the roll
       */
      rollDice(count, sides, modifier) {
        // Don't roll during animation
        if (this.isRolling) return
        
        // Mark as rolling for animation
        this.isRolling = true
        
        // Generate roll results
        const rolls = rollDice(count, sides)
        
        // Calculate total
        const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0)
        const total = diceTotal + modifier
        
        // Show animation for the first die
        this.showDiceAnimation(sides, rolls[0])
        
        // Update results after animation completes
        setTimeout(() => {
          this.resultText = `Resultado: ${total}`
          
          // Create details text
          if (rolls.length > 1 || modifier !== 0) {
            let details = `Tiradas: [${rolls.join(", ")}]`
            if (modifier !== 0) {
              const modifierSign = modifier > 0 ? "+" : ""
              details += ` ${modifierSign}${modifier}`
            }
            this.detailsText = details
          } else {
            this.detailsText = ''
          }
          
          this.isRolling = false
        }, this.animationDuration)
      },
      
      /**
       * Shows the dice animation
       * @param {number} sides - Number of sides on the die
       * @param {number} result - Roll result
       */
      showDiceAnimation(sides, result) {
        const animationContainer = this.$refs.diceAnimation
        if (!animationContainer) return
        
        // Clear previous animation
        animationContainer.innerHTML = ""
        
        // Create the appropriate die element
        const diceElement = this.createDiceElement(sides)
        animationContainer.appendChild(diceElement)
        
        // Start the animation
        diceElement.classList.add("rolling")
        
        // Set result after animation
        const resultElement = sides === 20 ?
          diceElement.querySelector(".result-number") :
          diceElement.querySelector(".dice-face")
        
        if (resultElement) {
          setTimeout(() => {
            resultElement.textContent = result
            diceElement.classList.remove("rolling")
          }, this.animationDuration * 0.9)
        }
      },
      
      /**
       * Creates a die element based on the number of sides
       * @param {number} sides - Number of sides on the die
       * @returns {HTMLElement} The created die element
       */
      createDiceElement(sides) {
        let diceElement
        
        if (sides === 20) {
          // Create a d20 (simplified to triangle)
          diceElement = document.createElement("div")
          diceElement.className = "d20"
          
          const resultNumber = document.createElement("div")
          resultNumber.className = "result-number"
          resultNumber.textContent = "?"
          resultNumber.setAttribute('aria-label', 'Dice roll result')
          resultNumber.setAttribute('aria-live', 'polite')
          
          diceElement.appendChild(resultNumber)
        } else {
          // Create a generic die
          diceElement = document.createElement("div")
          diceElement.className = "dice"
          
          const face = document.createElement("div")
          face.className = "dice-face"
          face.textContent = "?"
          face.setAttribute('aria-label', 'Dice roll result')
          face.setAttribute('aria-live', 'polite')
          
          diceElement.appendChild(face)
        }
        
        return diceElement
      }
    }
  }
  </script>
  
  <style scoped>
  .dice-container {
    padding: var(--spacing-md);
    border-radius: 8px;
    background-color: var(--color-highlight);
    margin-top: var(--spacing-sm);
  }
  
  .dice-options {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-bottom: 15px;
  }
  
  .dice-button {
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
  }
  
  .dice-button:hover {
    background-color: var(--color-primary-dark);
  }
  
  .dice-button:active {
    transform: scale(0.95);
  }
  
  .custom-roll {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }
  
  .roll-options {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: 15px;
  }
  
  .dice-input {
    width: 50px;
    padding: 5px;
    border: var(--border-standard);
    border-radius: 4px;
  }
  
  .dice-result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--spacing-lg);
  }
  
  .dice-animation {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    position: relative;
    perspective: 600px;
  }
  
  .dice {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 1s ease-out;
  }
  
  .dice-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--color-primary);
    color: white;
    font-size: 40px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--color-secondary);
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
  }
  
  /* d20 specific styles */
  .d20 {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86px solid var(--color-primary);
    position: relative;
    transform-style: preserve-3d;
    margin: 7px auto;
  }
  
  .d20::after {
    content: "";
    position: absolute;
    top: 28px;
    left: -50px;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 86px solid var(--color-primary);
  }
  
  .result-number {
    position: absolute;
    top: 30px;
    width: 100%;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    z-index: 10;
    text-shadow: 1px 1px 3px #000;
  }
  
  .dice-result {
    font-size: 24px;
    font-weight: bold;
    margin: 15px 0;
    color: var(--color-primary);
  }
  
  .dice-details {
    font-size: 16px;
    color: var(--color-primary-dark);
  }
  
  /* Animation keyframes */
  @keyframes roll {
    0% {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    25% {
      transform: rotateX(90deg) rotateY(45deg) rotateZ(180deg);
    }
    50% {
      transform: rotateX(180deg) rotateY(90deg) rotateZ(0deg);
    }
    75% {
      transform: rotateX(270deg) rotateY(135deg) rotateZ(180deg);
    }
    100% {
      transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
    }
  }
  
  .rolling {
    animation: roll 0.8s ease-out;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .custom-roll {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .custom-roll > span {
      display: none;
    }
    
    .dice-input, .dice-select {
      width: 100%;
    }
    
    .dice-button {
      width: 100%;
    }
  }
  </style>
  standard);
    border-radius: 4px;
    text-align: center;
  }
  
  .dice-select {
    padding: 5px;
    border: var(--border-