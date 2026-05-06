<template>
  <div class="home-view">
    <div class="home-container">
      <!-- Header -->
      <div class="header">
        <div class="header-text">
          <h1>Здравствуйте, {{ userName }}!</h1>
          <p>Как ваши растения сегодня?</p>
        </div>
        <div class="header-icon">
          <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
      </div>

      <!-- Tip of the Day -->
      <div class="tip-card">
        <div class="tip-icon">
          <svg class="lightbulb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
        </div>
        <div class="tip-content">
          <h3>Совет дня</h3>
          <p>{{ tipOfTheDay }}</p>
        </div>
      </div>

      <!-- Main Actions Grid -->
      <div class="actions-grid">
        <!-- Start Diagnosis -->
        <router-link to="/diagnosis" class="action-card diagnosis-card">
          <div class="card-icon white-icon">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <div class="card-text">
            <h2>Начать диагностику</h2>
            <p>Определите проблему вашего растения</p>
          </div>
        </router-link>

        <!-- History -->
        <router-link to="/history" class="action-card history-card">
          <div class="card-icon gray-icon">
            <svg class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="card-text-center">
            <h2>История</h2>
            <p>Просмотр прошлых диагностик</p>
          </div>
        </router-link>

        <!-- Reference -->
        <router-link to="/reference" class="action-card reference-card">
          <div class="card-icon gray-icon">
            <svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
          <div class="card-text-center">
            <h2>Справочник</h2>
            <p>Энциклопедия болезней растений</p>
          </div>
        </router-link>

        <!-- Statistics -->
        <div class="action-card stats-card">
          <h3>Быстрая статистика</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ diagnosisCount }}</div>
              <div class="stat-label">Диагностик</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ savedPlantsCount }}</div>
              <div class="stat-label">Растений<br/>спасено</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useReferenceStore } from '@/stores/useReferenceStore'
import { useDiagnosisStore } from '@/stores/useDiagnosisStore'

const authStore = useAuthStore()
const referenceStore = useReferenceStore()
const diagnosisStore = useDiagnosisStore()

const userName = computed(() => {
  return authStore.user?.user_metadata?.name || 'Пользователь'
})

const tipOfTheDay = ref('Совет дня: проверяйте влажность почвы перед поливом')
const diagnosisCount = ref(0)
const savedPlantsCount = ref(0)

onMounted(async () => {
  // Загружаем совет дня
  try {
    const tip = await referenceStore.getDailyTip()
    tipOfTheDay.value = tip
  } catch (error) {
    console.error('Ошибка загрузки совета:', error)
  }

  // Загружаем историю для статистики
  try {
    // Сначала загружаем из localStorage
    const cached = localStorage.getItem('diagnosisHistory')
    if (cached) {
      const parsedData = JSON.parse(cached)
      diagnosisCount.value = parsedData.length
      savedPlantsCount.value = Math.floor(diagnosisCount.value * 0.67)
      console.log('Статистика загружена из localStorage:', {
        диагнозов: diagnosisCount.value,
        растений: savedPlantsCount.value
      })
    }
    
    // Затем синхронизируем с Supabase
    await diagnosisStore.loadDiagnosisHistory()
    diagnosisCount.value = diagnosisStore.totalDiagnoses
    savedPlantsCount.value = Math.floor(diagnosisCount.value * 0.67)
    console.log('Статистика обновлена:', {
      диагнозов: diagnosisCount.value,
      растений: savedPlantsCount.value
    })
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  padding: 3rem;
}

.home-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.header-text h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.header-text p {
  font-size: 1.125rem;
  color: #6b7280;
}

.header-icon {
  width: 5rem;
  height: 5rem;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.leaf-icon {
  width: 3rem;
  height: 3rem;
  color: white;
}

/* Tip Card */
.tip-card {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 1px solid #dcfce7;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.tip-icon {
  width: 4rem;
  height: 4rem;
  background: #4CAF50;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lightbulb-icon {
  width: 2rem;
  height: 2rem;
  color: white;
}

.tip-content h3 {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.tip-content p {
  font-size: 1.25rem;
  color: #1f2937;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.action-card {
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.diagnosis-card {
  grid-column: span 3;
  background: #4CAF50;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
}

.diagnosis-card:hover {
  background: #45a049;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.history-card,
.reference-card {
  background: white;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.history-card:hover,
.reference-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.stats-card {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.card-icon {
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.white-icon {
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.2);
}

.gray-icon {
  width: 5rem;
  height: 5rem;
  background: #f9fafb;
}

.search-icon,
.clock-icon,
.book-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.search-icon {
  color: white;
}

.clock-icon,
.book-icon {
  color: #374151;
}

.card-text {
  flex: 1;
}

.card-text h2 {
  font-size: 1.875rem;
  margin-bottom: 0.5rem;
}

.card-text p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.card-text-center h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-text-center p {
  font-size: 0.875rem;
  color: #6b7280;
}

.stats-card h3 {
  font-size: 1.125rem;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.25rem;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
