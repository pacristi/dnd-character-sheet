<template>
    <div class="session-notes-container">
      <!-- Sessions Sidebar -->
      <div class="sessions-sidebar">
        <div class="sidebar-header">
          <h2>Notas de Sesión</h2>
          <div class="new-session-form">
            <input
              type="text"
              v-model="newSessionName"
              placeholder="Nombre de la sesión"
              @keypress.enter="createSession"
            />
            <button id="add-session-btn" @click="createSession">Nueva Sesión</button>
          </div>
        </div>
        
        <ul class="sessions-list">
          <li
            v-for="session in sortedSessions"
            :key="session.id"
            class="session-tab"
            :class="{ active: currentSession && session.id === currentSession.id }"
            @click="selectSession(session.id)"
          >
            <div class="session-tab-header">
              <span class="session-name">{{ session.name }}</span>
              <div class="session-tab-actions">
                <button
                  class="tab-action-btn"
                  title="Editar nombre"
                  @click.stop="renameSession(session.id)"
                >✎</button>
                <button
                  class="tab-action-btn"
                  title="Eliminar sesión"
                  @click.stop="deleteSession(session.id)"
                >✕</button>
              </div>
            </div>
            <div class="session-date">{{ formatDate(session.date) }}</div>
          </li>
        </ul>
        
        <div class="sidebar-actions">
          <button @click="exportSessions">Exportar Sesiones</button>
          <button class="secondary-button" @click="importSessions">Importar Sesiones</button>
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
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-button"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
            
            <div class="tab-content">
              <!-- Summary Tab -->
              <div
                class="tab-pane"
                id="summary-tab"
                :class="{ active: activeTab === 'summary' }"
              >
                <textarea
                  id="session-summary"
                  class="session-summary"
                  placeholder="Escribe un resumen de la sesión aquí..."
                  v-model="currentSession.summary"
                  @input="updateSessionData('summary', $event.target.value)"
                ></textarea>
              </div>
              
              <!-- Characters Tab -->
              <div
                class="tab-pane"
                id="characters-tab"
                :class="{ active: activeTab === 'characters' }"
              >
                <EntityList
                  entity-type="characters"
                  entity-name="Personaje"
                  :entities="currentSession.characters"
                  @add="addEntity($event, 'characters')"
                  @edit="updateEntity($event, 'characters')"
                  @remove="removeEntity($event, 'characters')"
                />
              </div>
              
              <!-- Locations Tab -->
              <div
                class="tab-pane"
                id="locations-tab"
                :class="{ active: activeTab === 'locations' }"
              >
                <EntityList
                  entity-type="locations"
                  entity-name="Lugar"
                  :entities="currentSession.locations"
                  @add="addEntity($event, 'locations')"
                  @edit="updateEntity($event, 'locations')"
                  @remove="removeEntity($event, 'locations')"
                />
              </div>
              
              <!-- Quests Tab -->
              <div
                class="tab-pane"
                id="quests-tab"
                :class="{ active: activeTab === 'quests' }"
              >
                <EntityList
                  entity-type="quests"
                  entity-name="Misión"
                  :entities="currentSession.quests"
                  @add="addEntity($event, 'quests')"
                  @edit="updateEntity($event, 'quests')"
                  @remove="removeEntity($event, 'quests')"
                />
              </div>
              
              <!-- Treasures Tab -->
              <div
                class="tab-pane"
                id="treasures-tab"
                :class="{ active: activeTab === 'treasures' }"
              >
                <EntityList
                  entity-type="treasures"
                  entity-name="Tesoro"
                  :entities="currentSession.treasures"
                  @add="addEntity($event, 'treasures')"
                  @edit="updateEntity($event, 'treasures')"
                  @remove="removeEntity($event, 'treasures')"
                />
              </div>
              
              <!-- Factions Tab -->
              <div
                class="tab-pane"
                id="factions-tab"
                :class="{ active: activeTab === 'factions' }"
              >
                <EntityList
                  entity-type="factions"
                  entity-name="Facción"
                  :entities="currentSession.factions"
                  @add="addEntity($event, 'factions')"
                  @edit="updateEntity($event, 'factions')"
                  @remove="removeEntity($event, 'factions')"
                />
              </div>
              
              <!-- Timeline Tab -->
              <div
                class="tab-pane"
                id="timeline-tab"
                :class="{ active: activeTab === 'timeline' }"
              >
                <div class="timeline-controls">
                  <button id="sort-timeline-btn" @click="sortTimelineEvents">
                    Ordenar por tiempo
                  </button>
                </div>
                
                <div class="entity-list timeline-list" id="timeline-list">
                  <div
                    v-for="event in currentSession.timeline"
                    :key="event.id"
                    class="timeline-item"
                  >
                    <div class="timeline-time">{{ event.time }}</div>
                    <div class="timeline-event">
                      <span class="event-text">{{ event.event }}</span>
                      <div class="entity-actions">
                        <button
                          class="entity-edit-btn"
                          @click="editTimelineEvent(event.id)"
                        >✎</button>
                        <button
                          class="entity-delete-btn"
                          @click="removeTimelineEvent(event.id)"
                        >✕</button>
                      </div>
                    </div>
                    <div v-if="event.important" class="important-marker">
                      ⭐ Importante
                    </div>
                  </div>
                </div>
                
                <div class="entity-add timeline-add">
                  <input
                    type="text"
                    v-model="newTimelineEvent.time"
                    placeholder="Tiempo"
                    style="width: 80px"
                  />
                  <input
                    type="text"
                    v-model="newTimelineEvent.event"
                    placeholder="Evento"
                  />
                  <button @click="addTimelineEvent">Añadir Evento</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Event Edit Modal -->
      <Modal v-model="showEventModal" title="Editar Evento">
        <div v-if="editingEvent" class="modal-form">
          <div class="form-group">
            <label for="edit-event-time">Tiempo:</label>
            <input type="text" id="edit-event-time" v-model="editingEvent.time" />
          </div>
          
          <div class="form-group">
            <label for="edit-event-text">Evento:</label>
            <textarea id="edit-event-text" rows="4" v-model="editingEvent.event"></textarea>
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="edit-event-important" v-model="editingEvent.important" />
              Marcar como importante
            </label>
          </div>
          
          <div class="modal-buttons">
            <button @click="saveTimelineEventEdit">Guardar</button>
            <button class="secondary-button" @click="showEventModal = false">Cancelar</button>
          </div>
        </div>
      </Modal>
      
      <!-- File input for import -->
      <input 
        type="file" 
        ref="importInput" 
        accept=".json" 
        style="display: none" 
        @change="handleImportFile"
      />
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import EntityList from '@/components/session/EntityList.vue'
  import Modal from '@/components/ui/Modal.vue'
  
  export default {
    name: 'SessionNotes',
    components: {
      EntityList,
      Modal
    },
    inject: ['showNotification'],
    data() {
      return {
        newSessionName: '',
        activeTab: 'summary',
        newTimelineEvent: {
          time: '',
          event: ''
        },
        editingEvent: null,
        showEventModal: false,
        tabs: [
          { id: 'summary', label: 'Resumen' },
          { id: 'characters', label: 'Personajes' },
          { id: 'locations', label: 'Lugares' },
          { id: 'quests', label: 'Misiones' },
          { id: 'treasures', label: 'Tesoros' },
          { id: 'factions', label: 'Facciones' },
          { id: 'timeline', label: 'Cronología' }
        ]
      }
    },
    computed: {
      ...mapState('sessions', ['sessions', 'currentSessionId']),
      ...mapGetters('sessions', ['currentSession', 'sortedSessions'])
    },
    methods: {
      ...mapActions('sessions', [
        'initializeSessions',
        'createSession',
        'selectSession',
        'updateSession',
        'deleteSession',
        'addEntity',
        'updateEntity',
        'removeEntity',
        'addTimelineEvent',
        'updateTimelineEvent',
        'removeTimelineEvent',
        'sortTimelineEvents',
        'saveSessions',
        'exportSessions',
        'importSessions'
      ]),
      
      formatDate(dateString) {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (error) {
          return dateString;
        }
      },
      
      createSession() {
        if (!this.newSessionName.trim()) {
          this.showNotification('Por favor, ingresa un nombre para la sesión', 'error');
          return;
        }
        
        this.$store.dispatch('sessions/createSession', {
          name: this.newSessionName,
          date: new Date().toISOString().split('T')[0]
        });
        
        this.newSessionName = '';
      },
      
      renameSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return;
        
        // Prompt for new name
        const newName = prompt('Enter new session name:', session.name);
        if (!newName || newName.trim() === '') return;
        
        // Update session
        this.updateSession({
          id: sessionId,
          data: { name: newName.trim() }
        });
      },
      
      updateSessionData(field, value) {
        if (!this.currentSession) return;
        
        this.updateSession({
          id: this.currentSession.id,
          data: { [field]: value }
        });
      },
      
      addTimelineEvent() {
        if (!this.currentSession) {
          this.showNotification('Por favor, crea o selecciona una sesión primero', 'error');
          return;
        }
        
        const time = this.newTimelineEvent.time.trim();
        const event = this.newTimelineEvent.event.trim();
        
        if (!event) {
          this.showNotification('Por favor, ingresa un evento', 'error');
          return;
        }
        
        // Create event object
        const timelineEvent = {
          id: `timeline-${Date.now()}`,
          time: time || 'N/A',
          event: event,
          important: false
        };
        
        // Add to store
        this.$store.dispatch('sessions/addTimelineEvent', {
          sessionId: this.currentSession.id,
          event: timelineEvent
        });
        
        // Clear inputs
        this.newTimelineEvent.time = '';
        this.newTimelineEvent.event = '';
      },
      
      editTimelineEvent(eventId) {
        if (!this.currentSession) return;
        
        // Find the event
        const event = this.currentSession.timeline.find(e => e.id === eventId);
        if (!event) return;
        
        // Set as editing event
        this.editingEvent = { ...event };
        this.showEventModal = true;
      },
      
      saveTimelineEventEdit() {
        if (!this.currentSession || !this.editingEvent) return;
        
        const eventText = this.editingEvent.event.trim();
        if (!eventText) {
          this.showNotification('El evento no puede estar vacío', 'error');
          return;
        }
        
        // Update the event
        this.$store.dispatch('sessions/updateTimelineEvent', {
          sessionId: this.currentSession.id,
          eventId: this.editingEvent.id,
          data: {
            time: this.editingEvent.time.trim() || 'N/A',
            event: eventText,
            important: this.editingEvent.important
          }
        });
        
        // Close the modal
        this.showEventModal = false;
        this.editingEvent = null;
      },
      
      removeTimelineEvent(eventId) {
        if (!this.currentSession) return;
        
        if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
          return;
        }
        
        this.$store.dispatch('sessions/removeTimelineEvent', {
          sessionId: this.currentSession.id,
          eventId: eventId
        });
      },
      
      importSessions() {
        // Trigger file input click
        this.$refs.importInput.click();
      },
      
      handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSessions = JSON.parse(e.target.result);
            if (Array.isArray(importedSessions)) {
              // Ask if user wants to replace or append
              const replace = confirm('¿Deseas reemplazar las notas actuales o añadir las importadas a las existentes?\n\nAceptar = Reemplazar\nCancelar = Añadir');
              
              this.$store.dispatch('sessions/importSessions', {
                sessions: importedSessions,
                replace: replace
              });
              
              this.showNotification('Notas de sesión importadas correctamente');
            } else {
              throw new Error('Invalid format');
            }
          } catch (error) {
            console.error('Error parsing imported notes:', error);
            this.showNotification('Error al importar las notas. Formato de archivo inválido.', 'error');
          }
        };
        
        reader.onerror = () => {
          this.showNotification('Error al leer el archivo', 'error');
        };
        
        reader.readAsText(file);
        
        // Reset the input
        event.target.value = '';
      }
    },
    created() {
      this.initializeSessions();
    }
  }
  </script>
  
  <style scoped>
  @import '@/assets/styles/components/session-notes.css';
  </style>