/**
 * Character Data Composable
 * Provides access to character data from the Vuex store
 */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useDebouncedSave } from '@/features/shared/composables/useDebouncedSave';
import * as abilityUtils from '../utils/abilityUtils';

/**
 * Composable for accessing and managing character data
 * @returns {Object} Character data and related functions
 */
export function useCharacterData() {
    const store = useStore();

    // Get character data from store
    const basicInfo = computed(() => store.state.character.basicInfo);
    const abilities = computed(() => store.state.character.abilities);
    const combat = computed(() => store.state.character.combat);
    const savingThrows = computed(() => store.state.character.savingThrows);
    const skills = computed(() => store.state.character.skills);
    const features = computed(() => store.state.character.features);
    const equipment = computed(() => store.state.character.equipment);
    const attacks = computed(() => store.state.character.attacks);
    const money = computed(() => store.state.character.money);
    const personality = computed(() => store.state.character.personality);
    const notes = computed(() => store.state.character.notes);
    const portrait = computed(() => store.state.character.portrait);

    // Computed values
    const level = computed(() => basicInfo.value.level || 1);

    const proficiencyBonus = computed(() =>
        abilityUtils.calculateProficiencyBonus(level.value)
    );

    const abilityModifiers = computed(() => {
        const modifiers = {};
        Object.entries(abilities.value).forEach(([ability, score]) => {
            modifiers[ability] = abilityUtils.calculateModifier(score);
        });
        return modifiers;
    });

    // Set up debounced save
    const { debouncedSave } = useDebouncedSave(() =>
        store.dispatch('character/saveCharacter')
    );

    // Update functions
    const updateBasicInfo = (field, value) => {
        store.commit('character/SET_BASIC_INFO', { field, value });
        debouncedSave();
    };

    const updateAbilityScore = (ability, score) => {
        store.commit('character/SET_ABILITY_SCORE', { ability, score });
        debouncedSave();
    };

    const updateCombatStat = (stat, value) => {
        store.commit('character/SET_COMBAT_STAT', { stat, value });
        debouncedSave();
    };

    const toggleSavingThrow = (ability) => {
        store.commit('character/TOGGLE_SAVING_THROW', ability);
        debouncedSave();
    };

    const toggleSkill = (skillId) => {
        store.commit('character/TOGGLE_SKILL', skillId);
        debouncedSave();
    };

    // Import/Export functions
    const exportCharacter = () => {
        return store.dispatch('character/exportCharacter');
    };

    const importCharacter = (characterData) => {
        return store.dispatch('character/importCharacter', characterData);
    };

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

        // Computed values
        level,
        proficiencyBonus,
        abilityModifiers,

        // Update functions
        updateBasicInfo,
        updateAbilityScore,
        updateCombatStat,
        toggleSavingThrow,
        toggleSkill,
        debouncedSave,

        // Import/Export
        exportCharacter,
        importCharacter
    };
}