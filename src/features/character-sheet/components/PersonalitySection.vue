<!--
  Personality Section Component
  Displays and manages character personality traits
-->
<template>
    <div class="section">
      <h2>Rasgos de Personalidad</h2>
      <div class="traits-section">
        <div class="traits-column">
          <PersonalityTrait
            trait-type="traits"
            label="Personalidad"
            :content="personality.traits"
            placeholder="Describe la personalidad de tu personaje"
            @update="updatePersonality('traits', $event)"
          />
          
          <PersonalityTrait
            trait-type="ideals"
            label="Ideal"
            :content="personality.ideals"
            placeholder="¿Cuáles son los ideales de tu personaje?"
            @update="updatePersonality('ideals', $event)"
          />
        </div>
        
        <div class="traits-column">
          <PersonalityTrait
            trait-type="bonds"
            label="Vínculo"
            :content="personality.bonds"
            placeholder="¿Qué vínculos tiene tu personaje?"
            @update="updatePersonality('bonds', $event)"
          />
          
          <PersonalityTrait
            trait-type="flaws"
            label="Defecto"
            :content="personality.flaws"
            placeholder="¿Cuáles son los defectos de tu personaje?"
            @update="updatePersonality('flaws', $event)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useCharacterData } from '../composables/useCharacterData';
  import PersonalityTrait from './PersonalityTrait.vue';
  
  export default {
    name: 'PersonalitySection',
    components: {
      PersonalityTrait
    },
    setup() {
      const { personality: characterPersonality, debouncedSave } = useCharacterData();
      const store = useCharacterData();
      
      // Get personality from the store
      const personality = computed(() => characterPersonality.value);
      
      /**
       * Update personality trait
       * @param {string} trait - Trait type (traits, ideals, bonds, flaws)
       * @param {string} value - New trait value
       */
      const updatePersonality = (trait, value) => {
        store.SET_PERSONALITY({ trait, value });
        debouncedSave();
      };
      
      return {
        personality,
        updatePersonality
      };
    }
  };
  </script>
  
  <style scoped>
  .traits-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
  
  .traits-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    .traits-section {
      grid-template-columns: 1fr;
      gap: var(--spacing-sm);
    }
  }
  </style>