<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <IconLeaf size="24" color="#fff" />
      </div>
      <div class="logo-text">
        <span class="logo-name">Growerum</span>
        <span class="logo-desc">Диагностика растений</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/home" class="nav-item" active-class="active">
        <IconHome size="18" />
        <span>Главная</span>
      </router-link>

      <router-link to="/history" class="nav-item" active-class="active">
        <IconHistory size="18" />
        <span>История</span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <IconUser size="18" />
        <span>Профиль</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      © {{ currentYear }} Growerum
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import IconLeaf from '@/components/icons/IconLeaf.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconHistory from '@/components/icons/IconHistory.vue'
import IconUser from '@/components/icons/IconUser.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.sidebar {
  width: 256px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: #4CAF50;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-weight: 700;
  font-size: 20px;
  color: #111827;
}

.logo-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-item.active {
  background: #4CAF50;
  color: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #9ca3af;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  line-height: 1.6;
}
</style>
