<template>
    <div class="section">
      <h2>Ataques y Armas</h2>
      <div class="attacks-header">
        <div class="attack-col-name">Nombre</div>
        <div class="attack-col-bonus">Bonificador</div>
        <div class="attack-col-damage">Daño</div>
        <div class="attack-col-type">Tipo</div>
        <div class="attack-col-range">Alcance</div>
        <div class="attack-col-properties">Propiedades</div>
        <div class="attack-col-actions"></div>
      </div>
      <div id="attacks-list">
        <div
          v-for="(attack, index) in attacks"
          :key="`attack-${index}`"
          class="attack-item"
        >
          <div class="attack-col-name">{{ attack.name }}</div>
          <div class="attack-col-bonus">{{ attack.bonus }}</div>
          <div class="attack-col-damage">{{ attack.damage }}</div>
          <div class="attack-col-type">{{ attack.type }}</div>
          <div class="attack-col-range">{{ attack.range }}</div>
          <div class="attack-col-properties">{{ attack.properties }}</div>
          <div class="attack-col-actions">
            <button type="button" @click="rollAttack(attack)" title="Tirar ataque" aria-label="Roll attack with ${attack.name}">🎲</button>
            <button type="button" @click="removeAttack(index)" title="Eliminar" aria-label="Remove attack">✕</button>
          </div>
        </div>
      </div>
      <div class="attack-add">
        <input
          type="text"
          v-model="newAttack.name"
          placeholder="Nombre"
          aria-label="Nombre del ataque"
          @keypress.enter="addAttack"
        />
        <input
          type="text"
          v-model="newAttack.bonus"
          placeholder="+0"
          style="width: 60px"
          aria-label="Bonificador de ataque"
        />
        <input
          type="text"
          v-model="newAttack.damage"
          placeholder="1d8"
          style="width: 80px"
          aria-label="Daño del ataque"
        />
        <select v-model="newAttack.type" aria-label="Tipo de daño">
          <option value="cortante">Cortante</option>
          <option value="perforante">Perforante</option>
          <option value="contundente">Contundente</option>
          <option value="ácido">Ácido</option>
          <option value="frío">Frío</option>
          <option value="fuego">Fuego</option>
          <option value="fuerza">Fuerza</option>
          <option value="eléctrico">Eléctrico</option>
          <option value="necrótico">Necrótico</option>
          <option value="psíquico">Psíquico</option>
          <option value="radiante">Radiante</option>
          <option value="trueno">Trueno</option>
          <option value="veneno">Veneno</option>
        </select>
        <input
          type="text"
          v-model="newAttack.range"
          placeholder="Alcance"
          style="width: 80px"
          aria-label="Alcance del ataque"
        />
        <input
          type="text"
          v-model="newAttack.properties"
          placeholder="Propiedades"
          aria-label="Propiedades del arma"
        />
        <button type="button" @click="addAttack">Añadir</button>
      </div>
      <div class="attack-actions mt-md">
        <button type="button" @click="generateAttacksFromEquipment" class="secondary-button">
          Generar desde equipo
        </button>
      </div>
      
      <!-- Roll Result Modal -->
      <Modal v-model="showRollModal" title="Resultado de la tirada">
        <div v-if="rollResult" class="dice-result-container">
          <h3>{{ rollResult.title }}</h3>
          <div class="dice-result">{{ rollResult.attackRoll }}</div>
          <div v-if="rollResult.critical" class="dice-critical">¡CRÍTICO!</div>
          <div v-else-if="rollResult.fumble" class="dice-fumble">¡PIFIA!</div>
          <div v-if="rollResult.damage" class="dice-damage">
            <div>Daño: {{ rollResult.damage }}</div>
            <div v-if="rollResult.critical" class="dice-critical-note">
              (dados duplicados por crítico)
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex'
  import Modal from '@/components/ui/Modal.vue'
  import { rollDie, rollDice } from '@/utils/dice'
  
  // Constants for weapon data
  const WEAPONS_DATABASE = {
    // Melee weapons
    "Espada larga": { damage: "1d8", type: "cortante", properties: "Versátil (1d10)" },
    "Espada corta": { damage: "1d6", type: "perforante", properties: "Ligera, Sutil" },
    "Daga": { damage: "1d4", type: "perforante", properties: "Ligera, Sutil, Arrojadiza (alcance 6/18)" },
    "Estoque": { damage: "1d8", type: "perforante", properties: "Sutil" },
    "Hacha de mano": { damage: "1d6", type: "cortante", properties: "Ligera, Arrojadiza (alcance 6/18)" },
    "Bastón": { damage: "1d6", type: "contundente", properties: "Versátil (1d8)" },
  
    // Ranged weapons
    "Arco largo": { damage: "1d8", type: "perforante", properties: "Munición (alcance 45/180), Dos manos, Pesada" },
    "Arco corto": { damage: "1d6", type: "perforante", properties: "Munición (alcance 24/96), Dos manos" },
    "Ballesta ligera": { damage: "1d8", type: "perforante", properties: "Munición (alcance 24/96), Carga, Dos manos" },
    "Ballesta pesada": { damage: "1d10", type: "perforante", properties: "Munición (alcance 30/120), Carga, Pesada, Dos manos" }
  };
  
  export default {
    name: 'AttacksSection',
    components: {
      Modal
    },
    inject: ['showNotification'],
    data() {
      return {
        newAttack: {
          name: '',
          bonus: '',
          damage: '',
          type: 'cortante',
          range: '',
          properties: ''
        },
        showRollModal: false,
        rollResult: null,
        saveTimeout: null
      }
    },
    computed: {
      ...mapState('character', ['attacks', 'equipment', 'abilities']),
      
      hasWeapons() {
        return this.attacks && this.attacks.length > 0
      }
    },
    methods: {
      ...mapMutations('character', ['ADD_ATTACK', 'REMOVE_ATTACK']),
      
      addAttack() {
        if (!this.newAttack.name.trim()) {
          this.showNotification("El ataque debe tener un nombre", "error");
          return;
        }
        
        // Add attack to store
        this.ADD_ATTACK({ ...this.newAttack });
        
        // Clear form
        this.resetNewAttackForm();
        
        // Save to storage
        this.debouncedSave();
        
        // Show notification
        this.showNotification(`Ataque añadido: ${this.newAttack.name}`, "info");
      },
      
      removeAttack(index) {
        const attackName = this.attacks[index]?.name || "attack";
        
        // Remove from store
        this.REMOVE_ATTACK(index);
        
        // Save to storage
        this.debouncedSave();
        
        // Show notification
        this.showNotification(`Removed attack: ${attackName}`, "info");
      },
      
      rollAttack(attack) {
        if (!attack) return;
        
        // Get attack data
        const { name, bonus, damage } = attack;
        
        // Roll attack
        const attackRoll = rollDie(20);
        const bonusNum = parseInt(bonus?.replace(/[^\d-]/g, '')) || 0;
        const attackTotal = attackRoll + bonusNum;
        
        // Check for critical hit or miss
        const critical = attackRoll === 20;
        const fumble = attackRoll === 1;
        
        // Prepare result
        let result = {
          title: `Ataque con ${name}`,
          attackRoll: `${attackRoll} ${bonus} = ${attackTotal}`,
          critical,
          fumble,
          damage: null
        };
        
        // Roll damage if available
        if (damage) {
          try {
            // Parse the damage formula (e.g. "1d8+3")
            const damageMatch = damage.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/i);
            
            if (damageMatch) {
              const diceCount = parseInt(damageMatch[1]) || 1;
              const diceSides = parseInt(damageMatch[2]) || 6;
              const damageBonus = parseInt(damageMatch[3]) || 0;
              
              // Roll the dice
              const critMultiplier = critical ? 2 : 1;
              const damageRolls = rollDice(diceCount * critMultiplier, diceSides);
              const damageTotal = damageRolls.reduce((sum, roll) => sum + roll, 0) + damageBonus;
              
              result.damage = `[${damageRolls.join(', ')}] + ${damageBonus} = ${damageTotal}`;
            } else {
              result.damage = damage;
            }
          } catch (error) {
            console.error("Error rolling damage:", error);
            result.damage = damage;
          }
        }
        
        // Show the result
        this.rollResult = result;
        this.showRollModal = true;
      },
      
      autoSuggestWeaponData(weaponName) {
        if (!weaponName) return;
        
        // Check for matching weapon in database
        for (const [name, data] of Object.entries(WEAPONS_DATABASE)) {
          if (name.toLowerCase().includes(weaponName.toLowerCase())) {
            // Auto-fill weapon data
            this.newAttack.damage = data.damage;
            this.newAttack.type = data.type;
            this.newAttack.properties = data.properties;
  
            // Auto-fill range if it's a ranged weapon
            const isRanged = data.properties.includes("Munición") || data.properties.includes("alcance");
            this.newAttack.range = isRanged ? "Distancia" : "Cuerpo a cuerpo";
  
            // Auto-calculate attack bonus
            const attackBonus = this.calculateAttackBonus(name, !isRanged);
            this.newAttack.bonus = attackBonus;
  
            break;
          }
        }
      },
      
      calculateAttackBonus(weapon, isMelee = true) {
        // Get ability modifier (STR for melee, DEX for ranged)
        const abilityType = isMelee ? 'str' : 'dex';
        const abilityMod = this.abilities[abilityType] 
          ? Math.floor((this.abilities[abilityType] - 10) / 2) 
          : 0;
        
        // Get proficiency bonus based on character level
        const level = this.$store.state.character.basicInfo.level || 1;
        const profBonus = Math.floor((level - 1) / 4) + 2;
        
        // Calculate total bonus
        return `+${abilityMod + profBonus}`;
      },
      
      generateAttacksFromEquipment() {
        let weaponsAdded = 0;
        
        // Get all equipment items
        this.equipment.forEach(item => {
          const itemName = item.name;
          
          // Check all weapons in database
          for (const [weaponName, weaponData] of Object.entries(WEAPONS_DATABASE)) {
            if (itemName.toLowerCase().includes(weaponName.toLowerCase())) {
              // Skip if attack already exists
              const existingAttack = this.attacks.some(
                attack => attack.name.toLowerCase() === weaponName.toLowerCase()
              );
              
              if (!existingAttack) {
                // Determine if ranged
                const isRanged = weaponData.properties.includes("Munición") ||
                  weaponData.properties.includes("alcance") ||
                  weaponName.includes("Arco") ||
                  weaponName.includes("Ballesta");
                
                // Calculate attack bonus
                const attackBonus = this.calculateAttackBonus(weaponName, !isRanged);
                
                // Add the attack
                this.ADD_ATTACK({
                  name: weaponName,
                  bonus: attackBonus,
                  damage: weaponData.damage,
                  type: weaponData.type,
                  range: isRanged ? "Distancia" : "Cuerpo a cuerpo",
                  properties: weaponData.properties
                });
                
                weaponsAdded++;
              }
            }
          }
        });
        
        // Save changes
        if (weaponsAdded > 0) {
          this.debouncedSave();
        }
        
        // Show result message
        if (weaponsAdded > 0) {
          this.showNotification(`Se han añadido ${weaponsAdded} ataques desde el equipo.`, "info");
        } else {
          this.showNotification("No se han encontrado armas nuevas en el equipo.", "info");
        }
      },
      
      resetNewAttackForm() {
        this.newAttack = {
          name: '',
          bonus: '',
          damage: '',
          type: 'cortante',
          range: '',
          properties: ''
        };
      },
      
      debouncedSave() {
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(() => {
          this.$store.dispatch('character/saveCharacter');
        }, 1000);
      }
    },
    watch: {
      'newAttack.name': {
        handler(newValue) {
          this.autoSuggestWeaponData(newValue);
        }
      }
    },
    beforeUnmount() {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
    }
  }
  </script>
  
  <style scoped>
  .attacks-header,
  .attack-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr auto;
    gap: 5px;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 5px;
  }
  
  .attacks-header {
    font-weight: bold;
    border-bottom: 1px solid var(--color-secondary);
    padding-bottom: 8px;
    margin-bottom: var(--spacing-sm);
  }
  
  .attack-col-name,
  .attack-col-bonus,
  .attack-col-damage,
  .attack-col-type,
  .attack-col-range,
  .attack-col-properties,
  .attack-col-actions {
    padding: 0 5px;
  }
  
  .attack-item {
    background-color: var(--color-highlight);
    border-radius: 5px;
    padding: 8px 5px;
  }
  
  .attack-item:hover {
    background-color: #e5d5b5;
  }
  
  .attack-item button {
    padding: 2px 5px;
    font-size: 12px;
  }
  
  .attack-add {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr auto;
    gap: 5px;
    margin-top: var(--spacing-sm);
    align-items: center;
  }
  
  .attack-add button {
    height: 32px;
  }
  
  /* Dice roll result styles */
  .dice-result-container {
    text-align: center;
  }
  
  .dice-result {
    font-size: 24px;
    font-weight: bold;
    margin: 15px 0;
  }
  
  .dice-critical {
    color: #d4af37;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .dice-fumble {
    color: #cc0000;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .dice-damage {
    font-size: 18px;
    margin-top: 10px;
    padding: 10px;
    background-color: var(--color-highlight);
    border-radius: 5px;
  }
  
  .dice-critical-note {
    font-size: 14px;
    font-style: italic;
    margin-top: 5px;
    color: #666;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .attacks-header,
    .attack-item,
    .attack-add {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, auto);
    }
    
    .attack-col-name,
    .attack-col-bonus {
      grid-row: 1;
    }
    
    .attack-col-damage,
    .attack-col-type {
      grid-row: 2;
    }
    
    .attack-col-range,
    .attack-col-properties {
      grid-row: 3;
    }
    
    .attack-col-actions {
      grid-column: 1 / 3;
      grid-row: 4;
      text-align: center;
      margin-top: 5px;
    }
    
    .attack-add button {
      grid-column: 1 / 3;
    }
  }
  </style>