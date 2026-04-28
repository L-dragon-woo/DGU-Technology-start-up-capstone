import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import { mockNotifications } from '@/data/mockData'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>(mockNotifications)

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )

  const sortedNotifications = computed(() => 
    [...notifications.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  function markAsRead(notificationId: string) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.isRead = true)
  }

  function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const newNotification: Notification = {
      ...notification,
      id: `noti${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    }
    notifications.value.unshift(newNotification)
    return newNotification
  }

  return {
    notifications,
    unreadCount,
    sortedNotifications,
    markAsRead,
    markAllAsRead,
    addNotification
  }
})
