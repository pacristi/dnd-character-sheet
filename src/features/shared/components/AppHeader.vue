<!-- 
  App Header Component
  The main navigation header for the application
-->
<template>
    <header class="app-header">
      <div class="header-container">
        <div class="logo">
          <img src="@/assets/images/d20.png" alt="D&D Logo" class="logo-image">
          <span class="logo-text">D&D 5E</span>
        </div>
        
        <nav class="main-nav">
          <ul class="nav-links">
            <li>
              <router-link :to="{ name: 'CharacterSheet' }" class="nav-link">
                Ficha de Personaje
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'SessionNotes' }" class="nav-link">
                Notas de Sesión
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="header-actions">
          <Button 
            variant="text" 
            @click="toggleDarkMode"
            :aria-label="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <template v-if="isDarkMode">🌞</template>
            <template v-else>🌙</template>
          </Button>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Button } from '@/features/shared';
  
  export default {
    name: 'AppHeader',
    components: {
      Button
    },
    setup() {
      const isDarkMode = ref(false);
      
      /**
       * Toggle dark mode
       */
      const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
        
        // Apply dark mode class to body
        if (isDarkMode.value) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        
        // Save preference
        localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
      };
      
      // Initialize dark mode from saved preference
      const initDarkMode = () => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
          isDarkMode.value = true;
          document.body.classList.add('dark-mode');
        }
      };
      
      // Call initialization on mounted
      initDarkMode();
      
      return {
        isDarkMode,
        toggleDarkMode
      };
    }
  };
  </script>
  
  <style scoped>
  .app-header {
    background-color: var(--color-primary);
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1.5rem;
  }
  
  .logo-image {
    height: 2rem;
    width: auto;
  }
  
  .main-nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .nav-link:hover {
    background-color: var(--color-primary-dark);
  }
  
  .nav-link.router-link-active {
    background-color: var(--color-primary-dark);
    font-weight: bold;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .header-container {
      flex-direction: column;
      padding: 0.5rem;
      gap: 0.5rem;
    }
    
    .main-nav {
      width: 100%;
    }
    
    .nav-links {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .nav-links {
      flex-direction: column;
      align-items: center;
    }
    
    .logo-text {
      font-size: 1.25rem;
    }
  }
  </style>