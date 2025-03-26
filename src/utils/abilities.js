/**
 * Utilities for ability calculations
 */

// Ability names and abbreviations mapping
export const ABILITY_ABBREVIATIONS = {
    str: 'FUE',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR'
}

// Full ability names
export const ABILITY_NAMES = {
    str: 'Fuerza',
    dex: 'Destreza',
    con: 'Constitución',
    int: 'Inteligencia',
    wis: 'Sabiduría',
    cha: 'Carisma'
}

// Standard skills list with associated abilities
export const SKILLS_LIST = [
    { id: 'acrobatics', name: 'Acrobacias', ability: 'dex' },
    { id: 'animal-handling', name: 'Manejo de Animales', ability: 'wis' },
    { id: 'arcana', name: 'Arcanos', ability: 'int' },
    { id: 'athletics', name: 'Atletismo', ability: 'str' },
    { id: 'deception', name: 'Engaño', ability: 'cha' },
    { id: 'history', name: 'Historia', ability: 'int' },
    { id: 'insight', name: 'Perspicacia', ability: 'wis' },
    { id: 'intimidation', name: 'Intimidación', ability: 'cha' },
    { id: 'investigation', name: 'Investigación', ability: 'int' },
    { id: 'medicine', name: 'Medicina', ability: 'wis' },
    { id: 'nature', name: 'Naturaleza', ability: 'int' },
    { id: 'perception', name: 'Percepción', ability: 'wis' },
    { id: 'performance', name: 'Interpretación', ability: 'cha' },
    { id: 'persuasion', name: 'Persuasión', ability: 'cha' },
    { id: 'religion', name: 'Religión', ability: 'int' },
    { id: 'sleight-of-hand', name: 'Juego de Manos', ability: 'dex' },
    { id: 'stealth', name: 'Sigilo', ability: 'dex' },
    { id: 'survival', name: 'Supervivencia', ability: 'wis' }
]

/**
 * Calculates ability modifier from ability score
 * @param {number} score - Ability score
 * @returns {number} Ability modifier
 */
export function calculateAbilityModifier(score) {
    return Math.floor((score - 10) / 2)
}

/**
 * Formats ability modifier for display (with + or - sign)
 * @param {number} modifier - Ability modifier value
 * @returns {string} Formatted modifier
 */
export function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

/**
 * Calculates proficiency bonus based on character level
 * @param {number} level - Character level
 * @returns {number} Proficiency bonus
 */
export function calculateProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2
}

/**
 * Calculates passive perception
 * @param {number} wisdomModifier - Wisdom ability modifier
 * @param {boolean} isProficient - Whether the character is proficient in Perception
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Passive perception score
 */
export function calculatePassivePerception(wisdomModifier, isProficient, proficiencyBonus) {
    return 10 + wisdomModifier + (isProficient ? proficiencyBonus : 0)
}

/**
 * Determines spellcasting ability based on character class
 * @param {string} characterClass - Character class
 * @returns {string} Ability code (int, wis, cha)
 */
export function getSpellcastingAbility(characterClass) {
    if (!characterClass) return 'int' // Default

    const classLower = characterClass.toLowerCase()

    if (['cleric', 'druid', 'ranger'].includes(classLower)) {
        return 'wis'
    } else if (['bard', 'paladin', 'sorcerer', 'warlock'].includes(classLower)) {
        return 'cha'
    } else {
        return 'int' // Wizard, Artificer, and others
    }
}