<template>
    <div class="section">
      <h2>Rasgos de Personalidad</h2>
      <div class="traits-section">
        <div>
          <div class="trait">
            <div class="trait-name">Personalidad</div>
            <textarea
              v-model="traits"
              class="notes-box"
              placeholder="Describe la personalidad de tu personaje"
              aria-label="Rasgos de personalidad"
              @input="updatePersonality('traits', $event.target.value)"
            ></textarea>
          </div>
  
          <div class="trait">
            <div class="trait-name">Ideal</div>
            <textarea
              v-model="ideals"
              class="notes-box"
              placeholder="¿Cuáles son los ideales de tu personaje?"
              aria-label="Ideales del personaje"
              @input="updatePersonality('ideals', $event.target.value)"
            ></textarea>
          </div>
        </div>
  
        <div>
          <div class="trait">
            <div class="trait-name">Vínculo</div>
            <textarea
              v-model="bonds"
              class="notes-box"
              placeholder="¿Qué vínculos tiene tu personaje?"
              aria-label="Vínculos del personaje"
              @input="updatePersonality('bonds', $event.target.value)"
            ></textarea>
          </div>
  
          <div class="trait">
            <div class="trait-name">Defecto</div>
            <textarea
              v-model="flaws"
              class="notes-box"
              placeholder="¿Cuáles son los defectos de tu personaje?"
              aria-label="Defectos del personaje"
              @input="updatePersonality('flaws', $event.target.value)"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'PersonalitySection',
    computed: {
      ...mapState('character', ['personality']),
      
      traits: {
        get() {
          return this.personality.traits
        }
      },
      
      ideals: {
        get() {
          return this.personality.ideals
        }
      },
      
      bonds: {
        get() {
          return this.personality.bonds
        }
      },
      
      flaws: {
        get() {
          return this.personality.flaws
        }
      }
    },
    methods: {
      ...mapMutations('character', ['SET_PERSONALITY']),
      
      updatePersonality(trait, value) {
        this.SET_PERSONALITY({ trait, value });
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
    data() {
      return {
        saveTimeout: null
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
  .traits-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  .trait {
    margin-bottom: var(--spacing-sm);
  }
  
  .trait-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .notes-box {
    width: 100%;
    min-height: 100px;
    padding: 5px;
    border: var(--border-standard);
    border-radius: 4px;
    background-color: #fffbf5;
    font-family: inherit;
    resize: vertical;
  }
  
  @media (max-width: 768px) {
    .traits-section {
      grid-template-columns: 1fr;
    }
  }
  </style>