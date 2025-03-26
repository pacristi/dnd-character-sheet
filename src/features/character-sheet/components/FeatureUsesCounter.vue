<!--
  Feature Uses Counter Component
  Manages the uses count for a limited-use feature
-->
<template>
    <div class="counter-container" v-if="uses">
      <div class="counter-info">
        <button
          type="button"
          class="counter-button"
          aria-label="Decrease uses"
          :disabled="current <= 0"
          @click="adjustUses(-1)"
        >
          -
        </button>
        <span class="counter-value" aria-live="polite">{{ current }}</span>
        <button
          type="button"
          class="counter-button"
          aria-label="Increase uses"
          :disabled="current >= max"
          @click="adjustUses(1)"
        >
          +
        </button>
        <span> / </span>
        <input
          type="number"
          v-model.number="maxUses"
          min="1"
          aria-label="Maximum uses"
          style="width: 40px"
          @change="updateMax"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, watch } from 'vue';
  
  export default {
    name: 'FeatureUsesCounter',
    props: {
      uses: {
        type: Object,
        required: true,
        validator: value => 
          typeof value === 'object' && 
          'current' in value && 
          'max' in value
      }
    },
    emits: ['update'],
    setup(props, { emit }) {
      const current = computed(() => props.uses.current || 0);
      const maxUses = ref(props.uses.max || 1);
      
      // Update maxUses when props change
      watch(() => props.uses.max, (newMax) => {
        maxUses.value = newMax || 1;
      });
      
      /**
       * Adjust current uses by amount
       * @param {number} amount - Amount to adjust by
       */
      const adjustUses = (amount) => {
        const newCurrent = Math.max(0, Math.min(props.uses.max, current.value + amount));
        emitUpdate(newCurrent, props.uses.max);
      };
      
      /**
       * Update max uses
       */
      const updateMax = () => {
        const newMax = Math.max(1, maxUses.value);
        const newCurrent = Math.min(current.value, newMax);
        emitUpdate(newCurrent, newMax);
      };
      
      /**
       * Emit uses update
       * @param {number} current - Current uses
       * @param {number} max - Maximum uses
       */
      const emitUpdate = (current, max) => {
        emit('update', {
          current,
          max
        });
      };
      
      return {
        current,
        maxUses,
        adjustUses,
        updateMax
      };
    }
  };
  </script>
  
  <style scoped>
  .counter-container {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-xs);
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  .counter-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .counter-button {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-weight: bold;
  }
  
  .counter-value {
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }
  </style>