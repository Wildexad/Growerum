import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/useAuthStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализируем
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')