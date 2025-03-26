<!--
  Saving Throws Section Component
  Displays and manages character saving throws
-->
<template>
    <div class="saving-throws" id="saving-throws">
      <div
        v-for="ability in abilityList"
        :key="ability"
        class="skill-item"
        :data-skill="`${ability}-save`"
      >
        <div
          class="proficient"
          role="checkbox"
          :aria-checked="isProficient(ability) ? 'true' : 'false'"
          tabindex="0"
          @click="handleToggle(ability)"
          @keypress="handleKeypress($event, ability)"
          :class="{ 'is-proficient': isProficient(ability) }"
        ></div>
        <span>{{ abilityNames[ability] }}</span>
        <span class="skill-mod" aria-live="polite">
          {{ formatModifier(savingThrowModifiers[ability] || 0) }}
        </span>
      </div>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'SavingThrowsSection',
    setup() {
      // Use store directly to avoid dependency issues
      const store = useStore();
      
      // Get data from store
      const savingThrows = computed(() => store.state.character.savingThrows || {});
      const abilities = computed(() => store.state.character.abilities || {});
      const proficiencyBonus = computed(() => 
        Math.floor((store.state.character.basicInfo?.level - 1) / 4) + 2
      );
      
      // Calculate ability modifiers
      const abilityModifiers = computed(() => {
        const modifiers = {};
        Object.entries(abilities.value).forEach(([ability, score]) => {
          modifiers[ability] = Math.floor((score - 10) / 2);
        });
        return modifiers;
      });
      
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
      
      // List of abilities
      const abilityList = abilityUtils.ABILITY_LIST;
      const abilityNames = abilityUtils.ABILITY_NAMES;
      
      // Check if an ability saving throw is proficient
      const isProficient = (ability) => {
        return !!savingThrows.value[ability];
      };
      
      // Toggle saving throw proficiency
      const handleToggle = (ability) => {
        store.commit('character/TOGGLE_SAVING_THROW', ability);
        store.dispatch('character/saveCharacter');
      };
      
      // Handle keyboard events for accessibility
      const handleKeypress = (event, ability) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleToggle(ability);
          event.preventDefault();
        }
      };
      
      return {
        savingThrows,
        savingThrowModifiers,
        abilityList,
        abilityNames,
        isProficient,
        handleToggle,
        handleKeypress,
        formatModifier: abilityUtils.formatModifier
      };
    }
  };
  </script>
  
  <style scoped>
  .saving-throws {
    margin-bottom: var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .skill-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  
  .proficient {
    width: 15px;
    height: 15px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    margin-right: 8px;
    display: inline-block;
    cursor: pointer;
  }
  
  .is-proficient {
    background-color: var(--color-primary);
  }
  
  .skill-mod {
    font-weight: bold;
    margin-left: auto;
  }
  
  @media (max-width: 768px) {
    .saving-throws {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .saving-throws {
      grid-template-columns: 1fr;
    }
  }
  </style>