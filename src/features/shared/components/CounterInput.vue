<!--
  Counter Input Component
  A component for incrementing and decrementing numeric values
-->
<template>
    <div class="counter-container">
      <button
        type="button"
        class="counter-button"
        :aria-label="decrementLabel"
        :disabled="modelValue <= min || disabled"
        @click="decrement"
      >
        -
      </button>
      
      <span 
        :id="id" 
        class="counter-value" 
        aria-live="polite"
      >
        {{ modelValue }}
      </span>
      
      <button
        type="button"
        class="counter-button"
        :aria-label="incrementLabel"
        :disabled="modelValue >= max || disabled"
        @click="increment"
      >
        +
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CounterInput',
    props: {
      modelValue: {
        type: Number,
        required: true
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: Infinity
      },
      step: {
        type: Number,
        default: 1
      },
      id: {
        type: String,
        default: ''
      },
      incrementLabel: {
        type: String,
        default: 'Increase value'
      },
      decrementLabel: {
        type: String,
        default: 'Decrease value'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      /**
       * Increment the value
       */
      const increment = () => {
        if (props.modelValue < props.max && !props.disabled) {
          emit('update:modelValue', props.modelValue + props.step);
        }
      };
      
      /**
       * Decrement the value
       */
      const decrement = () => {
        if (props.modelValue > props.min && !props.disabled) {
          emit('update:modelValue', props.modelValue - props.step);
        }
      };
      
      return {
        increment,
        decrement
      };
    }
  };
  </script>
  
  <style scoped>
  .counter-container {
    display: inline-flex;
    align-items: center;
  }
  
  .counter-button {
    width: 28px;
    height: 28px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
  }
  
  .counter-button:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }
  
  .counter-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .counter-value {
    margin: 0 10px;
    font-weight: bold;
    min-width: 24px;
    text-align: center;
  }
  </style>