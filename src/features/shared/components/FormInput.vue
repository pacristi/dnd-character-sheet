<!--
  FormInput component
  A reusable form input component with label and validation
-->
<template>
    <div class="form-field" :class="{ 'has-error': errorMessage }">
      <label v-if="label" :for="id" class="form-label">{{ label }}</label>
      <div class="input-wrapper">
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :aria-label="ariaLabel || label"
          :disabled="disabled"
          :min="min"
          :max="max"
          :step="step"
          class="form-input"
          :class="{ 'is-invalid': errorMessage }"
          v-bind="$attrs"
          @input="onInput"
          @blur="onBlur"
        />
        <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormInput',
    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        default: ''
      },
      modelValue: {
        type: [String, Number],
        default: ''
      },
      type: {
        type: String,
        default: 'text'
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
      min: {
        type: [Number, String],
        default: null
      },
      max: {
        type: [Number, String],
        default: null
      },
      step: {
        type: [Number, String],
        default: null
      },
      validator: {
        type: Function,
        default: null
      }
    },
    emits: ['update:modelValue', 'blur'],
    data() {
      return {
        errorMessage: ''
      };
    },
    methods: {
      onInput(event) {
        this.$emit('update:modelValue', event.target.value);
        
        // Clear error on input
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
        
        // Min/max validation for number inputs
        if (this.type === 'number' && this.modelValue !== '') {
          const value = Number(this.modelValue);
          
          if (this.min !== null && value < Number(this.min)) {
            this.errorMessage = `El valor mínimo es ${this.min}`;
            return false;
          }
          
          if (this.max !== null && value > Number(this.max)) {
            this.errorMessage = `El valor máximo es ${this.max}`;
            return false;
          }
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
  
  .input-wrapper {
    position: relative;
  }
  
  .form-input {
    width: 100%;
    padding: 8px;
    border: var(--border-standard);
    border-radius: 4px;
    background-color: #fffbf5;
    font-family: inherit;
    font-size: inherit;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
  }
  
  .form-input:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(117, 72, 46, 0.2);
  }
  
  .form-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .form-input.is-invalid {
    border-color: #cc0000;
  }
  
  .error-message {
    color: #cc0000;
    font-size: 0.85em;
    margin-top: 4px;
  }
  
  /* Specific input type styling */
  input[type="number"] {
    /* Prevent the spinner from affecting input size */
    appearance: textfield;
    -moz-appearance: textfield;
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  </style>