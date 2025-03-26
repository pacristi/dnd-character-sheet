<template>
    <div class="death-save-group">
      <span>{{ label }}:</span>
      <div class="death-save-boxes">
        <div 
          v-for="i in 3" 
          :key="`save-${i}`" 
          class="death-save-box" 
          :class="{ 'marked': count >= i }"
          @click="updateCount(i)"
          role="button"
          tabindex="0"
          :aria-label="`Toggle ${label} save ${i}`"
          @keypress.enter="updateCount(i)"
          @keypress.space="updateCount(i)"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  /**
   * Component for tracking death saves
   * Following SRP - handles only death save tracking UI
   */
  export default {
    name: 'DeathSaveTracker',
    props: {
      label: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        validator: value => value >= 0 && value <= 3
      }
    },
    methods: {
      /**
       * Update the save count
       * @param {Number} value - Value to set
       */
      updateCount(value) {
        // If clicking on an already marked box, toggle it off
        const newValue = this.count === value ? value - 1 : value
        this.$emit('update:count', newValue)
      }
    }
  }
  </script>
  
  <style scoped>
  .death-save-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .death-save-boxes {
    display: flex;
    gap: 5px;
  }
  
  .death-save-box {
    width: 20px;
    height: 20px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .death-save-box.marked {
    background-color: var(--color-primary);
  }
  
  .death-save-box:focus {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
  </style>