<!--
  Combat Stats Section Component
  Displays and manages combat-related statistics
-->
<template>
    <div class="section">
      <h2>Estadísticas de Combate</h2>
      
      <!-- Main combat stats grid -->
      <div class="combat-stats">
        <div class="combat-stat">
          <div class="combat-stat-name">CLASE DE ARMADURA</div>
          <input
            type="number"
            class="combat-stat-value"
            :value="armorClass"
            min="0"
            aria-label="Clase de Armadura"
            @input="updateArmorClass($event.target.value)"
          />
        </div>
        
        <div class="combat-stat">
          <div class="combat-stat-name">INICIATIVA</div>
          <input
            type="number"
            class="combat-stat-value"
            :value="initiative"
            aria-label="Iniciativa"
            @input="updateInitiative($event.target.value)"
          />
        </div>
        
        <div class="combat-stat">
          <div class="combat-stat-name">VELOCIDAD</div>
          <input
            type="text"
            class="combat-stat-value"
            :value="speed"
            aria-label="Velocidad"
            @input="updateSpeed($event.target.value)"
          />
        </div>
        
        <!-- Health Points Container -->
        <div class="combat-stat">
          <div class="combat-stat-name">PUNTOS DE VIDA</div>
          <HealthTracker
            :current-hp="currentHp"
            :max-hp="maxHp"
            :temporary-hp="temporaryHp"
            @update:current-hp="updateCurrentHp"
            @update:max-hp="updateMaxHp"
            @update:temporary-hp="updateTemporaryHp"
          />
        </div>
      </div>
      
      <!-- Saving Throws Section -->
      <h3>Tiradas de Salvación</h3>
      <SavingThrowsSection />
      
      <!-- Death Saves Section (shown only when HP is 0) -->
      <div v-if="showDeathSaves" class="death-saves-container">
        <h3>Tiradas de Muerte</h3>
        <div class="death-saves">
          <DeathSaveTracker
            label="Éxitos"
            :count="deathSaves.successes"
            @update:count="updateDeathSaveSuccesses"
          />
          <DeathSaveTracker
            label="Fallos"
            :count="deathSaves.failures"
            @update:count="updateDeathSaveFailures"
          />
        </div>
      </div>
      
      <!-- Passive Perception & Spell Stats Display -->
      <div class="passive-perception">
        <h3>Percepción Pasiva: {{ passivePerception }}</h3>
        <div v-if="isSpellcaster" class="spell-stats">
          <p>CD de Salvación de Conjuros: {{ spellSaveDC }}</p>
          <p>Bonificador de Ataque de Conjuros: {{ formatModifier(spellAttackBonus) }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import HealthTracker from './HealthTracker.vue';
  import SavingThrowsSection from './SavingThrowsSection.vue';
  import DeathSaveTracker from './DeathSaveTracker.vue';
  import { useCombatStats } from '../composables/useCombatStats';
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'CombatStatsSection',
    components: {
      HealthTracker,
      SavingThrowsSection,
      DeathSaveTracker
    },
    setup() {
      const {
        currentHp,
        maxHp,
        temporaryHp,
        deathSaves,
        showDeathSaves,
        passivePerception,
        isSpellcaster,
        spellSaveDC,
        spellAttackBonus,
        updateDeathSaves
      } = useCombatStats();
      
      // Combat stats from the store
      const combat = computed(() => useCombatStats().combat.value);
      
      // Computed properties
      const armorClass = computed({
        get: () => combat.value.armorClass || 10,
        set: value => updateCombatStat('armorClass', value)
      });
      
      const initiative = computed({
        get: () => combat.value.initiative || 0,
        set: value => updateCombatStat('initiative', value)
      });
      
      const speed = computed({
        get: () => combat.value.speed || '9m',
        set: value => updateCombatStat('speed', value)
      });
      
      // Update functions
      const updateCombatStat = (stat, value) => {
        useCombatStats().updateCombatStat(stat, value);
      };
      
      const updateCurrentHp = (value) => {
        currentHp.value = value;
      };
      
      const updateMaxHp = (value) => {
        maxHp.value = value;
      };
      
      const updateTemporaryHp = (value) => {
        temporaryHp.value = value;
      };
      
      const updateArmorClass = (value) => {
        armorClass.value = parseInt(value) || 10;
      };
      
      const updateInitiative = (value) => {
        initiative.value = parseInt(value) || 0;
      };
      
      const updateSpeed = (value) => {
        speed.value = value;
      };
      
      const updateDeathSaveSuccesses = (value) => {
        updateDeathSaves('successes', value);
      };
      
      const updateDeathSaveFailures = (value) => {
        updateDeathSaves('failures', value);
      };
      
      return {
        // State
        combat,
        currentHp,
        maxHp,
        temporaryHp,
        deathSaves,
        showDeathSaves,
        passivePerception,
        isSpellcaster,
        spellSaveDC,
        spellAttackBonus,
        armorClass,
        initiative,
        speed,
        
        // Update methods
        updateCombatStat,
        updateCurrentHp,
        updateMaxHp,
        updateTemporaryHp,
        updateArmorClass,
        updateInitiative,
        updateSpeed,
        updateDeathSaveSuccesses,
        updateDeathSaveFailures,
        
        // Utility functions
        formatModifier: abilityUtils.formatModifier
      };
    }
  };
  </script>
  
  <style scoped>
  .combat-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }
  
  .combat-stat {
    border: var(--border-standard);
    border-radius: 5px;
    padding: 5px;
    background-color: var(--color-highlight);
  }
  
  .combat-stat-name {
    font-size: 12px;
    font-weight: bold;
  }
  
  .combat-stat-value {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    width: 60px;
  }
  
  /* Death saves */
  .death-saves-container {
    margin-bottom: var(--spacing-md);
  }
  
  .death-saves {
    display: flex;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-sm);
  }
  
  /* Passive perception */
  .passive-perception {
    background-color: var(--color-highlight);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    margin-top: var(--spacing-md);
  }
  
  .passive-perception h3 {
    margin-top: 0;
  }
  
  .spell-stats {
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-secondary);
  }
  
  .spell-stats p {
    margin: 5px 0;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .combat-stats {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
    
    .death-saves {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
  
  @media (max-width: 480px) {
    .combat-stats {
      grid-template-columns: 1fr;
    }
  }
  </style>