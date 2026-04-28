<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCompanyStore } from '@/stores/companies'
import { mockDashboardStats, mockActivityLogs } from '@/data/mockData'
import CompanyCard from '@/components/companies/CompanyCard.vue'

const userStore = useUserStore()
const companyStore = useCompanyStore()

const stats = mockDashboardStats
const activities = mockActivityLogs.slice(0, 5)

const recommendedCompanies = computed(() => 
  companyStore.companies.slice(1, 4)
)

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
  <div class="dashboard">
    <header class="page-header">
      <div class="welcome">
        <h1>안녕하세요, {{ userStore.currentUser?.name }}님</h1>
        <p>{{ userStore.currentUser?.company.name }}의 오늘 활동을 확인하세요.</p>
      </div>
      <div class="quick-actions">
        <RouterLink to="/factory/requests" class="quick-action primary">받은 요청 확인</RouterLink>
        <RouterLink to="/client/request" class="quick-action">견적 요청 등록</RouterLink>
      </div>
    </header>

    <!-- Stats Grid -->
    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon views">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalViews }}</span>
          <span class="stat-label">프로필 조회수</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon inquiries">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalInquiries }}</span>
          <span class="stat-label">받은 문의</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon matches">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalMatches }}</span>
          <span class="stat-label">매칭 기업</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.recentMessages }}</span>
          <span class="stat-label">새 메시지</span>
        </div>
      </div>
    </section>

    <div class="dashboard-content">
      <!-- Recommended Companies -->
      <section class="section">
        <div class="section-header">
          <h2>추천 기업</h2>
          <RouterLink to="/companies" class="view-all">전체 보기</RouterLink>
        </div>
        <div class="companies-grid">
          <CompanyCard 
            v-for="company in recommendedCompanies" 
            :key="company.id" 
            :company="company"
          />
        </div>
      </section>

      <!-- Activity Log -->
      <section class="section activity-section">
        <div class="section-header">
          <h2>최근 활동</h2>
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
              <span class="activity-company" v-if="activity.targetCompanyName">
                {{ activity.targetCompanyName }}
              </span>
            </div>
            <span class="activity-time">{{ formatTime(activity.createdAt) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.welcome h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.welcome p {
  font-size: 16px;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.quick-action.primary {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
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

.stat-icon.messages {
  background-color: #ede9fe;
  color: #7c3aed;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.section {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.companies-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-section {
  height: fit-content;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
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

@media (max-width: 1024px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
