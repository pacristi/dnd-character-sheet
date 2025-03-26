<!--
  Notifications Provider Component
  A wrapper component that provides notification methods to all child components
-->
<template>
    <div>
      <slot></slot>
    </div>
  </template>
  
  <script>
  import { defineComponent, provide } from 'vue';
  import { notificationService } from '@/services/notificationService';
  
  export default defineComponent({
    name: 'NotificationsProvider',
    setup() {
      // Notification helper methods
      const showNotification = (message, type = 'info') => {
        notificationService[type](message);
      };
      
      const showSuccess = (message) => {
        notificationService.success(message);
      };
      
      const showError = (message) => {
        notificationService.error(message);
      };
      
      const showWarning = (message) => {
        notificationService.warning(message);
      };
      
      const showInfo = (message) => {
        notificationService.info(message);
      };
      
      // Provide notification methods to child components
      provide('showNotification', showNotification);
      provide('showSuccess', showSuccess);
      provide('showError', showError);
      provide('showWarning', showWarning);
      provide('showInfo', showInfo);
      
      return {};
    }
  });
  </script>