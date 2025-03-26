<!--
  Session Notes View
  The main view for the session notes feature
-->
<template>
  <div class="session-notes-container">
    <!-- Sessions Sidebar -->
    <div class="sessions-sidebar">
      <div class="sidebar-header">
        <h2>Notas de Sesión</h2>
        <div class="new-session-form">
          <FormInput
            id="new-session-name"
            v-model="newSessionName"
            placeholder="Nombre de la sesión"
            @keypress.enter="createSession"
          />
          <Button id="add-session-btn" @click="createSession">
            Nueva Sesión
          </Button>
        </div>
      </div>
      
      <!-- Sessions List -->
      <div v-if="sortedSessions.length > 0" class="sessions-list">
        <div
          v-for="session in sortedSessions"
          :key="session.id"
          class="session-tab"
          :class="{ active: currentSession && session.id === currentSession.id }"
          @click="selectSession(session.id)"
        >
          <div class="session-tab-header">
            <span class="session-name">{{ session.name }}</span>
            <div class="session-tab-actions">
              <Button 
                variant="text" 
                size="small"
                title="Editar nombre"
                @click.stop="renameSession(session.id)"
              >✎</Button>
              <Button 
                variant="text" 
                size="small"
                title="Eliminar sesión"
                @click.stop="confirmDeleteSession(session.id)"
              >✕</Button>
            </div>
          </div>
          <div class="session-date">{{ formatDate(session.date) }}</div>
        </div>
      </div>
      <div v-else class="empty-sessions">
        <p>No hay sesiones. Crea una para comenzar.</p>
      </div>
      
      <div class="sidebar-actions">
        <Button @click="exportSessions">Exportar Sesiones</Button>
        <Button 
          variant="secondary" 
          @click="$refs.importInput.click()"
        >
          Importar Sesiones
        </Button>
        <input 
          type="file" 
          ref="importInput" 
          accept=".json" 
          style="display: none" 
          @change="handleImportFile"
        />
      </div>
    </div>
    
    <!-- Session Content Area -->
    <div class="session-content">
      <div v-if="!currentSession" class="empty-state">
        <h2>No hay sesiones.</h2>
        <p>Crea una nueva sesión para comenzar a tomar notas.</p>
        <ul>
          <li>Organiza tus sesiones por fecha</li>
          <li>Registra PNJs, lugares y eventos importantes</li>
          <li>Mantén un registro cronológico de eventos</li>
          <li>Realiza un seguimiento de misiones y tesoros</li>
        </ul>
      </div>
      
      <div v-else id="session-content-area">
        <div class="session-header">
          <h2>{{ currentSession.name }}</h2>
          <div class="session-date-display">{{ formatDate(currentSession.date) }}</div>
        </div>
        
        <div class="session-tabs">
          <div class="tab-buttons">
            <Button
              v-for="tab in tabs"
              :key="tab.id"
              :variant="activeTab === tab.id ? 'primary' : 'secondary'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </Button>
          </div>
          
          <div class="tab-content">
            <!-- Summary Tab -->
            <div
              class="tab-pane"
              id="summary-tab"
              :class="{ active: activeTab === 'summary' }"
            >
              <FormTextarea
                id="session-summary"
                v-model="sessionSummary"
                placeholder="Escribe un resumen de la sesión aquí..."
                @update:model-value="updateSessionSummary"
                rows="12"
              />
            </div>
            
            <!-- Other tabs would go here -->
            <div
              v-for="tab in tabs.filter(t => t.id !== 'summary')"
              :key="`tab-${tab.id}`"
              class="tab-pane"
              :id="`${tab.id}-tab`"
              :class="{ active: activeTab === tab.id }"
            >
              <div class="tab-coming-soon">
                <p>Módulo en desarrollo. Pronto disponible.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <Modal
      v-model="showDeleteConfirmation"
      title="¿Eliminar Sesión?"
      :show-default-footer="true"
      confirm-text="Eliminar"
      @confirm="deleteSession"
    >
      <p>¿Estás seguro que deseas eliminar esta sesión? Esta acción no se puede deshacer.</p>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useSessionNotes } from '../composables/useSessionNotes';
import { Button, FormInput, FormTextarea, Modal } from '@/features/shared';
import { notificationService } from '@/services/notificationService';
import { fileService } from '@/services/fileService';

