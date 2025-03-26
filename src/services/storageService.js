/**
 * Improved Storage Service
 * Handles all localStorage operations with proper error handling
 */
import { ERROR_CODES, tryCatch } from '../utils/errorHandling';

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
     * @throws {AppError} If saving fails
     */
    save(data) {
        return tryCatch(
            () => {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
                return true;
            },
            ERROR_CODES.STORAGE_SAVE_ERROR,
            `Error saving data to ${this.storageKey}`
        );
    }

    /**
     * Load data from localStorage
     * @returns {*} Parsed data or defaultValue if not found
     * @throws {AppError} If loading fails
     */
    load() {
        return tryCatch(
            () => {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : this.defaultValue;
            },
            ERROR_CODES.STORAGE_LOAD_ERROR,
            `Error loading data from ${this.storageKey}`
        );
    }

    /**
     * Clear data from localStorage
     * @returns {boolean} Success status
     * @throws {AppError} If clearing fails
     */
    clear() {
        return tryCatch(
            () => {
                localStorage.removeItem(this.storageKey);
                return true;
            },
            ERROR_CODES.STORAGE_DELETE_ERROR,
            `Error clearing data from ${this.storageKey}`
        );
    }

    /**
     * Check if localStorage has data for this key
     * @returns {boolean} True if data exists
     */
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage usage info
     */
    getStorageInfo() {
        let totalStorage = 0;
        let keyStorage = 0;

        // Calculate total localStorage usage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalStorage += (key.length + value.length) * 2; // UTF-16 characters = 2 bytes
        }

        // Calculate storage used by this key
        const value = localStorage.getItem(this.storageKey);
        if (value) {
            keyStorage = (this.storageKey.length + value.length) * 2;
        }

        return {
            totalUsage: totalStorage,
            keyUsage: keyStorage,
            // Estimated quota (around 5MB for most browsers)
            estimatedQuota: 5 * 1024 * 1024,
            usagePercentage: (totalStorage / (5 * 1024 * 1024)) * 100
        };
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
     * @throws {AppError} If saving fails
     */
    saveCharacter(characterData) {
        return tryCatch(
            () => {
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
            },
            ERROR_CODES.STORAGE_SAVE_ERROR,
            'Error saving character data'
        );
    }

    /**
     * Load character data from localStorage
     * @returns {Object} Character data
     * @throws {AppError} If loading fails
     */
    loadCharacter() {
        return tryCatch(
            () => {
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
            },
            ERROR_CODES.STORAGE_LOAD_ERROR,
            'Error loading character data'
        );
    }

    /**
     * Cleans up old portraits from localStorage to free space
     * @returns {boolean} Success status
     */
    cleanupOldPortraits() {
        return tryCatch(
            () => {
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
            },
            ERROR_CODES.STORAGE_DELETE_ERROR,
            'Error cleaning up old portraits'
        );
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
        return tryCatch(
            () => {
                const preferences = this.load();
                preferences[key] = value;
                return this.save(preferences);
            },
            ERROR_CODES.STORAGE_SAVE_ERROR,
            `Error saving preference ${key}`
        );
    }
}

// Export service instances
export const characterStorage = new CharacterStorageService();
export const sessionStorage = new StorageService(STORAGE_KEYS.SESSIONS, []);
export const preferencesStorage = new PreferencesStorageService();