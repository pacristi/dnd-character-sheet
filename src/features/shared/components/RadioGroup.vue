<!--
  Radio Group Component
  A reusable component for radio button groups
-->
<template>
    <div class="radio-group-field">
      <label v-if="label" class="radio-group-label">{{ label }}</label>
      <div
        class="radio-options"
        :class="{
          'radio-inline': inline,
          'radio-vertical': !inline
        }"
      >
        <div
          v-for="option in options"
          :key="getOptionValue(option)"
          class="radio-option"
        >
          <input
            type="radio"
            :id="`${id}-${getOptionValue(option)}`"
            :name="id"
            :value="getOptionValue(option)"
            :checked="modelValue === getOptionValue(option)"
            :disabled="disabled"
            class="radio-input"
            @change="onChange(getOptionValue(option))"
          />
          <label :for="`${id}-${getOptionValue(option)}`" class="radio-label">
            <span class="radio-custom"></span>
            <span class="radio-text">{{ getOptionText(option) }}</span>
          </label>
        </div>
      </div>
      <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RadioGroup',
    props: {
      id: {
        type: String,
        required: true
      },
      modelValue: {
        type: [String, Number, Boolean],
        default: ''
      },
      options: {
        type: Array,
        required: true
      },
      valueKey: {
        type: String,
        default: null
      },
      textKey: {
        type: String,
        default: null
      },
      label: {
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
      },
      required: {
        type: Boolean,
        default: false
      },
      validator: {
        type: Function,
        default: null
      }
    },
    emits: ['update:modelValue', 'change'],
    data() {
      return {
        errorMessage: ''
      };
    },
    methods: {
      onChange(value) {
        this.$emit('update:modelValue', value);
        this.$emit('change', value);
        
        // Clear error on change
        if (this.errorMessage) {
          this.errorMessage = '';
        }
        
        // Validate
        this.validate();
      },
      
      validate() {
        this.errorMessage = '';
        
        // Required validation
        if (this.required && !this.modelValue) {
          this.errorMessage = 'Este campo es obligatorio';
          return false;
        }
        
        // Custom validator
        if (this.validator) {
          const validationResult = this.validator(this.modelValue);
          if (validationResult !== true) {
            this.errorMessage = validationResult || 'Valor inválido';
            return false;
          }
        }
        
        return true;
      },
      
      getOptionValue(option) {
        if (this.valueKey && typeof option === 'object') {
          return option[this.valueKey];
        }
        return option;
      },
      
      getOptionText(option) {
        if (this.textKey && typeof option === 'object') {
          return option[this.textKey];
        }
        return option;
      }
    }
  };
  </script>
  
  <style scoped>
  .radio-group-field {
    margin-bottom: var(--spacing-sm);
  }
  
  .radio-group-label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .radio-options {
    display: flex;
  }
  
  .radio-inline {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .radio-vertical {
    flex-direction: column;
    gap: 8px;
  }
  
  .radio-option {
    position: relative;
  }
  
  .radio-input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    cursor: pointer;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  
  .radio-custom {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    background-color: white;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  
  .radio-custom::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    background-color: var(--color-primary);
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
  
  .radio-input:checked + .radio-label .radio-custom::after {
    transform: translate(-50%, -50%) scale(1);
  }
  
  .radio-input:focus + .radio-label .radio-custom {
    box-shadow: 0 0 0 2px rgba(117, 72, 46, 0.3);
  }
  
  .radio-input:disabled + .radio-label {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .radio-input:disabled + .radio-label .radio-custom {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
  
  .radio-text {
    font-size: 14px;
  }
  
  .error-message {
    color: #cc0000;
    font-size: 0.85em;
    margin-top: 4px;
  }
  </style>