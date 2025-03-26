<template>
    <div v-if="modelValue" class="modal" @click.self="close">
      <div class="modal-content" :style="contentStyle">
        <span class="close-button" @click="close" aria-label="Close">&times;</span>
        <h3 v-if="title">{{ title }}</h3>
        <slot></slot>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseModal',
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      maxWidth: {
        type: String,
        default: '600px'
      }
    },
    emits: ['update:modelValue'],
    computed: {
      contentStyle() {
        return {
          maxWidth: this.maxWidth
        }
      }
    },
    watch: {
      modelValue(newVal) {
        if (newVal) {
          document.body.style.overflow = 'hidden'
          this.addKeyboardListener()
        } else {
          document.body.style.overflow = ''
          this.removeKeyboardListener()
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:modelValue', false)
      },
      handleKeydown(e) {
        if (e.key === 'Escape') {
          this.close()
        }
      },
      addKeyboardListener() {
        document.addEventListener('keydown', this.handleKeydown)
      },
      removeKeyboardListener() {
        document.removeEventListener('keydown', this.handleKeydown)
      }
    },
    mounted() {
      if (this.modelValue) {
        document.body.style.overflow = 'hidden'
        this.addKeyboardListener()
      }
    },
    beforeUnmount() {
      document.body.style.overflow = ''
      this.removeKeyboardListener()
    }
  }
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    padding: 30px 0;
  }
  
  .modal-content {
    background-color: var(--color-background);
    margin: auto;
    padding: var(--spacing-lg);
    border: var(--border-standard);
    border-radius: var(--border-radius);
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: modal-appear 0.3s ease-out;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    color: var(--color-primary);
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close-button:hover {
    color: var(--color-primary-dark);
  }
  
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }
  
  @keyframes modal-appear {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>