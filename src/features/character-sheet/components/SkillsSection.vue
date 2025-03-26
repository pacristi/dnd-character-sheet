<!--
  Skills Section Component
  Displays and manages character skills
-->
<template>
    <div class="section">
      <h2>Pericias</h2>
      <div class="skills" id="skills-list">
        <SkillItem
          v-for="skill in skillsList"
          :key="skill.id"
          :skill="skill"
          :is-proficient="isProficient(skill.id)"
          :modifier="getSkillModifier(skill.id, skill.ability)"
          @toggle="toggleSkill(skill.id)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import SkillItem from './SkillItem.vue';
  import * as skillsUtils from '../utils/skillsUtils';
  
  export default {
    name: 'SkillsSection',
    components: {
      SkillItem
    },
    setup() {
      // Use store directly
      const store = useStore();
      
      // Get skills data from store
      const skills = computed(() => store.state.character.skills || {});
      const abilities = computed(() => store.state.character.abilities || {});
      const basicInfo = computed(() => store.state.character.basicInfo || {});
      
      // Calculate proficiency bonus
      const proficiencyBonus = computed(() => {
        const level = basicInfo.value.level || 1;
        return Math.floor((level - 1) / 4) + 2;
      });
      
      // Calculate ability modifiers
      const abilityModifiers = computed(() => {
        const modifiers = {};
        Object.entries(abilities.value).forEach(([ability, score]) => {
          modifiers[ability] = Math.floor((score - 10) / 2);
        });
        return modifiers;
      });
      
      // Get the skills list from utils
      const skillsList = skillsUtils.SKILLS_LIST;
      
      /**
       * Check if a skill is proficient
       * @param {string} skillId - Skill identifier
       * @returns {boolean} Is the character proficient in this skill
       */
      const isProficient = (skillId) => {
        return !!skills.value[skillId];
      };
      
      /**
       * Get skill modifier value
       * @param {string} skillId - Skill identifier
       * @param {string} ability - Related ability (str, dex, etc.)
       * @returns {number} Total skill modifier
       */
      const getSkillModifier = (skillId, ability) => {
        const abilityMod = abilityModifiers.value[ability] || 0;
        const isProficientValue = isProficient(skillId);
        
        return isProficientValue ? abilityMod + proficiencyBonus.value : abilityMod;
      };
      
      /**
       * Toggle skill proficiency and save
       */
      const toggleSkill = (skillId) => {
        store.commit('character/TOGGLE_SKILL', skillId);
        store.dispatch('character/saveCharacter');
      };
      
      return {
        skillsList,
        isProficient,
        getSkillModifier,
        toggleSkill
      };
    }
  };
  </script>
  
  <style scoped>
  .skills {
    columns: 2;
  }
  
  @media (max-width: 600px) {
    .skills {
      columns: 1;
    }
  }
  </style>