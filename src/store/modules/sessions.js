import { saveSessionsToStorage, loadSessionsFromStorage } from '@/utils/storage'

export default {
    namespaced: true,

    state: {
        sessions: [],
        currentSessionId: null
    },

    getters: {
        currentSession: (state) => {
            if (!state.currentSessionId) return null
            return state.sessions.find(session => session.id === state.currentSessionId) || null
        },

        sortedSessions: (state) => {
            return [...state.sessions].sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
        }
    },

    mutations: {
        SET_SESSIONS(state, sessions) {
            state.sessions = sessions
        },

        SET_CURRENT_SESSION(state, sessionId) {
            state.currentSessionId = sessionId
        },

        ADD_SESSION(state, session) {
            state.sessions.push(session)
            state.currentSessionId = session.id
        },

        UPDATE_SESSION(state, { id, data }) {
            const index = state.sessions.findIndex(session => session.id === id)
            if (index !== -1) {
                state.sessions[index] = { ...state.sessions[index], ...data }
            }
        },

        REMOVE_SESSION(state, sessionId) {
            state.sessions = state.sessions.filter(session => session.id !== sessionId)

            // If the removed session was the current session, select another one
            if (state.currentSessionId === sessionId) {
                state.currentSessionId = state.sessions.length > 0 ? state.sessions[0].id : null
            }
        },

        // Entity management (characters, locations, etc.)
        ADD_ENTITY(state, { sessionId, entityType, entity }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                session[entityType].push(entity)
            }
        },

        UPDATE_ENTITY(state, { sessionId, entityType, entityId, data }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                const index = session[entityType].findIndex(e => e.id === entityId)
                if (index !== -1) {
                    session[entityType][index] = { ...session[entityType][index], ...data }
                }
            }
        },

        REMOVE_ENTITY(state, { sessionId, entityType, entityId }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                session[entityType] = session[entityType].filter(e => e.id !== entityId)
            }
        },

        // Timeline events
        ADD_TIMELINE_EVENT(state, { sessionId, event }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                session.timeline.push(event)
            }
        },

        UPDATE_TIMELINE_EVENT(state, { sessionId, eventId, data }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                const index = session.timeline.findIndex(e => e.id === eventId)
                if (index !== -1) {
                    session.timeline[index] = { ...session.timeline[index], ...data }
                }
            }
        },

        REMOVE_TIMELINE_EVENT(state, { sessionId, eventId }) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                session.timeline = session.timeline.filter(e => e.id !== eventId)
            }
        },

        SORT_TIMELINE_EVENTS(state, sessionId) {
            const session = state.sessions.find(s => s.id === sessionId)
            if (session) {
                session.timeline.sort((a, b) => {
                    if (a.time !== 'N/A' && b.time !== 'N/A') {
                        return a.time.localeCompare(b.time)
                    }
                    if (a.time !== 'N/A') return -1
                    if (b.time !== 'N/A') return 1
                    return 0
                })
            }
        }
    },

    actions: {
        // Initialize sessions
        initializeSessions({ commit }) {
            const savedSessions = loadSessionsFromStorage()
            if (savedSessions && savedSessions.length > 0) {
                commit('SET_SESSIONS', savedSessions)
                commit('SET_CURRENT_SESSION', savedSessions[0].id)
            }
        },

        // Create a new session
        createSession({ commit, dispatch }, { name, date }) {
            const sessionId = 'session-' + Date.now()
            const sessionDate = date || new Date().toISOString().split('T')[0]

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
            }

            commit('ADD_SESSION', newSession)
            dispatch('saveSessions')

            return sessionId
        },

        // Save sessions to localStorage
        saveSessions({ state }) {
            saveSessionsToStorage(state.sessions)
        },

        // Update session data
        updateSession({ commit, dispatch }, payload) {
            commit('UPDATE_SESSION', payload)
            dispatch('saveSessions')
        },

        // Delete a session
        deleteSession({ commit, dispatch }, sessionId) {
            commit('REMOVE_SESSION', sessionId)
            dispatch('saveSessions')
        },

        // Select a session
        selectSession({ commit }, sessionId) {
            commit('SET_CURRENT_SESSION', sessionId)
        },

        // Add entity to a session
        addEntity({ commit, dispatch }, payload) {
            commit('ADD_ENTITY', payload)
            dispatch('saveSessions')
        },

        // Update entity in a session
        updateEntity({ commit, dispatch }, payload) {
            commit('UPDATE_ENTITY', payload)
            dispatch('saveSessions')
        },

        // Remove entity from a session
        removeEntity({ commit, dispatch }, payload) {
            commit('REMOVE_ENTITY', payload)
            dispatch('saveSessions')
        },

        // Add timeline event
        addTimelineEvent({ commit, dispatch }, payload) {
            commit('ADD_TIMELINE_EVENT', payload)
            dispatch('saveSessions')
        },

        // Update timeline event
        updateTimelineEvent({ commit, dispatch }, payload) {
            commit('UPDATE_TIMELINE_EVENT', payload)
            dispatch('saveSessions')
        },

        // Remove timeline event
        removeTimelineEvent({ commit, dispatch }, payload) {
            commit('REMOVE_TIMELINE_EVENT', payload)
            dispatch('saveSessions')
        },

        // Sort timeline events
        sortTimelineEvents({ commit, dispatch }, sessionId) {
            commit('SORT_TIMELINE_EVENTS', sessionId)
            dispatch('saveSessions')
        },

        // Export sessions to JSON file
        exportSessions({ state }) {
            const sessionsData = JSON.stringify(state.sessions, null, 2)
            const filename = `dnd-session-notes-${new Date().toISOString().split('T')[0]}.json`

            // Use FileSaver.js or browser native API
            const blob = new Blob([sessionsData], { type: 'application/json' })

            // Create a link and trigger download
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            link.click()

            // Clean up
            URL.revokeObjectURL(url)
        },

        // Import sessions from JSON file
        importSessions({ commit, dispatch, state }, { sessions, replace }) {
            if (replace) {
                commit('SET_SESSIONS', sessions)
            } else {
                // Append sessions, avoiding duplicates by ID
                const existingIds = new Set(state.sessions.map(s => s.id))
                const newSessions = sessions.filter(s => !existingIds.has(s.id))

                newSessions.forEach(session => {
                    commit('ADD_SESSION', session)
                })
            }

            if (sessions.length > 0 && !state.currentSessionId) {
                commit('SET_CURRENT_SESSION', sessions[0].id)
            }

            dispatch('saveSessions')
        }
    }
}