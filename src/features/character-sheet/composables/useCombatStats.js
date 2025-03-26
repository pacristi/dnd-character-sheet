/**
 * Combat Stats Composable
 * Provides access to combat-related stats and functions
 */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useCharacterData } from './useCharacterData';
import * as abilityUtils from '../utils/abilityUtils';
import * as equipmentUtils from '../utils/equipmentUtils';

/**
 * Composable for accessing and managing combat statistics
 * @returns {Object} Combat stats and related functions
 */
export function useCombatStats() {
    const store = useStore();
    const {
        combat,
        abilityModifiers,
        proficiencyBonus,
        basicInfo,
        equipment,
        savingThrows,
        skills,
        debouncedSave
    } = useCharacterData();

    // Current HP values
    const currentHp = computed({
        get: () => combat.value.hp.current,
        set: (value) => {
            store.commit('character/SET_COMBAT_STAT', {
                stat: 'hp.current',
                value: Math.max(0, parseInt(value) || 0)
            });
            debouncedSave();
        }
    });

    const maxHp = computed({
        get: () => combat.value.hp.max,
        set: (value) => {
            store.commit('character/SET_COMBAT_STAT', {
                stat: 'hp.max',
                value: Math.max(1, parseInt(value) || 1)
            });
            debouncedSave();
        }
    });

    const temporaryHp = computed({
        get: () => combat.value.hp.temporary || 0,
        set: (value) => {
            store.commit('character/SET_COMBAT_STAT', {
                stat: 'hp.temporary',
                value: Math.max(0, parseInt(value) || 0)
            });
            debouncedSave();
        }
    });

    // Death saves
    const deathSaves = computed(() => combat.value.deathSaves || { successes: 0, failures: 0 });

    const showDeathSaves = computed(() => currentHp.value <= 0);

    // Calculate saving throw modifiers
    const savingThrowModifiers = computed(() => {
        const modifiers = {};
        Object.entries(savingThrows.value).forEach(([ability, isProficient]) => {
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
        // Check for equipped armor
        const equippedArmor = equipment.value.find(item =>
            item.equipped && equipmentUtils.findArmor(item.name)
        );

        const hasShield = equipment.value.some(item =>
            item.equipped && item.name.toLowerCase().includes('escudo')
        );

        if (equippedArmor) {
            return equipmentUtils.calculateArmorClass(
                equippedArmor.name,
                abilityModifiers.value,
                hasShield
            );
        }

        // If no armor is equipped, calculate unarmored AC
        return 10 + (abilityModifiers.value.dex || 0);
    });

    // Spellcasting related stats
    const isSpellcaster = computed(() => {
        if (!basicInfo.value.class) return false;

        const classLower = basicInfo.value.class.toLowerCase();
        return ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'artificer'].includes(classLower);
    });

    const spellcastingAbility = computed(() =>
        abilityUtils.getSpellcastingAbility(basicInfo.value.class)
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
        store.commit('character/SET_COMBAT_STAT', {
            stat: `deathSaves.${type}`,
            value: Math.max(0, Math.min(3, value))
        });
        debouncedSave();
    };

    const applyDamage = (amount) => {
        // First use up any temporary HP
        const tempHp = combat.value.hp.temporary || 0;
        const remainingDamage = Math.max(0, amount - tempHp);
        const newTempHp = Math.max(0, tempHp - amount);

        // Apply remaining damage to current HP
        const newCurrentHp = Math.max(0, currentHp.value - remainingDamage);

        // Update the stats
        store.commit('character/SET_COMBAT_STAT', { stat: 'hp.temporary', value: newTempHp });
        store.commit('character/SET_COMBAT_STAT', { stat: 'hp.current', value: newCurrentHp });

        debouncedSave();

        return {
            currentHp: newCurrentHp,
            temporaryHp: newTempHp,
            unconscious: newCurrentHp <= 0
        };
    };

    const heal = (amount) => {
        const newCurrentHp = Math.min(maxHp.value, currentHp.value + amount);

        store.commit('character/SET_COMBAT_STAT', { stat: 'hp.current', value: newCurrentHp });
        debouncedSave();

        return {
            currentHp: newCurrentHp,
            healed: newCurrentHp - currentHp.value
        };
    };

    const resetDeathSaves = () => {
        store.commit('character/SET_COMBAT_STAT', { stat: 'deathSaves.successes', value: 0 });
        store.commit('character/SET_COMBAT_STAT', { stat: 'deathSaves.failures', value: 0 });
        debouncedSave();
    };

    return {
        // HP
        currentHp,
        maxHp,
        temporaryHp,

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
        applyDamage,
        heal,
        resetDeathSaves
    };
}