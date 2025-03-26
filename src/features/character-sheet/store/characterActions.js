/**
 * Character Actions
 * Defines actions for the character store
 */
import { characterStorage } from '@/services/storageService';
import { fileService } from '@/services/fileService';
import { notificationService } from '@/services/notificationService';
import { createDefaultSkills } from '@/features/character-sheet/utils/skillsUtils';

export const characterActions = {
    /**
     * Initialize the character data from storage or default
     */
    initializeCharacter({ commit, dispatch }) {
        const savedCharacter = characterStorage.loadCharacter();
        if (savedCharacter) {
            commit('SET_STATE', savedCharacter);
        } else {
            dispatch('loadDefaultCharacter');
        }
    },

    /**
     * Load default character state
     */
    loadDefaultCharacter({ commit }) {
        try {
            // Reset to default state
            commit('RESET_STATE');

            // Initialize skills list
            const skills = createDefaultSkills();
            commit('SET_SKILLS', skills);

            notificationService.info('Se ha creado un nuevo personaje con valores por defecto');
        } catch (error) {
            console.error('Error loading default character:', error);
            notificationService.error('Error al crear un nuevo personaje');
        }
    },

    /**
     * Save character to localStorage
     */
    saveCharacter({ state }) {
        try {
            const saved = characterStorage.saveCharacter(state);
            return saved;
        } catch (error) {
            console.error('Error saving character:', error);
            notificationService.error('Error al guardar el personaje');
            return false;
        }
    },

    /**
     * Export character to JSON file
     */
    async exportCharacter({ state }) {
        try {
            const characterName = state.basicInfo.name || 'personaje';
            const characterClass = state.basicInfo.class || 'clase';
            const filename = `${characterName}-${characterClass}`;

            const success = await fileService.exportToJson(state, filename);

            if (success) {
                notificationService.success('Personaje exportado correctamente');
            }

            return success;
        } catch (error) {
            console.error('Error exporting character:', error);
            notificationService.error('Error al exportar el personaje');
            return false;
        }
    },

    /**
     * Import character from JSON data
     */
    importCharacter({ commit }, characterData) {
        try {
            commit('IMPORT_CHARACTER', characterData);

            // Save to localStorage for persistence
            characterStorage.saveCharacter(characterData);

            notificationService.success('Personaje importado correctamente');

            return true;
        } catch (error) {
            console.error('Error importing character:', error);
            notificationService.error('Error al importar el personaje');
            return false;
        }
    }
};