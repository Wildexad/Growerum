<template>
  <div class="reference-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">📖 Справочник болезней</h1>
      <p class="page-subtitle">Энциклопедия распространённых заболеваний комнатных растений</p>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск по названию или симптомам..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ filteredDiseases.length }}</span>
        <span class="stat-label">болезней в справочнике</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка справочника...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredDiseases.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <h3>Ничего не найдено</h3>
      <p>Попробуйте изменить поисковый запрос</p>
    </div>

    <!-- Diseases List -->
    <div v-else class="diseases-grid">
      <div 
        v-for="disease in filteredDiseases" 
        :key="disease.id"
        class="disease-card"
        @click="toggleDisease(disease)"
      >
        <div class="card-header">
          <div class="disease-info">
            <h3 class="disease-name">{{ disease.name }}</h3>
            <span class="severity-badge" :class="`severity-${getSeverityClass(disease.severity)}`">
              {{ disease.severity || 'Средняя' }}
            </span>
          </div>
          <svg class="expand-icon" :class="{ expanded: expandedDisease?.id === disease.id }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <p class="disease-description">{{ disease.description }}</p>

        <!-- Expanded Content -->
        <div v-if="expandedDisease?.id === disease.id" class="expanded-content">
          <!-- Symptoms -->
          <div class="section">
            <h4 class="section-title"> Симптомы</h4>
            <div class="symptoms-list">
              <span 
                v-for="(symptom, index) in getSymptoms(disease)" 
                :key="index"
                class="symptom-tag"
              >
                {{ symptom }}
              </span>
            </div>
          </div>

          <!-- Treatment -->
          <div class="section">
            <h4 class="section-title">💊 Лечение</h4>
            <p class="section-text">{{ disease.treatment }}</p>
          </div>

          <!-- Prevention -->
          <div class="section">
            <h4 class="section-title">🛡️ Профилактика</h4>
            <p class="section-text">{{ disease.prevention }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReferenceStore } from '@/stores/useReferenceStore'

const referenceStore = useReferenceStore()
const searchQuery = ref('')
const expandedDisease = ref(null)
const loading = ref(true)

const filteredDiseases = computed(() => {
  if (!searchQuery.value) {
    return referenceStore.diseases
  }
  return referenceStore.searchDiseases(searchQuery.value)
})

onMounted(async () => {
  try {
    await referenceStore.loadDiseases()
  } catch (error) {
    console.error('Ошибка загрузки справочника:', error)
  } finally {
    loading.value = false
  }
})

const toggleDisease = (disease) => {
  if (expandedDisease.value?.id === disease.id) {
    expandedDisease.value = null
  } else {
    expandedDisease.value = disease
  }
}

const getSymptoms = (disease) => {
  if (!disease.symptoms) return []
  if (Array.isArray(disease.symptoms)) return disease.symptoms
  try {
    return JSON.parse(disease.symptoms)
  } catch {
    return []
  }
}

const getSeverityClass = (severity) => {
  if (!severity) return 'medium'
  const map = {
    'Низкая': 'low',
    'Средняя': 'medium',
    'Высокая': 'high',
    'Критическая': 'critical'
  }
  return map[severity] || 'medium'
}
</script>

<style scoped>
.reference-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
}

/* Search */
.search-container {
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.clear-button {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #999;
  transition: color 0.2s;
}

.clear-button:hover {
  color: #333;
}

.clear-button svg {
  width: 18px;
  height: 18px;
}

/* Stats */
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #ccc;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.empty-state p {
  color: #666;
  margin: 0;
}

/* Diseases Grid */
.diseases-grid {
  display: grid;
  gap: 1.5rem;
}

.disease-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.disease-card:hover {
  border-color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.disease-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.disease-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-low {
  background: #e8f5e9;
  color: #2e7d32;
}

.severity-medium {
  background: #fff3e0;
  color: #f57c00;
}

.severity-high {
  background: #ffebee;
  color: #c62828;
}

.severity-critical {
  background: #fce4ec;
  color: #ad1457;
}

.expand-icon {
  width: 24px;
  height: 24px;
  color: #999;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.disease-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

/* Expanded Content */
.expanded-content {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.section-text {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.symptoms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.symptom-tag {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #333;
  border: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .disease-card {
    padding: 1.25rem;
  }
  
  .disease-name {
    font-size: 1.125rem;
  }
}
</style>
