<!--
  Features Section Component
  Displays and manages character features and traits
-->
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
            @input="() => updateFeature(index, feature)"
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
          @input="() => updateFeature(index, feature)"
        ></textarea>
        
        <FeatureUsesCounter 
          v-if="feature.limitedUse"
          :uses="feature.uses"
          @update="updateUses(index, $event)"
        />
        
        <div class="limited-uses">
          <div class="limited-use-item">
            <label>
              <input
                type="checkbox"
                aria-label="Limited use feature"
                v-model="feature.limitedUse"
                @change="() => updateFeature(index, feature)"
              />
              Uso limitado
            </label>
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
import { computed } from 'vue';
import { useCharacterData } from '../composables/useCharacterData';
import FeatureUsesCounter from './FeatureUsesCounter.vue';

export default {
  name: 'FeaturesSection',
  components: {
    FeatureUsesCounter
  },
  setup() {
    const { 
      features: characterFeatures,
      ADD_FEATURE, 
      UPDATE_FEATURE, 
      REMOVE_FEATURE 
    } = useCharacterData();
    
    const features = computed(() => characterFeatures.value);
    
    /**
     * Add a new feature
     */
    const addFeature = () => {
      const featureId = `feature-${Date.now()}`;
      const newFeature = {
        id: featureId,
        name: '',
        description: '',
        limitedUse: false,
        uses: {
          current: 0,
          max: 1
        }
      };
      
      ADD_FEATURE(newFeature);
      
      // Focus on the name input after rendering
      setTimeout(() => {
        const featureElement = document.querySelector(`.trait[data-id="${featureId}"]`);
        if (featureElement) {
          const nameInput = featureElement.querySelector('input[type="text"]');
          if (nameInput) {
            nameInput.focus();
          }
        }
      }, 0);
    };
    
    /**
     * Update an existing feature
     * @param {number} index - Feature index
     * @param {Object} feature - Feature data
     */
    const updateFeature = (index, feature) => {
      // Ensure the feature has uses property if limitedUse is true
      if (feature.limitedUse && (!feature.uses || typeof feature.uses !== 'object')) {
        // Create a copy of the feature for update
        const updatedFeature = {
          ...feature,
          uses: {
            current: 0,
            max: 1
          }
        };
        UPDATE_FEATURE({ index, feature: updatedFeature });
      } else {
        UPDATE_FEATURE({ index, feature });
      }
    };
    
    /**
     * Remove a feature
     * @param {number} index - Feature index
     */
    const removeFeature = (index) => {
      REMOVE_FEATURE(index);
    };
    
    /**
     * Update feature uses
     * @param {number} index - Feature index
     * @param {Object} uses - New uses values {current, max}
     */
    const updateUses = (index, uses) => {
      const feature = features.value[index];
      if (!feature) return;
      
      const updatedFeature = {
        ...feature,
        uses
      };
      
      UPDATE_FEATURE({ index, feature: updatedFeature });
    };
    
    return {
      features,
      addFeature,
      updateFeature,
      removeFeature,
      updateUses
    };
  }
};
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
</style>