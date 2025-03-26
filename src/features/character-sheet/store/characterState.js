/**
 * Character State
 * Defines the initial state for the character store
 */

/**
 * Creates a fresh default character state
 * @returns {Object} Default character state
 */
export const getDefaultState = () => ({
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
});

// Export the state factory function as the default state
export const characterState = getDefaultState();