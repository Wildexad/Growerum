import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import HomeView from '@/views/HomeView.vue'
import DiagnosisView from '@/views/DiagnosisView.vue'
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult.vue'
import HistoryView from '@/views/HistoryView.vue'
import ReferenceView from '@/views/ReferenceView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/diagnosis', component: DiagnosisView, meta: { requiresAuth: true } },
  { path: '/diagnosis/result', component: DiagnosisResult, meta: { requiresAuth: true } },
  { path: '/history', component: HistoryView, meta: { requiresAuth: true } },
  { path: '/reference', component: ReferenceView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Ждём пока Pinia инициализируется (loading флаг)
  if (authStore.loading) return true

  const isAuth = authStore.isAuthenticated

  // Защищённые маршруты — нужен вход
  if (to.meta.requiresAuth && !isAuth) {
    return { path: '/login' }
  }

  // Страница логина — только для гостей
  if (to.meta.guestOnly && isAuth) {
    return { path: '/profile' }
  }

  return true
})

export default router
