<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'mypage-profile', label: '기업 프로필', path: '/mypage' },
  { name: 'mypage-analytics', label: '활동 분석', path: '/mypage/analytics' },
  { name: 'mypage-settings', label: '계정 설정', path: '/mypage/settings' }
]

const isActive = (tab: typeof tabs[0]) => {
  if (tab.path === '/mypage') {
    return route.path === '/mypage' || route.name === 'mypage-profile'
  }
  return route.path === tab.path
}
</script>

<template>
  <div class="mypage">
    <header class="page-header">
      <h1>마이페이지</h1>
      <p>기업 정보와 계정을 관리하세요</p>
    </header>

    <div class="tabs-container">
      <nav class="tabs">
        <RouterLink 
          v-for="tab in tabs" 
          :key="tab.name"
          :to="tab.path"
          class="tab"
          :class="{ active: isActive(tab) }"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="tab-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.mypage {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

.tabs-container {
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.tab {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
</style>
