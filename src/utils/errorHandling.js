/**
 * Error Handling Utility
 * Provides consistent error handling for the application
 */
export class AppError extends Error {
    /**
     * Create a new application error
     * @param {string} message - Error message
     * @param {string} code - Error code
     * @param {*} originalError - Original error that caused this one
     */
    constructor(message, code = 'UNKNOWN_ERROR', originalError = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.originalError = originalError;

        // Capture stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }

    /**
     * Get a formatted error message including code
     * @returns {string} Formatted error message
     */
    getFormattedMessage() {
        return `${this.code}: ${this.message}`;
    }

    /**
     * Get the full error details including original error
     * @returns {Object} Error details
     */
    getDetails() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            stack: this.stack,
            originalError: this.originalError
        };
    }
}

// Error codes for different scenarios
export const ERROR_CODES = {
    // Storage errors
    STORAGE_SAVE_ERROR: 'STORAGE_SAVE_ERROR',
    STORAGE_LOAD_ERROR: 'STORAGE_LOAD_ERROR',
    STORAGE_DELETE_ERROR: 'STORAGE_DELETE_ERROR',
    STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',

    // File handling errors
    FILE_READ_ERROR: 'FILE_READ_ERROR',
    FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
    FILE_INVALID_FORMAT: 'FILE_INVALID_FORMAT',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',

    // Data errors
    DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
    DATA_PARSING_ERROR: 'DATA_PARSING_ERROR',

    // Character errors
    CHARACTER_NOT_FOUND: 'CHARACTER_NOT_FOUND',
    CHARACTER_IMPORT_ERROR: 'CHARACTER_IMPORT_ERROR',
    CHARACTER_EXPORT_ERROR: 'CHARACTER_EXPORT_ERROR'
};

/**
 * Try to execute a function and handle errors
 * @param {Function} fn - Function to execute
 * @param {string} errorCode - Error code to use if function throws
 * @param {string} errorMessage - Error message to use if function throws
 * @returns {*} Result of the function or throws AppError
 */
export function tryCatch(fn, errorCode, errorMessage) {
    try {
        return fn();
    } catch (error) {
        throw new AppError(
            errorMessage || error.message,
            errorCode || ERROR_CODES.UNKNOWN_ERROR,
            error
        );
    }
}

/**
 * Execute an async function and handle errors
 * @param {Function} fn - Async function to execute
 * @param {string} errorCode - Error code to use if function throws
 * @param {string} errorMessage - Error message to use if function throws
 * @returns {Promise<*>} Promise with result or rejects with AppError
 */
export async function tryCatchAsync(fn, errorCode, errorMessage) {
    try {
        return await fn();
    } catch (error) {
        throw new AppError(
            errorMessage || error.message,
            errorCode || ERROR_CODES.UNKNOWN_ERROR,
            error
        );
    }
}