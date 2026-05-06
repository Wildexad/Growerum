<template>
  <div class="result-view">
    <div class="result-container">
      <!-- Close Button -->
      <div class="close-button-wrapper">
        <button class="close-button" @click="goHome">
          <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <!-- Header -->
      <div class="result-header">
        <h1>Результат диагностики</h1>
        <p>Анализ завершён</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Анализируем данные...</p>
      </div>

      <!-- Result Content -->
      <div v-else-if="diagnosis" class="result-grid">
        <!-- Left Column -->
        <div class="result-left">
          <!-- Diagnosis Card -->
          <div class="diagnosis-card">
            <div class="diagnosis-header">
              <div class="diagnosis-info">
                <h2>{{ diagnosis.name }}</h2>
                <p>{{ diagnosis.description }}</p>
              </div>
              <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>

            <!-- Confidence Indicator -->
            <div class="confidence-box">
              <div class="confidence-header">
                <span>Уверенность диагноза</span>
                <span class="confidence-value">{{ diagnosis.confidence }}%</span>
              </div>
              <div class="confidence-bar">
                <div class="confidence-fill" :style="{ width: diagnosis.confidence + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="recommendations-card">
            <h3 class="recommendations-title">
              <svg class="check-circle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Рекомендации по лечению
            </h3>
            <ol class="recommendations-list">
              <li v-for="(rec, index) in diagnosis.recommendations" :key="index" class="recommendation-item">
                <div class="rec-number">{{ index + 1 }}</div>
                <p>{{ rec }}</p>
              </li>
            </ol>
          </div>

          <!-- Explanation Accordion -->
          <div class="explanation-card">
            <button class="explanation-header" @click="showExplanation = !showExplanation">
              <span>Объяснение диагноза</span>
              <svg
                :class="['chevron-icon', { 'rotated': showExplanation }]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <transition name="slide">
              <div v-if="showExplanation" class="explanation-content">
                <p class="explanation-intro">Логическая цепочка анализа:</p>
                <ul class="explanation-list">
                  <li v-for="(exp, index) in diagnosis.explanation" :key="index" class="explanation-item">
                    <div class="bullet-point"></div>
                    <p>{{ exp }}</p>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>

        <!-- Right Column -->
        <div class="result-right">
          <!-- Save Button -->
          <button
            class="save-button"
            :class="{ 'saved': saved }"
            @click="handleSave"
            :disabled="saved"
          >
            <svg class="save-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>{{ saved ? 'Сохранено!' : 'Сохранить в историю' }}</span>
          </button>

          <!-- New Diagnosis Button -->
          <button class="new-diagnosis-button" @click="handleNewDiagnosis">
            <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span>Новая диагностика</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DiagnosisService } from '@/services/diagnosisService'
import { useDiagnosisStore } from '@/stores/useDiagnosisStore'

const router = useRouter()
const diagnosisStore = useDiagnosisStore()

const loading = ref(true)
const diagnosis = ref(null)
const showExplanation = ref(false)
const saved = ref(false)

onMounted(async () => {
  const answersJson = localStorage.getItem('diagnosisAnswers')
  if (!answersJson) {
    router.push('/')
    return
  }

  try {
    const answers = JSON.parse(answersJson)
    
    // Анализируем ответы с помощью DiagnosisService
    const result = DiagnosisService.analyze(answers)
    
    // Добавляем ответы к результату для сохранения
    result.answers = answers
    
    diagnosis.value = result
    loading.value = false
  } catch (error) {
    console.error('Ошибка анализа:', error)
    router.push('/diagnosis')
  }
})

const handleSave = async () => {
  if (!diagnosis.value) return
  
  try {
    loading.value = true
    
    // Сохраняем в Supabase через store
    await diagnosisStore.saveDiagnosis({
      disease: diagnosis.value.name,
      confidence: diagnosis.value.confidence,
      description: diagnosis.value.description,
      recommendations: diagnosis.value.recommendations,
      explanation: diagnosis.value.explanation,
      answers: diagnosis.value.answers
    })
    
    saved.value = true
    
    // Показываем сообщение если сохранено локально
    if (diagnosisStore.error) {
      console.warn(diagnosisStore.error)
    }

    setTimeout(() => {
      router.push('/history')
    }, 1000)
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка сохранения: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleNewDiagnosis = () => {
  localStorage.removeItem('diagnosisAnswers')
  router.push('/diagnosis')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result-view {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.result-container {
  width: 100%;
  max-width: 1152px;
}

/* Close Button */
.close-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.close-button {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #e5e7eb;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

/* Header */
.result-header {
  text-align: center;
  margin-bottom: 3rem;
}

.result-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
}

.result-header p {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 5rem;
  height: 5rem;
  border: 4px solid #4CAF50;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 1.25rem;
  color: #6b7280;
}

/* Result Grid */
.result-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.result-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Diagnosis Card */
.diagnosis-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.diagnosis-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.diagnosis-info h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.diagnosis-info p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.625;
  margin: 0;
}

.alert-icon {
  width: 3rem;
  height: 3rem;
  color: #f97316;
  flex-shrink: 0;
  margin-left: 1.5rem;
}

.confidence-box {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 1px solid #bbf7d0;
  border-radius: 1rem;
  padding: 1.5rem;
}

.confidence-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.confidence-header span:first-child {
  font-size: 1.125rem;
  color: #374151;
}

.confidence-value {
  font-size: 2.25rem;
  font-weight: 600;
  color: #4CAF50;
}

.confidence-bar {
  height: 0.75rem;
  background: white;
  border-radius: 9999px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease;
}

/* Recommendations Card */
.recommendations-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.recommendations-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
}

.check-circle-icon {
  width: 2rem;
  height: 2rem;
  color: #4CAF50;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  gap: 1rem;
}

.rec-number {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 600;
}

.recommendation-item p {
  font-size: 1.125rem;
  color: #374151;
  padding-top: 0.5rem;
  margin: 0;
  line-height: 1.5;
}

/* Explanation Card */
.explanation-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.explanation-header {
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.explanation-header:hover {
  background-color: #f9fafb;
}

.explanation-header span {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.chevron-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.explanation-content {
  padding: 0 2rem 2rem 2rem;
  border-top: 1px solid #f3f4f6;
}

.explanation-intro {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 1.5rem 0;
}

.explanation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explanation-item {
  display: flex;
  gap: 1rem;
}

.bullet-point {
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #4CAF50;
  border-radius: 50%;
  margin-top: 0.75rem;
}

.explanation-item p {
  font-size: 1.125rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

/* Save Button */
.save-button {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.save-button:hover:not(:disabled) {
  background-color: #45a049;
}

.save-button.saved {
  background-color: #16a34a;
}

.save-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.save-button span {
  font-size: 1.25rem;
  font-weight: 500;
}

/* New Diagnosis Button */
.new-diagnosis-button {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.new-diagnosis-button:hover {
  border-color: #d1d5db;
}

.refresh-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.new-diagnosis-button span {
  font-size: 1.25rem;
  font-weight: 500;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Responsive */
@media (max-width: 900px) {
  .result-grid {
    grid-template-columns: 1fr;
  }

  .result-view {
    padding: 2rem;
  }
}
</style>
