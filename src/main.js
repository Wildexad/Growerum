import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/useAuthStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Ждём проверки сессии ПЕРЕД монтированием,
// чтобы роутер знал статус аутентификации при первом переходе
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})