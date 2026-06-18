import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Lädt deine router/index.ts

const app = createApp(App)

// HIER: Das hat gefehlt! Jetzt wird der Router in Vue reingehängt
app.use(router)

// Erst danach hängen wir die fertige App in die HTML-Seite ein
app.mount('#app')