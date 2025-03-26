<!--
  Languages Section Component
  Displays and manages character languages and proficiencies
-->
<template>
    <div class="section">
      <h2>Idiomas y Competencias</h2>
      
      <!-- Languages -->
      <div class="category-container">
        <h3>Idiomas</h3>
        <TagList
          :items="languages"
          placeholder="Añadir idioma..."
          empty-message="Sin idiomas"
          @add="addLanguage"
          @remove="removeLanguage"
        />
      </div>
      
      <!-- Proficiencies -->
      <div class="category-container">
        <h3>Otras Competencias</h3>
        <TagList
          :items="proficiencies"
          placeholder="Añadir competencia..."
          empty-message="Sin competencias"
          @add="addProficiency"
          @remove="removeProficiency"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useCharacterData } from '../composables/useCharacterData';
  import TagList from './TagList.vue';
  
  export default {
    name: 'LanguagesSection',
    components: {
      TagList
    },
    setup() {
      const { 
        languages: characterLanguages,
        proficiencies: characterProficiencies,
        debouncedSave
      } = useCharacterData();
      
      const store = useCharacterData();
      
      // Get data from the store
      const languages = computed(() => characterLanguages.value);
      const proficiencies = computed(() => characterProficiencies.value);
      
      /**
       * Add a language
       * @param {string} language - Language to add
       */
      const addLanguage = (language) => {
        if (!language.trim()) return;
        
        // Add to store if not already present
        if (!languages.value.includes(language)) {
          store.ADD_LANGUAGE(language);
          debouncedSave();
        }
      };
      
      /**
       * Remove a language
       * @param {string} language - Language to remove
       */
      const removeLanguage = (language) => {
        store.REMOVE_LANGUAGE(language);
        debouncedSave();
      };
      
      /**
       * Add a proficiency
       * @param {string} proficiency - Proficiency to add
       */
      const addProficiency = (proficiency) => {
        if (!proficiency.trim()) return;
        
        // Add to store if not already present
        if (!proficiencies.value.includes(proficiency)) {
          store.ADD_PROFICIENCY(proficiency);
          debouncedSave();
        }
      };
      
      /**
       * Remove a proficiency
       * @param {string} proficiency - Proficiency to remove
       */
      const removeProficiency = (proficiency) => {
        store.REMOVE_PROFICIENCY(proficiency);
        debouncedSave();
      };
      
      return {
        languages,
        proficiencies,
        addLanguage,
        removeLanguage,
        addProficiency,
        removeProficiency
      };
    }
  };
  </script>
  
  <style scoped>
  .category-container {
    margin-bottom: var(--spacing-md);
  }
  
  h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-primary);
    font-size: 1.1rem;
  }
  </style>