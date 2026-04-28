<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessageStore } from '@/stores/messages'
import type { Message } from '@/types'

const messageStore = useMessageStore()

const selectedMessage = ref<Message | null>(null)
const filter = ref<'all' | 'unread'>('all')

const filteredMessages = computed(() => {
  if (filter.value === 'unread') {
    return messageStore.sortedMessages.filter(m => !m.isRead)
  }
  return messageStore.sortedMessages
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function selectMessage(message: Message) {
  selectedMessage.value = message
  if (!message.isRead) {
    messageStore.markAsRead(message.id)
  }
}

function deleteMessage(id: string) {
  messageStore.deleteMessage(id)
  if (selectedMessage.value?.id === id) {
    selectedMessage.value = null
  }
}
</script>

<template>
  <div class="messages-page">
    <header class="page-header">
      <h1>메시지</h1>
      <p>비즈니스 파트너와 소통하세요</p>
    </header>

    <div class="messages-container card">
      <!-- Message List -->
      <div class="message-list">
        <div class="list-header">
          <div class="filter-tabs">
            <button 
              class="tab" 
              :class="{ active: filter === 'all' }"
              @click="filter = 'all'"
            >
              전체
            </button>
            <button 
              class="tab" 
              :class="{ active: filter === 'unread' }"
              @click="filter = 'unread'"
            >
              읽지 않음 ({{ messageStore.unreadCount }})
            </button>
          </div>
        </div>

        <div v-if="filteredMessages.length > 0" class="messages">
          <div 
            v-for="message in filteredMessages" 
            :key="message.id"
            class="message-item"
            :class="{ 
              unread: !message.isRead,
              selected: selectedMessage?.id === message.id 
            }"
            @click="selectMessage(message)"
          >
            <div class="message-avatar">
              {{ message.senderName.charAt(0) }}
            </div>
            <div class="message-content">
              <div class="message-top">
                <span class="sender-name">{{ message.senderName }}</span>
                <span class="message-time">{{ formatDate(message.createdAt) }}</span>
              </div>
              <span class="sender-company">{{ message.senderCompany }}</span>
              <p class="message-subject">{{ message.subject }}</p>
            </div>
            <div v-if="!message.isRead" class="unread-dot"></div>
          </div>
        </div>

        <div v-else class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <p>메시지가 없습니다</p>
        </div>
      </div>

      <!-- Message Detail -->
      <div class="message-detail">
        <template v-if="selectedMessage">
          <div class="detail-header">
            <div class="detail-sender">
              <div class="detail-avatar">
                {{ selectedMessage.senderName.charAt(0) }}
              </div>
              <div class="detail-info">
                <h3>{{ selectedMessage.senderName }}</h3>
                <span>{{ selectedMessage.senderCompany }}</span>
              </div>
            </div>
            <div class="detail-actions">
              <button class="btn btn-ghost" @click="deleteMessage(selectedMessage.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" x2="10" y1="11" y2="17"/>
                  <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="detail-body">
            <h2 class="detail-subject">{{ selectedMessage.subject }}</h2>
            <span class="detail-date">{{ formatFullDate(selectedMessage.createdAt) }}</span>
            <div class="detail-content">
              <p v-for="(line, index) in selectedMessage.content.split('\n')" :key="index">
                {{ line }}
              </p>
            </div>
          </div>

          <div class="detail-footer">
            <button class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 17 4 12 9 7"/>
                <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
              </svg>
              답장하기
            </button>
          </div>
        </template>

        <div v-else class="no-selection">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <p>메시지를 선택하세요</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-page {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - var(--header-height) - 48px);
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 24px;
  flex-shrink: 0;
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

.messages-container {
  flex: 1;
  display: grid;
  grid-template-columns: 380px 1fr;
  overflow: hidden;
  padding: 0;
}

.message-list {
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.tab:hover {
  background-color: var(--background);
}

.tab.active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.messages {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.15s ease;
  position: relative;
}

.message-item:hover {
  background-color: var(--background);
}

.message-item.selected {
  background-color: var(--primary-light);
}

.message-item.unread {
  background-color: #f0f7ff;
}

.message-item.unread:hover {
  background-color: #e0efff;
}

.message-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.sender-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.message-time {
  font-size: 12px;
  color: var(--text-muted);
}

.sender-company {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.message-subject {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  flex-shrink: 0;
}

.message-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.detail-sender {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.detail-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-info span {
  font-size: 14px;
  color: var(--text-muted);
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.detail-actions .btn svg {
  width: 18px;
  height: 18px;
}

.detail-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.detail-subject {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.detail-date {
  font-size: 13px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 24px;
}

.detail-content {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.detail-content p {
  margin-bottom: 12px;
}

.detail-content p:last-child {
  margin-bottom: 0;
}

.detail-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.detail-footer .btn svg {
  width: 18px;
  height: 18px;
}

.no-selection,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  text-align: center;
  padding: 40px;
}

.no-selection svg,
.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .messages-container {
    grid-template-columns: 1fr;
  }

  .message-list {
    border-right: none;
  }

  .message-detail {
    display: none;
  }

  .message-detail.active {
    display: flex;
  }
}
</style>
