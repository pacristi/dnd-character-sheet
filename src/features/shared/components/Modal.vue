<!--
  Modal component
  A reusable modal dialog component with customizable header and footer
-->
<template>
    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="modelValue"
          class="modal-overlay"
          @click="closeOnBackdrop ? close() : null"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : null"
        >
          <div 
            class="modal-container" 
            :class="sizeClass"
            @click.stop
            :style="contentStyle"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="modal-header">
              <h3 v-if="title" id="modal-title" class="modal-title">{{ title }}</h3>
              <slot v-else name="header"></slot>
              <button 
                type="button" 
                class="modal-close" 
                @click="close" 
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer"></slot>
            </div>
            <div v-else-if="showDefaultFooter" class="modal-footer">
              <Button 
                variant="secondary" 
                @click="close"
              >
                {{ cancelText }}
              </Button>
              <Button 
                @click="confirm"
              >
                {{ confirmText }}
              </Button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script>
  import Button from './Button.vue';
  
  export default {
    name: 'AppModal',
    components: {
      Button
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'medium',
        validator: value => ['small', 'medium', 'large', 'fullscreen'].includes(value)
      },
      maxWidth: {
        type: String,
        default: null
      },
      closeOnBackdrop: {
        type: Boolean,
        default: true
      },
      closeOnEsc: {
        type: Boolean,
        default: true
      },
      showDefaultFooter: {
        type: Boolean,
        default: false
      },
      confirmText: {
        type: String,
        default: 'Aceptar'
      },
      cancelText: {
        type: String,
        default: 'Cancelar'
      }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      sizeClass() {
        return {
          'modal-sm': this.size === 'small',
          'modal-lg': this.size === 'large',
          'modal-fullscreen': this.size === 'fullscreen'
        };
      },
      contentStyle() {
        if (this.maxWidth) {
          return { maxWidth: this.maxWidth };
        }
        return {};
      }
    },
    methods: {
      close() {
        this.$emit('update:modelValue', false);
      },
      confirm() {
        this.$emit('confirm');
        this.close();
      },
      handleKeydown(e) {
        if (this.closeOnEsc && e.key === 'Escape' && this.modelValue) {
          this.close();
        }
      }
    },
    mounted() {
      if (this.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }
      if (this.modelValue) {
        document.body.style.overflow = 'hidden';
      }
    },
    beforeUnmount() {
      document.removeEventListener('keydown', this.handleKeydown);
      document.body.style.overflow = '';
    },
    watch: {
      modelValue(val) {
        if (val) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  
  .modal-container {
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
    max-height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    position: relative;
    animation: modal-appear 0.3s ease-out;
  }
  
  .modal-sm {
    max-width: 400px;
  }
  
  .modal-lg {
    max-width: 800px;
  }
  
  .modal-fullscreen {
    max-width: none;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: var(--border-standard);
    background-color: var(--color-highlight);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-primary);
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    color: var(--color-primary);
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .modal-close:hover {
    opacity: 1;
  }
  
  .modal-body {
    padding: 16px;
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .modal-footer {
    padding: 16px;
    border-top: var(--border-standard);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  /* Animations */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  @keyframes modal-appear {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .modal-container {
      width: 100%;
      max-width: none;
      border-radius: var(--border-radius);
    }
    
    .modal-sm, .modal-lg {
      max-width: none;
    }
  }
  </style>