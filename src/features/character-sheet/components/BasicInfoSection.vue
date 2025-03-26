<template>
    <div class="section">
      <h2>Información Básica</h2>
      <div class="basic-info">
        <div class="info-item">
          <label for="character-name">Nombre:</label>
          <input
            type="text"
            id="character-name"
            placeholder="Nombre de tu personaje"
            aria-label="Nombre del personaje"
            v-model="name"
            @input="updateBasicInfo('name', $event.target.value)"
          />
        </div>
        <div class="info-item">
          <label for="level">Nivel:</label>
          <CounterInput 
            id="level"
            v-model="level"
            :min="1"
            :max="20"
            increment-label="Aumentar nivel"
            decrement-label="Disminuir nivel"
            @update:modelValue="updateBasicInfo('level', $event)"
          />
        </div>
        <div class="info-item">
          <label for="race">Raza:</label>
          <input
            type="text"
            id="race"
            placeholder="Raza"
            aria-label="Raza del personaje"
            v-model="race"
            @input="updateBasicInfo('race', $event.target.value)"
          />
        </div>
        <div class="info-item">
          <label for="class">Clase:</label>
          <input
            type="text"
            id="class"
            placeholder="Clase"
            aria-label="Clase del personaje"
            v-model="characterClass"
            @input="updateBasicInfo('class', $event.target.value)"
          />
        </div>
        <div class="info-item">
          <label for="background">Trasfondo:</label>
          <input
            type="text"
            id="background"
            placeholder="Trasfondo"
            aria-label="Trasfondo del personaje"
            v-model="background"
            @input="updateBasicInfo('background', $event.target.value)"
          />
        </div>
        <div class="info-item">
          <label for="alignment">Alineamiento:</label>
          <input
            type="text"
            id="alignment"
            placeholder="Alineamiento"
            aria-label="Alineamiento del personaje"
            v-model="alignment"
            @input="updateBasicInfo('alignment', $event.target.value)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  import CounterInput from '../../shared/components/CounterInput.vue'
  
  export default {
    name: 'BasicInfoSection',
    components: {
      CounterInput
    },
    computed: {
      ...mapState('character', ['basicInfo']),
      
      name: {
        get() {
          return this.basicInfo.name
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'name', value })
        }
      },
      
      level: {
        get() {
          return this.basicInfo.level
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'level', value })
        }
      },
      
      race: {
        get() {
          return this.basicInfo.race
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'race', value })
        }
      },
      
      characterClass: {
        get() {
          return this.basicInfo.class
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'class', value })
        }
      },
      
      background: {
        get() {
          return this.basicInfo.background
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'background', value })
        }
      },
      
      alignment: {
        get() {
          return this.basicInfo.alignment
        },
        set(value) {
          this.SET_BASIC_INFO({ field: 'alignment', value })
        }
      }
    },
    methods: {
      ...mapMutations('character', ['SET_BASIC_INFO']),
      
      updateBasicInfo(field, value) {
        this.SET_BASIC_INFO({ field, value })
        // Save to localStorage after a short delay to avoid excessive saves
        this.debouncedSave()
      },
      
      debouncedSave() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout)
        }
        
        this.saveTimeout = setTimeout(() => {
          this.$store.dispatch('character/saveCharacter')
        }, 1000)
      }
    },
    data() {
      return {
        saveTimeout: null
      }
    },
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }
    }
  }
  </script>
  
  <style scoped>
  .basic-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }
  
  .info-item {
    margin-bottom: var(--spacing-sm);
  }
  
  .info-item label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .basic-info {
      grid-template-columns: 1fr;
    }
  }
  </style>