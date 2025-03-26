/**
 * Notification Service
 * Provides a consistent API for showing notifications
 */
import { reactive } from 'vue';

// Notification types
export const NotificationType = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier
 * @property {string} message - Notification message
 * @property {string} type - Notification type (info, success, warning, error)
 * @property {number} duration - Duration in milliseconds (0 for no auto-hide)
 */

/**
 * Notification Service Class
 * Manages application notifications
 */
class NotificationService {
    constructor() {
        this.state = reactive({
            notifications: [],
            nextId: 1
        });
    }

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, success, warning, error)
     * @param {number} duration - Duration in milliseconds (0 for no auto-hide)
     * @returns {string} Notification ID
     */
    show(message, type = NotificationType.INFO, duration = 5000) {
        const id = `notification-${this.state.nextId++}`;

        const notification = {
            id,
            message,
            type,
            duration
        };

        this.state.notifications.push(notification);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    /**
     * Show a success notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     * @returns {string} Notification ID
     */
    success(message, duration = 5000) {
        return this.show(message, NotificationType.SUCCESS, duration);
    }

    /**
     * Show an info notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     * @returns {string} Notification ID
     */
    info(message, duration = 5000) {
        return this.show(message, NotificationType.INFO, duration);
    }

    /**
     * Show a warning notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     * @returns {string} Notification ID
     */
    warning(message, duration = 5000) {
        return this.show(message, NotificationType.WARNING, duration);
    }

    /**
     * Show an error notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     * @returns {string} Notification ID
     */
    error(message, duration = 5000) {
        return this.show(message, NotificationType.ERROR, duration);
    }

    /**
     * Hide a notification by ID
     * @param {string} id - Notification ID
     */
    hide(id) {
        const index = this.state.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.state.notifications.splice(index, 1);
        }
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.state.notifications = [];
    }

    /**
     * Get all active notifications
     * @returns {Array<Notification>} Array of active notifications
     */
    getNotifications() {
        return this.state.notifications;
    }
}

// Create and export a singleton instance
const notificationServiceInstance = new NotificationService();
export const notificationService = notificationServiceInstance;