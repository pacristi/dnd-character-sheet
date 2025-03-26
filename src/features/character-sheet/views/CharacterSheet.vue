<!--
  Character Sheet View
  The main view for the character sheet feature
-->
<template>
  <div class="main-container">
    <!-- Character portrait container -->
    <PortraitSection v-if="isLoaded" />

    <!-- Main content container -->
    <div class="main-content">
      <div class="header">
        <h1>D&D 5ª Edición</h1>
        <p class="character-title">Ficha de Personaje</p>
      </div>

      <div v-if="isLoaded">
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
      <div v-else class="loading-state">
        <p>Cargando hoja de personaje...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, provide, ref } from 'vue';
import { useStore } from 'vuex';
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

export default defineComponent({
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
    const store = useStore();
    const isLoaded = ref(false);
    
    // Setup notification function to inject into components
    const showNotification = (message, type = 'info') => {
      notificationService[type](message);
    };
    
    // Make notification function available to components that need it
    provide('showNotification', showNotification);
    
    // Initialize character data when component is mounted
    onMounted(async () => {
      try {
        await store.dispatch('character/initializeCharacter');
        isLoaded.value = true;
        showNotification('Hoja de personaje cargada', 'info');
      } catch (error) {
        console.error('Error loading character sheet:', error);
        showNotification('Error al cargar la hoja de personaje. Recargando con valores por defecto...', 'error');
        
        // Try to load default character as fallback
        try {
          await store.dispatch('character/loadDefaultCharacter');
          isLoaded.value = true;
        } catch (fallbackError) {
          console.error('Fatal error loading default character:', fallbackError);
          showNotification('Error fatal al cargar la hoja de personaje.', 'error');
        }
      }
    });
    
    return {
      isLoaded
    };
  }
});
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

.loading-state {
  margin-top: 2rem;
  text-align: center;
  font-style: italic;
  color: var(--color-primary);
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
}
</style>