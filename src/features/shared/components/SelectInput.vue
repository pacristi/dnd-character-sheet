<!--
  Select Input Component
  A reusable component for dropdown selections
-->
<template>
    <div class="form-field" :class="{ 'has-error': errorMessage }">
      <label v-if="label" :for="id" class="form-label">{{ label }}</label>
      <div class="select-wrapper">
        <select
          :id="id"
          :value="modelValue"
          :aria-label="ariaLabel || label"
          :disabled="disabled"
          class="form-select"
          :class="{ 'is-invalid': errorMessage }"
          v-bind="$attrs"
          @change="onChange"
          @blur="onBlur"
        >
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <option
            v-for="option in options"
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
          >
            {{ getOptionText(option) }}
          </option>
        </select>
        
        <div class="select-arrow"></div>
        
        <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SelectInput',
    props: {
      id: {
        type: String,
        required: true
      },
      modelValue: {
        type: [String, Number, Boolean, Object],
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
      placeholder: {
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
      required: {
        type: Boolean,
        default: false
      },
      validator: {
        type: Function,
        default: null
      }
    },
    emits: ['update:modelValue', 'blur', 'change'],
    data() {
      return {
        errorMessage: ''
      };
    },
    methods: {
      onChange(event) {
        const value = event.target.value;
        this.$emit('update:modelValue', value);
        this.$emit('change', value);
        
        // Clear error on change
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      },
      
      onBlur(event) {
        this.$emit('blur', event);
        
        // Validate on blur
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
  .form-field {
    margin-bottom: var(--spacing-sm);
  }
  
  .form-label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .select-wrapper {
    position: relative;
  }
  
  .form-select {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: var(--border-standard);
    border-radius: 4px;
    background-color: #fffbf5;
    font-family: inherit;
    font-size: inherit;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    transition: border-color 0.2s ease;
  }
  
  .form-select:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(117, 72, 46, 0.2);
  }
  
  .form-select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .form-select.is-invalid {
    border-color: #cc0000;
  }
  
  .select-arrow {
    position: absolute;
    top: 50%;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--color-primary);
    pointer-events: none;
    transform: translateY(-50%);
  }
  
  .error-message {
    color: #cc0000;
    font-size: 0.85em;
    margin-top: 4px;
  }
  </style>