/**
 * Storage utilities for character and session data
 */

// Storage keys
const STORAGE_KEYS = {
    CHARACTER: 'dnd-character-data',
    SESSIONS: 'dnd-session-notes',
    PORTRAIT: 'dnd-character-portrait'
}

/**
 * Saves character data to localStorage
 * @param {Object} characterData - Character data to save
 */
export function saveCharacterToStorage(characterData) {
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
        }

        return true
    } catch (error) {
        console.error('Error saving character data to storage:', error)
        return false
    }
}

/**
 * Loads character data from localStorage
 * @returns {Object|null} Character data or null if not found
 */
export function loadCharacterFromStorage() {
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
}

/**
 * Saves session notes to localStorage
 * @param {Array} sessions - Session notes to save
 */
export function saveSessionsToStorage(sessions) {
    try {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
        return true
    } catch (error) {
        console.error('Error saving session notes to storage:', error)
        return false
    }
}

/**
 * Loads session notes from localStorage
 * @returns {Array|null} Session notes or null if not found
 */
export function loadSessionsFromStorage() {
    try {
        const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS)
        return sessions ? JSON.parse(sessions) : []
    } catch (error) {
        console.error('Error loading session notes from storage:', error)
        return []
    }
}

/**
 * Cleans up old portraits from localStorage to free space
 */
export function cleanupOldPortraits() {
    try {
        // Find all portrait keys (in case we have multiple portraits stored)
        const portraitKeys = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith('dnd-character-portrait')) {
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