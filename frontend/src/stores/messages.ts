import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message } from '@/types'
import { mockMessages } from '@/data/mockData'

export const useMessageStore = defineStore('messages', () => {
  const messages = ref<Message[]>(mockMessages)

  const unreadCount = computed(() => 
    messages.value.filter(m => !m.isRead).length
  )

  const sortedMessages = computed(() => 
    [...messages.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  function markAsRead(messageId: string) {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.isRead = true
    }
  }

  function markAllAsRead() {
    messages.value.forEach(m => m.isRead = true)
  }

  function sendMessage(message: Omit<Message, 'id' | 'createdAt'>) {
    const newMessage: Message = {
      ...message,
      id: `msg${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    messages.value.unshift(newMessage)
    return newMessage
  }

  function deleteMessage(messageId: string) {
    const index = messages.value.findIndex(m => m.id === messageId)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  return {
    messages,
    unreadCount,
    sortedMessages,
    markAsRead,
    markAllAsRead,
    sendMessage,
    deleteMessage
  }
})
