<!--
  Character Import/Export Component
  Handles importing and exporting character data
-->
<template>
    <div class="section">
      <h2>Cargar/Guardar Personaje</h2>
      <div class="actions-container">
        <Button 
          @click="handleExportCharacter" 
          :loading="isExporting"
        >
          Guardar como JSON
        </Button>
        
        <input
          type="file"
          ref="importJsonInput"
          class="file-input"
          accept=".json"
          @change="handleImportCharacter"
          aria-label="Importar personaje desde archivo JSON"
        />
        
        <Button 
          @click="$refs.importJsonInput.click()" 
          variant="secondary"
          :loading="isImporting"
        >
          Cargar desde JSON
        </Button>
        
        <Button 
          @click="confirmResetCharacter" 
          variant="danger"
        >
          Nuevo Personaje
        </Button>
      </div>
      
      <Modal
        v-model="showResetConfirmation"
        title="¿Crear Nuevo Personaje?"
        :show-default-footer="true"
        confirm-text="Crear Nuevo"
        @confirm="resetCharacter"
      >
        <p>¿Estás seguro de que quieres crear un nuevo personaje? Los datos del personaje actual se perderán.</p>
      </Modal>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { fileService } from '@/services/fileService';
  import { notificationService } from '@/services/notificationService';
  import { Button, Modal } from '@/features/shared';
  
  export default {
    name: 'CharacterImportExport',
    components: {
      Button,
      Modal
    },
    setup() {
      const store = useStore();
      
      // File input ref
      const importJsonInput = ref(null);
      
      // Loading states
      const isExporting = ref(false);
      const isImporting = ref(false);
      
      // Reset confirmation
      const showResetConfirmation = ref(false);
      
      /**
       * Export character to JSON file
       */
      const handleExportCharacter = async () => {
        try {
          isExporting.value = true;
          await store.dispatch('character/exportCharacter');
        } catch (error) {
          console.error('Error exporting character:', error);
          notificationService.error('Error al exportar el personaje: ' + error.message);
        } finally {
          isExporting.value = false;
        }
      };
      
      /**
       * Import character from JSON file
       */
      const handleImportCharacter = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
          isImporting.value = true;
          
          // Read and parse the file
          const characterData = await fileService.importFromJson(file);
          
          // Import the character data
          await store.dispatch('character/importCharacter', characterData);
          
          notificationService.success('Personaje importado correctamente');
        } catch (error) {
          console.error('Error importing character:', error);
          notificationService.error('Error al importar el personaje. El archivo puede estar corrupto.');
        } finally {
          isImporting.value = false;
          
          // Reset input to allow loading the same file again
          if (importJsonInput.value) {
            importJsonInput.value.value = '';
          }
        }
      };
      
      /**
       * Show reset confirmation dialog
       */
      const confirmResetCharacter = () => {
        showResetConfirmation.value = true;
      };
      
      /**
       * Reset character to default
       */
      const resetCharacter = () => {
        store.dispatch('character/loadDefaultCharacter');
        notificationService.info('Se ha creado un nuevo personaje');
      };
      
      return {
        importJsonInput,
        isExporting,
        isImporting,
        showResetConfirmation,
        handleExportCharacter,
        handleImportCharacter,
        confirmResetCharacter,
        resetCharacter
      };
    }
  };
  </script>
  
  <style scoped>
  .actions-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
  
  .file-input {
    display: none;
  }
  
  @media (max-width: 480px) {
    .actions-container {
      grid-template-columns: 1fr;
    }
  }
  </style>