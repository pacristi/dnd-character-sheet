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
          @click="toggleSavingThrow(ability)"
          @keypress="handleKeypress($event, ability)"
          :class="{ 'is-proficient': isProficient(ability) }"
        ></div>
        <span>{{ abilityNames[ability] }}</span>
        <span class="skill-mod" aria-live="polite">
          {{ formatModifier(savingThrowModifiers[ability]) }}
        </span>
      </div>
    </div>
  </template>
  
  <script>
  import { useCharacterData } from '../composables/useCharacterData';
  import { useCombatStats } from '../composables/useCombatStats';
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'SavingThrowsSection',
    setup() {
      const { savingThrows } = useCharacterData();
      const { savingThrowModifiers } = useCombatStats();
      
      // List of abilities
      const abilityList = abilityUtils.ABILITY_LIST;
      const abilityNames = abilityUtils.ABILITY_NAMES;
      
      // Check if an ability saving throw is proficient
      const isProficient = (ability) => savingThrows.value[ability] || false;
      
      // Toggle saving throw proficiency
      const toggleSavingThrow = (ability) => {
        const store = useCharacterData();
        store.toggleSavingThrow(ability);
      };
      
      // Handle keyboard events for accessibility
      const handleKeypress = (event, ability) => {
        if (event.key === 'Enter' || event.key === ' ') {
          toggleSavingThrow(ability);
          event.preventDefault();
        }
      };
      
      return {
        savingThrows,
        savingThrowModifiers,
        abilityList,
        abilityNames,
        isProficient,
        toggleSavingThrow,
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