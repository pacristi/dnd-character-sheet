// src/services/storageService.js
/**
 * Storage Service: Handles all storage-related operations
 * Following single responsibility principle - this service is only concerned with storage
 */

// Storage keys
const STORAGE_KEYS = {
    CHARACTER: 'dnd-character-data',
    SESSIONS: 'dnd-session-notes',
    PORTRAIT: 'dnd-character-portrait',
    PREFERENCES: 'dnd-user-preferences'
}

/**
 * Character Storage API
 */
export const characterStorage = {
    /**
     * Saves character data to localStorage
     * @param {Object} characterData - Character data to save
     * @returns {Boolean} Success status
     */
    saveCharacter(characterData) {
        try {
            // Handle portrait data separately due to size
            const portraitData = characterData.portrait
            const characterDataCopy = { ...characterData }
            delete characterDataCopy.portrait

            // Save character data
            localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(characterDataCopy))

            // Save portrait if available
            if (portraitData) {
                localStorage.setItem(STORAGE_KEYS.PORTRAIT, portraitData)
                this.cleanupOldPortraits()
            }

            return true
        } catch (error) {
            console.error('Error saving character data to storage:', error)
            return false
        }
    },

    /**
     * Loads character data from localStorage
     * @returns {Object|null} Character data or null if not found
     */
    loadCharacter() {
        try {
            // Load character data
            const characterData = localStorage.getItem(STORAGE_KEYS.CHARACTER)
            if (!characterData) return null

            // Parse character data
            const parsedData = JSON.parse(characterData)

            // Add portrait data if available
            const portraitData = localStorage.getItem(STORAGE_KEYS.PORTRAIT)
            if (portraitData) {
                parsedData.portrait = portraitData
            }

            return parsedData
        } catch (error) {
            console.error('Error loading character data from storage:', error)
            return null
        }
    },

    /**
     * Cleans up old portraits from localStorage to free space
     */
    cleanupOldPortraits() {
        try {
            // Find all portrait keys (in case we have multiple portraits stored)
            const portraitKeys = []
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key.startsWith(STORAGE_KEYS.PORTRAIT)) {
                    portraitKeys.push(key)
                }
            }

            // If we have more than one portrait, remove the old ones
            if (portraitKeys.length > 1) {
                // Sort by creation time if available, otherwise just remove random ones
                portraitKeys.slice(0, portraitKeys.length - 1).forEach(key => {
                    localStorage.removeItem(key)
                })
            }

            return true
        } catch (error) {
            console.error('Error cleaning up old portraits:', error)
            return false
        }
    }
}

/**
 * Session Storage API
 */
export const sessionStorage = {
    /**
     * Saves session notes to localStorage
     * @param {Array} sessions - Session notes to save
     * @returns {Boolean} Success status
     */
    saveSessions(sessions) {
        try {
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
            return true
        } catch (error) {
            console.error('Error saving session notes to storage:', error)
            return false
        }
    },

    /**
     * Loads session notes from localStorage
     * @returns {Array} Session notes or empty array if not found
     */
    loadSessions() {
        try {
            const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS)
            return sessions ? JSON.parse(sessions) : []
        } catch (error) {
            console.error('Error loading session notes from storage:', error)
            return []
        }
    }
}

/**
 * Preferences Storage API
 */
export const preferencesStorage = {
    /**
     * Saves a user preference to localStorage
     * @param {String} key - Preference key
     * @param {*} value - Preference value
     * @returns {Boolean} Success status
     */
    savePreference(key, value) {
        try {
            // Load existing preferences
            const preferences = this.loadAllPreferences()

            // Update preference
            preferences[key] = value

            // Save back to storage
            localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))

            return true
        } catch (error) {
            console.error('Error saving preference to storage:', error)
            return false
        }
    },

    /**
     * Loads a user preference from localStorage
     * @param {String} key - Preference key
     * @param {*} defaultValue - Default value if preference not found
     * @returns {*} Preference value or default value
     */
    loadPreference(key, defaultValue = null) {
        try {
            const preferences = this.loadAllPreferences()
            return key in preferences ? preferences[key] : defaultValue
        } catch (error) {
            console.error('Error loading preference from storage:', error)
            return defaultValue
        }
    },

    /**
     * Loads all user preferences from localStorage
     * @returns {Object} All preferences
     */
    loadAllPreferences() {
        try {
            const preferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
            return preferences ? JSON.parse(preferences) : {}
        } catch (error) {
            console.error('Error loading preferences from storage:', error)
            return {}
        }
    }
}