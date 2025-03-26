/**
 * Utilities for dice rolling
 */

/**
 * Rolls a single die
 * @param {number} sides - Number of sides on the die
 * @returns {number} Result of the roll
 */
export function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
}

/**
 * Rolls multiple dice
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides on each die
 * @returns {Array} Array of roll results
 */
export function rollDice(count, sides) {
    const results = []
    for (let i = 0; i < count; i++) {
        results.push(rollDie(sides))
    }
    return results
}

/**
 * Rolls dice with advantage (roll twice, take highest)
 * @param {number} sides - Number of sides on the die
 * @returns {Object} Object containing both rolls and the highest result
 */
export function rollWithAdvantage(sides = 20) {
    const roll1 = rollDie(sides)
    const roll2 = rollDie(sides)
    return {
        rolls: [roll1, roll2],
        result: Math.max(roll1, roll2),
        advantage: true,
        disadvantage: false
    }
}

/**
 * Rolls dice with disadvantage (roll twice, take lowest)
 * @param {number} sides - Number of sides on the die
 * @returns {Object} Object containing both rolls and the lowest result
 */
export function rollWithDisadvantage(sides = 20) {
    const roll1 = rollDie(sides)
    const roll2 = rollDie(sides)
    return {
        rolls: [roll1, roll2],
        result: Math.min(roll1, roll2),
        advantage: false,
        disadvantage: true
    }
}

/**
 * Parses a dice formula string and rolls the dice
 * @param {string} formula - Dice formula (e.g. "2d6+3")
 * @returns {Object} Roll results
 */
export function rollFormula(formula) {
    // Parse the formula (e.g. "2d6+3")
    const regex = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i
    const match = formula.match(regex)

    if (!match) {
        throw new Error(`Invalid dice formula: ${formula}`)
    }

    const count = parseInt(match[1])
    const sides = parseInt(match[2])
    const modifierSign = match[3] || '+'
    const modifierValue = parseInt(match[4] || 0)
    const modifier = modifierSign === '+' ? modifierValue : -modifierValue

    // Roll the dice
    const rolls = rollDice(count, sides)
    const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = diceTotal + modifier

    return {
        formula,
        rolls,
        diceTotal,
        modifier,
        total
    }
}

/**
 * Processes a damage formula for critical hits
 * @param {string} formula - Damage formula (e.g. "1d8+3")
 * @param {number} multiplier - Dice multiplier for crits (usually 2)
 * @returns {Object} Damage roll results
 */
export function rollDamageFormula(formula, multiplier = 1) {
    // Parse the damage formula (e.g. "1d8+3")
    const regex = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i
    const match = formula.match(regex)

    if (!match) {
        throw new Error(`Invalid damage formula: ${formula}`)
    }

    const count = parseInt(match[1]) * multiplier
    const sides = parseInt(match[2])
    const modifierSign = match[3] || '+'
    const modifierValue = parseInt(match[4] || 0)
    const modifier = modifierSign === '+' ? modifierValue : -modifierValue

    // Roll the dice
    const rolls = rollDice(count, sides)
    const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = diceTotal + modifier

    return {
        formula,
        rolls,
        diceTotal,
        modifier,
        total,
        isCritical: multiplier > 1
    }
}