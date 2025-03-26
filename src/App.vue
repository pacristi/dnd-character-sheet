<!-- 
  App Component
  The root component of the application 
-->
<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <NotificationContainer />
  </div>
</template>

<script>
import { AppHeader } from '@/features/shared/components';
import { NotificationContainer } from '@/features/shared/components';

export default {
  name: 'App',
  components: {
    AppHeader,
    NotificationContainer
  }
};
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/main.css';

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  background-color: var(--color-background);
  min-height: 100vh;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
</style>