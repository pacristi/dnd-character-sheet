// src/utils/characterUtils.js

/**
 * Utility functions for ability score calculations
 */
export const abilityUtils = {
    // Ability names and abbreviations mapping
    ABILITY_ABBREVIATIONS: {
        str: 'FUE',
        dex: 'DES',
        con: 'CON',
        int: 'INT',
        wis: 'SAB',
        cha: 'CAR'
    },

    // Full ability names
    ABILITY_NAMES: {
        str: 'Fuerza',
        dex: 'Destreza',
        con: 'Constitución',
        int: 'Inteligencia',
        wis: 'Sabiduría',
        cha: 'Carisma'
    },

    /**
     * Calculates ability modifier from ability score
     * @param {number} score - Ability score
     * @returns {number} Ability modifier
     */
    calculateModifier(score) {
        return Math.floor((score - 10) / 2)
    },

    /**
     * Formats ability modifier for display (with + or - sign)
     * @param {number} modifier - Ability modifier value
     * @returns {string} Formatted modifier
     */
    formatModifier(modifier) {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`
    },

    /**
     * Determines spellcasting ability based on character class
     * @param {string} characterClass - Character class
     * @returns {string} Ability code (int, wis, cha)
     */
    getSpellcastingAbility(characterClass) {
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
}

/**
 * Utility functions for skills
 */
export const skillUtils = {
    // Standard skills list with associated abilities
    SKILLS_LIST: [
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
    ],

    /**
     * Create a default skills object with all skills set to false
     * @returns {Object} Skills object
     */
    createDefaultSkills() {
        const skills = {}
        this.SKILLS_LIST.forEach(skill => {
            skills[skill.id] = false
        })
        return skills
    },

    /**
     * Calculates passive perception
     * @param {number} wisdomModifier - Wisdom ability modifier
     * @param {boolean} isProficient - Whether the character is proficient in Perception
     * @param {number} proficiencyBonus - Character's proficiency bonus
     * @returns {number} Passive perception score
     */
    calculatePassivePerception(wisdomModifier, isProficient, proficiencyBonus) {
        return 10 + wisdomModifier + (isProficient ? proficiencyBonus : 0)
    }
}

/**
 * Utility functions for combat calculations
 */
export const combatUtils = {
    /**
     * Calculates proficiency bonus based on character level
     * @param {number} level - Character level
     * @returns {number} Proficiency bonus
     */
    calculateProficiencyBonus(level) {
        return Math.floor((level - 1) / 4) + 2
    },

    /**
     * Calculate default spell slots based on character level and spell level
     * @param {number} charLevel - Character level
     * @param {number} spellLevel - Spell level
     * @returns {number} Number of spell slots
     */
    getDefaultSpellSlots(charLevel, spellLevel) {
        // Simplified table based on standard spell slot progression
        // Each row is a character level, each column is a spell level (1-9)
        const spellSlotsTable = [
            // lvl 1  2  3  4  5  6  7  8  9
            [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1st level character
            [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2nd level character
            [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3rd level character
            [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4th level character
            [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5th level character
            [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6th level character
            [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7th level character
            [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8th level character
            [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9th level character
            [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10th level character
            [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11th level character
            [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12th level character
            [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13th level character
            [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14th level character
            [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15th level character
            [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16th level character
            [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17th level character
            [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18th level character
            [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19th level character
            [4, 3, 3, 3, 3, 2, 2, 1, 1]  // 20th level character
        ]

        // Get the row for the character level (clamp to 1-20)
        const level = Math.max(1, Math.min(20, charLevel))
        const slots = spellSlotsTable[level - 1]

        // Return slots for the requested spell level (1-indexed)
        return spellLevel <= slots.length ? slots[spellLevel - 1] : 0
    }
}

/**
 * Utility functions for equipment and items
 */
export const equipmentUtils = {
    // Constants for weapon data
    WEAPONS_DATABASE: {
        // Melee weapons
        "Espada larga": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
        "Espada corta": { damage: "1d6", type: "perforante", properties: "Ligera, Sutil" },
        "Daga": { damage: "1d4", type: "perforante", properties: "Ligera, Sutil, Arrojadiza (alcance 6/18)" },
        "Estoque": { damage: "1d8", type: "perforante", properties: "Sutil" },
        "Hacha de mano": { damage: "1d6", type: "cortante", properties: "Ligera, Arrojadiza (alcance 6/18)" },
        "Bastón": { damage: "1d6", type: "contundente", properties: "Versátil (1d8)" },

        // Ranged weapons
        "Arco largo": { damage: "1d8", type: "perforante", properties: "Munición (alcance 45/180), Dos manos, Pesada" },
        "Arco corto": { damage: "1d6", type: "perforante", properties: "Munición (alcance 24/96), Dos manos" },
        "Ballesta ligera": { damage: "1d8", type: "perforante", properties: "Munición (alcance 24/96), Carga, Dos manos" },
        "Ballesta pesada": { damage: "1d10", type: "perforante", properties: "Munición (alcance 30/120), Carga, Pesada, Dos manos" }
    },

    /**
     * Find weapon data in the database
     * @param {string} weaponName - Name of the weapon to find
     * @returns {Object|null} Weapon data or null if not found
     */
    findWeaponData(weaponName) {
        if (!weaponName) return null

        // Check for exact match
        if (this.WEAPONS_DATABASE[weaponName]) {
            return this.WEAPONS_DATABASE[weaponName]
        }

        // Check for partial match
        for (const [name, data] of Object.entries(this.WEAPONS_DATABASE)) {
            if (name.toLowerCase().includes(weaponName.toLowerCase()) ||
                weaponName.toLowerCase().includes(name.toLowerCase())) {
                return {
                    ...data,
                    name: name // Include the full name
                }
            }
        }

        return null
    },

    /**
     * Determine if a weapon is ranged based on its properties
     * @param {Object} weaponData - Weapon data object
     * @returns {boolean} True if weapon is ranged
     */
    isRangedWeapon(weaponData) {
        if (!weaponData) return false

        return weaponData.properties.includes("Munición") ||
            weaponData.properties.includes("alcance") ||
            weaponData.name?.includes("Arco") ||
            weaponData.name?.includes("Ballesta")
    },

    /**
     * Calculate attack bonus for a weapon
     * @param {Object} weaponData - Weapon data object
     * @param {Object} abilityScores - Character ability scores
     * @param {number} proficiencyBonus - Character proficiency bonus
     * @returns {string} Formatted attack bonus (e.g. "+5")
     */
    calculateAttackBonus(weaponData, abilityScores, proficiencyBonus) {
        if (!weaponData || !abilityScores) return "+0"

        // Determine if ranged weapon
        const isRanged = this.isRangedWeapon(weaponData)

        // Get ability modifier (STR for melee, DEX for ranged)
        const abilityType = isRanged ? 'dex' : 'str'
        const abilityScore = abilityScores[abilityType] || 10
        const abilityMod = abilityUtils.calculateModifier(abilityScore)

        // Calculate total bonus
        const totalBonus = abilityMod + proficiencyBonus

        return abilityUtils.formatModifier(totalBonus)
    }
}