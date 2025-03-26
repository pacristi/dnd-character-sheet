<!--
  Abilities Section Component
  Displays and manages character ability scores
-->
<template>
    <div class="section">
      <h2>Características</h2>
      <div class="abilities">
        <AbilityScore
          v-for="ability in abilityList"
          :key="ability"
          :ability="ability"
          :score="abilityScores[ability]"
          :modifier="abilityModifiers[ability]"
          @update:score="updateAbilityScore(ability, $event)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useCharacterData } from '../composables/useCharacterData';
  import AbilityScore from './AbilityScore.vue';
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'AbilitiesSection',
    components: {
      AbilityScore
    },
    setup() {
      const { abilities, abilityModifiers, updateAbilityScore } = useCharacterData();
      
      // Get the list of abilities
      const abilityList = abilityUtils.ABILITY_LIST;
      
      // Create computed for ability scores from abilities state
      const abilityScores = computed(() => abilities.value);
      
      return {
        abilityList,
        abilityScores,
        abilityModifiers,
        updateAbilityScore
      };
    }
  };
  </script>
  
  <style scoped>
  .abilities {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  @media (max-width: 768px) {
    .abilities {
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .abilities {
      flex-direction: column;
      align-items: center;
    }
  }
  </style>