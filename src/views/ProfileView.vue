<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">Профиль</h1>
      <p class="page-subtitle">Настройки и информация</p>
    </div>

    <div class="profile-grid">
      <div class="profile-left">
        <UserCard
          :email="authStore.user?.email || 'почта@example.com'"
          :display-name="authStore.user?.user_metadata?.name || 'Имя'"
          :stats="userStats"
        />
        <SettingsCard @navigate="handleSettingsNav" />
      </div>

      <div class="profile-right">
        <AboutCard />
        <LogoutCard @logout="handleSignOut" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import UserCard from '@/components/profile/UserCard.vue'
import SettingsCard from '@/components/profile/SettingsCard.vue'
import AboutCard from '@/components/profile/AboutCard.vue'
import LogoutCard from '@/components/profile/LogoutCard.vue'

const authStore = useAuthStore()
const router = useRouter()

const userStats = reactive({ diagnoses: 12, plants: 8, days: 15 })

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (err) {
    console.error('Ошибка выхода:', err.message)
  }
}

const handleSettingsNav = (target) => {
  console.log('Navigate to:', target)
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 48px;
}

.profile-page > div {
  max-width: 1280px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.page-subtitle {
  font-size: 20px;
  color: #6b7280;
  margin: 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  align-items: start;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>