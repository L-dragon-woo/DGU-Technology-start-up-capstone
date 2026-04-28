<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companies'
import { useMessageStore } from '@/stores/messages'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const messageStore = useMessageStore()
const userStore = useUserStore()

const company = computed(() => 
  companyStore.getCompanyById(route.params.id as string)
)

const isFavorite = computed(() => 
  company.value ? companyStore.isFavorite(company.value.id) : false
)

const showContactModal = ref(false)
const messageSubject = ref('')
const messageContent = ref('')
const isSending = ref(false)

const initials = computed(() => {
  if (!company.value) return ''
  return company.value.name.slice(0, 2)
})

onMounted(() => {
  if (!company.value) {
    router.push('/companies')
  }
})

function toggleFavorite() {
  if (company.value) {
    companyStore.toggleFavorite(company.value.id)
  }
}

function openContactModal() {
  showContactModal.value = true
  messageSubject.value = `[협력 문의] ${userStore.currentUser?.company.name}에서 연락드립니다`
  messageContent.value = ''
}

function closeContactModal() {
  showContactModal.value = false
}

async function sendMessage() {
  if (!messageSubject.value.trim() || !messageContent.value.trim()) return
  if (!company.value || !userStore.currentUser) return

  isSending.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  messageStore.sendMessage({
    senderId: userStore.currentUser.id,
    senderName: userStore.currentUser.name,
    senderCompany: userStore.currentUser.company.name,
    receiverId: company.value.id,
    receiverName: company.value.name,
    receiverCompany: company.value.name,
    subject: messageSubject.value,
    content: messageContent.value,
    isRead: false
  })

  isSending.value = false
  showContactModal.value = false
  alert('메시지가 성공적으로 전송되었습니다.')
}
</script>

<template>
  <div v-if="company" class="company-detail">
    <!-- Back Button -->
    <button class="back-btn" @click="router.back()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      목록으로
    </button>

    <!-- Company Header -->
    <header class="company-header card">
      <div class="header-content">
        <div class="company-avatar">
          {{ initials }}
        </div>
        <div class="company-info">
          <h1>{{ company.name }}</h1>
          <div class="company-meta">
            <span class="badge">{{ company.industry }}</span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ company.region }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {{ company.employeeCount }}명
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              {{ company.establishedYear }}년 설립
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button 
          class="btn btn-secondary"
          :class="{ 'btn-favorite': isFavorite }"
          @click="toggleFavorite"
        >
          <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {{ isFavorite ? '관심 등록됨' : '관심 기업' }}
        </button>
        <button class="btn btn-primary" @click="openContactModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          문의하기
        </button>
      </div>
    </header>

    <div class="detail-content">
      <!-- Main Content -->
      <div class="main-column">
        <!-- About -->
        <section class="card section">
          <h2>기업 소개</h2>
          <p class="description">{{ company.description }}</p>
          <div class="tags">
            <span v-for="tag in company.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </section>

        <!-- Business Info -->
        <section class="card section">
          <h2>사업 정보</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">업종</span>
              <span class="info-value">{{ company.industry }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">기업 규모</span>
              <span class="info-value">{{ company.size }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">직원 수</span>
              <span class="info-value">{{ company.employeeCount }}명</span>
            </div>
            <div class="info-item">
              <span class="info-label">설립년도</span>
              <span class="info-value">{{ company.establishedYear }}년</span>
            </div>
            <div v-if="company.revenue" class="info-item">
              <span class="info-label">매출액</span>
              <span class="info-value">{{ company.revenue }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">지역</span>
              <span class="info-value">{{ company.region }}</span>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section v-if="company.certifications.length > 0" class="card section">
          <h2>인증 현황</h2>
          <div class="certifications">
            <span v-for="cert in company.certifications" :key="cert" class="certification-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {{ cert }}
            </span>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="side-column">
        <section class="card section contact-card">
          <h2>연락처</h2>
          <div class="contact-list">
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a :href="`mailto:${company.contactEmail}`">{{ company.contactEmail }}</a>
            </div>
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{{ company.contactPhone }}</span>
            </div>
            <div v-if="company.website" class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" x2="22" y1="12" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <a :href="company.website" target="_blank" rel="noopener">웹사이트 방문</a>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- Contact Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h2>문의하기</h2>
              <button class="close-btn" @click="closeContactModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" x2="6" y1="6" y2="18"/>
                  <line x1="6" x2="18" y1="6" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="label">받는 기업</label>
                <input type="text" class="input" :value="company.name" disabled />
              </div>
              <div class="form-group">
                <label class="label">제목</label>
                <input v-model="messageSubject" type="text" class="input" />
              </div>
              <div class="form-group">
                <label class="label">내용</label>
                <textarea 
                  v-model="messageContent" 
                  class="textarea" 
                  rows="6"
                  placeholder="문의 내용을 입력하세요..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeContactModal">취소</button>
              <button 
                class="btn btn-primary" 
                :disabled="isSending || !messageContent.trim()"
                @click="sendMessage"
              >
                <span v-if="isSending" class="spinner"></span>
                {{ isSending ? '전송 중...' : '전송' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.company-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-secondary);
  background: none;
  border: none;
  margin-bottom: 16px;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--text-primary);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.company-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.company-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  flex-shrink: 0;
}

.company-info h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.meta-item svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-favorite {
  color: #ef4444;
  border-color: #ef4444;
}

.btn-favorite svg {
  color: #ef4444;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.section {
  margin-bottom: 24px;
}

.section h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  background-color: var(--primary-light);
  border-radius: 9999px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: var(--text-muted);
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.certifications {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.certification-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #059669;
  background-color: #d1fae5;
  border-radius: var(--radius-md);
}

.certification-badge svg {
  width: 16px;
  height: 16px;
}

.contact-card {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.contact-item svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.contact-item a {
  color: var(--primary);
}

.contact-item a:hover {
  text-decoration: underline;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 520px;
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--background);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

@media (max-width: 1024px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .contact-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .company-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
