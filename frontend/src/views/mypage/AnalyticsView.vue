<script setup lang="ts">
import { mockDashboardStats, mockActivityLogs } from '@/data/mockData'

const stats = mockDashboardStats
const activities = mockActivityLogs

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'view': return 'eye'
    case 'inquiry': return 'message-circle'
    case 'match': return 'link'
    case 'message': return 'send'
    default: return 'activity'
  }
}
</script>

<template>
  <div class="analytics-view">
    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">프로필 조회수</span>
          <div class="stat-icon views">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
        <span class="stat-value">{{ stats.totalViews }}</span>
        <span class="stat-change positive">+12% 지난주 대비</span>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">받은 문의</span>
          <div class="stat-icon inquiries">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
        </div>
        <span class="stat-value">{{ stats.totalInquiries }}</span>
        <span class="stat-change positive">+5% 지난주 대비</span>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">매칭 기업</span>
          <div class="stat-icon matches">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
        </div>
        <span class="stat-value">{{ stats.totalMatches }}</span>
        <span class="stat-change neutral">변동 없음</span>
      </div>
    </div>

    <!-- Activity Log -->
    <div class="card activity-card">
      <div class="card-header">
        <h2>활동 내역</h2>
      </div>
      <div class="activity-list">
        <div v-for="activity in activities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <svg v-if="getActivityIcon(activity.type) === 'eye'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else-if="getActivityIcon(activity.type) === 'message-circle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <svg v-else-if="getActivityIcon(activity.type) === 'link'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" x2="11" y1="2" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </div>
          <div class="activity-content">
            <p class="activity-desc">{{ activity.description }}</p>
            <span v-if="activity.targetCompanyName" class="activity-company">
              {{ activity.targetCompanyName }}
            </span>
          </div>
          <span class="activity-time">{{ formatTime(activity.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 20px;
  height: 20px;
}

.stat-icon.views {
  background-color: #dbeafe;
  color: #2563eb;
}

.stat-icon.inquiries {
  background-color: #d1fae5;
  color: #059669;
}

.stat-icon.matches {
  background-color: #fef3c7;
  color: #d97706;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.negative {
  color: #dc2626;
}

.stat-change.neutral {
  color: var(--text-muted);
}

.activity-card {
  padding: 0;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.activity-list {
  padding: 8px 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 24px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--background);
}

.activity-icon svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.activity-icon.view {
  background-color: #dbeafe;
}
.activity-icon.view svg {
  color: #2563eb;
}

.activity-icon.inquiry {
  background-color: #d1fae5;
}
.activity-icon.inquiry svg {
  color: #059669;
}

.activity-icon.match {
  background-color: #fef3c7;
}
.activity-icon.match svg {
  color: #d97706;
}

.activity-icon.message {
  background-color: #ede9fe;
}
.activity-icon.message svg {
  color: #7c3aed;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-desc {
  font-size: 14px;
  color: var(--text-primary);
}

.activity-company {
  font-size: 13px;
  color: var(--text-muted);
}

.activity-time {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
