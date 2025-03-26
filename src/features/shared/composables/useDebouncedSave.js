/**
 * A composable for debounced saving
 * Provides a debounced save function to avoid excessive saves during rapid changes
 */
import { ref } from 'vue';

/**
 * Create a debounced save function
 * @param {Function} saveFunction - The function to call for saving
 * @param {number} defaultDelay - Default delay in milliseconds
 * @returns {Object} Object containing the debouncedSave function and saveTimeout ref
 */
export function useDebouncedSave(saveFunction, defaultDelay = 1000) {
    const saveTimeout = ref(null);

    /**
     * Debounced save function
     * @param {number} delay - Delay in milliseconds
     */
    const debouncedSave = (delay = defaultDelay) => {
        // Clear existing timeout
        if (saveTimeout.value) {
            clearTimeout(saveTimeout.value);
        }

        // Set new timeout
        saveTimeout.value = setTimeout(() => {
            saveFunction();
            saveTimeout.value = null;
        }, delay);
    };

    // Return the function and timeout reference
    // Note: Cleanup should be handled by component using this composable
    return {
        debouncedSave,
        saveTimeout
    };
}