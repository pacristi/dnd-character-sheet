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
      <div class="section">
        <h2>Cargar/Guardar Personaje</h2>
        <div class="d-flex gap-md mb-md">
          <button @click="exportCharacter" class="flex-1">
            Guardar como JSON
          </button>
          <input
            type="file"
            ref="importJsonInput"
            class="file-input"
            accept=".json"
            @change="importCharacter"
            aria-label="Importar personaje desde archivo JSON"
          />
          <button @click="$refs.importJsonInput.click()" class="flex-1">
            Cargar desde JSON
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PortraitSection from '@/components/character/PortraitSection.vue'
import BasicInfoSection from '@/components/character/BasicInfoSection.vue'
import AbilitiesSection from '@/components/character/AbilitiesSection.vue'
import CombatStatsSection from '@/components/character/CombatStatsSection.vue'
import SkillsSection from '@/components/character/SkillsSection.vue'
import FeaturesSection from '@/components/character/FeaturesSection.vue'
import SpellsSection from '@/components/character/SpellsSection.vue'
import AttacksSection from '@/components/character/AttacksSection.vue'
import LanguagesSection from '@/components/character/LanguagesSection.vue'
import EquipmentSection from '@/components/character/EquipmentSection.vue'
import PersonalitySection from '@/components/character/PersonalitySection.vue'
import NotesSection from '@/components/character/NotesSection.vue'

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
    NotesSection
  },
  inject: ['showNotification'],
  methods: {
    ...mapActions('character', [
      'initializeCharacter',
      'saveCharacter',
      'exportCharacter'
    ]),
    
    /**
     * Import character from JSON file
     * @param {Event} event - File input change event
     */
    async importCharacter(event) {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const characterData = JSON.parse(e.target.result)
            this.$store.dispatch('character/importCharacter', characterData)
            this.showNotification('Character loaded successfully!')
          } catch (error) {
            console.error("Error parsing character data:", error)
            this.showNotification('Error loading character. The file may be corrupted.', 'error')
          }
        }
        
        reader.onerror = () => {
          this.showNotification('Error reading file. Please try again.', 'error')
        }
        
        reader.readAsText(file)
      } catch (error) {
        console.error("Error importing character:", error)
        this.showNotification('Failed to import character.', 'error')
      }
      
      // Reset input to allow loading the same file again
      event.target.value = ''
    }
  },
  created() {
    // Initialize character data when component is created
    this.initializeCharacter()
  }
}
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

.flex-1 {
  flex: 1;
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
}
</style>