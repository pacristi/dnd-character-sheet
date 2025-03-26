/**
 * Ability Utilities
 * Provides utility functions for ability scores and related calculations
 */

/**
 * Ability abbreviations in Spanish
 * @type {Object.<string, string>}
 */
export const ABILITY_ABBREVIATIONS = {
    str: 'FUE',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR'
};

/**
 * Full ability names in Spanish
 * @type {Object.<string, string>}
 */
export const ABILITY_NAMES = {
    str: 'Fuerza',
    dex: 'Destreza',
    con: 'Constitución',
    int: 'Inteligencia',
    wis: 'Sabiduría',
    cha: 'Carisma'
};

/**
 * List of abilities
 * @type {string[]}
 */
export const ABILITY_LIST = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

/**
 * Calculate ability modifier from ability score
 * @param {number} score - Ability score
 * @returns {number} Ability modifier
 */
export function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

/**
 * Format ability modifier for display (with + or - sign)
 * @param {number} modifier - Ability modifier value
 * @returns {string} Formatted modifier string
 */
export function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Calculate proficiency bonus based on character level
 * @param {number} level - Character level
 * @returns {number} Proficiency bonus
 */
export function calculateProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2;
}

/**
 * Calculate passive perception
 * @param {number} wisdomModifier - Wisdom ability modifier
 * @param {boolean} isProficient - Whether the character is proficient in Perception
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Passive perception score
 */
export function calculatePassivePerception(wisdomModifier, isProficient, proficiencyBonus) {
    return 10 + wisdomModifier + (isProficient ? proficiencyBonus : 0);
}

/**
 * Calculate spell save DC
 * @param {number} spellcastingModifier - Spellcasting ability modifier
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Spell save DC
 */
export function calculateSpellSaveDC(spellcastingModifier, proficiencyBonus) {
    return 8 + spellcastingModifier + proficiencyBonus;
}

/**
 * Calculate spell attack bonus
 * @param {number} spellcastingModifier - Spellcasting ability modifier
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Spell attack bonus
 */
export function calculateSpellAttackBonus(spellcastingModifier, proficiencyBonus) {
    return spellcastingModifier + proficiencyBonus;
}

/**
 * Determine spellcasting ability based on character class
 * @param {string} characterClass - Character class
 * @returns {string} Ability code (str, dex, con, int, wis, or cha)
 */
export function getSpellcastingAbility(characterClass) {
    if (!characterClass) return 'int'; // Default to Intelligence

    const classLower = characterClass.toLowerCase();

    if (['cleric', 'druid', 'ranger'].includes(classLower)) {
        return 'wis';
    } else if (['bard', 'paladin', 'sorcerer', 'warlock'].includes(classLower)) {
        return 'cha';
    } else {
        return 'int'; // Wizard, Artificer, and others
    }
}

/**
 * Get formatted spellcasting ability name
 * @param {string} ability - Ability code (str, dex, con, int, wis, or cha)
 * @returns {string} Full ability name
 */
export function getSpellcastingAbilityName(ability) {
    return ABILITY_NAMES[ability] || ABILITY_NAMES.int;
}