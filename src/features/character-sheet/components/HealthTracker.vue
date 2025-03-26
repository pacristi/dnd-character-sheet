<!--
  Health Tracker Component
  Manages character hit points
-->
<template>
    <div class="health-tracker">
      <div class="hp-container">
        <input
          type="number"
          v-model.number="currentHpModel"
          class="hp-current"
          min="0"
          aria-label="Puntos de vida actuales"
        />
        /
        <input
          type="number"
          v-model.number="maxHpModel"
          class="hp-max"
          min="1"
          aria-label="Puntos de vida máximos"
        />
      </div>
      
      <div class="temp-hp-container">
        <div class="combat-stat-name">PUNTOS DE VIDA TEMPORALES</div>
        <input
          type="number"
          v-model.number="tempHpModel"
          class="hp-temp"
          min="0"
          aria-label="Puntos de vida temporales"
        />
      </div>
      
      <div class="hp-actions">
        <div class="action-buttons">
          <button
            type="button"
            @click="heal(1)"
            class="hp-button heal-button"
            title="Curar 1 PV"
          >
            +1
          </button>
          <button
            type="button"
            @click="damage(1)"
            class="hp-button damage-button"
            title="1 PV de daño"
          >
            -1
          </button>
        </div>
        
        <div class="hp-percentage">
          <div
            class="hp-bar"
            :style="{ width: healthPercentage + '%' }"
            :class="healthStatusClass"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'HealthTracker',
    props: {
      currentHp: {
        type: Number,
        required: true
      },
      maxHp: {
        type: Number,
        required: true
      },
      temporaryHp: {
        type: Number,
        default: 0
      }
    },
    emits: ['update:currentHp', 'update:maxHp', 'update:temporaryHp'],
    setup(props, { emit }) {
      // Create two-way binding with v-model
      const currentHpModel = computed({
        get: () => props.currentHp,
        set: (value) => {
          emit('update:currentHp', Math.max(0, parseInt(value) || 0));
        }
      });
      
      const maxHpModel = computed({
        get: () => props.maxHp,
        set: (value) => {
          emit('update:maxHp', Math.max(1, parseInt(value) || 1));
        }
      });
      
      const tempHpModel = computed({
        get: () => props.temporaryHp,
        set: (value) => {
          emit('update:temporaryHp', Math.max(0, parseInt(value) || 0));
        }
      });
      
      // Calculate health percentage for the progress bar
      const healthPercentage = computed(() => {
        if (props.maxHp <= 0) return 0;
        return Math.min(100, Math.max(0, (props.currentHp / props.maxHp) * 100));
      });
      
      // Determine health status class for color coding
      const healthStatusClass = computed(() => {
        const percentage = healthPercentage.value;
        if (percentage <= 0) return 'health-critical';
        if (percentage <= 25) return 'health-danger';
        if (percentage <= 50) return 'health-warning';
        return 'health-good';
      });
      
      // Health modification methods
      const heal = (amount) => {
        const newHp = Math.min(props.maxHp, props.currentHp + amount);
        emit('update:currentHp', newHp);
      };
      
      const damage = (amount) => {
        // First use temporary HP
        const remainingTemp = Math.max(0, props.temporaryHp - amount);
        const tempHpAbsorbed = props.temporaryHp - remainingTemp;
        const remainingDamage = amount - tempHpAbsorbed;
        
        // Apply remaining damage to current HP
        const newCurrentHp = Math.max(0, props.currentHp - remainingDamage);
        
        // Update both values
        emit('update:temporaryHp', remainingTemp);
        emit('update:currentHp', newCurrentHp);
      };
      
      return {
        currentHpModel,
        maxHpModel,
        tempHpModel,
        healthPercentage,
        healthStatusClass,
        heal,
        damage
      };
    }
  };
  </script>
  
  <style scoped>
  .health-tracker {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .hp-container {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
  }
  
  .hp-current, .hp-max, .hp-temp {
    width: 50px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  
  .hp-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .hp-button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .heal-button {
    background-color: #28a745;
    color: white;
  }
  
  .damage-button {
    background-color: #dc3545;
    color: white;
  }
  
  .hp-percentage {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 5px;
  }
  
  .hp-bar {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .health-good {
    background-color: #28a745;
  }
  
  .health-warning {
    background-color: #ffc107;
  }
  
  .health-danger {
    background-color: #fd7e14;
  }
  
  .health-critical {
    background-color: #dc3545;
  }
  
  .temp-hp-container {
    margin-top: 5px;
  }
  </style>