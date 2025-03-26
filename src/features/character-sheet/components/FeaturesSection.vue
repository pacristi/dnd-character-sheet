<template>
    <div class="section">
      <h2>Rasgos y Habilidades</h2>
      <div id="features-container">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="trait"
          :data-id="feature.id || `feature-${index}`"
        >
          <div class="feature-header">
            <input
              type="text"
              placeholder="Nombre del rasgo"
              aria-label="Feature name"
              v-model="feature.name"
              @input="updateFeature(index)"
            />
            <button
              type="button"
              aria-label="Remove feature"
              @click="removeFeature(index)"
            >
              ✕
            </button>
          </div>
          
          <textarea
            placeholder="Descripción del rasgo"
            aria-label="Feature description"
            v-model="feature.description"
            @input="updateFeature(index)"
          ></textarea>
          
          <div class="limited-uses">
            <div class="limited-use-item">
              <label>
                <input
                  type="checkbox"
                  aria-label="Limited use feature"
                  v-model="feature.limitedUse"
                  @change="updateFeature(index)"
                />
                Uso limitado
              </label>
              <div
                class="counter-container"
                v-if="feature.limitedUse"
                style="margin-left: 10px"
              >
                <button
                  type="button"
                  class="counter-button"
                  aria-label="Decrease uses"
                  @click="adjustUses(index, -1)"
                >
                  -
                </button>
                <span class="counter-value" aria-live="polite">{{ feature.uses ? feature.uses.current : 0 }}</span>
                <button
                  type="button"
                  class="counter-button"
                  aria-label="Increase uses"
                  @click="adjustUses(index, 1)"
                >
                  +
                </button>
                <span> / </span>
                <input
                  type="number"
                  v-model.number="feature.uses.max"
                  min="1"
                  aria-label="Maximum uses"
                  style="width: 40px"
                  @input="updateFeature(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="addFeature"
        style="margin-top: 10px"
      >
        Añadir Rasgo
      </button>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'FeaturesSection',
    computed: {
      ...mapState('character', ['features'])
    },
    methods: {
      ...mapMutations('character', ['SET_FEATURES', 'ADD_FEATURE', 'UPDATE_FEATURE', 'REMOVE_FEATURE']),
      
      addFeature() {
        const featureId = `feature-${Date.now()}`
        const newFeature = {
          id: featureId,
          name: '',
          description: '',
          limitedUse: false,
          uses: {
            current: 0,
            max: 1
          }
        }
        
        this.ADD_FEATURE(newFeature)
        this.debouncedSave()
        
        // Focus on the name input after rendering
        this.$nextTick(() => {
          const featureElement = document.querySelector(`.trait[data-id="${featureId}"]`)
          if (featureElement) {
            const nameInput = featureElement.querySelector('input[type="text"]')
            if (nameInput) {
              nameInput.focus()
            }
          }
        })
      },
      
      updateFeature(index) {
        // Ensure the feature at this index has uses property if limitedUse is true
        if (this.features[index].limitedUse && (!this.features[index].uses || typeof this.features[index].uses !== 'object')) {
          // Vue reactivity doesn't detect nested object creation well, so we need to use UPDATE_FEATURE
          const updatedFeature = {
            ...this.features[index],
            uses: {
              current: 0,
              max: 1
            }
          }
          this.UPDATE_FEATURE({ index, feature: updatedFeature })
        }
        
        this.debouncedSave()
      },
      
      removeFeature(index) {
        this.REMOVE_FEATURE(index)
        this.debouncedSave()
      },
      
      adjustUses(index, change) {
        if (!this.features[index].limitedUse || !this.features[index].uses) {
          return
        }
        
        const feature = this.features[index]
        const maxUses = feature.uses.max || 1
        
        // Calculate new value within bounds
        const newValue = Math.max(0, Math.min(maxUses, feature.uses.current + change))
        
        // Create updated feature with new value
        const updatedFeature = {
          ...feature,
          uses: {
            ...feature.uses,
            current: newValue
          }
        }
        
        this.UPDATE_FEATURE({ index, feature: updatedFeature })
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
  .trait {
    margin-bottom: var(--spacing-md);
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius);
    padding: var(--spacing-sm);
    background-color: var(--color-highlight);
  }
  
  .feature-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }
  
  .feature-header input {
    flex-grow: 1;
    margin-right: var(--spacing-sm);
  }
  
  textarea {
    width: 100%;
    min-height: 60px;
    margin-bottom: var(--spacing-sm);
  }
  
  .limited-uses {
    margin-top: var(--spacing-sm);
  }
  
  .limited-use-item {
    display: flex;
    align-items: center;
  }
  
  .counter-container {
    display: flex;
    align-items: center;
  }
  
  .counter-button {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  
  .counter-value {
    margin: 0 var(--spacing-sm);
    font-weight: bold;
  }
  </style>