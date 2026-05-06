<template>
  <div class="history-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">История диагностик</h1>
      <p class="page-subtitle">Все ваши прошлые проверки</p>
    </div>

    <!-- Empty state card -->
    <div class="empty-card">
      <div class="empty-icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <p class="empty-title">История пуста</p>
      <p class="empty-sub">Здесь будут отображаться ваши диагностики</p>
    </div>
  </div>
</template>

<script setup>
// История диагностик — пустое состояние
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding: 48px;
}

.history-page > div {
  max-width: 1280px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* Empty state card */
.empty-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}

.empty-icon-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon-wrap svg {
  width: 48px;
  height: 48px;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
}

.empty-sub {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  text-align: center;
}
</style>
