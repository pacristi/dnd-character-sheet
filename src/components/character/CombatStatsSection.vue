<template>
    <div class="section">
      <h2>Estadísticas de Combate</h2>
      <div class="combat-stats">
        <div class="combat-stat">
          <div class="combat-stat-name">CLASE DE ARMADURA</div>
          <input
            type="number"
            class="combat-stat-value"
            v-model.number="armorClass"
            min="0"
            aria-label="Clase de Armadura"
            @change="updateCombatStat('armorClass', $event.target.value)"
          />
        </div>
        <div class="combat-stat">
          <div class="combat-stat-name">INICIATIVA</div>
          <input
            type="number"
            class="combat-stat-value"
            v-model.number="initiative"
            aria-label="Iniciativa"
            @change="updateCombatStat('initiative', $event.target.value)"
          />
        </div>
        <div class="combat-stat">
          <div class="combat-stat-name">VELOCIDAD</div>
          <input
            type="text"
            class="combat-stat-value"
            v-model="speed"
            aria-label="Velocidad"
            @change="updateCombatStat('speed', $event.target.value)"
          />
        </div>
        <div class="combat-stat">
          <div class="combat-stat-name">PUNTOS DE VIDA</div>
          <div class="hp-container">
            <input
              type="number"
              v-model.number="currentHp"
              class="hp-current"
              min="0"
              aria-label="Puntos de vida actuales"
              @change="updateCombatStat('hp.current', $event.target.value)"
            />
            /
            <input
              type="number"
              v-model.number="maxHp"
              class="hp-current"
              min="1"
              aria-label="Puntos de vida máximos"
              @change="updateCombatStat('hp.max', $event.target.value)"
            />
          </div>
          <div class="combat-stat-name">PUNTOS DE VIDA TEMPORALES</div>
          <div class="hp-container">
            <input
              type="number"
              v-model.number="temporaryHp"
              class="hp-current"
              min="0"
              aria-label="Puntos de vida temporales"
              @change="updateCombatStat('hp.temporary', $event.target.value)"
            />
          </div>
        </div>
      </div>
  
      <h3>Tiradas de Salvación</h3>
      <div class="skills" id="saving-throws">
        <div
          v-for="(name, ability) in abilityNames" 
          :key="ability"
          class="skill-item"
          :data-skill="`${ability}-save`"
        >
          <div
            class="proficient"
            role="checkbox"
            :aria-checked="savingThrows[ability] ? 'true' : 'false'"
            tabindex="0"
            @click="toggleSavingThrow(ability)"
            @keypress="handleKeypress($event, ability)"
            :class="{ 'is-proficient': savingThrows[ability] }"
          ></div>
          <span>{{ name }}</span>
          <span class="skill-mod" aria-live="polite">
            {{ formatModifier(savingThrowModifiers[ability]) }}
          </span>
        </div>
      </div>
      
      <!-- Death Saves -->
      <div class="death-saves-container" v-if="showDeathSaves">
        <h3>Tiradas de Muerte</h3>
        <div class="death-saves">
          <div class="death-save-group">
            <span>Éxitos:</span>
            <div class="death-save-boxes">
              <div 
                v-for="i in 3" 
                :key="`success-${i}`" 
                class="death-save-box" 
                :class="{ 'marked': deathSaves.successes >= i }"
                @click="updateDeathSaves('successes', i)"
              ></div>
            </div>
          </div>
          <div class="death-save-group">
            <span>Fallos:</span>
            <div class="death-save-boxes">
              <div 
                v-for="i in 3" 
                :key="`failure-${i}`" 
                class="death-save-box" 
                :class="{ 'marked': deathSaves.failures >= i }"
                @click="updateDeathSaves('failures', i)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Passive Perception Display -->
      <div class="passive-perception">
        <h3>Percepción Pasiva: {{ passivePerception }}</h3>
        <div v-if="spellcaster" class="spell-stats">
          <p>CD de Salvación de Conjuros: {{ spellSaveDC }}</p>
          <p>Bonificador de Ataque de Conjuros: {{ formatModifier(spellAttackBonus) }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import { ABILITY_NAMES, formatModifier } from '@/utils/abilities'
  
  export default {
    name: 'CombatStatsSection',
    computed: {
      ...mapState('character', ['combat', 'savingThrows', 'basicInfo']),
      ...mapGetters('character', ['savingThrowModifiers', 'passivePerception', 'spellAttackBonus', 'spellSaveDC']),
      
      armorClass: {
        get() {
          return this.combat.armorClass
        }
      },
      
      initiative: {
        get() {
          return this.combat.initiative
        }
      },
      
      speed: {
        get() {
          return this.combat.speed
        }
      },
      
      currentHp: {
        get() {
          return this.combat.hp.current
        }
      },
      
      maxHp: {
        get() {
          return this.combat.hp.max
        }
      },
      
      temporaryHp: {
        get() {
          return this.combat.hp.temporary || 0
        }
      },
      
      deathSaves: {
        get() {
          return this.combat.deathSaves || { successes: 0, failures: 0 }
        }
      },
      
      showDeathSaves() {
        // Show death saves when HP is 0
        return this.currentHp <= 0
      },
      
      spellcaster() {
        // Check if the character is a spellcaster based on class
        const classL = this.basicInfo.class.toLowerCase()
        return ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'artificer'].includes(classL)
      },
      
      abilityNames() {
        return ABILITY_NAMES
      }
    },
    methods: {
      ...mapMutations('character', ['SET_COMBAT_STAT', 'TOGGLE_SAVING_THROW']),
      
      formatModifier,
      
      updateCombatStat(stat, value) {
        // Parse number if applicable
        let parsedValue = value
        if (typeof value === 'string' && !isNaN(value)) {
          parsedValue = parseInt(value) || 0
        }
        
        // Update the stat
        this.SET_COMBAT_STAT({ stat, value: parsedValue })
        
        // Save changes
        this.debouncedSave()
      },
      
      toggleSavingThrow(ability) {
        this.TOGGLE_SAVING_THROW(ability)
        this.debouncedSave()
      },
      
      updateDeathSaves(type, value) {
        // Update death save successes or failures
        const newValue = this.deathSaves[type] === value ? value - 1 : value
        this.SET_COMBAT_STAT({ 
          stat: `deathSaves.${type}`, 
          value: newValue 
        })
        this.debouncedSave()
      },
      
      handleKeypress(event, ability) {
        if (event.key === 'Enter' || event.key === ' ') {
          this.toggleSavingThrow(ability)
          event.preventDefault()
        }
      },
      
      debouncedSave() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout)
        }
        
        this.saveTimeout = setTimeout(() => {
          this.$store.dispatch('character/saveCharacter')
        }, 1000)
      }
    },
    data() {
      return {
        saveTimeout: null
      }
    },
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }
    }
  }
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
  
  .hp-container {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
    margin: 5px 0;
  }
  
  .hp-current {
    width: 40px;
    text-align: center;
  }
  
  /* Saving throws */
  .skills {
    margin-bottom: var(--spacing-md);
  }
  
  .skill-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  
  .proficient {
    width: 15px;
    height: 15px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    margin-right: 5px;
    display: inline-block;
    cursor: pointer;
  }
  
  .is-proficient {
    background-color: var(--color-primary);
  }
  
  .skill-mod {
    font-weight: bold;
    margin-left: auto;
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
  
  .death-save-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .death-save-boxes {
    display: flex;
    gap: 5px;
  }
  
  .death-save-box {
    width: 20px;
    height: 20px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
  }
  
  .death-save-box.marked {
    background-color: var(--color-primary);
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