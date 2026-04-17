<template>
  <div class="logout-card" @click="$emit('logout')">
    <div class="logout-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </div>
    <span class="logout-text">Выйти из аккаунта</span>
  </div>
</template>

<script setup>
defineEmits(['logout'])
</script>

<style scoped>
.logout-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-card:hover {
  background: #fff5f5;
}

.logout-icon {
  color: #e74c3c;
}

.logout-text {
  font-size: 13px;
  font-weight: 600;
  color: #e74c3c;
}
</style>
