<template>
  <div class="app-layout">
    <AppSidebar v-if="showSidebar" />

    <main class="main-content" :class="{ 'no-sidebar': !showSidebar }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const showSidebar = computed(() => route.path !== '/login')
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f3f4f6;
  color: #333;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.main-content.no-sidebar {
  padding: 0;
}
</style>