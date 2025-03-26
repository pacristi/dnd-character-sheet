<template>
    <div class="combat-stat">
      <div class="combat-stat-name">{{ label }}</div>
      <input
        v-if="isText"
        type="text"
        class="combat-stat-value"
        :value="value"
        aria-label="Combat stat value"
        @input="updateValue($event.target.value)"
      />
      <input
        v-else
        type="number"
        class="combat-stat-value"
        :value="value"
        min="0"
        aria-label="Combat stat value"
        @input="updateValue($event.target.value)"
      />
    </div>
  </template>
  
  <script>
  /**
   * Reusable component for combat statistics
   * Following SRP - this component only handles one specific type of UI element
   */
  export default {
    name: 'CombatStatItem',
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: [Number, String],
        required: true
      },
      isText: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /**
       * Emit new value when input changes
       * @param {*} value - New value
       */
      updateValue(value) {
        // Parse number if not a text input
        const parsedValue = this.isText ? value : (parseInt(value) || 0)
        this.$emit('update:value', parsedValue)
      }
    }
  }
  </script>
  
  <style scoped>
  .combat-stat {
    border: var(--border-standard);
    border-radius: 5px;
    padding: 5px;
    background-color: var(--color-highlight);
    text-align: center;
  }
  
  .combat-stat-name {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .combat-stat-value {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    width: 60px;
  }
  </style>