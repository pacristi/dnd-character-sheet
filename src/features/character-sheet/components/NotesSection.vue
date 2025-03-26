<!--
  Notes Section Component
  Displays and manages character notes
-->
<template>
    <div class="section">
      <h2>Notas</h2>
      <FormTextarea
        id="character-notes"
        :model-value="notes"
        placeholder="Notas adicionales de tu personaje y aventuras"
        aria-label="Notas"
        rows="8"
        @update:model-value="updateNotes"
      />
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useCharacterData } from '../composables/useCharacterData';
  import { FormTextarea } from '@/features/shared';
  
  export default {
    name: 'NotesSection',
    components: {
      FormTextarea
    },
    setup() {
      const { debouncedSave } = useCharacterData();
      const store = useCharacterData();
      
      // Get notes from the store
      const notes = computed(() => store.notes.value);
      
      /**
       * Update notes in the store
       * @param {string} value - New notes value
       */
      const updateNotes = (value) => {
        store.SET_NOTES(value);
        debouncedSave();
      };
      
      return {
        notes,
        updateNotes
      };
    }
  };
  </script>
  
  <style scoped>
  /* Component-specific styles */
  </style>