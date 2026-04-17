<template>
  <div class="user-card">
    <div class="user-header">
      <div class="avatar">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6.5 12C3 12 2 15 2 17c0 1.7 1 3 3.5 3C8 20 10 18 12 15"/>
          <path d="M17.5 12C21 12 22 15 22 17c0 1.7-1 3-3.5 3C16 20 14 18 12 15"/>
          <path d="M12 2v13"/>
          <path d="M9 6c0 0 1.5 1 3 1s3-1 3-1"/>
        </svg>
      </div>
      <div class="user-info">
        <h3 class="user-name">{{ displayName }}</h3>
        <div class="user-email">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
          </svg>
          <span>{{ email }}</span>
        </div>
      </div>
    </div>

    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-number">{{ stats.diagnoses }}</span>
        <span class="stat-label">Диагностик</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ stats.plants }}</span>
        <span class="stat-label">Растений</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ stats.days }}</span>
        <span class="stat-label">Дней</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  email: {
    type: String,
    default: 'почта@example.com'
  },
  displayName: {
    type: String,
    default: 'Имя'
  },
  stats: {
    type: Object,
    default: () => ({ diagnoses: 12, plants: 8, days: 15 })
  }
})
</script>

<style scoped>
.user-card {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.avatar {
  width: 56px;
  height: 56px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.user-email {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
  font-size: 13px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 26px;
  font-weight: 700;
  color: #4CAF50;
}

.stat-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}
</style>
