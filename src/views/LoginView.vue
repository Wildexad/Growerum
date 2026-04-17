<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{ isLoginMode ? 'Вход в систему' : 'Регистрация' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-group" v-if="!isLoginMode">
            <label for="name">Имя (отображаемое в профиле)</label>
            <input type="text" id="name" v-model="name" :required="!isLoginMode" placeholder="Иван Иванов" />
          </div>

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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
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
      await authStore.signUp(email.value, password.value, name.value)
      alert('Регистрация прошла успешно!')
    }
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  width: 100%;
  padding: 16px;
}

.auth-card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
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
  box-sizing: border-box;
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
</style>
