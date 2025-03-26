/**
 * Mixin to provide character-related API functionality
 */
export const characterApiMixin = {
    methods: {
        /**
         * Calculates proficiency bonus based on character level
         * @param {Number} level - Character level
         * @returns {Number} Proficiency bonus
         */
        calculateProficiencyBonus(level) {
            return Math.floor((level - 1) / 4) + 2
        },

        /**
         * Calculates ability modifier from ability score
         * @param {Number} score - Ability score
         * @returns {Number} Ability modifier
         */
        calculateAbilityModifier(score) {
            return Math.floor((score - 10) / 2)
        },

        /**
         * Formats ability modifier for display (with + or - sign)
         * @param {Number} modifier - Ability modifier value
         * @returns {String} Formatted modifier
         */
        formatModifier(modifier) {
            return modifier >= 0 ? `+${modifier}` : `${modifier}`
        }
    }
}