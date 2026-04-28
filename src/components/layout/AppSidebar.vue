<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    name: 'dashboard',
    label: '대시보드',
    icon: 'dashboard',
    path: '/dashboard'
  },
  {
    name: 'client-request',
    label: '견적 요청',
    icon: 'request',
    path: '/client/request'
  },
  {
    name: 'factory-onboarding',
    label: '공장 등록',
    icon: 'factory',
    path: '/factory/onboarding'
  },
  {
    name: 'factory-requests',
    label: '받은 요청',
    icon: 'inbox',
    path: '/factory/requests'
  },
  {
    name: 'dispute-mediation',
    label: '분쟁 중재',
    icon: 'shield',
    path: '/disputes/mediation'
  },
  {
    name: 'transaction-progress',
    label: '거래 진행',
    icon: 'progress',
    path: '/transaction/progress'
  },
  {
    name: 'companies',
    label: '기업 디렉토리',
    icon: 'building',
    path: '/companies'
  },
  {
    name: 'messages',
    label: '메시지',
    icon: 'message',
    path: '/messages'
  },
  {
    name: 'mypage',
    label: '마이페이지',
    icon: 'user',
    path: '/mypage'
  }
]

const isActive = (item: typeof navItems[0]) => {
  if (item.path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(item.path)
}
</script>

<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <RouterLink to="/" class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="logo-text">RootMatching</span>
      </RouterLink>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink 
            :to="item.path" 
            class="nav-item"
            :class="{ active: isActive(item) }"
          >
            <svg v-if="item.icon === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1"/>
              <rect x="14" y="3" width="7" height="5" rx="1"/>
              <rect x="14" y="12" width="7" height="9" rx="1"/>
              <rect x="3" y="16" width="7" height="5" rx="1"/>
            </svg>
            <svg v-else-if="item.icon === 'building'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
              <path d="M10 6h4"/>
              <path d="M10 10h4"/>
              <path d="M10 14h4"/>
              <path d="M10 18h4"/>
            </svg>
            <svg v-else-if="item.icon === 'request'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M9 15h6"/>
              <path d="M9 11h2"/>
            </svg>
            <svg v-else-if="item.icon === 'factory'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18"/>
              <path d="M5 21V8l6 4V8l6 4V3h2v18"/>
              <path d="M9 17h1"/>
              <path d="M14 17h1"/>
            </svg>
            <svg v-else-if="item.icon === 'inbox'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
            <svg v-else-if="item.icon === 'shield'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <svg v-else-if="item.icon === 'progress'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h4l3 8 4-16 3 8h4"/>
              <path d="M5 20h14"/>
            </svg>
            <svg v-else-if="item.icon === 'message'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <svg v-else-if="item.icon === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="help-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
        <div class="help-content">
          <span class="help-title">도움이 필요하신가요?</span>
          <span class="help-desc">고객센터에 문의하세요</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 150;
}

.sidebar-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), #3b82f6);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--background);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.nav-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.help-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: var(--background);
  border-radius: var(--radius-lg);
}

.help-card svg {
  width: 24px;
  height: 24px;
  color: var(--primary);
  flex-shrink: 0;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.help-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.help-desc {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .app-sidebar.open {
    transform: translateX(0);
  }
}
</style>
