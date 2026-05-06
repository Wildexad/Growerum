<template>
  <div class="profile-view">
    <div class="profile-container">
      <!-- Header -->
      <div class="page-header">
        <h1>Профиль</h1>
        <p>Настройки и информация</p>
      </div>

      <!-- Profile Grid -->
      <div class="profile-grid">
        <!-- Left Column -->
        <div class="profile-left">
          <!-- User Card -->
          <div class="user-card">
            <div class="user-header">
              <div class="user-avatar">
                <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div class="user-info">
                <h2>{{ userName }}</h2>
                <p class="user-email">
                  <svg class="mail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {{ userEmail }}
                </p>
              </div>
            </div>

            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-number">12</div>
                <div class="stat-label">Диагностик</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">8</div>
                <div class="stat-label">Растений</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">15</div>
                <div class="stat-label">Дней</div>
              </div>
            </div>
          </div>

          <!-- Settings Card -->
          <div class="settings-card">
            <h3>Настройки</h3>

            <button class="settings-item">
              <svg class="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <div class="settings-text">
                <div class="settings-title">Уведомления</div>
                <div class="settings-subtitle">Управление оповещениями</div>
              </div>
            </button>

            <button class="settings-item">
              <svg class="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <div class="settings-text">
                <div class="settings-title">Общие настройки</div>
                <div class="settings-subtitle">Язык, тема, регион</div>
              </div>
            </button>

            <button class="settings-item">
              <svg class="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <div class="settings-text">
                <div class="settings-title">Помощь и поддержка</div>
                <div class="settings-subtitle">FAQ и обратная связь</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Right Column -->
        <div class="profile-right">
          <!-- About Card -->
          <div class="about-card">
            <h3>О приложении</h3>
            <p class="version">Версия 1.0.0</p>
            <p class="description">
              Приложение для диагностики проблем комнатных растений с использованием
              современных методов анализа симптомов.
            </p>
          </div>

          <!-- Logout Card -->
          <button class="logout-card" @click="handleSignOut">
            <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            <span>Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => {
  return authStore.user?.user_metadata?.name || 'Пользователь'
})

const userEmail = computed(() => {
  return authStore.user?.email || 'email@example.com'
})

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (err) {
    console.error('Ошибка выхода:', err.message)
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  padding: 3rem;
}

.profile-container {
  max-width: 1024px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
}

.page-header p {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
}

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* User Card */
.user-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.user-avatar {
  width: 6rem;
  height: 6rem;
  background: linear-gradient(135deg, #4CAF50 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leaf-icon {
  width: 3.5rem;
  height: 3.5rem;
  color: white;
}

.user-info h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.user-email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.mail-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Settings Card */
.settings-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  padding: 1.5rem 2rem;
  margin: 0;
  border-bottom: 1px solid #f3f4f6;
}

.settings-item {
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: none;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background-color: #f9fafb;
}

.settings-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #6b7280;
  flex-shrink: 0;
}

.settings-text {
  flex: 1;
}

.settings-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
}

.settings-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* About Card */
.about-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.about-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.version {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}

.description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.625;
  margin: 0;
}

/* Logout Card */
.logout-card {
  width: 100%;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.logout-card:hover {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.logout-icon {
  width: 2rem;
  height: 2rem;
  color: #dc2626;
}

.logout-card span {
  font-size: 1.125rem;
  color: #dc2626;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-view {
    padding: 2rem;
  }
}
</style>