<template>
  <div class="user-card">
    <div class="user-header">
      <div class="avatar">
        <IconLeaf size="32" color="#fff" />
      </div>
      <div class="user-info">
        <h3 class="user-name">{{ displayName }}</h3>
        <div class="user-email">
          <IconMail size="14" color="currentColor" />
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
import IconLeaf from '@/components/icons/IconLeaf.vue'
import IconMail from '@/components/icons/IconMail.vue'

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
