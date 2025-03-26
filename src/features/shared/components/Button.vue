<!--
  Button component
  A reusable button component with various styles and states
-->
<template>
    <button
      :type="type"
      class="btn"
      :class="[
        `btn-${variant}`,
        { 'btn-block': block },
        { 'btn-sm': size === 'small' },
        { 'btn-lg': size === 'large' }
      ]"
      :disabled="disabled || loading"
      v-bind="$attrs"
      @click="onClick"
    >
      <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
      <span class="btn-content" :class="{ 'with-spinner': loading }">
        <slot></slot>
      </span>
    </button>
  </template>
  
  <script>
  export default {
      name: 'BaseButton',
      props: {
      type: {
        type: String,
        default: 'button',
        validator: value => ['button', 'submit', 'reset'].includes(value)
      },
      variant: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'secondary', 'danger', 'outline', 'text'].includes(value)
      },
      size: {
        type: String,
        default: 'medium',
        validator: value => ['small', 'medium', 'large'].includes(value)
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      block: {
        type: Boolean,
        default: false
      }
    },
    emits: ['click'],
    methods: {
      onClick(event) {
        if (!this.disabled && !this.loading) {
          this.$emit('click', event);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
    border: 1px solid transparent;
    outline: none;
    position: relative;
    overflow: hidden;
    user-select: none;
  }
  
  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }
  
  .btn-secondary {
    background-color: var(--color-secondary);
    color: white;
    border-color: var(--color-secondary);
  }
  
  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-secondary-dark);
    border-color: var(--color-secondary-dark);
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
  }
  
  .btn-danger:hover:not(:disabled) {
    background-color: #bd2130;
    border-color: #bd2130;
  }
  
  .btn-outline {
    background-color: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  .btn-outline:hover:not(:disabled) {
    background-color: rgba(117, 72, 46, 0.1);
  }
  
  .btn-text {
    background-color: transparent;
    color: var(--color-primary);
    border-color: transparent;
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .btn-text:hover:not(:disabled) {
    background-color: rgba(117, 72, 46, 0.1);
  }
  
  /* Sizes */
  .btn-sm {
    padding: 4px 8px;
    font-size: 0.875rem;
  }
  
  .btn-lg {
    padding: 12px 20px;
    font-size: 1.125rem;
  }
  
  /* States */
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn:focus {
    box-shadow: 0 0 0 3px rgba(117, 72, 46, 0.3);
  }
  
  .btn-block {
    display: flex;
    width: 100%;
  }
  
  /* Loading state */
  .btn-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: btn-spin 0.8s linear infinite;
    margin-right: 8px;
  }
  
  .btn-content.with-spinner {
    margin-left: 8px;
  }
  
  @keyframes btn-spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>