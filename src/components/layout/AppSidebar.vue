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
  width: 220px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 28px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #4CAF50;
  border-radius: 10px;
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
  font-size: 15px;
  color: #1a1a1a;
}

.logo-desc {
  font-size: 11px;
  color: #999;
  margin-top: 1px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f0f9f1;
  color: #4CAF50;
}

.nav-item.active {
  background: #4CAF50;
  color: #fff;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #bbb;
  padding: 0 20px;
  text-align: center;
}
</style>
