/**
 * Character Getters
 * Defines getters for the character store
 */
import * as abilityUtils from '@/features/character-sheet/utils/abilityUtils';
import * as skillsUtils from '@/features/character-sheet/utils/skillsUtils';

export const characterGetters = {
    /**
     * Calculate proficiency bonus based on character level
     */
    proficiencyBonus: (state) => {
        const level = state.basicInfo.level || 1;
        return abilityUtils.calculateProficiencyBonus(level);
    },

    /**
     * Calculate ability modifiers for all abilities
     */
    abilityModifiers: (state) => {
        const modifiers = {};
        Object.entries(state.abilities).forEach(([ability, score]) => {
            modifiers[ability] = abilityUtils.calculateModifier(score);
        });
        return modifiers;
    },

    /**
     * Calculate skill modifiers based on abilities and proficiency
     */
    skillModifiers: (state, getters) => {
        const modifiers = {};
        Object.entries(state.skills).forEach(([skillId, isProficient]) => {
            const skill = skillsUtils.SKILLS_MAP[skillId];
            if (!skill) return;

            const ability = skill.ability;
            const baseModifier = getters.abilityModifiers[ability] || 0;
            modifiers[skillId] = isProficient
                ? baseModifier + getters.proficiencyBonus
                : baseModifier;
        });
        return modifiers;
    },

    /**
     * Calculate saving throw modifiers based on abilities and proficiency
     */
    savingThrowModifiers: (state, getters) => {
        const modifiers = {};
        Object.entries(state.savingThrows).forEach(([ability, isProficient]) => {
            const baseModifier = getters.abilityModifiers[ability] || 0;
            modifiers[ability] = isProficient
                ? baseModifier + getters.proficiencyBonus
                : baseModifier;
        });
        return modifiers;
    },

    /**
     * Calculate passive perception
     */
    passivePerception: (state, getters) => {
        const perceptionSkillId = 'perception';
        const wisModifier = getters.abilityModifiers.wis || 0;
        const isProficient = state.skills[perceptionSkillId] || false;

        return 10 + wisModifier + (isProficient ? getters.proficiencyBonus : 0);
    },

    /**
     * Determine spellcasting ability based on class
     */
    spellcastingAbility: (state) => {
        return abilityUtils.getSpellcastingAbility(state.basicInfo.class);
    },

    /**
     * Get spellcasting ability modifier
     */
    spellcastingModifier: (state, getters) => {
        const ability = getters.spellcastingAbility;
        return getters.abilityModifiers[ability] || 0;
    },

    /**
     * Calculate spell attack bonus
     */
    spellAttackBonus: (state, getters) => {
        return getters.spellcastingModifier + getters.proficiencyBonus;
    },

    /**
     * Calculate spell save DC
     */
    spellSaveDC: (state, getters) => {
        return 8 + getters.spellAttackBonus;
    },

    /**
     * Get total weight of equipment
     */
    totalEquipmentWeight: (state) => {
        return state.equipment.reduce((total, item) => {
            return total + (parseFloat(item.weight) || 0);
        }, 0);
    },

    /**
     * Get prepared spells
     */
    preparedSpells: (state) => {
        const prepared = [];

        Object.values(state.spells).forEach(levelData => {
            levelData.spells.forEach(spell => {
                if (spell.prepared) {
                    prepared.push(spell);
                }
            });
        });

        return prepared;
    }
};