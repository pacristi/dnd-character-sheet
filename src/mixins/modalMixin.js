/**
 * Mixin to provide consistent modal handling functionality
 */
export const modalMixin = {
    data() {
        return {
            showModal: false,
            editingItem: null
        }
    },
    methods: {
        closeModal() {
            this.showModal = false
            this.editingItem = null
        },
        openModal(item = null) {
            this.editingItem = item ? { ...item } : null
            this.showModal = true
        }
    }
}