/**
 * Sessions Store Module
 * Manages session notes data
 */
import { sessionStorage } from '@/services/storageService';

/**
 * Default state factory
 * @returns {Object} Default sessions state
 */
const getDefaultState = () => ({
    sessions: [],
    currentSessionId: null
});

/**
 * Sessions store module
 */
export const sessionsStore = {
    namespaced: true,

    // State
    state: getDefaultState(),

    // Getters
    getters: {
        /**
         * Get current session
         * @param {Object} state - Store state
         * @returns {Object|null} Current session or null
         */
        currentSession: (state) => {
            if (!state.currentSessionId) return null;
            return state.sessions.find(session => session.id === state.currentSessionId) || null;
        },

        /**
         * Get sessions sorted by date (newest first)
         * @param {Object} state - Store state
         * @returns {Array} Sorted sessions
         */
        sortedSessions: (state) => {
            return [...state.sessions].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        }
    },

    // Mutations
    mutations: {
        /**
         * Set sessions
         * @param {Object} state - Store state
         * @param {Array} sessions - Session data
         */
        SET_SESSIONS(state, sessions) {
            state.sessions = sessions;
        },

        /**
         * Set current session
         * @param {Object} state - Store state
         * @param {string} sessionId - Session ID
         */
        SET_CURRENT_SESSION(state, sessionId) {
            state.currentSessionId = sessionId;
        },

        /**
         * Add a new session
         * @param {Object} state - Store state
         * @param {Object} session - Session data
         */
        ADD_SESSION(state, session) {
            state.sessions.push(session);
            state.currentSessionId = session.id;
        },

        /**
         * Update a session
         * @param {Object} state - Store state
         * @param {Object} param1 - Update parameters
         * @param {string} param1.id - Session ID
         * @param {Object} param1.data - Updated session data
         */
        UPDATE_SESSION(state, { id, data }) {
            const index = state.sessions.findIndex(session => session.id === id);
            if (index !== -1) {
                state.sessions[index] = { ...state.sessions[index], ...data };
            }
        },

        /**
         * Remove a session
         * @param {Object} state - Store state
         * @param {string} sessionId - Session ID
         */
        REMOVE_SESSION(state, sessionId) {
            state.sessions = state.sessions.filter(session => session.id !== sessionId);

            // If the removed session was the current session, select another one
            if (state.currentSessionId === sessionId) {
                state.currentSessionId = state.sessions.length > 0 ? state.sessions[0].id : null;
            }
        },

        /**
         * Add an entity to a session
         * @param {Object} state - Store state
         * @param {Object} param1 - Parameters
         * @param {string} param1.sessionId - Session ID
         * @param {string} param1.entityType - Entity type
         * @param {Object} param1.entity - Entity data
         */
        ADD_ENTITY(state, { sessionId, entityType, entity }) {
            const session = state.sessions.find(s => s.id === sessionId);
            if (session) {
                if (!session[entityType]) {
                    session[entityType] = [];
                }
                session[entityType].push(entity);
            }
        },

        /**
         * Update an entity in a session
         * @param {Object} state - Store state
         * @param {Object} param1 - Parameters
         * @param {string} param1.sessionId - Session ID
         * @param {string} param1.entityType - Entity type
         * @param {string} param1.entityId - Entity ID
         * @param {Object} param1.data - Updated entity data
         */
        UPDATE_ENTITY(state, { sessionId, entityType, entityId, data }) {
            const session = state.sessions.find(s => s.id === sessionId);
            if (session && session[entityType]) {
                const index = session[entityType].findIndex(e => e.id === entityId);
                if (index !== -1) {
                    session[entityType][index] = { ...session[entityType][index], ...data };
                }
            }
        },

        /**
         * Remove an entity from a session
         * @param {Object} state - Store state
         * @param {Object} param1 - Parameters
         * @param {string} param1.sessionId - Session ID
         * @param {string} param1.entityType - Entity type
         * @param {string} param1.entityId - Entity ID
         */
        REMOVE_ENTITY(state, { sessionId, entityType, entityId }) {
            const session = state.sessions.find(s => s.id === sessionId);
            if (session && session[entityType]) {
                session[entityType] = session[entityType].filter(e => e.id !== entityId);
            }
        }
    },

    // Actions
    actions: {
        /**
         * Initialize sessions
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         */
        initializeSessions({ commit }) {
            const savedSessions = sessionStorage.load() || [];

            commit('SET_SESSIONS', savedSessions);

            if (savedSessions.length > 0) {
                commit('SET_CURRENT_SESSION', savedSessions[0].id);
            }
        },

        /**
         * Create a new session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} param1 - Parameters
         * @param {string} param1.name - Session name
         * @param {string} param1.date - Session date
         * @returns {string} New session ID
         */
        createSession({ commit, dispatch }, { name, date }) {
            const sessionId = 'session-' + Date.now();
            const sessionDate = date || new Date().toISOString().split('T')[0];

            const newSession = {
                id: sessionId,
                name,
                date: sessionDate,
                summary: '',
                characters: [],
                locations: [],
                quests: [],
                treasures: [],
                factions: [],
                timeline: []
            };

            commit('ADD_SESSION', newSession);
            dispatch('saveSessions');

            return sessionId;
        },

        /**
         * Save sessions to storage
         * @param {Object} param0 - Context
         * @param {Object} param0.state - Store state
         */
        saveSessions({ state }) {
            sessionStorage.save(state.sessions);
        },

        /**
         * Update session data
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} payload - Session update payload
         */
        updateSession({ commit, dispatch }, payload) {
            commit('UPDATE_SESSION', payload);
            dispatch('saveSessions');
        },

        /**
         * Delete a session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {string} sessionId - Session ID
         */
        deleteSession({ commit, dispatch }, sessionId) {
            commit('REMOVE_SESSION', sessionId);
            dispatch('saveSessions');
        },

        /**
         * Select a session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {string} sessionId - Session ID
         */
        selectSession({ commit }, sessionId) {
            commit('SET_CURRENT_SESSION', sessionId);
        },

        /**
         * Add an entity to a session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} payload - Entity payload
         */
        addEntity({ commit, dispatch }, payload) {
            commit('ADD_ENTITY', payload);
            dispatch('saveSessions');
        },

        /**
         * Update an entity in a session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} payload - Entity update payload
         */
        updateEntity({ commit, dispatch }, payload) {
            commit('UPDATE_ENTITY', payload);
            dispatch('saveSessions');
        },

        /**
         * Remove an entity from a session
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} payload - Entity removal payload
         */
        removeEntity({ commit, dispatch }, payload) {
            commit('REMOVE_ENTITY', payload);
            dispatch('saveSessions');
        },

        /**
         * Import sessions
         * @param {Object} param0 - Context
         * @param {Function} param0.commit - Commit function
         * @param {Function} param0.dispatch - Dispatch function
         * @param {Object} param0.state - Store state
         * @param {Object} param1 - Parameters
         * @param {Array} param1.sessions - Session data
         * @param {boolean} param1.replace - Whether to replace existing sessions
         */
        importSessions({ commit, dispatch, state }, { sessions, replace }) {
            if (replace) {
                commit('SET_SESSIONS', sessions);
            } else {
                // Append sessions, avoiding duplicates by ID
                const existingIds = new Set(state.sessions.map(s => s.id));
                const newSessions = sessions.filter(s => !existingIds.has(s.id));

                newSessions.forEach(session => {
                    commit('ADD_SESSION', session);
                });
            }

            if (sessions.length > 0 && !state.currentSessionId) {
                commit('SET_CURRENT_SESSION', sessions[0].id);
            }

            dispatch('saveSessions');
        },

        /**
         * Export sessions
         * @param {Object} param0 - Context
         * @param {Object} param0.state - Store state
         * @returns {Array} Sessions data
         */
        exportSessions({ state }) {
            return state.sessions;
        }
    }
};

export default sessionsStore;