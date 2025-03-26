<template>
    <div class="counter-container">
      <button
        type="button"
        class="counter-button"
        :aria-label="decrementLabel"
        @click="decrement"
      >
        -
      </button>
      <span :id="id" class="counter-value" aria-live="polite">{{ modelValue }}</span>
      <button
        type="button"
        class="counter-button"
        :aria-label="incrementLabel"
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
        default: null
      },
      incrementLabel: {
        type: String,
        default: 'Increase value'
      },
      decrementLabel: {
        type: String,
        default: 'Decrease value'
      }
    },
    emits: ['update:modelValue'],
    methods: {
      increment() {
        if (this.modelValue < this.max) {
          this.$emit('update:modelValue', this.modelValue + this.step)
        }
      },
      decrement() {
        if (this.modelValue > this.min) {
          this.$emit('update:modelValue', this.modelValue - this.step)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .counter-container {
    display: flex;
    align-items: center;
  }
  
  .counter-button {
    width: 25px;
    height: 25px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
  }
  
  .counter-button:hover {
    background-color: var(--color-primary-dark);
  }
  
  .counter-value {
    margin: 0 10px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }
  </style>