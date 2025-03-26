/**
 * Session Notes Feature
 * Entry point for the session notes feature
 */

// Export components
export { default as SessionNotes } from './views/SessionNotes.vue';
export { default as EntityList } from './components/EntityList.vue';

// Export composables
export { useSessionNotes } from './composables/useSessionNotes';

// Export store
export { sessionsStore } from './store';