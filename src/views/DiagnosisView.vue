<template>
  <div class="diagnosis-view">
    <div class="diagnosis-container">
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
      <div class="diagnosis-header">
        <h1>Диагностика</h1>
        <p>Шаг {{ currentStep + 1 }} из {{ totalSteps }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="question-card">
        <h2>{{ currentQuestion.question }}</h2>

        <!-- Options Grid -->
        <div class="options-grid">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            :class="['option-button', { 'selected': isOptionSelected(option) }]"
            @click="handleOptionClick(option)"
          >
            <span class="option-text">{{ option }}</span>
            <svg v-if="isOptionSelected(option)" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </button>
        </div>

        <!-- Multi-select hint -->
        <p v-if="currentQuestion.multiSelect" class="multi-select-hint">
          Можно выбрать несколько вариантов
        </p>
      </div>

      <!-- Symptoms Summary -->
      <div v-if="selectedCount > 0" class="symptoms-summary">
        <p>Отмечено симптомов: <span class="count">{{ selectedCount }}</span> из {{ totalSteps }}</p>
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <button class="back-button" @click="handleBack">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          <span>Назад</span>
        </button>

        <button
          class="next-button"
          :class="{ 'disabled': currentAnswers.length === 0 }"
          :disabled="currentAnswers.length === 0"
          @click="handleNext"
        >
          <span>{{ isLastStep ? 'Получить результат' : 'Далее' }}</span>
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  {
    id: 1,
    question: 'Какой тип вашего растения?',
    options: [
      'Комнатное декоративное',
      'Суккулент',
      'Цветущее растение',
      'Пальма или папоротник',
      'Не знаю',
    ],
    multiSelect: false,
  },
  {
    id: 2,
    question: 'Какие изменения вы наблюдаете на листьях?',
    options: [
      'Пожелтение листьев',
      'Коричневые пятна',
      'Белый налёт',
      'Листья скручиваются',
      'Побурение сосудов',
      'Тёмные пятна',
      'Серый налёт',
      'Липкий налёт',
      'Коричневые бляшки',
      'Тонкая паутина',
      'Зелёные прожилки',
      'Жёлтая кайма',
      'Чёрные пятна',
      'Сухие края листьев',
      'Листья вянут',
      'Ничего из перечисленного',
    ],
    multiSelect: true,
  },
  {
    id: 3,
    question: 'Есть ли изменения в росте растения?',
    options: [
      'Растение перестало расти',
      'Листья опадают',
      'Стебель стал мягким',
      'Новые листья мелкие',
      'Увядание',
      'Замедленный рост',
      'Вытягивание стебля',
      'Деформация побегов',
      'Гниль стебля',
      'Нет изменений',
    ],
    multiSelect: true,
  },
  {
    id: 4,
    question: 'Как часто вы поливаете растение?',
    options: [
      'Каждый день',
      '2-3 раза в неделю',
      'Раз в неделю',
      'Раз в 2 недели',
      'Нерегулярно',
    ],
    multiSelect: false,
  },
  {
    id: 5,
    question: 'Где находится растение?',
    options: [
      'На подоконнике (прямое солнце)',
      'Возле окна (яркий свет)',
      'В глубине комнаты',
      'В тёмном месте',
      'Часто перемещаю',
    ],
    multiSelect: false,
  },
]

const currentStep = ref(0)
const answers = ref({})

const totalSteps = questions.length
const currentQuestion = computed(() => questions[currentStep.value])
const currentAnswers = computed(() => answers.value[currentQuestion.value.id] || [])
const progressPercentage = computed(() => ((currentStep.value + 1) / totalSteps) * 100)
const selectedCount = computed(() => Object.values(answers.value).filter(a => a.length > 0).length)
const isLastStep = computed(() => currentStep.value === totalSteps - 1)

const isOptionSelected = (option) => {
  return currentAnswers.value.includes(option)
}

const handleOptionClick = (option) => {
  if (currentQuestion.value.multiSelect) {
    const newAnswers = currentAnswers.value.includes(option)
      ? currentAnswers.value.filter(a => a !== option)
      : [...currentAnswers.value, option]
    answers.value = { ...answers.value, [currentQuestion.value.id]: newAnswers }
  } else {
    answers.value = { ...answers.value, [currentQuestion.value.id]: [option] }
  }
}

const handleNext = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  } else {
    // Save answers and navigate to result
    localStorage.setItem('diagnosisAnswers', JSON.stringify(answers.value))
    router.push('/diagnosis/result')
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.diagnosis-view {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.diagnosis-container {
  width: 100%;
  max-width: 896px;
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
.diagnosis-header {
  text-align: center;
  margin-bottom: 2rem;
}

.diagnosis-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.diagnosis-header p {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
}

/* Progress Bar */
.progress-bar-container {
  margin-bottom: 3rem;
}

.progress-bar {
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

/* Question Card */
.question-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.question-card h2 {
  font-size: 1.875rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 2rem 0;
  color: #1a1a1a;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.option-button {
  text-align: left;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-button:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.option-button.selected {
  border-color: #4CAF50;
  background-color: #f0fdf4;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.option-text {
  font-size: 1.125rem;
  color: #374151;
}

.option-button.selected .option-text {
  color: #111827;
}

.check-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #4CAF50;
  flex-shrink: 0;
  margin-left: 0.75rem;
}

.multi-select-hint {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 1.5rem 0 0 0;
  text-align: center;
}

/* Symptoms Summary */
.symptoms-summary {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: center;
}

.symptoms-summary p {
  font-size: 1.125rem;
  color: #374151;
  margin: 0;
}

.count {
  font-weight: 600;
  color: #4CAF50;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.125rem;
}

.back-button:hover {
  border-color: #d1d5db;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.next-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  transition: all 0.2s;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.next-button:hover:not(.disabled) {
  background-color: #45a049;
}

.next-button.disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .diagnosis-view {
    padding: 2rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .back-button {
    width: 100%;
  }
}
</style>