export default {
  name: 'SessionNotes',
  components: {
    Button,
    FormInput,
    FormTextarea,
    Modal
  },
  setup() {
    const sessionNotes = useSessionNotes();
    
    // State
    const newSessionName = ref('');
    const activeTab = ref('summary');
    const sessionSummary = ref('');
    const showDeleteConfirmation = ref(false);
    const sessionToDelete = ref(null);
    const importInput = ref(null);
    
    // Tabs definition
    const tabs = [
      { id: 'summary', label: 'Resumen' },
      { id: 'characters', label: 'Personajes' },
      { id: 'locations', label: 'Lugares' },
      { id: 'quests', label: 'Misiones' },
      { id: 'treasures', label: 'Tesoros' },
      { id: 'factions', label: 'Facciones' },
      { id: 'timeline', label: 'Cronología' }
    ];
    
    // Computed properties
    const sessions = computed(() => sessionNotes.sessions.value);
    const sortedSessions = computed(() => sessionNotes.sortedSessions.value);
    const currentSession = computed(() => sessionNotes.currentSession.value);
    
    // Update summary when current session changes
    onMounted(() => {
      // Initialize sessions
      sessionNotes.initializeSessions();
    });
    
    // Watch for current session changes
    const watchCurrentSession = () => {
      if (currentSession.value) {
        sessionSummary.value = currentSession.value.summary || '';
      } else {
        sessionSummary.value = '';
      }
    };
    
    // Methods
    const createSession = () => {
      const name = newSessionName.value.trim();
      if (!name) {
        notificationService.error('Por favor, ingresa un nombre para la sesión');
        return;
      }
      
      // Create new session with today's date
      sessionNotes.createSession(name);
      
      // Clear input
      newSessionName.value = '';
      
      // Show notification
      notificationService.success(`Sesión "${name}" creada`);
    };
    
    const selectSession = (sessionId) => {
      sessionNotes.selectSession(sessionId);
      watchCurrentSession();
    };
    
    const renameSession = (sessionId) => {
      const session = sessions.value.find(s => s.id === sessionId);
      if (!session) return;
      
      // Prompt for new name
      const newName = prompt('Nuevo nombre de la sesión:', session.name);
      if (!newName || newName.trim() === '') return;
      
      // Update session
      sessionNotes.updateSession(sessionId, { name: newName.trim() });
      
      // Show notification
      notificationService.success(`Sesión renombrada a "${newName}"`);
    };
    
    const confirmDeleteSession = (sessionId) => {
      sessionToDelete.value = sessionId;
      showDeleteConfirmation.value = true;
    };
    
    const deleteSession = () => {
      if (!sessionToDelete.value) return;
      
      // Get session name for notification
      const session = sessions.value.find(s => s.id === sessionToDelete.value);
      const sessionName = session ? session.name : 'Sesión';
      
      // Delete session
      sessionNotes.deleteSession(sessionToDelete.value);
      
      // Reset state
      sessionToDelete.value = null;
      showDeleteConfirmation.value = false;
      
      // Update summary if needed
      watchCurrentSession();
      
      // Show notification
      notificationService.info(`Sesión "${sessionName}" eliminada`);
    };
    
    const updateSessionSummary = (summary) => {
      if (!currentSession.value) return;
      
      sessionNotes.updateSession(currentSession.value.id, { summary });
    };
    
    const exportSessions = async () => {
      try {
        await fileService.exportToJson(sessions.value, 'dnd-session-notes');
        notificationService.success('Sesiones exportadas correctamente');
      } catch (error) {
        console.error('Error exporting sessions:', error);
        notificationService.error('Error al exportar sesiones');
      }
    };
    
    const handleImportFile = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        // Parse file
        const importedSessions = await fileService.importFromJson(file);
        
        // Validate sessions
        if (!Array.isArray(importedSessions)) {
          throw new Error('Formato inválido');
        }
        
        // Ask if user wants to replace or append
        const replace = confirm(
          '¿Deseas reemplazar las notas actuales o añadir las importadas a las existentes?\n\n' +
          'Aceptar = Reemplazar\nCancelar = Añadir'
        );
        
        // Import sessions
        sessionNotes.importSessions(importedSessions, replace);
        
        // Update summary if needed
        watchCurrentSession();
        
        // Show notification
        notificationService.success('Sesiones importadas correctamente');
      } catch (error) {
        console.error('Error importing sessions:', error);
        notificationService.error('Error al importar sesiones');
      }
      
      // Reset input
      if (importInput.value) {
        importInput.value.value = '';
      }
    };
    
    return {
      // State
      newSessionName,
      activeTab,
      sessionSummary,
      showDeleteConfirmation,
      importInput,
      tabs,
      
      // Computed
      sessions,
      sortedSessions,
      currentSession,
      
      // Methods
      createSession,
      selectSession,
      renameSession,
      confirmDeleteSession,
      deleteSession,
      updateSessionSummary,
      exportSessions,
      handleImportFile,
      formatDate: sessionNotes.formatDate
    };
  }
};
</script>

<style scoped>
.session-notes-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

/* Sessions Sidebar */
.sessions-sidebar {
  width: 300px;
  flex-shrink: 0;
  background-color: var(--color-paper);
  border: var(--border-standard);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 15px;
  border-bottom: var(--border-standard);
}

.sidebar-header h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.new-session-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sessions-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
}

.session-tab {
  background-color: var(--color-highlight);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.session-tab:hover {
  background-color: #e5d5b5;
}

.session-tab.active {
  background-color: var(--color-secondary);
  color: white;
}

.session-tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-name {
  font-weight: bold;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-date {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 5px;
}

.empty-sessions {
  padding: 15px;
  text-align: center;
  color: #777;
  font-style: italic;
}

.sidebar-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 15px;
  border-top: var(--border-standard);
}

/* Session Content Area */
.session-content {
  flex: 1;
  background-color: var(--color-paper);
  border: var(--border-standard);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state h2 {
  color: var(--color-primary);
}

.empty-state ul {
  display: inline-block;
  text-align: left;
  margin: 20px auto;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.session-header h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 24px;
}

.session-date-display {
  font-style: italic;
  color: #666;
}

/* Session Tabs */
.session-tabs {
  margin-top: 20px;
}

.tab-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tab-content {
  background-color: white;
  border: var(--border-standard);
  border-radius: var(--border-radius);
  min-height: 300px;
}

.tab-pane {
  display: none;
  padding: 15px;
}

.tab-pane.active {
  display: block;
}

.tab-coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #777;
  font-style: italic;
}

/* Responsive styles */
@media (max-width: 768px) {
  .session-notes-container {
    flex-direction: column;
    height: auto;
  }
  
  .sessions-sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
  
  .session-content {
    height: auto;
    min-height: 500px;
  }
}
</style>