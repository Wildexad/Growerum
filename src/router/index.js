import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DiagnosisView from '@/views/DiagnosisView.vue'
import HistoryView from '@/views/HistoryView.vue'
import ReferenceView from '@/views/ReferenceView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  { path: '/', redirect: '/profile' },
  { path: '/home', component: HomeView },
  { path: '/diagnosis', component: DiagnosisView },
  { path: '/history', component: HistoryView },
  { path: '/reference', component: ReferenceView },
  { path: '/profile', component: ProfileView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
