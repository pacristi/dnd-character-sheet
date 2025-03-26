<template>
  <div class="section">
    <h2>Estadísticas de Combate</h2>
    <div class="combat-stats">
      <combat-stat-item 
        label="CLASE DE ARMADURA" 
        :value="combat.armorClass" 
        @update:value="updateCombatStat('armorClass', $event)" 
      />
      
      <combat-stat-item 
        label="INICIATIVA" 
        :value="combat.initiative" 
        @update:value="updateCombatStat('initiative', $event)" 
      />
      
      <combat-stat-item 
        label="VELOCIDAD" 
        :value="combat.speed" 
        :is-text="true"
        @update:value="updateCombatStat('speed', $event)" 
      />

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
            class="hp-max"
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
            class="hp-temp"
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
        <death-save-tracker 
          label="Éxitos" 
          :count="deathSaves.successes" 
          @update:count="updateDeathSaves('successes', $event)" 
        />
        <death-save-tracker 
          label="Fallos" 
          :count="deathSaves.failures" 
          @update:count="updateDeathSaves('failures', $event)" 
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { abilityUtils } from '@/utils/characterUtils'
import { saveHandlerMixin } from '@/mixins/saveHandlerMixin'
import CombatStatItem from '@/components/character/CombatStatItem.vue'
import DeathSaveTracker from '@/components/character/DeathSaveTracker.vue'

export default {
  name: 'CombatStatsSection',
  components: {
    CombatStatItem,
    DeathSaveTracker
  },
  mixins: [saveHandlerMixin],
  computed: {
    ...mapState('character', ['combat', 'savingThrows', 'basicInfo']),
    ...mapGetters('character', ['savingThrowModifiers', 'passivePerception', 'spellAttackBonus', 'spellSaveDC']),
    
    // Use individual getters/setters for cleaner code
    currentHp: {
      get() {
        return this.combat.hp.current
      },
      set(value) {
        this.updateCombatStat('hp.current', value)
      }
    },
    
    maxHp: {
      get() {
        return this.combat.hp.max
      },
      set(value) {
        this.updateCombatStat('hp.max', value)
      }
    },
    
    temporaryHp: {
      get() {
        return this.combat.hp.temporary || 0
      },
      set(value) {
        this.updateCombatStat('hp.temporary', value)
      }
    },
    
    deathSaves() {
      return this.combat.deathSaves || { successes: 0, failures: 0 }
    },
    
    showDeathSaves() {
      // Show death saves when HP is 0
      return this.currentHp <= 0
    },
    
    isSpellcaster() {
      // Check if the character is a spellcaster based on class
      if (!this.basicInfo.class) return false
      
      const classL = this.basicInfo.class.toLowerCase()
      return ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'artificer'].includes(classL)
    },
    
    abilityNames() {
      return abilityUtils.ABILITY_NAMES
    }
  },
  methods: {
    ...mapMutations('character', ['SET_COMBAT_STAT', 'TOGGLE_SAVING_THROW']),
    
    formatModifier(modifier) {
      return abilityUtils.formatModifier(modifier)
    },
    
    /**
     * Update a combat statistic
     * @param {string} stat - Stat identifier (can include dot notation)
     * @param {*} value - New value
     */
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
    
    /**
     * Toggle saving throw proficiency
     * @param {string} ability - Ability identifier
     */
    toggleSavingThrow(ability) {
      this.TOGGLE_SAVING_THROW(ability)
      this.debouncedSave()
    },
    
    /**
     * Update death saves count
     * @param {string} type - Type of save ('successes' or 'failures')
     * @param {number} value - New value
     */
    updateDeathSaves(type, value) {
      this.SET_COMBAT_STAT({ 
        stat: `deathSaves.${type}`, 
        value: value
      })
      this.debouncedSave()
    },
    
    /**
     * Handle keyboard events for accessibility
     * @param {Event} event - Keyboard event
     * @param {string} ability - Ability identifier
     */
    handleKeypress(event, ability) {
      if (event.key === 'Enter' || event.key === ' ') {
        this.toggleSavingThrow(ability)
        event.preventDefault()
      }
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

.hp-container {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  margin: 5px 0;
}

.hp-current, .hp-max, .hp-temp {
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