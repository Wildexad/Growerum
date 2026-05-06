<template>
  <div class="history-view">
    <div class="history-container">
      <!-- Header -->
      <div class="page-header">
        <h1>История диагностик</h1>
        <p>Все ваши прошлые проверки</p>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- History List -->
        <div class="history-list">
          <!-- Empty State -->
          <div v-if="history.length === 0" class="empty-state">
            <div class="empty-icon-wrapper">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </div>
            <h3>История пуста</h3>
            <p>Здесь будут отображаться ваши диагностики</p>
          </div>

          <!-- History Entries -->
          <div v-else class="entries-list">
            <div
              v-for="entry in history"
              :key="entry.id"
              class="history-entry"
            >
              <div class="entry-content">
                <div class="entry-icon">
                  <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>

                <div class="entry-info">
                  <h3>{{ entry.disease }}</h3>
                  <p class="entry-date">{{ formatDate(entry.date) }}</p>
                  <div class="confidence-bar-wrapper">
                    <div class="confidence-bar">
                      <div class="confidence-fill" :style="{ width: entry.confidence + '%' }"></div>
                    </div>
                    <span class="confidence-value">{{ entry.confidence }}%</span>
                  </div>
                </div>

                <div class="entry-actions">
                  <button class="delete-button" @click="handleDelete(entry.id)">
                    <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  </button>
                  <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Sidebar -->
        <div v-if="history.length > 0" class="statistics-sidebar">
          <div class="stats-card">
            <h3>Статистика</h3>
            <div class="stats-content">
              <div class="stat-item">
                <div class="stat-number">{{ history.length }}</div>
                <div class="stat-label">Всего диагностик</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ averageConfidence }}%</div>
                <div class="stat-label">Средняя уверенность</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const history = ref([])

const averageConfidence = computed(() => {
  if (history.value.length === 0) return 0
  const sum = history.value.reduce((acc, entry) => acc + entry.confidence, 0)
  return Math.round(sum / history.value.length)
})

onMounted(() => {
  loadHistory()
})

const loadHistory = () => {
  const historyData = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]')
  history.value = historyData
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const handleDelete = (id) => {
  history.value = history.value.filter(entry => entry.id !== id)
  localStorage.setItem('diagnosisHistory', JSON.stringify(history.value))
}
</script>

<style scoped>
.history-view {
  min-height: 100vh;
  padding: 3rem;
}

.history-container {
  max-width: 1152px;
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

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 1.5rem;
  padding: 4rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-icon-wrapper {
  width: 6rem;
  height: 6rem;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.empty-state p {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

/* History Entries */
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-entry {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.history-entry:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.entry-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.entry-icon {
  width: 4rem;
  height: 4rem;
  background-color: #fff7ed;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon {
  width: 2rem;
  height: 2rem;
  color: #f97316;
}

.entry-info {
  flex: 1;
  min-width: 0;
}

.entry-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.entry-date {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}

.confidence-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.confidence-bar {
  height: 0.5rem;
  width: 8rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.confidence-value {
  font-size: 0.875rem;
  color: #6b7280;
}

.entry-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.delete-button {
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
  opacity: 0;
}

.history-entry:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  color: #ef4444;
}

.trash-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.chevron-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #9ca3af;
}

/* Statistics Sidebar */
.statistics-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #dcfce7;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stats-card h3 {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .history-view {
    padding: 2rem;
  }

  .entry-content {
    gap: 1rem;
  }

  .entry-icon {
    width: 3rem;
    height: 3rem;
  }

  .alert-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .entry-info h3 {
    font-size: 1.25rem;
  }

  .entry-date {
    font-size: 1rem;
  }
}
</style>
