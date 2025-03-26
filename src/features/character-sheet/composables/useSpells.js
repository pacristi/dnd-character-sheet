/**
 * Spells Composable
 * Provides access to spell-related data and functions
 */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useCharacterData } from './useCharacterData';

/**
 * Composable for accessing and managing spells
 * @returns {Object} Spells data and related functions
 */
export function useSpells() {
    const store = useStore();
    const {
        debouncedSave,
        level,
    } = useCharacterData();

    // Spells data
    const spells = computed(() => store.state.character.spells || {});

    // Get sorted spells (cantrips first, then by level)
    const sortedSpells = computed(() => {
        const sorted = {};

        // Add cantrips first if they exist
        if (spells.value.cantrip) {
            sorted.cantrip = spells.value.cantrip;
        }

        // Add numbered levels in order
        for (let i = 1; i <= 9; i++) {
            const level = i.toString();
            if (spells.value[level]) {
                sorted[level] = spells.value[level];
            }
        }

        return sorted;
    });

    /**
     * Format spell level for display
     * @param {string} level - Spell level identifier
     * @param {Object} levelData - Spell data for the level
     * @returns {string} Formatted level string
     */
    const formatSpellLevel = (level, levelData) => {
        if (level === 'cantrip') {
            return 'Trucos (a voluntad)';
        } else {
            const numSlots = levelData.slots ? levelData.slots.total : getDefaultSlots(parseInt(level));
            return `Nivel ${level} (${numSlots} espacios)`;
        }
    };

    /**
     * Format spell level value
     * @param {string} level - Spell level identifier
     * @returns {string} Formatted level string
     */
    const formatSpellLevelValue = (level) => {
        return level === 'cantrip' ? 'Truco' : `Nivel ${level}`;
    };

    /**
     * Get default spell slots based on character level
     * @param {number} spellLevel - Spell level
     * @returns {number} Number of spell slots
     */
    const getDefaultSlots = (spellLevel) => {
        const charLevel = level.value;

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
        ];

        // Get the row for the character level (clamp to 1-20)
        const lvl = Math.max(1, Math.min(20, charLevel));
        const slots = spellSlotsTable[lvl - 1];

        // Return slots for the requested spell level (1-indexed)
        return spellLevel <= slots.length ? slots[spellLevel - 1] : 0;
    };

    /**
     * Check if a spell slot is used
     * @param {string} level - Spell level
     * @param {number} slotIndex - Slot index
     * @returns {boolean} True if the slot is used
     */
    const isSlotUsed = (level, slotIndex) => {
        if (!spells.value[level] || !spells.value[level].slots) {
            return false;
        }

        return slotIndex < spells.value[level].slots.used;
    };

    /**
     * Toggle the used state of a spell slot
     * @param {string} level - Spell level
     * @param {number} slotIndex - Slot index
     */
    const toggleSpellSlot = (level, slotIndex) => {
        if (!spells.value[level]) {
            return;
        }

        // Initialize slots structure if it doesn't exist
        let slotsData = spells.value[level].slots || {
            total: getDefaultSlots(parseInt(level)),
            used: 0
        };

        // Calculate new used count based on slot index
        let newUsedCount;
        if (slotIndex < slotsData.used) {
            // If clicked on a used slot, set used to this index
            newUsedCount = slotIndex;
        } else {
            // If clicked on an unused slot, set used to index + 1
            newUsedCount = slotIndex + 1;
        }

        // Update slots
        store.commit('character/SET_SPELL_SLOTS', {
            level,
            slots: {
                ...slotsData,
                used: newUsedCount
            }
        });

        debouncedSave();
    };

    /**
     * Add a new spell
     * @param {Object} spell - Spell data
     */
    const addSpell = (spell) => {
        store.commit('character/ADD_SPELL', { level: spell.level, spell });
        debouncedSave();
    };

    /**
     * Update an existing spell
     * @param {string} level - Spell level
     * @param {number} index - Spell index
     * @param {Object} spell - Updated spell data
     */
    const updateSpell = (level, index, spell) => {
        store.commit('character/UPDATE_SPELL', { level, index, spell });
        debouncedSave();
    };

    /**
     * Remove a spell
     * @param {string} level - Spell level
     * @param {number} index - Spell index
     */
    const removeSpell = (level, index) => {
        store.commit('character/REMOVE_SPELL', { level, index });
        debouncedSave();
    };

    /**
     * Reset all spell slots (e.g., after a long rest)
     */
    const resetSpellSlots = () => {
        // Iterate through each spell level
        Object.keys(spells.value).forEach(level => {
            if (level !== 'cantrip' && spells.value[level] && spells.value[level].slots) {
                // Update slots to set used to 0 but maintain total
                store.commit('character/SET_SPELL_SLOTS', {
                    level,
                    slots: {
                        total: spells.value[level].slots.total,
                        used: 0
                    }
                });
            }
        });

        debouncedSave();
    };

    /**
     * Create an empty spell object
     * @returns {Object} Empty spell object
     */
    const createEmptySpell = () => ({
        name: '',
        level: 'cantrip',
        castTime: '',
        range: '',
        duration: '',
        components: '',
        school: 'Abjuración',
        description: '',
        prepared: false
    });

    return {
        spells,
        sortedSpells,
        formatSpellLevel,
        formatSpellLevelValue,
        getDefaultSlots,
        isSlotUsed,
        toggleSpellSlot,
        addSpell,
        updateSpell,
        removeSpell,
        resetSpellSlots,
        createEmptySpell
    };
}