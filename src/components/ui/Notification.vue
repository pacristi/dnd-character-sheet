<template>
    <div id="notification-container" v-if="notifications.length > 0">
      <div 
        v-for="(notification, index) in notifications" 
        :key="index" 
        class="notification"
        :class="notification.type"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(index)">&times;</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SystemNotification',
    data() {
      return {
        notifications: [],
        nextId: 0
      }
    },
    methods: {
      /**
       * Shows a notification message
       * @param {string} message - Message to display
       * @param {string} type - Type of notification (info, error)
       * @param {number} duration - Duration in milliseconds (0 for no auto-hide)
       */
      show(message, type = 'info', duration = 5000) {
        const id = this.nextId++
        const notification = { id, message, type }
        this.notifications.push(notification)
        
        // Auto-hide after duration
        if (duration > 0) {
          setTimeout(() => {
            this.removeNotificationById(id)
          }, duration)
        }
      },
      
      /**
       * Removes a notification by index
       * @param {number} index - Notification index
       */
      removeNotification(index) {
        this.notifications.splice(index, 1)
      },
      
      /**
       * Removes a notification by ID
       * @param {number} id - Notification ID
       */
      removeNotificationById(id) {
        const index = this.notifications.findIndex(n => n.id === id)
        if (index !== -1) {
          this.removeNotification(index)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  #notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
  }
  
  .notification {
    padding: 10px 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slide-in 0.3s ease-out;
  }
  
  .notification.info {
    background-color: #d4edda;
    color: #155724;
  }
  
  .notification.error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .notification button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-left: 15px;
    font-size: 18px;
    color: inherit;
    opacity: 0.7;
  }
  
  .notification button:hover {
    opacity: 1;
    background: none;
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  </style>