<template>
  <div class="home-page">

    <!-- Top row: greeting + avatar icon -->
    <div class="top-row">
      <div class="greeting">
        <h1 class="greeting-title">Здравствуйте, {{ userName }}!</h1>
        <p class="greeting-sub">Как ваши растения сегодня?</p>
      </div>
      <div class="avatar-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>
    </div>

    <!-- Совет дня -->
    <div class="tip-card">
      <div class="tip-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="tip-text">
        <p class="tip-label">Совет дня</p>
        <p class="tip-body">Совет дня: проверяйте влажность почвы перед поливом</p>
      </div>
    </div>

    <!-- Начать диагностику -->
    <div class="diagnose-card" @click="$router.push('/diagnose')">
      <div class="diagnose-img">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="diagnose-text">
        <p class="diagnose-title">Начать диагностику</p>
        <p class="diagnose-sub">Определите проблему вашего растения</p>
      </div>
    </div>

    <!-- Bottom 3 cards -->
    <div class="bottom-grid">

      <!-- История -->
      <div class="bottom-card" @click="$router.push('/history')">
        <div class="bottom-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p class="bottom-title">История</p>
        <p class="bottom-link">Просмотр прошлых диагностик</p>
      </div>

      <!-- Справочник -->
      <div class="bottom-card" @click="$router.push('/reference')">
        <div class="bottom-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="9" y1="7" x2="15" y2="7"/>
            <line x1="9" y1="11" x2="15" y2="11"/>
            <line x1="9" y1="15" x2="13" y2="15"/>
          </svg>
        </div>
        <p class="bottom-title">Справочник</p>
        <p class="bottom-link">Энциклопедия болезней растений</p>
      </div>

      <!-- Быстрая статистика -->
      <div class="bottom-card stats-card">
        <p class="stats-label">Быстрая статистика</p>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-num">{{ diagnosisCount }}</span>
            <span class="stat-desc">Диагностик</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ plantsCount }}</span>
            <span class="stat-desc">Растений сохр.</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const userName = computed(() => {
  return authStore.user?.user_metadata?.name || authStore.user?.email?.split('@')[0] || 'Пользователь'
})

// TODO: подключить реальную статистику из Supabase
const diagnosisCount = 0
const plantsCount = 0
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-page > div {
  max-width: 1280px;
  margin: 0 auto;
}

/* Top row */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.greeting-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.greeting-sub {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
}

.avatar-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.avatar-icon svg {
  width: 28px;
  height: 28px;
}

.avatar-icon:hover {
  background: #43a047;
}

/* Tip card */
.tip-card {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 1px solid #d1fae5;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tip-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: #4caf50;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
}

.tip-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 4px;
}

.tip-body {
  font-size: 15px;
  color: #1f2937;
  margin: 0;
}

/* Diagnose card */
.diagnose-card {
  background: #4caf50;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.diagnose-card:hover {
  background: #45a049;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.diagnose-img {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.diagnose-img svg {
  stroke: #fff;
}

.diagnose-img svg {
  width: 32px;
  height: 32px;
  stroke: #fff;
}

.diagnose-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}

.diagnose-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.bottom-grid > *:first-child,
.bottom-grid > *:nth-child(2) {
  /* История и Справочник занимают по одной колонке */
}

.bottom-grid > *:last-child {
  /* Статистика занимает одну колонку */
}

.bottom-card {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.bottom-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.bottom-icon {
  margin-bottom: 0;
  width: 56px;
  height: 56px;
  background: #f9fafb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-icon svg {
  width: 28px;
  height: 28px;
}

.bottom-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.bottom-link {
  font-size: 13px;
  color: #4caf50;
  margin: 0;
  text-align: center;
}

/* Stats card */
.stats-card {
  cursor: default;
}

.stats-card:hover {
  transform: none;
}

.stats-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 16px;
  text-align: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 36px;
  font-weight: 700;
  color: #4caf50;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}
</style>
