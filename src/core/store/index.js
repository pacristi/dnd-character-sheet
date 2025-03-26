/**
 * Vuex Store Configuration
 * Sets up the Vuex store with all modules
 */
import { createStore } from 'vuex';
import { characterStore } from '@/features/character-sheet/store';
import { sessionsStore } from '@/features/session-notes/store';

/**
 * Create and configure the Vuex store
 * @returns {import('vuex').Store} Configured Vuex store
 */
export default createStore({
    // Register feature modules
    modules: {
        character: characterStore,
        sessions: sessionsStore
    }
});