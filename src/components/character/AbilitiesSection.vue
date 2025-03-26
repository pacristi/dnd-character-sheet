<template>
    <div class="section">
      <h2>Características</h2>
      <div class="abilities">
        <div
          v-for="(abbr, ability) in abilityAbbreviations"
          :key="ability"
          class="ability"
          :data-ability="ability"
        >
          <div class="ability-name">{{ abilityNames[ability] }}</div>
          <input
            type="number"
            class="ability-score"
            v-model.number="abilityScores[ability]"
            min="1"
            max="30"
            :aria-label="`Puntuación de ${abilityNames[ability]}`"
            @change="updateAbilityScore(ability, $event.target.value)"
          />
          <div class="ability-mod" aria-live="polite">
            {{ formatModifier(abilityModifiers[ability]) }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import { ABILITY_ABBREVIATIONS, ABILITY_NAMES, formatModifier } from '@/utils/abilities'
  
  export default {
    name: 'AbilitiesSection',
    data() {
      return {
        abilityAbbreviations: ABILITY_ABBREVIATIONS,
        abilityNames: ABILITY_NAMES,
        abilityScores: {}
      }
    },
    computed: {
      ...mapState('character', ['abilities']),
      ...mapGetters('character', ['abilityModifiers'])
    },
    methods: {
      ...mapMutations('character', ['SET_ABILITY_SCORE']),
      
      formatModifier,
      
      updateAbilityScore(ability, value) {
        // Parse and validate the score
        const score = parseInt(value) || 10
        const validScore = Math.max(1, Math.min(30, score))
        
        // Update the store
        this.SET_ABILITY_SCORE({ ability, score: validScore })
        
        // Save changes
        this.debouncedSave()
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
    watch: {
      abilities: {
        handler(newAbilities) {
          // Update the local abilityScores to reflect the store state
          this.abilityScores = { ...newAbilities }
        },
        immediate: true,
        deep: true
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
  .abilities {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .ability {
    text-align: center;
    width: calc(16.6% - 10px);
    border: 2px solid var(--color-secondary);
    border-radius: var(--border-radius);
    padding: 10px 5px;
    background-color: var(--color-highlight);
  }
  
  .ability-name {
    font-weight: bold;
    font-size: 12px;
  }
  
  .ability-score {
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
    text-align: center;
    width: 60px;
  }
  
  .ability-mod {
    background-color: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .abilities {
      justify-content: center;
    }
  
    .ability {
      width: calc(33% - 10px);
    }
  }
  
  @media (max-width: 480px) {
    .ability {
      width: calc(50% - 10px);
    }
  }
  </style>