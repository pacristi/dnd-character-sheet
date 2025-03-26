<template>
    <div class="section">
      <h2>Notas</h2>
      <textarea
        v-model="notes"
        class="notes-box"
        placeholder="Notas adicionales de tu personaje y aventuras"
        aria-label="Notas"
        @input="updateNotes($event.target.value)"
      ></textarea>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'NotesSection',
    computed: {
      ...mapState('character', ['notes']),
      
      notes: {
        get() {
          return this.$store.state.character.notes
        }
      }
    },
    methods: {
      ...mapMutations('character', ['SET_NOTES']),
      
      updateNotes(value) {
        this.SET_NOTES(value);
        this.debouncedSave();
      },
      
      debouncedSave() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(() => {
          this.$store.dispatch('character/saveCharacter');
        }, 1000);
      }
    },
    data() {
      return {
        saveTimeout: null
      }
    },
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
    }
  }
  </script>
  
  <style scoped>
  .notes-box {
    width: 100%;
    min-height: 150px;
    padding: 10px;
    border: var(--border-standard);
    border-radius: 4px;
    background-color: #fffbf5;
    font-family: inherit;
    resize: vertical;
  }
  </style>