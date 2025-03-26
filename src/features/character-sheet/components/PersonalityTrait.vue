<!--
  Personality Trait Component
  Displays and manages a single personality trait
-->
<template>
    <div class="trait">
      <div class="trait-header">
        <h3>{{ label }}</h3>
      </div>
      <FormTextarea
        :id="`personality-${traitType}`"
        :model-value="content"
        :placeholder="placeholder"
        :aria-label="`${label} del personaje`"
        rows="4"
        @update:model-value="$emit('update', $event)"
      />
    </div>
  </template>
  
  <script>
  import { FormTextarea } from '@/features/shared';
  
  export default {
    name: 'PersonalityTrait',
    components: {
      FormTextarea
    },
    props: {
      traitType: {
        type: String,
        required: true,
        validator: value => ['traits', 'ideals', 'bonds', 'flaws'].includes(value)
      },
      label: {
        type: String,
        required: true
      },
      content: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    emits: ['update']
  };
  </script>
  
  <style scoped>
  .trait {
    background-color: var(--color-highlight);
    border-radius: var(--border-radius);
    padding: var(--spacing-sm);
  }
  
  .trait-header {
    margin-bottom: var(--spacing-xs);
  }
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-primary);
  }
  </style>