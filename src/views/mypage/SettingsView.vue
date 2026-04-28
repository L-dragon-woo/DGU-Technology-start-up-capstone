<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isUpdatingProfile = ref(false)
const isUpdatingPassword = ref(false)

const profileForm = ref({
  name: userStore.currentUser?.name || '',
  email: userStore.currentUser?.email || '',
  phone: userStore.currentUser?.phone || '',
  position: userStore.currentUser?.position || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = ref({
  emailNewMessage: true,
  emailNewInquiry: true,
  emailWeeklyReport: false,
  pushNewMessage: true,
  pushNewMatch: true
})

async function updateProfile() {
  isUpdatingProfile.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  userStore.updateProfile({
    name: profileForm.value.name,
    email: profileForm.value.email,
    phone: profileForm.value.phone,
    position: profileForm.value.position
  })
  
  isUpdatingProfile.value = false
  alert('프로필이 업데이트되었습니다.')
}

async function updatePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }
  
  isUpdatingPassword.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  isUpdatingPassword.value = false
  alert('비밀번호가 변경되었습니다.')
}
</script>

<template>
  <div class="settings-view">
    <!-- Profile Settings -->
    <section class="card settings-section">
      <div class="section-header">
        <h2>계정 정보</h2>
        <p>개인 계정 정보를 관리합니다</p>
      </div>
      <form @submit.prevent="updateProfile">
        <div class="form-grid">
          <div class="form-group">
            <label class="label">이름</label>
            <input v-model="profileForm.name" type="text" class="input" />
          </div>
          <div class="form-group">
            <label class="label">직책</label>
            <input v-model="profileForm.position" type="text" class="input" />
          </div>
          <div class="form-group">
            <label class="label">이메일</label>
            <input v-model="profileForm.email" type="email" class="input" />
          </div>
          <div class="form-group">
            <label class="label">연락처</label>
            <input v-model="profileForm.phone" type="tel" class="input" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isUpdatingProfile">
            <span v-if="isUpdatingProfile" class="spinner"></span>
            {{ isUpdatingProfile ? '저장 중...' : '저장' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Password Settings -->
    <section class="card settings-section">
      <div class="section-header">
        <h2>비밀번호 변경</h2>
        <p>계정 보안을 위해 정기적으로 비밀번호를 변경하세요</p>
      </div>
      <form @submit.prevent="updatePassword">
        <div class="form-grid single-column">
          <div class="form-group">
            <label class="label">현재 비밀번호</label>
            <input v-model="passwordForm.currentPassword" type="password" class="input" />
          </div>
          <div class="form-group">
            <label class="label">새 비밀번호</label>
            <input v-model="passwordForm.newPassword" type="password" class="input" />
          </div>
          <div class="form-group">
            <label class="label">새 비밀번호 확인</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="input" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isUpdatingPassword">
            <span v-if="isUpdatingPassword" class="spinner"></span>
            {{ isUpdatingPassword ? '변경 중...' : '비밀번호 변경' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Notification Settings -->
    <section class="card settings-section">
      <div class="section-header">
        <h2>알림 설정</h2>
        <p>알림 수신 방법을 설정합니다</p>
      </div>
      <div class="notification-settings">
        <div class="setting-group">
          <h3>이메일 알림</h3>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">새 메시지 수신</span>
              <span class="setting-desc">새 메시지가 도착하면 이메일로 알립니다</span>
            </div>
            <label class="toggle">
              <input v-model="notificationSettings.emailNewMessage" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">새 문의 접수</span>
              <span class="setting-desc">새 문의가 접수되면 이메일로 알립니다</span>
            </div>
            <label class="toggle">
              <input v-model="notificationSettings.emailNewInquiry" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">주간 리포트</span>
              <span class="setting-desc">매주 활동 요약 리포트를 받습니다</span>
            </div>
            <label class="toggle">
              <input v-model="notificationSettings.emailWeeklyReport" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-group">
          <h3>푸시 알림</h3>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">새 메시지</span>
              <span class="setting-desc">새 메시지 알림을 받습니다</span>
            </div>
            <label class="toggle">
              <input v-model="notificationSettings.pushNewMessage" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">새 매칭</span>
              <span class="setting-desc">새로운 매칭 기업 알림을 받습니다</span>
            </div>
            <label class="toggle">
              <input v-model="notificationSettings.pushNewMatch" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="card settings-section danger-zone">
      <div class="section-header">
        <h2>계정 삭제</h2>
        <p>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다</p>
      </div>
      <button class="btn btn-danger">
        계정 삭제 요청
      </button>
    </section>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  padding: 24px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.section-header p {
  font-size: 14px;
  color: var(--text-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-grid.single-column {
  grid-template-columns: 1fr;
  max-width: 400px;
}

.form-actions {
  margin-top: 24px;
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.setting-group h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background-color: var(--border);
  border-radius: 26px;
  transition: background-color 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.toggle input:checked + .toggle-slider {
  background-color: var(--primary);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.danger-zone {
  border-color: #fee2e2;
}

.danger-zone .section-header h2 {
  color: var(--error);
}

.btn-danger {
  background-color: var(--error);
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  transition: background-color 0.2s ease;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
