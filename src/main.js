/**
 * Application Entry Point
 * Sets up Vue and mounts the app to the DOM
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './core/router';
import store from './core/store';
import './assets/styles/main.css';

// Create and configure the Vue app
const app = createApp(App);

// Use plugins
app.use(store);
app.use(router);

// Mount the app
app.mount('#app');