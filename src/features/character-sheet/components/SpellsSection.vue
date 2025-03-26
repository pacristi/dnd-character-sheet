<template>
    <div class="section">
      <h2>Hechizos</h2>
      
      <!-- Spellcasting Info -->
      <div v-if="isSpellcaster" class="spellcasting-info">
        <div class="spellcasting-stat">
          <span>Característica de Lanzamiento: {{ spellcastingAbilityName }}</span>
        </div>
        <div class="spellcasting-stat">
          <span>CD de Salvación: {{ spellSaveDC }}</span>
        </div>
        <div class="spellcasting-stat">
          <span>Bonificador de Ataque: {{ formatModifier(spellAttackBonus) }}</span>
        </div>
      </div>
      
      <!-- Spell Levels Container -->
      <div id="spells-container">
        <!-- Show each level of spells -->
        <div
          v-for="(levelData, level) in sortedSpells"
          :key="level"
          class="spell-level-container"
          :data-level="level"
        >
          <div class="spell-level-header">
            <div class="spell-level">
              {{ formatSpellLevel(level, levelData) }}
            </div>
            
            <!-- Spell Slots for non-cantrips -->
            <div v-if="level !== 'cantrip'" class="spell-slots">
              <div
                v-for="index in getSpellSlots(level, levelData)"
                :key="`slot-${level}-${index}`"
                class="spell-slot"
                :class="{ used: isSlotUsed(level, index - 1) }"
                @click="toggleSpellSlot(level, index - 1)"
                role="button"
                tabindex="0"
                aria-label="Spell slot"
              ></div>
            </div>
          </div>
          
          <!-- Spells List -->
          <div class="spell-items">
            <div
              v-for="(spell, index) in levelData.spells"
              :key="`spell-${level}-${index}`"
              class="spell-item"
            >
              <input
                type="checkbox"
                class="spell-checkbox"
                :aria-label="`Prepare ${spell.name}`"
                v-model="spell.prepared"
                @change="updateSpellPrepared(level, index, spell)"
              />
              <span
                class="spell-name"
                role="button"
                tabindex="0"
                @click="showSpellDetails(level, index)"
              >{{ spell.name }}</span>
              <div class="spell-actions">
                <button
                  class="spell-info-button"
                  @click="openExternalInfo(spell.name)"
                  title="Ver detalles externos"
                  aria-label="View external spell details"
                >ℹ️</button>
                <button
                  class="spell-delete-button"
                  @click="removeSpell(level, index)"
                  aria-label="Remove spell"
                >✕</button>
              </div>
            </div>
            
            <!-- Empty state message when no spells -->
            <div v-if="levelData.spells.length === 0" class="empty-spells-message">
              No hay hechizos de este nivel. Añade uno utilizando el formulario de abajo.
            </div>
          </div>
        </div>
        
        <!-- Empty state when no spells at all -->
        <div v-if="Object.keys(sortedSpells).length === 0" class="empty-spells-container">
          <p>No has añadido ningún hechizo todavía.</p>
          <p>Utiliza el formulario de abajo para añadir tus primeros hechizos.</p>
        </div>
  
        <!-- Add New Spell Form -->
        <div class="spell-add">
          <h3>Añadir Hechizo</h3>
          
          <div class="spell-add-row">
            <input
              type="text"
              v-model="newSpell.name"
              placeholder="Nombre del hechizo"
              aria-label="Nombre del hechizo"
              @keyup.enter="addSpell"
            />
            <select v-model="newSpell.level" aria-label="Nivel del hechizo">
              <option value="cantrip">Truco</option>
              <option value="1">Nivel 1</option>
              <option value="2">Nivel 2</option>
              <option value="3">Nivel 3</option>
              <option value="4">Nivel 4</option>
              <option value="5">Nivel 5</option>
              <option value="6">Nivel 6</option>
              <option value="7">Nivel 7</option>
              <option value="8">Nivel 8</option>
              <option value="9">Nivel 9</option>
            </select>
          </div>
  
          <div class="spell-add-row">
            <input
              type="text"
              v-model="newSpell.castTime"
              placeholder="Tiempo de lanzamiento (ej. 1 acción)"
              aria-label="Tiempo de lanzamiento"
            />
            <input
              type="text"
              v-model="newSpell.range"
              placeholder="Alcance (ej. 18 metros)"
              aria-label="Alcance del hechizo"
            />
          </div>
  
          <div class="spell-add-row">
            <input
              type="text"
              v-model="newSpell.duration"
              placeholder="Duración (ej. Concentración, hasta 1 minuto)"
              aria-label="Duración del hechizo"
            />
            <input
              type="text"
              v-model="newSpell.components"
              placeholder="Componentes (ej. V, S, M)"
              aria-label="Componentes del hechizo"
            />
          </div>
          
          <div class="spell-add-row">
            <select v-model="newSpell.school" aria-label="Escuela de magia">
              <option value="Abjuración">Abjuración</option>
              <option value="Adivinación">Adivinación</option>
              <option value="Conjuración">Conjuración</option>
              <option value="Encantamiento">Encantamiento</option>
              <option value="Evocación">Evocación</option>
              <option value="Ilusión">Ilusión</option>
              <option value="Nigromancia">Nigromancia</option>
              <option value="Transmutación">Transmutación</option>
            </select>
          </div>
  
          <textarea
            v-model="newSpell.description"
            placeholder="Descripción del hechizo..."
            rows="4"
            aria-label="Descripción del hechizo"
          ></textarea>
  
          <div class="spell-add-buttons">
            <button type="button" @click="addSpell" class="primary-button">
              Añadir Hechizo
            </button>
            <button
              type="button"
              @click="resetNewSpellForm"
              class="secondary-button"
            >
              Limpiar Formulario
            </button>
            <button
              type="button"
              @click="searchSpellDatabase"
              class="secondary-button"
            >
              Buscar Hechizo
            </button>
          </div>
        </div>
      </div>
      
      <!-- Spell Detail Modal -->
      <Modal
        v-model="showModal"
        title=""
      >
        <template v-if="selectedSpell">
          <div class="spell-modal-header">
            <h3 id="modal-spell-name">{{ selectedSpell.name }}</h3>
            <div class="spell-level-school">
              <span>{{ formatSpellLevelValue(selectedSpell.level) }}</span>
              <span v-if="selectedSpell.school"> • {{ selectedSpell.school }}</span>
            </div>
          </div>
          
          <div class="spell-info-grid">
            <div class="spell-info-item">
              <span class="spell-info-label">Tiempo de Lanzamiento:</span>
              <span id="modal-spell-time">{{ selectedSpell.castTime || '1 acción' }}</span>
            </div>
            <div class="spell-info-item">
              <span class="spell-info-label">Alcance:</span>
              <span id="modal-spell-range">{{ selectedSpell.range || 'A ti mismo' }}</span>
            </div>
            <div class="spell-info-item">
              <span class="spell-info-label">Duración:</span>
              <span id="modal-spell-duration">{{ selectedSpell.duration || 'Instantáneo' }}</span>
            </div>
            <div class="spell-info-item">
              <span class="spell-info-label">Componentes:</span>
              <span id="modal-spell-components">{{ selectedSpell.components || 'V, S' }}</span>
            </div>
          </div>
          
          <div class="spell-description">
            <p id="modal-spell-description">{{ selectedSpell.description || 'Sin descripción.' }}</p>
          </div>
          
          <div class="modal-buttons">
            <button type="button" @click="editSpellInModal" class="primary-button">
              Editar
            </button>
            <button
              type="button" 
              @click="openExternalInfo(selectedSpell.name)"
              class="secondary-button"
            >
              Ver Referencia
            </button>
            <button
              type="button"
              @click="showModal = false"
              class="secondary-button"
            >
              Cerrar
            </button>
          </div>
        </template>
      </Modal>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import Modal from '../../shared/components/Modal.vue'
  import { formatModifier, getSpellcastingAbility } from '../utils/abilityUtils';
  
  export default {
    name: 'SpellsSection',
    components: {
      Modal
    },
    inject: ['showNotification'],
    data() {
      return {
        newSpell: this.getEmptySpell(),
        showModal: false,
        selectedSpell: null,
        selectedLevel: null,
        selectedIndex: null,
        saveTimeout: null
      }
    },
    computed: {
      ...mapState('character', ['spells', 'basicInfo', 'abilities']),
      ...mapGetters('character', ['spellSaveDC', 'spellAttackBonus']),
      
      sortedSpells() {
        // Create a sorted version of the spells object
        const sorted = {}
        
        // Add cantrips first if they exist
        if (this.spells.cantrip) {
          sorted.cantrip = this.spells.cantrip
        }
        
        // Add numbered levels in order
        for (let i = 1; i <= 9; i++) {
          const level = i.toString()
          if (this.spells[level]) {
            sorted[level] = this.spells[level]
          }
        }
        
        return sorted
      },
      
      isSpellcaster() {
        // Check if the character is a spellcaster based on class
        if (!this.basicInfo.class) return false
        
        const classL = this.basicInfo.class.toLowerCase()
        return ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'artificer'].includes(classL)
      },
      
      spellcastingAbility() {
        return getSpellcastingAbility(this.basicInfo.class)
      },
      
      spellcastingAbilityName() {
        const abilityNames = {
          'str': 'Fuerza',
          'dex': 'Destreza',
          'con': 'Constitución',
          'int': 'Inteligencia',
          'wis': 'Sabiduría',
          'cha': 'Carisma'
        }
        
        return abilityNames[this.spellcastingAbility] || 'Inteligencia'
      }
    },
    methods: {
      ...mapMutations('character', [
        'ADD_SPELL', 
        'UPDATE_SPELL', 
        'REMOVE_SPELL', 
        'SET_SPELL_SLOTS'
      ]),
      
      formatModifier,
      
      getEmptySpell() {
        return {
          name: '',
          level: 'cantrip',
          castTime: '',
          range: '',
          duration: '',
          components: '',
          school: 'Abjuración',
          description: '',
          prepared: false
        }
      },
      
      formatSpellLevel(level, levelData) {
        if (level === 'cantrip') {
          return 'Trucos (a voluntad)'
        } else {
          const numSlots = levelData.slots ? levelData.slots.total : this.getDefaultSlots(parseInt(level))
          return `Nivel ${level} (${numSlots} espacios)`
        }
      },
      
      formatSpellLevelValue(level) {
        return level === 'cantrip' ? 'Truco' : `Nivel ${level}`
      },
      
      getSpellSlots(level, levelData) {
        return levelData.slots ? levelData.slots.total : this.getDefaultSlots(parseInt(level))
      },
      
      isSlotUsed(level, slotIndex) {
        if (!this.spells[level] || !this.spells[level].slots) {
          return false
        }
        
        return slotIndex < this.spells[level].slots.used
      },
      
      toggleSpellSlot(level, slotIndex) {
        if (!this.spells[level]) {
          return
        }
        
        // Initialize slots structure if it doesn't exist
        let slotsData = this.spells[level].slots || {
          total: this.getDefaultSlots(parseInt(level)),
          used: 0
        }
        
        // Calculate new used count based on slot index
        let newUsedCount
        if (slotIndex < slotsData.used) {
          // If clicked on a used slot, set used to this index
          newUsedCount = slotIndex
        } else {
          // If clicked on an unused slot, set used to index + 1
          newUsedCount = slotIndex + 1
        }
        
        // Update slots
        this.SET_SPELL_SLOTS({
          level,
          slots: {
            ...slotsData,
            used: newUsedCount
          }
        })
        
        this.debouncedSave()
      },
      
      getDefaultSlots(spellLevel) {
    const charLevel = this.basicInfo.level || 1
    
    // Simplified table based on standard spell slot progression
    // Each row is a character level, each column is a spell level (1-9)
    const spellSlotsTable = [
        // lvl 1  2  3  4  5  6  7  8  9
        [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1st level character
        [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2nd level character
        [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3rd level character
        [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4th level character
        [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5th level character
        [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6th level character
        [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7th level character
        [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8th level character
        [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9th level character
        [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10th level character
        [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11th level character
        [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12th level character
        [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13th level character
        [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14th level character
        [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15th level character
        [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16th level character
        [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17th level character
        [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18th level character
        [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19th level character
        [4, 3, 3, 3, 3, 2, 2, 1, 1]  // 20th level character
    ]
    
    // Get the row for the character level (clamp to 1-20)
    const level = Math.max(1, Math.min(20, charLevel))
    const slots = spellSlotsTable[level - 1]
    
    // Return slots for the requested spell level (1-indexed)
    return spellLevel <= slots.length ? slots[spellLevel - 1] : 0
    },

    addSpell() {
    if (!this.newSpell.name.trim()) {
        this.showNotification('Por favor ingresa un nombre para el hechizo', 'error')
        return
    }
    
    // Create spell object (clone to avoid reference issues)
    const spell = { ...this.newSpell }
    
    // Add to store
    this.ADD_SPELL({ level: spell.level, spell })
    
    // Show notification
    this.showNotification(`Hechizo añadido: ${spell.name}`, 'info')
    
    // Clear form
    this.resetNewSpellForm()
    
    // Save changes
    this.debouncedSave()
    },

    updateSpellPrepared(level, index, spell) {
    this.UPDATE_SPELL({ level, index, spell })
    this.debouncedSave()
    },

    removeSpell(level, index) {
    const spell = this.spells[level]?.spells[index]
    if (!spell) return
    
    // Confirm deletion
    if (!confirm(`¿Estás seguro que deseas eliminar el hechizo "${spell.name}"?`)) {
        return
    }
    
    const spellName = spell.name
    
    this.REMOVE_SPELL({ level, index })
    this.debouncedSave()
    
    this.showNotification(`Hechizo eliminado: ${spellName}`, 'info')
    },

    showSpellDetails(level, index) {
    if (!this.spells[level]?.spells[index]) return
    
    this.selectedSpell = { ...this.spells[level].spells[index] }
    this.selectedLevel = level
    this.selectedIndex = index
    this.showModal = true
    },

    editSpellInModal() {
    if (!this.selectedSpell) return
    
    // Copy spell data to the form
    this.newSpell = { ...this.selectedSpell }
    
    // Close the modal
    this.showModal = false
    
    // Remove the original spell
    if (this.selectedLevel !== null && this.selectedIndex !== null) {
        this.REMOVE_SPELL({ level: this.selectedLevel, index: this.selectedIndex })
        this.debouncedSave()
    }
    
    // Reset selection
    this.selectedSpell = null
    this.selectedLevel = null
    this.selectedIndex = null
    
    // Scroll to the form
    this.$nextTick(() => {
        const spellAddForm = document.querySelector('.spell-add')
        if (spellAddForm) {
        spellAddForm.scrollIntoView({ behavior: 'smooth' })
        }
    })
    },

    searchSpellDatabase() {
    // In a future implementation, this would connect to a spells API or database
    this.showNotification('La búsqueda en la base de datos de hechizos se implementará en una versión futura.', 'info')
    },

    openExternalInfo(spellName) {
    if (!spellName) return
    
    const formattedName = encodeURIComponent(spellName.toLowerCase().replace(/\s+/g, '-'))
    window.open(`https://dnd5e.wikidot.com/spell:${formattedName}`, '_blank')
    },

    resetNewSpellForm() {
    this.newSpell = this.getEmptySpell()
    },

    debouncedSave() {
    if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
    }
    
    this.saveTimeout = setTimeout(() => {
        this.$store.dispatch('character/saveCharacter')
    }, 1000)
    }
        }
    }
</script>