<template>
  <div class="profile-page">
    <!-- Auth form (not logged in) -->
    <div v-if="!authStore.isAuthenticated" class="auth-container">
      <div class="auth-card">
        <h2>{{ isLoginMode ? 'Вход в систему' : 'Регистрация' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required placeholder="example@mail.com" />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input type="password" id="password" v-model="password" required placeholder="******" />
          </div>

          <button type="submit" :disabled="isLoading" class="btn-primary">
            {{ isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться') }}
          </button>
        </form>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <div class="toggle-mode">
          <span v-if="isLoginMode">Нет аккаунта?</span>
          <span v-else>Уже есть аккаунт?</span>
          <button @click="toggleMode" class="btn-link">
            {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Profile (logged in) -->
    <div v-else class="profile-content">
      <div class="page-header">
        <h1 class="page-title">Профиль</h1>
        <p class="page-subtitle">Настройки и информация</p>
      </div>

      <div class="profile-grid">
        <!-- Left column -->
        <div class="profile-left">
          <UserCard
            :email="authStore.user?.email || 'почта@example.com'"
            :display-name="authStore.user?.user_metadata?.name || 'Имя'"
            :stats="userStats"
          />
          <SettingsCard @navigate="handleSettingsNav" />
        </div>

        <!-- Right column -->
        <div class="profile-right">
          <AboutCard />
          <LogoutCard @logout="handleSignOut" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import UserCard from '@/components/profile/UserCard.vue'
import SettingsCard from '@/components/profile/SettingsCard.vue'
import AboutCard from '@/components/profile/AboutCard.vue'
import LogoutCard from '@/components/profile/LogoutCard.vue'

const authStore = useAuthStore()

// --- Profile data ---
const userStats = reactive({ diagnoses: 12, plants: 8, days: 15 })

const handleSignOut = async () => {
  try {
    await authStore.signOut()
  } catch (err) {
    console.error('Ошибка выхода:', err.message)
  }
}

const handleSettingsNav = (target) => {
  console.log('Navigate to:', target)
}

// --- Auth form ---
const email = ref('')
const password = ref('')
const isLoginMode = ref(true)
const isLoading = ref(false)
const error = ref('')

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  error.value = ''
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  try {
    if (isLoginMode.value) {
      await authStore.signIn(email.value, password.value)
    } else {
      await authStore.signUp(email.value, password.value)
      alert('Регистрация успешна! Проверьте почту для подтверждения.')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ===== Auth form ===== */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 13px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.2s;
  margin-top: 4px;
}

.btn-primary:hover {
  background: #43a047;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-msg {
  color: #e74c3c;
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
}

.toggle-mode {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: #888;
}

.btn-link {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
  text-decoration: underline;
}

/* ===== Profile content ===== */
.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
  margin: 4px 0 0;
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