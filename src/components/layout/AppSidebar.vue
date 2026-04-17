<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6.5 12C3 12 2 15 2 17c0 1.7 1 3 3.5 3C8 20 10 18 12 15"/>
          <path d="M17.5 12C21 12 22 15 22 17c0 1.7-1 3-3.5 3C16 20 14 18 12 15"/>
          <path d="M12 2v13"/>
          <path d="M9 6c0 0 1.5 1 3 1s3-1 3-1"/>
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-name">Growerum</span>
        <span class="logo-desc">Диагностика растений</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/home" class="nav-item" active-class="active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Главная</span>
      </router-link>

      <router-link to="/history" class="nav-item" active-class="active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>История</span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Профиль</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
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
</style>
