/**
 * Storage Service
 * Handles all localStorage operations with error handling and clean abstractions
 */

// Storage keys for different data types
const STORAGE_KEYS = {
    CHARACTER: 'dnd-character-data',
    PORTRAIT: 'dnd-character-portrait',
    SESSIONS: 'dnd-session-notes',
    PREFERENCES: 'dnd-user-preferences'
};

/**
 * Base Storage Service class
 * Provides methods for saving and loading data from localStorage
 */
class StorageService {
    /**
     * @param {string} storageKey - localStorage key to use
     * @param {*} defaultValue - Default value to return if storage is empty
     */
    constructor(storageKey, defaultValue = null) {
        this.storageKey = storageKey;
        this.defaultValue = defaultValue;
    }

    /**
     * Save data to localStorage
     * @param {*} data - Data to save
     * @returns {boolean} Success status
     */
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data to ${this.storageKey}:`, error);
            return false;
        }
    }

    /**
     * Load data from localStorage
     * @returns {*} Parsed data or defaultValue if not found
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.defaultValue;
        } catch (error) {
            console.error(`Error loading data from ${this.storageKey}:`, error);
            return this.defaultValue;
        }
    }

    /**
     * Clear data from localStorage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error(`Error clearing data from ${this.storageKey}:`, error);
            return false;
        }
    }
}

/**
 * Character Storage Service
 * Handles saving and loading character data with special handling for portraits
 */
class CharacterStorageService extends StorageService {
    constructor() {
        super(STORAGE_KEYS.CHARACTER, {});
        this.portraitKey = STORAGE_KEYS.PORTRAIT;
    }

    /**
     * Save character data to localStorage
     * @param {Object} characterData - Character data to save
     * @returns {boolean} Success status
     */
    saveCharacter(characterData) {
        try {
            // Handle portrait data separately due to size
            const portraitData = characterData.portrait;
            const characterDataCopy = { ...characterData };
            delete characterDataCopy.portrait;

            // Save character data
            localStorage.setItem(this.storageKey, JSON.stringify(characterDataCopy));

            // Save portrait if available
            if (portraitData) {
                localStorage.setItem(this.portraitKey, portraitData);
                this.cleanupOldPortraits();
            }

            return true;
        } catch (error) {
            console.error('Error saving character data:', error);
            return false;
        }
    }

    /**
     * Load character data from localStorage
     * @returns {Object} Character data
     */
    loadCharacter() {
        try {
            // Load character data
            const characterData = localStorage.getItem(this.storageKey);
            if (!characterData) return this.defaultValue;

            // Parse character data
            const parsedData = JSON.parse(characterData);

            // Add portrait data if available
            const portraitData = localStorage.getItem(this.portraitKey);
            if (portraitData) {
                parsedData.portrait = portraitData;
            }

            return parsedData;
        } catch (error) {
            console.error('Error loading character data:', error);
            return this.defaultValue;
        }
    }

    /**
     * Cleans up old portraits from localStorage to free space
     */
    cleanupOldPortraits() {
        try {
            // Find all portrait keys (in case we have multiple portraits stored)
            const portraitKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.portraitKey)) {
                    portraitKeys.push(key);
                }
            }

            // If we have more than one portrait, remove the old ones
            if (portraitKeys.length > 1) {
                // Sort by creation time if available, otherwise just remove random ones
                portraitKeys.slice(0, portraitKeys.length - 1).forEach(key => {
                    localStorage.removeItem(key);
                });
            }

            return true;
        } catch (error) {
            console.error('Error cleaning up old portraits:', error);
            return false;
        }
    }
}

/**
 * Preferences Storage Service
 * Handles user preferences
 */
class PreferencesStorageService extends StorageService {
    constructor() {
        super(STORAGE_KEYS.PREFERENCES, {});
    }

    /**
     * Get a specific preference value
     * @param {string} key - Preference key
     * @param {*} defaultValue - Default value to return if not found
     * @returns {*} Preference value or default
     */
    getPreference(key, defaultValue = null) {
        const preferences = this.load();
        return key in preferences ? preferences[key] : defaultValue;
    }

    /**
     * Set a specific preference value
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     * @returns {boolean} Success status
     */
    setPreference(key, value) {
        try {
            const preferences = this.load();
            preferences[key] = value;
            return this.save(preferences);
        } catch (error) {
            console.error(`Error saving preference ${key}:`, error);
            return false;
        }
    }
}

// Export service instances
export const characterStorage = new CharacterStorageService();
export const sessionStorage = new StorageService(STORAGE_KEYS.SESSIONS, []);
export const preferencesStorage = new PreferencesStorageService();