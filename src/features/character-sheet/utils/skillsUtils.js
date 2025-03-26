/**
 * Skills Utilities
 * Provides utility functions for skills and related calculations
 */

/**
 * List of D&D 5e skills with their associated abilities
 * @type {Array<{id: string, name: string, ability: string}>}
 */
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
];

/**
 * Create a map of skill IDs to their definitions
 * @type {Object.<string, {id: string, name: string, ability: string}>}
 */
export const SKILLS_MAP = SKILLS_LIST.reduce((map, skill) => {
    map[skill.id] = skill;
    return map;
}, {});

/**
 * Create a default skills object with all skills set to false
 * @returns {Object.<string, boolean>} Object with all skills set to false
 */
export function createDefaultSkills() {
    return SKILLS_LIST.reduce((skills, skill) => {
        skills[skill.id] = false;
        return skills;
    }, {});
}

/**
 * Calculate skill modifier
 * @param {string} skillId - Skill identifier
 * @param {Object.<string, number>} abilityModifiers - Character's ability modifiers
 * @param {Object.<string, boolean>} skills - Character's skill proficiencies
 * @param {number} proficiencyBonus - Character's proficiency bonus
 * @returns {number} Skill modifier
 */
export function calculateSkillModifier(skillId, abilityModifiers, skills, proficiencyBonus) {
    const skill = SKILLS_MAP[skillId];
    if (!skill) return 0;

    const abilityModifier = abilityModifiers[skill.ability] || 0;
    const isProficient = skills[skillId] || false;

    return abilityModifier + (isProficient ? proficiencyBonus : 0);
}

/**
 * Get a formatted list of proficient skills
 * @param {Object.<string, boolean>} skills - Character's skill proficiencies
 * @returns {string[]} List of proficient skill names
 */
export function getProficientSkills(skills) {
    return Object.entries(skills)
        .filter(([, isProficient]) => isProficient)
        .map(([skillId]) => SKILLS_MAP[skillId]?.name || skillId);
}