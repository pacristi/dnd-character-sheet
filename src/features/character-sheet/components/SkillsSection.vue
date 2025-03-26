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
  import { useCharacterData } from '../composables/useCharacterData';
  import SkillItem from './SkillItem.vue';
  import * as skillsUtils from '../utils/skillsUtils';
  
  export default {
    name: 'SkillsSection',
    components: {
      SkillItem
    },
    setup() {
      const { skills, abilityModifiers, proficiencyBonus, toggleSkill } = useCharacterData();
      
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