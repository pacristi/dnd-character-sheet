
/**
 * Mixin to provide consistent save handling functionality
 * across character sheet components
 */
export const saveHandlerMixin = {
    data() {
        return {
            saveTimeout: null
        }
    },
    methods: {
        /**
         * Debounced save function to prevent excessive saves
         * @param {Number} delay - Delay in ms before saving (default: 1000)
         */
        debouncedSave(delay = 1000) {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout)
            }

            this.saveTimeout = setTimeout(() => {
                this.$store.dispatch('character/saveCharacter')
            }, delay)
        }
    },
    beforeUnmount() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout)
        }
    }
}