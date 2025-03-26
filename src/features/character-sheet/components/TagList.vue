<!--
  Tag List Component
  A reusable component for displaying and managing a list of tags
-->
<template>
    <div class="tag-list-container">
      <!-- Tags list -->
      <div class="tags-list" v-if="items.length > 0">
        <div
          v-for="(item, index) in items"
          :key="`tag-${index}`"
          class="tag"
        >
          <span>{{ item }}</span>
          <button
            type="button"
            aria-label="Remove item"
            @click="$emit('remove', item)"
          >✕</button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="empty-tags">
        {{ emptyMessage }}
      </div>
      
      <!-- Add new item form -->
      <div class="tag-add">
        <FormInput
          :id="`new-${inputId}`"
          v-model="newItem"
          :placeholder="placeholder"
          :aria-label="placeholder"
          @keypress.enter="addItem"
        />
        <Button @click="addItem">Añadir</Button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { FormInput, Button } from '@/features/shared';
  
  export default {
    name: 'TagList',
    components: {
      FormInput,
      Button
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: 'Añadir...'
      },
      emptyMessage: {
        type: String,
        default: 'No hay elementos'
      },
      inputId: {
        type: String,
        default: 'item'
      }
    },
    emits: ['add', 'remove'],
    setup(props, { emit }) {
      // Input for new item
      const newItem = ref('');
      
      /**
       * Add a new item
       */
      const addItem = () => {
        const itemText = newItem.value.trim();
        if (!itemText) return;
        
        // Emit add event
        emit('add', itemText);
        
        // Clear input
        newItem.value = '';
      };
      
      return {
        newItem,
        addItem
      };
    }
  };
  </script>
  
  <style scoped>
  .tag-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .tag {
    background-color: var(--color-highlight);
    padding: 5px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
  }
  
  .tag button {
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }
  
  .tag button:hover {
    color: var(--color-primary-dark);
  }
  
  .empty-tags {
    color: #777;
    font-style: italic;
    font-size: 0.9rem;
    padding: 5px 0;
  }
  
  .tag-add {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-xs);
  }
  
  .tag-add > :first-child {
    flex-grow: 1;
  }
  </style>