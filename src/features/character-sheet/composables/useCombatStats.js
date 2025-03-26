/**
 * Combat Stats Composable
 * Provides access to combat-related stats and functions
 */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useCharacterData } from './useCharacterData';
import * as abilityUtils from '../utils/abilityUtils';

/**
 * Composable for accessing and managing combat statistics
 * @returns {Object} Combat stats and related functions
 */
export function useCombatStats() {
    // Get store safely
    let store;
    try {
        store = useStore();
    } catch (error) {
        console.warn('Store not available yet in useCombatStats');
    }

    // Get character data
    const characterData = useCharacterData();

    // Safely access properties with default values
    const combat = computed(() => characterData.combat?.value || {
        hp: { current: 0, max: 0, temporary: 0 },
        deathSaves: { successes: 0, failures: 0 },
        armorClass: 10,
        initiative: 0,
        speed: '9m'
    });

    const abilityModifiers = computed(() => characterData.abilityModifiers?.value || {});
    const proficiencyBonus = computed(() => characterData.proficiencyBonus?.value || 2);
    const basicInfo = computed(() => characterData.basicInfo?.value || {});
    const savingThrows = computed(() => characterData.savingThrows?.value || {});
    const skills = computed(() => characterData.skills?.value || {});

    // Debounced save function
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

    // Current HP values with safe defaults
    const currentHp = computed({
        get: () => combat.value.hp?.current || 0,
        set: (value) => {
            safeCommit('SET_COMBAT_STAT', {
                stat: 'hp.current',
                value: Math.max(0, parseInt(value) || 0)
            });
        }
    });

    const maxHp = computed({
        get: () => combat.value.hp?.max || 1,
        set: (value) => {
            safeCommit('SET_COMBAT_STAT', {
                stat: 'hp.max',
                value: Math.max(1, parseInt(value) || 1)
            });
        }
    });

    const temporaryHp = computed({
        get: () => combat.value.hp?.temporary || 0,
        set: (value) => {
            safeCommit('SET_COMBAT_STAT', {
                stat: 'hp.temporary',
                value: Math.max(0, parseInt(value) || 0)
            });
        }
    });

    // Death saves
    const deathSaves = computed(() => combat.value.deathSaves || { successes: 0, failures: 0 });

    const showDeathSaves = computed(() => currentHp.value <= 0);

    // Calculate saving throw modifiers
    const savingThrowModifiers = computed(() => {
        const modifiers = {};
        Object.entries(savingThrows.value || {}).forEach(([ability, isProficient]) => {
            const baseModifier = abilityModifiers.value[ability] || 0;
            modifiers[ability] = isProficient
                ? baseModifier + proficiencyBonus.value
                : baseModifier;
        });
        return modifiers;
    });

    // Calculate passive perception
    const passivePerception = computed(() => {
        const wisModifier = abilityModifiers.value.wis || 0;
        const isProficient = skills.value['perception'] || false;
        return 10 + wisModifier + (isProficient ? proficiencyBonus.value : 0);
    });

    // Calculate initiative modifier
    const initiativeModifier = computed(() => abilityModifiers.value.dex || 0);

    // Calculate armor class
    const armorClass = computed(() => {
        return 10 + (abilityModifiers.value.dex || 0);
    });

    // Spellcasting related stats
    const isSpellcaster = computed(() => {
        if (!basicInfo.value.class) return false;

        const classLower = basicInfo.value.class.toLowerCase();
        return ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'artificer'].includes(classLower);
    });

    const spellcastingAbility = computed(() =>
        abilityUtils.getSpellcastingAbility(basicInfo.value.class || '')
    );

    const spellcastingAbilityName = computed(() =>
        abilityUtils.getSpellcastingAbilityName(spellcastingAbility.value)
    );

    const spellcastingModifier = computed(() =>
        abilityModifiers.value[spellcastingAbility.value] || 0
    );

    const spellSaveDC = computed(() =>
        abilityUtils.calculateSpellSaveDC(spellcastingModifier.value, proficiencyBonus.value)
    );

    const spellAttackBonus = computed(() =>
        abilityUtils.calculateSpellAttackBonus(spellcastingModifier.value, proficiencyBonus.value)
    );

    // Update functions
    const updateDeathSaves = (type, value) => {
        safeCommit('SET_COMBAT_STAT', {
            stat: `deathSaves.${type}`,
            value: Math.max(0, Math.min(3, value))
        });
    };

    // Update combat stat
    const updateCombatStat = (stat, value) => {
        safeCommit('SET_COMBAT_STAT', { stat, value });
    };

    return {
        // HP
        currentHp,
        maxHp,
        temporaryHp,
        combat,

        // Death saves
        deathSaves,
        showDeathSaves,

        // Modifiers and stats
        savingThrowModifiers,
        passivePerception,
        initiativeModifier,
        armorClass,

        // Spellcasting
        isSpellcaster,
        spellcastingAbility,
        spellcastingAbilityName,
        spellcastingModifier,
        spellSaveDC,
        spellAttackBonus,

        // Actions
        updateDeathSaves,
        updateCombatStat,

        // Helpers
        debouncedSave
    };
}