<!--
  Skill Item Component
  Displays and manages a single skill item
-->
<template>
    <div
      class="skill-item"
      :data-skill="skill.id"
      :data-ability="skill.ability"
    >
      <div
        class="proficient"
        role="checkbox"
        :aria-checked="isProficient ? 'true' : 'false'"
        tabindex="0"
        @click="$emit('toggle')"
        @keypress="handleKeypress"
        :class="{ 'is-proficient': isProficient }"
      ></div>
      <span>{{ skill.name }} ({{ abilityAbbreviation }})</span>
      <span class="skill-mod" aria-live="polite">
        {{ formattedModifier }}
      </span>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import * as abilityUtils from '../utils/abilityUtils';
  
  export default {
    name: 'SkillItem',
    props: {
      skill: {
        type: Object,
        required: true,
        validator: value => value.id && value.name && value.ability
      },
      isProficient: {
        type: Boolean,
        required: true
      },
      modifier: {
        type: Number,
        required: true
      }
    },
    emits: ['toggle'],
    setup(props) {
      // Get the ability abbreviation for this skill
      const abilityAbbreviation = abilityUtils.ABILITY_ABBREVIATIONS[props.skill.ability];
      
      // Format the modifier for display
      const formattedModifier = computed(() => {
        return abilityUtils.formatModifier(props.modifier);
      });
      
      /**
       * Handle keyboard events for accessibility
       * @param {Event} event - Keyboard event
       */
      const handleKeypress = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.target.click();
        }
      };
      
      return {
        abilityAbbreviation,
        formattedModifier,
        handleKeypress
      };
    }
  };
  </script>
  
  <style scoped>
  .skill-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    break-inside: avoid;
  }
  
  .proficient {
    width: 16px;
    height: 16px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    margin-right: 8px;
    display: inline-block;
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .is-proficient {
    background-color: var(--color-primary);
  }
  
  .skill-mod {
    font-weight: bold;
    margin-left: auto;
    flex-shrink: 0;
  }
  </style>