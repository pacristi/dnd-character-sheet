<!--
  FormTextarea component
  A reusable textarea component with label and validation
-->
<template>
    <div class="form-field" :class="{ 'has-error': errorMessage }">
      <label v-if="label" :for="id" class="form-label">{{ label }}</label>
      <div class="textarea-wrapper">
        <textarea
          :id="id"
          :value="modelValue"
          :placeholder="placeholder"
          :aria-label="ariaLabel || label"
          :disabled="disabled"
          :rows="rows"
          class="form-textarea"
          :class="{ 'is-invalid': errorMessage }"
          v-bind="$attrs"
          @input="onInput"
          @blur="onBlur"
        ></textarea>
        <div v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormTextarea',
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
      rows: {
        type: [Number, String],
        default: 4
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
        if (this.required && !this.modelValue.trim()) {
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
  
  .textarea-wrapper {
    position: relative;
  }
  
  .form-textarea {
    width: 100%;
    padding: 8px;
    border: var(--border-standard);
    border-radius: 4px;
    background-color: #fffbf5;
    font-family: inherit;
    font-size: inherit;
    box-sizing: border-box;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.2s ease;
  }
  
  .form-textarea:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(117, 72, 46, 0.2);
  }
  
  .form-textarea:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .form-textarea.is-invalid {
    border-color: #cc0000;
  }
  
  .error-message {
    color: #cc0000;
    font-size: 0.85em;
    margin-top: 4px;
  }
  </style>