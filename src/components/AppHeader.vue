<template>
    <nav class="top-navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <img src="@/assets/images/d20.png" alt="D&D 5e Logo" />
          D&D 5E
        </div>
        <ul class="nav-links">
          <li :class="{ active: $route.path === '/' }">
            <router-link to="/">Ficha de Personaje</router-link>
          </li>
          <li :class="{ active: $route.path === '/session-notes' }">
            <router-link to="/session-notes">Notas de Sesión</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AppHeader'
  }
  </script>
  
  <style scoped>
  .top-navbar {
    background-color: var(--color-primary);
    color: white;
    padding: 0;
    margin: 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  
  .nav-logo {
    font-size: 24px;
    font-weight: bold;
    padding: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .nav-logo img {
    width: 30px;
    height: 30px;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-links li {
    margin: 0;
    padding: 0;
  }
  
  .nav-links a {
    display: block;
    color: white;
    text-decoration: none;
    padding: 15px 20px;
    transition: background-color 0.3s;
  }
  
  .nav-links a:hover {
    background-color: var(--color-primary-dark);
  }
  
  .nav-links li.active {
    background-color: var(--color-primary-dark);
    font-weight: bold;
  }
  </style>