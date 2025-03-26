/**
 * Session Notes Composable
 * Provides access to session notes data and functions
 */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useDebouncedSave } from '@/features/shared/composables/useDebouncedSave';

/**
 * Composable for accessing and managing session notes
 * @returns {Object} Session notes data and related functions
 */
export function useSessionNotes() {
    const store = useStore();

    // Session data
    const sessions = computed(() => store.state.sessions.sessions || []);
    const currentSessionId = computed(() => store.state.sessions.currentSessionId);
    const currentSession = computed(() => {
        if (!currentSessionId.value) return null;
        return sessions.value.find(session => session.id === currentSessionId.value) || null;
    });

    // Get sessions sorted by date (newest first)
    const sortedSessions = computed(() => {
        return [...sessions.value].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
    });

    // Set up debounced save
    const { debouncedSave } = useDebouncedSave(() =>
        store.dispatch('sessions/saveSessions')
    );

    /**
     * Initialize sessions data
     */
    const initializeSessions = () => {
        store.dispatch('sessions/initializeSessions');
    };

    /**
     * Create a new session
     * @param {string} name - Session name
     * @param {string} date - Session date (YYYY-MM-DD)
     * @returns {string} New session ID
     */
    const createSession = (name, date) => {
        const sessionDate = date || new Date().toISOString().split('T')[0];

        return store.dispatch('sessions/createSession', {
            name,
            date: sessionDate
        });
    };

    /**
     * Update session data
     * @param {string} sessionId - Session ID
     * @param {Object} data - Updated session data
     */
    const updateSession = (sessionId, data) => {
        store.dispatch('sessions/updateSession', {
            id: sessionId,
            data
        });
    };

    /**
     * Delete a session
     * @param {string} sessionId - Session ID
     */
    const deleteSession = (sessionId) => {
        store.dispatch('sessions/deleteSession', sessionId);
    };

    /**
     * Select a session as the current session
     * @param {string} sessionId - Session ID
     */
    const selectSession = (sessionId) => {
        store.dispatch('sessions/selectSession', sessionId);
    };

    /**
     * Add an entity to a session
     * @param {string} sessionId - Session ID
     * @param {string} entityType - Entity type (characters, locations, etc.)
     * @param {Object} entity - Entity data
     */
    const addEntity = (sessionId, entityType, entity) => {
        store.dispatch('sessions/addEntity', {
            sessionId,
            entityType,
            entity
        });
    };

    /**
     * Update an entity in a session
     * @param {string} sessionId - Session ID
     * @param {string} entityType - Entity type (characters, locations, etc.)
     * @param {string} entityId - Entity ID
     * @param {Object} data - Updated entity data
     */
    const updateEntity = (sessionId, entityType, entityId, data) => {
        store.dispatch('sessions/updateEntity', {
            sessionId,
            entityType,
            entityId,
            data
        });
    };

    /**
     * Remove an entity from a session
     * @param {string} sessionId - Session ID
     * @param {string} entityType - Entity type (characters, locations, etc.)
     * @param {string} entityId - Entity ID
     */
    const removeEntity = (sessionId, entityType, entityId) => {
        store.dispatch('sessions/removeEntity', {
            sessionId,
            entityType,
            entityId
        });
    };

    /**
     * Add a timeline event to a session
     * @param {string} sessionId - Session ID
     * @param {Object} event - Timeline event data
     */
    const addTimelineEvent = (sessionId, event) => {
        store.dispatch('sessions/addTimelineEvent', {
            sessionId,
            event
        });
    };

    /**
     * Update a timeline event in a session
     * @param {string} sessionId - Session ID
     * @param {string} eventId - Event ID
     * @param {Object} data - Updated event data
     */
    const updateTimelineEvent = (sessionId, eventId, data) => {
        store.dispatch('sessions/updateTimelineEvent', {
            sessionId,
            eventId,
            data
        });
    };

    /**
     * Remove a timeline event from a session
     * @param {string} sessionId - Session ID
     * @param {string} eventId - Event ID
     */
    const removeTimelineEvent = (sessionId, eventId) => {
        store.dispatch('sessions/removeTimelineEvent', {
            sessionId,
            eventId
        });
    };

    /**
     * Sort timeline events in a session
     * @param {string} sessionId - Session ID
     */
    const sortTimelineEvents = (sessionId) => {
        store.dispatch('sessions/sortTimelineEvents', sessionId);
    };

    /**
     * Export sessions to a JSON file
     */
    const exportSessions = () => {
        store.dispatch('sessions/exportSessions');
    };

    /**
     * Import sessions from a JSON file
     * @param {Array} importedSessions - Sessions data
     * @param {boolean} replace - Whether to replace existing sessions
     */
    const importSessions = (importedSessions, replace = false) => {
        store.dispatch('sessions/importSessions', {
            sessions: importedSessions,
            replace
        });
    };

    /**
     * Format a date as a localized string
     * @param {string} dateString - Date string in YYYY-MM-DD format
     * @returns {string} Formatted date string
     */
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    return {
        // State
        sessions,
        currentSessionId,
        currentSession,
        sortedSessions,

        // Actions
        initializeSessions,
        createSession,
        updateSession,
        deleteSession,
        selectSession,
        addEntity,
        updateEntity,
        removeEntity,
        addTimelineEvent,
        updateTimelineEvent,
        removeTimelineEvent,
        sortTimelineEvents,
        exportSessions,
        importSessions,
        debouncedSave,

        // Utilities
        formatDate
    };
}