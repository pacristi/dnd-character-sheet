<template>
    <div class="section">
      <h2>Pericias</h2>
      <div class="skills" id="skills-list">
        <div
          v-for="skill in skillsList"
          :key="skill.id"
          class="skill-item"
          :data-skill="skill.id"
          :data-ability="skill.ability"
        >
          <div
            class="proficient"
            role="checkbox"
            :aria-checked="isProficient(skill.id) ? 'true' : 'false'"
            tabindex="0"
            @click="toggleSkill(skill.id)"
            @keypress="handleKeypress($event, skill.id)"
            :class="{ 'is-proficient': isProficient(skill.id) }"
          ></div>
          <span>{{ skill.name }} ({{ abilityAbbreviations[skill.ability] }})</span>
          <span class="skill-mod" aria-live="polite">
            {{ formatModifier(getSkillModifier(skill.id, skill.ability)) }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import { SKILLS_LIST, ABILITY_ABBREVIATIONS, formatModifier } from '@/utils/abilities'
  
  export default {
    name: 'SkillsSection',
    data() {
      return {
        skillsList: SKILLS_LIST,
        abilityAbbreviations: ABILITY_ABBREVIATIONS,
        saveTimeout: null
      }
    },
    computed: {
      ...mapState('character', ['skills']),
      ...mapGetters('character', ['skillModifiers', 'abilityModifiers', 'proficiencyBonus'])
    },
    methods: {
      ...mapMutations('character', ['TOGGLE_SKILL']),
      
      formatModifier,
      
      isProficient(skillId) {
        return !!this.skills[skillId]
      },
      
      toggleSkill(skillId) {
        this.TOGGLE_SKILL(skillId)
        this.debouncedSave()
      },
      
      getSkillModifier(skillId, ability) {
        // First check if we have it in the skillModifiers getter
        if (this.skillModifiers[skillId] !== undefined) {
          return this.skillModifiers[skillId]
        }
        
        // Otherwise calculate it manually
        const abilityMod = this.abilityModifiers[ability] || 0
        const isProficient = this.isProficient(skillId)
        
        return isProficient ? abilityMod + this.proficiencyBonus : abilityMod
      },
      
      handleKeypress(event, skillId) {
        if (event.key === 'Enter' || event.key === ' ') {
          this.toggleSkill(skillId)
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
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }
    }
  }
  </script>
  
  <style scoped>
  .skills {
    columns: 2;
  }
  
  .skill-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    break-inside: avoid;
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
  
  /* Responsive styles */
  @media (max-width: 600px) {
    .skills {
      columns: 1;
    }
  }
  </style>