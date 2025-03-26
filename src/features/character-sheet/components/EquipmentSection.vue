<template>
    <div class="section">
      <h2>Equipo</h2>
      <div id="equipment-list" class="equipment-list">
        <div
          v-for="(item, index) in equipment"
          :key="`item-${index}`"
          class="equipment-item"
        >
          <input
            type="checkbox"
            class="equipment-checkbox"
            :aria-label="`Equipped ${item.name}`"
            v-model="item.equipped"
            @change="updateEquipmentItem(index, item)"
          />
          <span>{{ item.name }}</span>
          <input
            v-if="weightTracking"
            type="number"
            class="item-weight"
            v-model.number="item.weight"
            min="0"
            step="0.1"
            style="width: 40px; margin-left: 10px"
            aria-label="Item weight in kg"
            @change="updateEquipmentItem(index, item)"
          />
          <template v-if="weightTracking"> kg </template>
          <button
            type="button"
            @click="removeEquipment(index)"
            aria-label="Remove item"
            style="margin-left: auto; font-size: 10px;"
          >✕</button>
        </div>
      </div>
  
      <div class="equipment-item money-item" style="margin-top: 10px">
        <span>Monedas:</span>
        <input
          type="number"
          v-model.number="gold"
          min="0"
          style="width: 60px; margin: 0 5px"
          aria-label="Piezas de oro"
          @change="updateMoney('gold', $event.target.value)"
        />
        <span>po</span>
        <input
          type="number"
          v-model.number="silver"
          min="0"
          style="width: 60px; margin: 0 5px"
          aria-label="Piezas de plata"
          @change="updateMoney('silver', $event.target.value)"
        />
        <span>pp</span>
        <input
          type="number"
          v-model.number="copper"
          min="0"
          style="width: 60px; margin: 0 5px"
          aria-label="Piezas de cobre"
          @change="updateMoney('copper', $event.target.value)"
        />
        <span>pc</span>
      </div>
  
      <!-- Weight tracking toggle -->
      <div id="equipment-weight-tracker" class="equipment-weight-tracker">
        <label for="weight-tracking-toggle" style="display: flex; align-items: center; margin-right: 15px;">
          <input
            type="checkbox"
            id="weight-tracking-toggle"
            v-model="weightTracking"
          />
          <span style="margin-left: 5px;">Rastrear peso</span>
        </label>
        
        <div id="weight-display" v-if="weightTracking">
          Peso total: <span id="total-weight">{{ totalWeight.toFixed(1) }}</span> kg
          <span style="margin: 0 10px;">/</span>
          Capacidad: <input
            type="number"
            v-model.number="weightCapacity"
            min="1"
            style="width: 50px;"
            @change="debouncedSave"
          /> kg
        </div>
      </div>
      
      <div class="equipment-add">
        <input
          type="text"
          id="new-equipment"
          v-model="newEquipment"
          placeholder="Añadir nuevo equipo"
          aria-label="Nuevo objeto"
          @keypress.enter="addEquipment"
        />
        <button type="button" @click="addEquipment">Añadir</button>
      </div>
      
      <button type="button" @click="showBulkEquipmentDialog" class="secondary-button mt-md">
        Añadir varios
      </button>
      
      <!-- Bulk Equipment Dialog -->
      <Modal v-model="showBulkDialog" title="Añadir Varios Objetos">
        <p style="margin-bottom: 10px;">
          Ingresa un objeto por línea. Puedes añadir [P] al inicio para indicar que está equipado.
        </p>
        
        <textarea
          id="bulk-equipment"
          v-model="bulkEquipmentText"
          style="width: 100%; height: 150px; margin-bottom: 15px;"
          placeholder="Ejemplo:
  [P] Armadura de cuero
  Cuerda (50 pies)
  Raciones (5 días)"
        ></textarea>
        
        <div class="modal-buttons">
          <button type="button" @click="addBulkEquipment">Añadir Objetos</button>
          <button type="button" class="secondary-button" @click="showBulkDialog = false">Cancelar</button>
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  import Modal from '../../shared/components/Modal.vue'
  
  export default {
    name: 'EquipmentSection',
    components: {
      Modal
    },
    inject: ['showNotification'],
    data() {
      return {
        newEquipment: '',
        weightTracking: false,
        weightCapacity: 60,
        showBulkDialog: false,
        bulkEquipmentText: '',
        saveTimeout: null
      }
    },
    computed: {
      ...mapState('character', ['equipment', 'money']),
      
      gold: {
        get() {
          return this.money.gold
        }
      },
      
      silver: {
        get() {
          return this.money.silver
        }
      },
      
      copper: {
        get() {
          return this.money.copper
        }
      },
      
      totalWeight() {
        // Calculate total weight from equipment
        let total = 0;
        
        this.equipment.forEach(item => {
          if (item.weight) {
            total += parseFloat(item.weight) || 0;
          }
        });
        
        // Add gold weight (1 kg per 50 gold)
        const goldWeight = Math.floor((this.money.gold || 0) / 50) * 1;
        total += goldWeight;
        
        return total;
      },
      
      weightStatus() {
        if (this.totalWeight > this.weightCapacity) {
          return 'overloaded';
        } else if (this.totalWeight > this.weightCapacity * 0.8) {
          return 'heavy';
        } else {
          return 'normal';
        }
      }
    },
    methods: {
      ...mapMutations('character', [
        'ADD_EQUIPMENT',
        'UPDATE_EQUIPMENT',
        'REMOVE_EQUIPMENT',
        'SET_MONEY'
      ]),
      
      addEquipment() {
        const equipmentText = this.newEquipment.trim();
        if (!equipmentText) return;
        
        // Create equipment item
        const newItem = {
          name: equipmentText,
          equipped: false,
          weight: 0
        };
        
        // Add to store
        this.ADD_EQUIPMENT(newItem);
        
        // Clear input
        this.newEquipment = '';
        
        // Save changes
        this.debouncedSave();
      },
      
      updateEquipmentItem(index, item) {
        this.UPDATE_EQUIPMENT({ index, item });
        this.debouncedSave();
      },
      
      removeEquipment(index) {
        this.REMOVE_EQUIPMENT(index);
        this.debouncedSave();
      },
      
      updateMoney(currency, amount) {
        const parsedAmount = parseInt(amount) || 0;
        this.SET_MONEY({ currency, amount: parsedAmount });
        this.debouncedSave();
      },
      
      showBulkEquipmentDialog() {
        this.bulkEquipmentText = '';
        this.showBulkDialog = true;
      },
      
      addBulkEquipment() {
        const itemsText = this.bulkEquipmentText.trim();
        if (!itemsText) {
          this.showBulkDialog = false;
          return;
        }
        
        // Process each line as an equipment item
        const lines = itemsText.split('\n');
        let itemsAdded = 0;
        
        lines.forEach(line => {
          line = line.trim();
          if (!line) return;
          
          // Check if the item should be equipped
          const equippedMatch = line.match(/^\[P\]\s*(.*)/i);
          const isEquipped = !!equippedMatch;
          const itemText = isEquipped ? equippedMatch[1] : line;
          
          if (itemText) {
            this.ADD_EQUIPMENT({
              name: itemText,
              equipped: isEquipped,
              weight: 0
            });
            itemsAdded++;
          }
        });
        
        // Close the modal
        this.showBulkDialog = false;
        
        // Save changes
        this.debouncedSave();
        
        if (itemsAdded > 0) {
          this.showNotification(`Se añadieron ${itemsAdded} objetos al equipo.`, 'info');
        }
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
    mounted() {
      // Initialize weight tracking from locally stored preference
      const storedWeightTracking = localStorage.getItem('weightTracking');
      if (storedWeightTracking !== null) {
        this.weightTracking = storedWeightTracking === 'true';
      }
      
      // Initialize weight capacity from locally stored value
      const storedWeightCapacity = localStorage.getItem('weightCapacity');
      if (storedWeightCapacity !== null) {
        this.weightCapacity = parseInt(storedWeightCapacity) || 60;
      }
    },
    watch: {
      weightTracking(newValue) {
        // Store preference in localStorage
        localStorage.setItem('weightTracking', newValue);
      },
      weightCapacity(newValue) {
        // Store capacity in localStorage
        localStorage.setItem('weightCapacity', newValue);
      },
      weightStatus(newValue) {
        const weightElement = document.getElementById('total-weight');
        if (weightElement) {
          // Apply styling based on weight status
          weightElement.style.color = newValue === 'overloaded' ? '#cc0000' : 
                                     newValue === 'heavy' ? '#cc6600' : '';
        }
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
  .equipment-list {
    columns: 2;
  }
  
  .equipment-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .equipment-checkbox {
    margin-right: 5px;
  }
  
  .equipment-add {
    margin-top: var(--spacing-sm);
    display: flex;
    gap: 5px;
  }
  
  .equipment-add input {
    flex: 1;
  }
  
  .money-item {
    background-color: var(--color-highlight);
    padding: 8px;
    border-radius: 5px;
  }
  
  .equipment-weight-tracker {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px;
    background-color: var(--color-highlight);
    border-radius: 5px;
  }
  
  #weight-display {
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .equipment-list {
      columns: 1;
    }
    
    .equipment-weight-tracker {
      flex-direction: column;
      align-items: flex-start;
    }
    
    #weight-display {
      margin-top: 10px;
    }
  }
  </style>