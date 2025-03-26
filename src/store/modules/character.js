// src/store/modules/character.js
import { characterStorage } from '@/services/storageService'
import { abilityUtils } from '@/utils/characterUtils'

// Initial state factory to ensure clean state every time
const getDefaultState = () => ({
    portrait: null,
    basicInfo: {
        name: '',
        level: 1,
        race: '',
        class: '',
        background: '',
        alignment: ''
    },
    abilities: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
    },
    combat: {
        armorClass: 10,
        initiative: 0,
        speed: '9m',
        hp: {
            current: 10,
            max: 10,
            temporary: 0
        },
        deathSaves: {
            successes: 0,
            failures: 0
        }
    },
    savingThrows: {
        str: false,
        dex: false,
        con: false,
        int: false,
        wis: false,
        cha: false
    },
    skills: {},
    languages: [],
    proficiencies: [],
    features: [],
    spells: {},
    equipment: [],
    attacks: [],
    money: {
        gold: 0,
        silver: 0,
        copper: 0
    },
    personality: {
        traits: '',
        ideals: '',
        bonds: '',
        flaws: ''
    },
    notes: ''
})

export default {
    namespaced: true,

    state: getDefaultState(),

    getters: {
        /**
         * Calculate proficiency bonus based on character level
         */
        proficiencyBonus: (state) => {
            const level = state.basicInfo.level
            return Math.floor((level - 1) / 4) + 2
        },

        /**
         * Calculate ability modifiers for all abilities
         */
        abilityModifiers: (state) => {
            const modifiers = {}
            Object.entries(state.abilities).forEach(([ability, score]) => {
                modifiers[ability] = Math.floor((score - 10) / 2)
            })
            return modifiers
        },

        /**
         * Calculate skill modifiers based on abilities and proficiency
         */
        skillModifiers: (state, getters) => {
            const modifiers = {}
            Object.entries(state.skills).forEach(([skill, isProficient]) => {
                const ability = skill.split('-')[0]
                const baseModifier = getters.abilityModifiers[ability] || 0
                modifiers[skill] = isProficient
                    ? baseModifier + getters.proficiencyBonus
                    : baseModifier
            })
            return modifiers
        },

        /**
         * Calculate saving throw modifiers based on abilities and proficiency
         */
        savingThrowModifiers: (state, getters) => {
            const modifiers = {}
            Object.entries(state.savingThrows).forEach(([ability, isProficient]) => {
                const baseModifier = getters.abilityModifiers[ability] || 0
                modifiers[ability] = isProficient
                    ? baseModifier + getters.proficiencyBonus
                    : baseModifier
            })
            return modifiers
        },

        /**
         * Calculate passive perception
         */
        passivePerception: (state, getters) => {
            const perceptionModifier = getters.skillModifiers['wis-perception'] || 0
            return 10 + perceptionModifier
        },

        /**
         * Determine and calculate spell attack bonus
         */
        spellAttackBonus: (state, getters) => {
            if (!state.basicInfo.class) return 0

            // Get spellcasting ability based on class
            const spellAbility = abilityUtils.getSpellcastingAbility(state.basicInfo.class)

            const abilityModifier = getters.abilityModifiers[spellAbility] || 0
            return abilityModifier + getters.proficiencyBonus
        },

        /**
         * Calculate spell save DC
         */
        spellSaveDC: (state, getters) => {
            return 8 + getters.spellAttackBonus
        }
    },

    actions: {
        /**
         * Initialize the character data from storage or default
         */
        initializeCharacter({ commit, dispatch }) {
            const savedCharacter = characterStorage.loadCharacter()
            if (savedCharacter) {
                commit('SET_STATE', savedCharacter)
            } else {
                dispatch('loadDefaultCharacter')
            }
        },

        /**
         * Load default character state
         */
        loadDefaultCharacter({ commit }) {
            try {
                // Reset to default state
                commit('RESET_STATE')

                // Initialize skills list
                const skillsMap = {
                    'acrobatics': 'dex',
                    'animal-handling': 'wis',
                    'arcana': 'int',
                    'athletics': 'str',
                    'deception': 'cha',
                    'history': 'int',
                    'insight': 'wis',
                    'intimidation': 'cha',
                    'investigation': 'int',
                    'medicine': 'wis',
                    'nature': 'int',
                    'perception': 'wis',
                    'performance': 'cha',
                    'persuasion': 'cha',
                    'religion': 'int',
                    'sleight-of-hand': 'dex',
                    'stealth': 'dex',
                    'survival': 'wis'
                }

                const skills = {}
                Object.keys(skillsMap).forEach(skill => {
                    skills[skill] = false
                })

                commit('SET_SKILLS', skills)
            } catch (error) {
                console.error('Error loading default character:', error)
            }
        },

        /**
         * Save character to localStorage
         */
        saveCharacter({ state }) {
            return characterStorage.saveCharacter(state)
        },

        /**
         * Export character to JSON file
         */
        exportCharacter({ state }) {
            const characterData = JSON.stringify(state, null, 2)
            const characterName = state.basicInfo.name || 'character'
            const characterClass = state.basicInfo.class || 'class'
            const filename = `${characterName}-${characterClass}.json`

            // Create a blob and trigger download
            const blob = new Blob([characterData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            link.click()

            // Clean up
            URL.revokeObjectURL(url)
        },

        /**
         * Import character from JSON data
         */
        importCharacter({ commit }, characterData) {
            commit('IMPORT_CHARACTER', characterData)
            // Save to localStorage for persistence
            characterStorage.saveCharacter(characterData)
        }
    },

    mutations: {
        // Reset the entire state to default
        RESET_STATE(state) {
            Object.assign(state, getDefaultState())
        },

        // Set/update entire state at once
        SET_STATE(state, newState) {
            Object.assign(state, newState)
        },

        // Update basic info fields
        SET_BASIC_INFO(state, { field, value }) {
            state.basicInfo[field] = value
        },

        // Update ability score
        SET_ABILITY_SCORE(state, { ability, score }) {
            state.abilities[ability] = parseInt(score) || 10
        },

        // Update combat stats
        SET_COMBAT_STAT(state, { stat, value }) {
            if (stat.includes('.')) {
                const [parent, child] = stat.split('.')
                state.combat[parent][child] = value
            } else {
                state.combat[stat] = value
            }
        },

        // Toggle proficiency for saving throws
        TOGGLE_SAVING_THROW(state, ability) {
            state.savingThrows[ability] = !state.savingThrows[ability]
        },

        // Set all skills
        SET_SKILLS(state, skills) {
            state.skills = skills
        },

        // Toggle skill proficiency
        TOGGLE_SKILL(state, skillId) {
            state.skills[skillId] = !state.skills[skillId]
        },

        // Add/remove languages
        ADD_LANGUAGE(state, language) {
            if (!state.languages.includes(language)) {
                state.languages.push(language)
            }
        },
        REMOVE_LANGUAGE(state, language) {
            state.languages = state.languages.filter(lang => lang !== language)
        },

        // Add/remove proficiencies
        ADD_PROFICIENCY(state, proficiency) {
            if (!state.proficiencies.includes(proficiency)) {
                state.proficiencies.push(proficiency)
            }
        },
        REMOVE_PROFICIENCY(state, proficiency) {
            state.proficiencies = state.proficiencies.filter(prof => prof !== proficiency)
        },

        // Manage features
        SET_FEATURES(state, features) {
            state.features = features
        },
        ADD_FEATURE(state, feature) {
            state.features.push(feature)
        },
        UPDATE_FEATURE(state, { index, feature }) {
            state.features[index] = feature
        },
        REMOVE_FEATURE(state, index) {
            state.features.splice(index, 1)
        },

        // Manage spells
        SET_SPELLS(state, spells) {
            state.spells = spells
        },
        ADD_SPELL(state, { level, spell }) {
            if (!state.spells[level]) {
                state.spells[level] = { spells: [], slots: { total: 0, used: 0 } }
            }
            state.spells[level].spells.push(spell)
        },
        UPDATE_SPELL(state, { level, index, spell }) {
            state.spells[level].spells[index] = spell
        },
        REMOVE_SPELL(state, { level, index }) {
            state.spells[level].spells.splice(index, 1)

            // Remove the level if no spells remain
            if (state.spells[level].spells.length === 0 && level !== 'cantrip') {
                delete state.spells[level]
            }
        },
        SET_SPELL_SLOTS(state, { level, slots }) {
            if (!state.spells[level]) {
                state.spells[level] = { spells: [], slots: null }
            }
            state.spells[level].slots = slots
        },

        // Manage equipment
        ADD_EQUIPMENT(state, item) {
            state.equipment.push(item)
        },
        UPDATE_EQUIPMENT(state, { index, item }) {
            state.equipment[index] = item
        },
        REMOVE_EQUIPMENT(state, index) {
            state.equipment.splice(index, 1)
        },

        // Manage attacks
        SET_ATTACKS(state, attacks) {
            state.attacks = attacks
        },
        ADD_ATTACK(state, attack) {
            state.attacks.push(attack)
        },
        UPDATE_ATTACK(state, { index, attack }) {
            state.attacks[index] = attack
        },
        REMOVE_ATTACK(state, index) {
            state.attacks.splice(index, 1)
        },

        // Update money
        SET_MONEY(state, { currency, amount }) {
            state.money[currency] = parseInt(amount) || 0
        },

        // Update personality traits
        SET_PERSONALITY(state, { trait, value }) {
            state.personality[trait] = value
        },

        // Update notes
        SET_NOTES(state, notes) {
            state.notes = notes
        },

        // Set portrait
        SET_PORTRAIT(state, portraitData) {
            state.portrait = portraitData
        },

        // Import complete character data
        IMPORT_CHARACTER(state, characterData) {
            Object.assign(state, characterData)
        }
    }
}