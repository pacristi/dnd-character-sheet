<!--
  Ability Score Component
  Displays and manages a single ability score
-->
<template>
    <div class="ability" :data-ability="ability">
      <div class="ability-name">{{ abilityNames[ability] }}</div>
      <div class="ability-abbr">{{ abilityAbbreviations[ability] }}</div>
      <input
        type="number"
        class="ability-score"
        :value="score"
        min="1"
        max="30"
        :aria-label="`Puntuación de ${abilityNames[ability]}`"
        @input="updateScore($event.target.value)"
      />
      <div class="ability-mod" aria-live="polite">
        {{ formatModifier(modifier) }}
      </div>
    </div>
  </template>
  
  <script>
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'AbilityScore',
    props: {
      ability: {
        type: String,
        required: true,
        validator: value => abilityUtils.ABILITY_LIST.includes(value)
      },
      score: {
        type: Number,
        required: true
      },
      modifier: {
        type: Number,
        required: true
      }
    },
    emits: ['update:score'],
    setup(props, { emit }) {
      // Get ability names and abbreviations from utils
      const abilityNames = abilityUtils.ABILITY_NAMES;
      const abilityAbbreviations = abilityUtils.ABILITY_ABBREVIATIONS;
      
      /**
       * Update the ability score
       * @param {string|number} value - New ability score value
       */
      const updateScore = (value) => {
        // Parse and validate the score
        const score = parseInt(value) || 10;
        const validScore = Math.max(1, Math.min(30, score));
        
        // Emit the update event
        emit('update:score', validScore);
      };
      
      return {
        abilityNames,
        abilityAbbreviations,
        formatModifier: abilityUtils.formatModifier,
        updateScore
      };
    }
  };
  </script>
  
  <style scoped>
  .ability {
    text-align: center;
    width: 120px;
    border: 2px solid var(--color-secondary);
    border-radius: var(--border-radius);
    padding: 10px 5px;
    background-color: var(--color-highlight);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .ability-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 2px;
  }
  
  .ability-abbr {
    font-size: 18px;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 5px;
  }
  
  .ability-score {
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
    text-align: center;
    width: 60px;
    background-color: white;
    border: 1px solid var(--color-secondary);
    border-radius: 4px;
    padding: 4px;
  }
  
  .ability-mod {
    background-color: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    font-weight: bold;
    font-size: 16px;
    margin: 5px auto 0;
  }
  </style>