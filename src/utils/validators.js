/**
 * Validation Utilities
 * Provides validation functions for forms and data
 */
import { ref } from 'vue';

/**
 * Validate that a value is not empty
 * @param {*} value - Value to validate
 * @param {string} [message='This field is required'] - Custom error message
 * @returns {true|string} True if valid, error message if invalid
 */
export function required(value, message = 'Este campo es obligatorio') {
    // Check for different empty values
    const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);

    return isEmpty ? message : true;
}

/**
 * Validate minimum length
 * @param {number} min - Minimum length
 * @param {string} [message] - Custom error message
 * @returns {Function} Validation function
 */
export function minLength(min, message) {
    return (value) => {
        if (value === undefined || value === null) return true;

        const length = typeof value === 'string' ? value.length :
            Array.isArray(value) ? value.length : String(value).length;

        return length >= min ? true : message || `Debe tener al menos ${min} caracteres`;
    };
}

/**
 * Validate maximum length
 * @param {number} max - Maximum length
 * @param {string} [message] - Custom error message
 * @returns {Function} Validation function
 */
export function maxLength(max, message) {
    return (value) => {
        if (value === undefined || value === null) return true;

        const length = typeof value === 'string' ? value.length :
            Array.isArray(value) ? value.length : String(value).length;

        return length <= max ? true : message || `Debe tener máximo ${max} caracteres`;
    };
}

/**
 * Validate minimum value
 * @param {number} min - Minimum value
 * @param {string} [message] - Custom error message
 * @returns {Function} Validation function
 */
export function minValue(min, message) {
    return (value) => {
        if (value === undefined || value === null || value === '') return true;

        const numValue = Number(value);
        if (isNaN(numValue)) return 'Debe ser un número válido';

        return numValue >= min ? true : message || `El valor mínimo es ${min}`;
    };
}

/**
 * Validate maximum value
 * @param {number} max - Maximum value
 * @param {string} [message] - Custom error message
 * @returns {Function} Validation function
 */
export function maxValue(max, message) {
    return (value) => {
        if (value === undefined || value === null || value === '') return true;

        const numValue = Number(value);
        if (isNaN(numValue)) return 'Debe ser un número válido';

        return numValue <= max ? true : message || `El valor máximo es ${max}`;
    };
}

/**
 * Validate that a value is an integer
 * @param {string} [message='Debe ser un número entero'] - Custom error message
 * @returns {Function} Validation function
 */
export function integer(message = 'Debe ser un número entero') {
    return (value) => {
        if (value === undefined || value === null || value === '') return true;

        const numValue = Number(value);
        if (isNaN(numValue)) return 'Debe ser un número válido';

        return Number.isInteger(numValue) ? true : message;
    };
}

/**
 * Validate against a regular expression pattern
 * @param {RegExp} pattern - Regular expression to match
 * @param {string} [message='Formato inválido'] - Custom error message
 * @returns {Function} Validation function
 */
export function pattern(pattern, message = 'Formato inválido') {
    return (value) => {
        if (value === undefined || value === null || value === '') return true;

        return pattern.test(String(value)) ? true : message;
    };
}

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions to combine
 * @returns {Function} Combined validation function
 */
export function compose(...validators) {
    return (value) => {
        for (const validator of validators) {
            const result = validator(value);
            if (result !== true) return result;
        }
        return true;
    };
}

/**
 * Character-specific validators
 */
export const characterValidators = {
    /**
     * Validate ability score
     * @param {*} value - Ability score
     * @returns {true|string} True if valid, error message if invalid
     */
    abilityScore: compose(
        required('La puntuación de habilidad es obligatoria'),
        integer('La puntuación debe ser un número entero'),
        minValue(1, 'La puntuación mínima es 1'),
        maxValue(30, 'La puntuación máxima es 30')
    ),

    /**
     * Validate character level
     * @param {*} value - Character level
     * @returns {true|string} True if valid, error message if invalid
     */
    level: compose(
        required('El nivel es obligatorio'),
        integer('El nivel debe ser un número entero'),
        minValue(1, 'El nivel mínimo es 1'),
        maxValue(20, 'El nivel máximo es 20')
    ),

    /**
     * Validate character name
     * @param {*} value - Character name
     * @returns {true|string} True if valid, error message if invalid
     */
    name: compose(
        required('El nombre es obligatorio'),
        maxLength(50, 'El nombre no puede exceder los 50 caracteres')
    ),

    /**
     * Validate hit points
     * @param {*} value - Hit points
     * @returns {true|string} True if valid, error message if invalid
     */
    hitPoints: compose(
        required('Los puntos de vida son obligatorios'),
        integer('Los puntos de vida deben ser un número entero'),
        minValue(0, 'Los puntos de vida no pueden ser negativos')
    )
};

/**
 * Form validation helper functions
 */

/**
 * Validate an entire form
 * @param {Object} form - Form data
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Validation results
 */
export function validateForm(form, validationRules) {
    const errors = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(validationRules)) {
        const result = validator(form[field]);
        if (result !== true) {
            errors[field] = result;
            isValid = false;
        }
    }

    return { isValid, errors };
}

/**
 * Create a form validator composable
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Form validation utilities
 */
export function useFormValidation(initialValues, validationRules) {
    const values = ref({ ...initialValues });
    const errors = ref({});
    const isDirty = ref({});

    // Validate a specific field
    const validateField = (field) => {
        const validator = validationRules[field];
        if (!validator) return true;

        const result = validator(values.value[field]);
        if (result !== true) {
            errors.value[field] = result;
            return false;
        } else {
            errors.value[field] = '';
            return true;
        }
    };

    // Validate all fields
    const validate = () => {
        let isValid = true;

        for (const field in validationRules) {
            isDirty.value[field] = true;
            if (!validateField(field)) {
                isValid = false;
            }
        }

        return isValid;
    };

    // Handle field change
    const handleChange = (field, value) => {
        values.value[field] = value;
        isDirty.value[field] = true;
        validateField(field);
    };

    return {
        values,
        errors,
        isDirty,
        validate,
        validateField,
        handleChange
    };
}