<template>
    <div class="section">
      <h2>Idiomas y Competencias</h2>
      <div>
        <div class="info-item">
          <label for="languages-list">Idiomas:</label>
          <div id="languages-container" style="margin-top: 5px">
            <div
              id="languages-list"
              class="tags-list"
            >
              <div
                v-for="(language, index) in languages"
                :key="`lang-${index}`"
                class="tag"
              >
                <span>{{ language }}</span>
                <button
                  type="button"
                  aria-label="Remove language"
                  @click="removeLanguage(language)"
                >✕</button>
              </div>
            </div>
            <div style="display: flex; gap: 5px; margin-bottom: 10px">
              <input
                type="text"
                id="new-language"
                v-model="newLanguage"
                placeholder="Añadir idioma..."
                style="flex-grow: 1"
                aria-label="Nuevo idioma"
                @keypress.enter="addLanguage"
              />
              <button type="button" @click="addLanguage">Añadir</button>
            </div>
          </div>
        </div>
  
        <div class="info-item" style="margin-top: 15px">
          <label for="proficiencies-list">Otras Competencias:</label>
          <div id="proficiencies-container" style="margin-top: 5px">
            <div
              id="proficiencies-list"
              class="tags-list"
            >
              <div
                v-for="(proficiency, index) in proficiencies"
                :key="`prof-${index}`"
                class="tag"
              >
                <span>{{ proficiency }}</span>
                <button
                  type="button"
                  aria-label="Remove proficiency"
                  @click="removeProficiency(proficiency)"
                >✕</button>
              </div>
            </div>
            <div style="display: flex; gap: 5px">
              <input
                type="text"
                id="new-proficiency"
                v-model="newProficiency"
                placeholder="Añadir competencia..."
                style="flex-grow: 1"
                aria-label="Nueva competencia"
                @keypress.enter="addProficiency"
              />
              <button type="button" @click="addProficiency">Añadir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'LanguagesSection',
    data() {
      return {
        newLanguage: '',
        newProficiency: '',
        saveTimeout: null
      }
    },
    computed: {
      ...mapState('character', ['languages', 'proficiencies'])
    },
    methods: {
      ...mapMutations('character', [
        'ADD_LANGUAGE',
        'REMOVE_LANGUAGE',
        'ADD_PROFICIENCY',
        'REMOVE_PROFICIENCY'
      ]),
      
      addLanguage() {
        const languageText = this.newLanguage.trim();
        if (!languageText) return;
        
        // Add to store if not already present
        if (!this.languages.includes(languageText)) {
          this.ADD_LANGUAGE(languageText);
          this.debouncedSave();
        }
        
        // Clear input
        this.newLanguage = '';
      },
      
      removeLanguage(language) {
        this.REMOVE_LANGUAGE(language);
        this.debouncedSave();
      },
      
      addProficiency() {
        const proficiencyText = this.newProficiency.trim();
        if (!proficiencyText) return;
        
        // Add to store if not already present
        if (!this.proficiencies.includes(proficiencyText)) {
          this.ADD_PROFICIENCY(proficiencyText);
          this.debouncedSave();
        }
        
        // Clear input
        this.newProficiency = '';
      },
      
      removeProficiency(proficiency) {
        this.REMOVE_PROFICIENCY(proficiency);
        this.debouncedSave();
      },
      
      debouncedSave() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(() => {
          this.$store.dispatch('character/saveCharacter');
        }, 1000);
      }
    },
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
    }
  }
  </script>
  
  <style scoped>
  .tags-list {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .tag {
    background-color: var(--color-highlight);
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .tag button {
    background: none;
    border: none;
    font-size: 14px;
    margin-left: 5px;
    cursor: pointer;
    padding: 0;
    color: var(--color-primary);
  }
  
  .tag button:hover {
    background: none;
    color: var(--color-primary-dark);
  }
  
  .info-item {
    margin-bottom: var(--spacing-sm);
  }
  
  .info-item label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  </style>