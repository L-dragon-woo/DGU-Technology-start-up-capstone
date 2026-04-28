<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
import { computed } from 'vue'

defineEmits<{
  close: []
}>()

const notificationStore = useNotificationStore()

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  return '방금 전'
}

const getIcon = (type: string) => {
  switch (type) {
    case 'message': return 'message'
    case 'match': return 'link'
    case 'inquiry': return 'eye'
    default: return 'bell'
  }
}

const recentNotifications = computed(() => 
  notificationStore.sortedNotifications.slice(0, 5)
)
</script>

<template>
  <div class="notification-dropdown" @click.stop>
    <div class="dropdown-header">
      <h3>알림</h3>
      <button 
        v-if="notificationStore.unreadCount > 0"
        class="mark-read-btn"
        @click="notificationStore.markAllAsRead"
      >
        모두 읽음
      </button>
    </div>

    <div class="notification-list">
      <template v-if="recentNotifications.length > 0">
        <div 
          v-for="notification in recentNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
          @click="notificationStore.markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="notification.type">
            <svg v-if="getIcon(notification.type) === 'message'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <svg v-else-if="getIcon(notification.type) === 'link'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <svg v-else-if="getIcon(notification.type) === 'eye'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-desc">{{ notification.content }}</p>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
        </div>
      </template>
      <div v-else class="empty-state">
        <p>새로운 알림이 없습니다</p>
      </div>
    </div>

    <div class="dropdown-footer">
      <RouterLink to="/notifications" class="view-all-btn" @click="$emit('close')">
        전체 알림 보기
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.notification-dropdown {
  position: absolute;
  top: calc(var(--header-height) - 8px);
  right: 100px;
  width: 380px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.dropdown-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.mark-read-btn {
  font-size: 13px;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 14px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.notification-item:hover {
  background-color: var(--background);
}

.notification-item.unread {
  background-color: var(--primary-light);
}

.notification-item.unread:hover {
  background-color: #cee0fc;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--background);
}

.notification-icon svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.notification-icon.message {
  background-color: #dbeafe;
}

.notification-icon.message svg {
  color: #2563eb;
}

.notification-icon.match {
  background-color: #d1fae5;
}

.notification-icon.match svg {
  color: #059669;
}

.notification-icon.inquiry {
  background-color: #fef3c7;
}

.notification-icon.inquiry svg {
  color: #d97706;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.notification-desc {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.view-all-btn {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}
</style>
