<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notifications'
import { useMessageStore } from '@/stores/messages'
import NotificationDropdown from '@/components/common/NotificationDropdown.vue'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()
const messageStore = useMessageStore()

const searchQuery = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)

const totalUnread = computed(() => 
  notificationStore.unreadCount + messageStore.unreadCount
)

const userInitials = computed(() => {
  if (!userStore.currentUser?.name) return 'U'
  return userStore.currentUser.name.charAt(0)
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'companies', query: { keyword: searchQuery.value } })
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

function closeDropdowns() {
  showNotifications.value = false
  showUserMenu.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <form class="search-form" @submit.prevent="handleSearch">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="기업명, 업종, 키워드로 검색..." 
          class="search-input"
        />
      </form>
    </div>

    <div class="header-right">
      <div class="header-actions">
        <button 
          class="action-btn"
          :class="{ active: showNotifications }"
          @click="toggleNotifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span v-if="totalUnread > 0" class="badge-count">{{ totalUnread }}</span>
        </button>

        <RouterLink to="/messages" class="action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span v-if="messageStore.unreadCount > 0" class="badge-count">{{ messageStore.unreadCount }}</span>
        </RouterLink>
      </div>

      <div class="user-menu-wrapper">
        <button class="user-btn" @click="toggleUserMenu">
          <div class="avatar">{{ userInitials }}</div>
          <div class="user-info">
            <span class="user-name">{{ userStore.currentUser?.name }}</span>
            <span class="user-company">{{ userStore.currentUser?.company.name }}</span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <Transition name="fade">
          <div v-if="showUserMenu" class="dropdown-menu user-dropdown" @click="closeDropdowns">
            <RouterLink to="/mypage" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              마이페이지
            </RouterLink>
            <RouterLink to="/mypage/settings" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              계정 설정
            </RouterLink>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" @click="userStore.logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              로그아웃
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <Transition name="fade">
      <NotificationDropdown 
        v-if="showNotifications" 
        @close="showNotifications = false"
      />
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 1;
  max-width: 480px;
}

.search-form {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 44px;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--background);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--surface);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover,
.action-btn.active {
  background-color: var(--background);
  color: var(--text-primary);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.badge-count {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background-color: var(--error);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu-wrapper {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-btn:hover {
  background-color: var(--background);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.user-company {
  font-size: 12px;
  color: var(--text-muted);
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 8px;
  z-index: 200;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: var(--background);
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.dropdown-item.logout {
  color: var(--error);
}

.dropdown-item.logout svg {
  color: var(--error);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border);
  margin: 8px 0;
}

@media (max-width: 768px) {
  .user-info {
    display: none;
  }

  .search-input {
    font-size: 16px;
  }
}
</style>
