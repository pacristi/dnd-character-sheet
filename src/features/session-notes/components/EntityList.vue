<template>
    <div>
      <div class="entity-list">
        <div
          v-for="entity in entities"
          :key="entity.id"
          class="entity-item"
        >
          <div class="entity-header">
            <span class="entity-name">{{ entity.name }}</span>
            <div class="entity-actions">
              <button
                class="entity-edit-btn"
                @click="editEntity(entity.id)"
              >✎</button>
              <button
                class="entity-delete-btn"
                @click="deleteEntity(entity.id)"
              >✕</button>
            </div>
          </div>
          <div class="entity-details">{{ entity.details || '' }}</div>
        </div>
      </div>
      
      <div class="entity-add">
        <input
          type="text"
          v-model="newEntityName"
          :placeholder="`Nombre del ${entityName.toLowerCase()}`"
        />
        <button @click="addEntity">Añadir {{ entityName }}</button>
      </div>
      
      <!-- Edit Modal -->
      <Modal v-model="showEditModal" :title="`Editar ${entityName}`">
        <div v-if="editingEntity" class="modal-form">
          <div class="form-group">
            <label :for="`edit-${entityType}-name`">Nombre:</label>
            <input 
              :id="`edit-${entityType}-name`" 
              type="text" 
              v-model="editingEntity.name"
            />
          </div>
          
          <div class="form-group">
            <label :for="`edit-${entityType}-details`">Detalles:</label>
            <textarea 
              :id="`edit-${entityType}-details`" 
              rows="8" 
              v-model="editingEntity.details"
            ></textarea>
          </div>
          
          <div class="modal-buttons">
            <button @click="saveEntityEdit">Guardar</button>
            <button 
              class="secondary-button" 
              @click="showEditModal = false"
            >Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import Modal from '../../shared/components/Modal.vue';
  
  export default {
    name: 'EntityList',
    components: {
      Modal
    },
    inject: ['showNotification'],
    props: {
      entityType: {
        type: String,
        required: true
      },
      entityName: {
        type: String,
        required: true
      },
      entities: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        newEntityName: '',
        editingEntity: null,
        showEditModal: false
      }
    },
    methods: {
      addEntity() {
        const name = this.newEntityName.trim();
        if (!name) {
          this.showNotification(`Por favor, ingresa un nombre para el ${this.entityName.toLowerCase()}`, 'error');
          return;
        }
        
        // Create entity object
        const entity = {
          id: `${this.entityType.slice(0, -1)}-${Date.now()}`,
          name: name,
          details: ''
        };
        
        // Emit add event
        this.$emit('add', entity);
        
        // Clear input
        this.newEntityName = '';
        
        // Prompt to edit details
        setTimeout(() => {
          this.editEntity(entity.id);
        }, 100);
      },
      
      editEntity(id) {
        // Find the entity
        const entity = this.entities.find(e => e.id === id);
        if (!entity) return;
        
        // Set as editing entity
        this.editingEntity = { ...entity };
        this.showEditModal = true;
      },
      
      saveEntityEdit() {
        if (!this.editingEntity) return;
        
        const name = this.editingEntity.name.trim();
        if (!name) {
          this.showNotification('El nombre no puede estar vacío', 'error');
          return;
        }
        
        // Emit update event
        this.$emit('edit', {
          id: this.editingEntity.id,
          data: {
            name,
            details: this.editingEntity.details
          }
        });
        
        // Close the modal
        this.showEditModal = false;
        this.editingEntity = null;
      },
      
      deleteEntity(id) {
        if (!confirm(`¿Estás seguro de que quieres eliminar este ${this.entityName.toLowerCase()}?`)) {
          return;
        }
        
        // Emit delete event
        this.$emit('remove', id);
      }
    }
  }
  </script>
  
  <style scoped>
  .entity-list {
    margin-bottom: 20px;
  }
  
  .entity-item {
    background-color: var(--color-highlight);
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px 15px;
  }
  
  .entity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .entity-name {
    font-weight: bold;
    font-size: 16px;
  }
  
  .entity-actions {
    display: flex;
    gap: 5px;
  }
  
  .entity-edit-btn,
  .entity-delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 5px;
    color: var(--color-primary);
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .entity-edit-btn:hover,
  .entity-delete-btn:hover {
    opacity: 1;
    background: none;
  }
  
  .entity-details {
    margin-top: 10px;
    font-size: 14px;
    white-space: pre-wrap;
  }
  
  .entity-add {
    display: flex;
    gap: 10px;
  }
  
  .entity-add input {
    flex-grow: 1;
  }
  </style>