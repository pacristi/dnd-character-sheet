/**
 * Character Data Composable
 * Provides access to character data from the Vuex store
 */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

/**
 * Composable for accessing and managing character data
 * @returns {Object} Character data and related functions
 */
export function useCharacterData() {
    // Get store safely inside component setup
    let store;
    try {
        store = useStore();
    } catch (error) {
        console.warn('Store not available yet in useCharacterData');
    }

    // Empty state for when store isn't available
    const emptyState = {
        basicInfo: {},
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        combat: { hp: { current: 10, max: 10, temporary: 0 }, deathSaves: { successes: 0, failures: 0 } },
        savingThrows: {},
        skills: {},
        features: [],
        equipment: [],
        attacks: [],
        money: { gold: 0, silver: 0, copper: 0 },
        personality: { traits: '', ideals: '', bonds: '', flaws: '' },
        notes: '',
        portrait: null,
        spells: {},
        languages: [],
        proficiencies: []
    };

    // Helper to safely access state
    const safeState = () => {
        if (!store) return emptyState;
        try {
            return store.state.character || emptyState;
        } catch (error) {
            console.warn(`Error accessing store state: ${error.message}`);
            return emptyState;
        }
    };

    // Get character data from store
    const basicInfo = computed(() => safeState().basicInfo || {});
    const abilities = computed(() => safeState().abilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    const combat = computed(() => safeState().combat || { hp: { current: 10, max: 10, temporary: 0 } });
    const savingThrows = computed(() => safeState().savingThrows || {});
    const skills = computed(() => safeState().skills || {});
    const features = computed(() => safeState().features || []);
    const equipment = computed(() => safeState().equipment || []);
    const attacks = computed(() => safeState().attacks || []);
    const money = computed(() => safeState().money || { gold: 0, silver: 0, copper: 0 });
    const personality = computed(() => safeState().personality || { traits: '', ideals: '', bonds: '', flaws: '' });
    const notes = computed(() => safeState().notes || '');
    const portrait = computed(() => safeState().portrait || null);
    const spells = computed(() => safeState().spells || {});
    const languages = computed(() => safeState().languages || []);
    const proficiencies = computed(() => safeState().proficiencies || []);

    // Computed values
    const level = computed(() => basicInfo.value?.level || 1);
    const proficiencyBonus = computed(() => 2);
    const abilityModifiers = computed(() => {
        const mods = {};
        Object.entries(abilities.value).forEach(([ability, score]) => {
            mods[ability] = Math.floor((score - 10) / 2);
        });
        return mods;
    });

    // Initialize character data
    const initializeCharacter = () => {
        if (store) {
            store.dispatch('character/initializeCharacter');
        } else {
            console.warn('Cannot initialize character: store not available');
        }
    };

    // Load default character
    const loadDefaultCharacter = () => {
        if (store) {
            store.dispatch('character/loadDefaultCharacter');
        } else {
            console.warn('Cannot load default character: store not available');
        }
    };

    // Helper for debounced save
    const saveTimeout = ref(null);
    const debouncedSave = (delay = 1000) => {
        if (saveTimeout.value) {
            clearTimeout(saveTimeout.value);
        }

        saveTimeout.value = setTimeout(() => {
            if (store) {
                store.dispatch('character/saveCharacter');
            }
            saveTimeout.value = null;
        }, delay);
    };

    // Safe commit wrapper
    const safeCommit = (type, payload) => {
        if (!store) {
            console.warn(`Cannot commit ${type}: store not available`);
            return;
        }

        try {
            store.commit(`character/${type}`, payload);
            debouncedSave();
        } catch (error) {
            console.error(`Error in commit ${type}:`, error);
        }
    };

    // Helper functions to update character data
    const updateBasicInfo = (field, value) => {
        safeCommit('SET_BASIC_INFO', { field, value });
    };

    const updateAbilityScore = (ability, score) => {
        safeCommit('SET_ABILITY_SCORE', { ability, score });
    };

    const updateCombatStat = (stat, value) => {
        safeCommit('SET_COMBAT_STAT', { stat, value });
    };

    const toggleSavingThrow = (ability) => {
        safeCommit('TOGGLE_SAVING_THROW', ability);
    };

    const toggleSkill = (skillId) => {
        safeCommit('TOGGLE_SKILL', skillId);
    };

    // Create a mutation handler
    const createMutationHandler = (mutationType) => {
        return (...args) => safeCommit(mutationType, ...args);
    };

    // Map common mutations to functions
    const SET_PORTRAIT = createMutationHandler('SET_PORTRAIT');
    const SET_NOTES = createMutationHandler('SET_NOTES');
    const SET_PERSONALITY = createMutationHandler('SET_PERSONALITY');
    const SET_FEATURES = createMutationHandler('SET_FEATURES');
    const ADD_FEATURE = createMutationHandler('ADD_FEATURE');
    const UPDATE_FEATURE = createMutationHandler('UPDATE_FEATURE');
    const REMOVE_FEATURE = createMutationHandler('REMOVE_FEATURE');
    const ADD_EQUIPMENT = createMutationHandler('ADD_EQUIPMENT');
    const UPDATE_EQUIPMENT = createMutationHandler('UPDATE_EQUIPMENT');
    const REMOVE_EQUIPMENT = createMutationHandler('REMOVE_EQUIPMENT');
    const SET_MONEY = createMutationHandler('SET_MONEY');
    const ADD_ATTACK = createMutationHandler('ADD_ATTACK');
    const UPDATE_ATTACK = createMutationHandler('UPDATE_ATTACK');
    const REMOVE_ATTACK = createMutationHandler('REMOVE_ATTACK');
    const ADD_SPELL = createMutationHandler('ADD_SPELL');
    const UPDATE_SPELL = createMutationHandler('UPDATE_SPELL');
    const REMOVE_SPELL = createMutationHandler('REMOVE_SPELL');
    const SET_SPELL_SLOTS = createMutationHandler('SET_SPELL_SLOTS');
    const ADD_LANGUAGE = createMutationHandler('ADD_LANGUAGE');
    const REMOVE_LANGUAGE = createMutationHandler('REMOVE_LANGUAGE');
    const ADD_PROFICIENCY = createMutationHandler('ADD_PROFICIENCY');
    const REMOVE_PROFICIENCY = createMutationHandler('REMOVE_PROFICIENCY');

    return {
        // State
        basicInfo,
        abilities,
        combat,
        savingThrows,
        skills,
        features,
        equipment,
        attacks,
        money,
        personality,
        notes,
        portrait,
        spells,
        languages,
        proficiencies,

        // Computed values
        level,
        proficiencyBonus,
        abilityModifiers,

        // Core functions
        initializeCharacter,
        loadDefaultCharacter,
        debouncedSave,

        // Update functions
        updateBasicInfo,
        updateAbilityScore,
        updateCombatStat,
        toggleSavingThrow,
        toggleSkill,

        // Mutation handlers
        SET_PORTRAIT,
        SET_NOTES,
        SET_PERSONALITY,
        SET_FEATURES,
        ADD_FEATURE,
        UPDATE_FEATURE,
        REMOVE_FEATURE,
        ADD_EQUIPMENT,
        UPDATE_EQUIPMENT,
        REMOVE_EQUIPMENT,
        SET_MONEY,
        ADD_ATTACK,
        UPDATE_ATTACK,
        REMOVE_ATTACK,
        ADD_SPELL,
        UPDATE_SPELL,
        REMOVE_SPELL,
        SET_SPELL_SLOTS,
        ADD_LANGUAGE,
        REMOVE_LANGUAGE,
        ADD_PROFICIENCY,
        REMOVE_PROFICIENCY
    };
}