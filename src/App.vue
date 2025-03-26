<template>
    <AppHeader />
    <main>
      <router-view />
    </main>
    <Notification ref="notification" />
  </template>
  
  <script>
  import AppHeader from '@/components/AppHeader.vue'
  import Notification from '@/components/ui/Notification.vue'
  
  export default {
    name: 'App',
    components: {
      AppHeader,
      Notification
    },
    provide() {
      return {
        showNotification: this.showNotification
      }
    },
    methods: {
      showNotification(message, type = 'info') {
        this.$refs.notification.show(message, type)
      }
    }
  }
  </script>
  
  <style>
  #app {
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text);
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }
  </style>