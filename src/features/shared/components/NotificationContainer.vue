<!-- 
  Notification Container Component
  Displays notifications from the notification service
-->
<template>
    <div class="notification-container">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <div class="notification-content">{{ notification.message }}</div>
          <button
            @click="dismissNotification(notification.id)"
            class="notification-close"
            aria-label="Cerrar notificación"
          >
            &times;
          </button>
        </div>
      </TransitionGroup>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { notificationService } from '@/services/notificationService';
  
  export default {
    name: 'NotificationContainer',
    setup() {
      // Get notifications from the service
      const notifications = ref([]);
      
      /**
       * Update notifications from the service
       */
      const updateNotifications = () => {
        notifications.value = notificationService.getNotifications();
      };
      
      /**
       * Dismiss a notification
       * @param {string} id - Notification ID
       */
      const dismissNotification = (id) => {
        notificationService.hide(id);
        updateNotifications();
      };
      
      // Set up event listeners for notifications
      onMounted(() => {
        // Initial update
        updateNotifications();
        
        // Set up interval to check for new notifications
        const interval = setInterval(updateNotifications, 500);
        
        // Clean up interval on unmount
        onUnmounted(() => {
          clearInterval(interval);
        });
      });
      
      return {
        notifications,
        dismissNotification
      };
    }
  };
  </script>
  
  <style scoped>
  .notification-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .notification {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: 4px solid;
  }
  
  .notification.info {
    border-left-color: #3498db;
  }
  
  .notification.success {
    border-left-color: #2ecc71;
  }
  
  .notification.warning {
    border-left-color: #f39c12;
  }
  
  .notification.error {
    border-left-color: #e74c3c;
  }
  
  .notification-content {
    flex: 1;
    font-size: 0.875rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    padding: 0 0 0 0.75rem;
    cursor: pointer;
    color: #666;
  }
  
  .notification-close:hover {
    color: #333;
  }
  
  /* Transitions */
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from {
    opacity: 0;
    transform: translateX(50px);
  }
  
  .notification-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  </style>