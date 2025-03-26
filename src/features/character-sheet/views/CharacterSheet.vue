<!--
  Character Sheet View
  The main view for the character sheet feature
-->
<template>
    <div class="main-container">
      <!-- Character portrait container -->
      <PortraitSection />
  
      <!-- Main content container -->
      <div class="main-content">
        <div class="header">
          <h1>D&D 5ª Edición</h1>
          <p class="character-title">Ficha de Personaje</p>
        </div>
  
        <!-- Basic Information Section -->
        <BasicInfoSection />
  
        <!-- Abilities Section -->
        <AbilitiesSection />
  
        <!-- Combat Stats Section -->
        <CombatStatsSection />
  
        <!-- Skills Section -->
        <SkillsSection />
  
        <!-- Features Section -->
        <FeaturesSection />
  
        <!-- Spells Section -->
        <SpellsSection />
  
        <!-- Attacks Section -->
        <AttacksSection />
  
        <!-- Languages & Proficiencies Section -->
        <LanguagesSection />
  
        <!-- Equipment Section -->
        <EquipmentSection />
  
        <!-- Personality Traits Section -->
        <PersonalitySection />
  
        <!-- Notes Section -->
        <NotesSection />
  
        <!-- Character Save/Load Section -->
        <CharacterImportExport />
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { useCharacterData } from '../composables/useCharacterData';
  import { notificationService } from '@/services/notificationService';
  
  // Import components
  import PortraitSection from '../components/PortraitSection.vue';
  import BasicInfoSection from '../components/BasicInfoSection.vue';
  import AbilitiesSection from '../components/AbilitiesSection.vue';
  import CombatStatsSection from '../components/CombatStatsSection.vue';
  import SkillsSection from '../components/SkillsSection.vue';
  import FeaturesSection from '../components/FeaturesSection.vue';
  import SpellsSection from '../components/SpellsSection.vue';
  import AttacksSection from '../components/AttacksSection.vue';
  import LanguagesSection from '../components/LanguagesSection.vue';
  import EquipmentSection from '../components/EquipmentSection.vue';
  import PersonalitySection from '../components/PersonalitySection.vue';
  import NotesSection from '../components/NotesSection.vue';
  import CharacterImportExport from '../components/CharacterImportExport.vue';
  
  export default {
    name: 'CharacterSheet',
    components: {
      PortraitSection,
      BasicInfoSection,
      AbilitiesSection,
      CombatStatsSection,
      SkillsSection,
      FeaturesSection,
      SpellsSection,
      AttacksSection,
      LanguagesSection,
      EquipmentSection,
      PersonalitySection,
      NotesSection,
      CharacterImportExport
    },
    setup() {
      const { initializeCharacter } = useCharacterData();
      
      // Initialize character data when component is mounted
      onMounted(() => {
        initializeCharacter();
        notificationService.info('Hoja de personaje cargada');
      });
    }
  };
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: var(--spacing-lg);
  }
  
  .main-content {
    flex: 1;
    min-width: 0; /* Ensures flex works correctly */
  }
  
  .character-title {
    font-style: italic;
    font-size: 18px;
    margin-top: 0;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .main-container {
      flex-direction: column;
    }
  }
  </style>