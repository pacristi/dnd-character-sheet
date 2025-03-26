<!--
  Checkbox Component
  A reusable component for checkboxes
-->
<template>
    <div class="checkbox-field" :class="{ inline }">
      <div class="checkbox-wrapper">
        <input
          type="checkbox"
          :id="id"
          :checked="modelValue"
          :aria-label="ariaLabel"
          :disabled="disabled"
          class="checkbox-input"
          v-bind="$attrs"
          @change="onChange"
        />
        <label :for="id" class="checkbox-label">
          <span class="checkbox-custom">
            <svg class="checkmark-icon" viewBox="0 0 14 11" fill="none">
              <path d="M1 5.5L5 9.5L13 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="checkbox-text">{{ label }}</span>
        </label>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseCheckbox',
    props: {
      id: {
        type: String,
        required: true
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      ariaLabel: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      inline: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
      /**
       * Handle input change
       * @param {Event} event - Change event
       */
      const onChange = (event) => {
        const checked = event.target.checked;
        emit('update:modelValue', checked);
        emit('change', checked);
      };
      
      return {
        onChange
      };
    }
  };
  </script>
  
  <style scoped>
  .checkbox-field {
    margin-bottom: var(--spacing-sm);
  }
  
  .checkbox-field.inline {
    display: inline-block;
    margin-right: var(--spacing-md);
  }
  
  .checkbox-wrapper {
    display: flex;
    align-items: center;
  }
  
  .checkbox-input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    cursor: pointer;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  
  .checkbox-custom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    background-color: white;
    border: 2px solid var(--color-primary);
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .checkbox-input:checked + .checkbox-label .checkbox-custom {
    background-color: var(--color-primary);
  }
  
  .checkmark-icon {
    width: 12px;
    height: 9px;
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .checkbox-input:checked + .checkbox-label .checkmark-icon {
    opacity: 1;
  }
  
  .checkbox-input:focus + .checkbox-label .checkbox-custom {
    box-shadow: 0 0 0 2px rgba(117, 72, 46, 0.3);
  }
  
  .checkbox-input:disabled + .checkbox-label {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .checkbox-input:disabled + .checkbox-label .checkbox-custom {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
  
  .checkbox-text {
    font-size: 14px;
  }
  </style>