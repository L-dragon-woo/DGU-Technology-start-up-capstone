<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { industries, regions, companySizes } from '@/data/mockData'

const userStore = useUserStore()

const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
  name: userStore.currentUser?.company.name || '',
  industry: userStore.currentUser?.company.industry || '',
  region: userStore.currentUser?.company.region || '',
  size: userStore.currentUser?.company.size || '',
  description: userStore.currentUser?.company.description || '',
  contactEmail: userStore.currentUser?.company.contactEmail || '',
  contactPhone: userStore.currentUser?.company.contactPhone || '',
  website: userStore.currentUser?.company.website || '',
  tags: userStore.currentUser?.company.tags.join(', ') || ''
})

const initials = computed(() => {
  return formData.value.name.slice(0, 2)
})

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  // Reset form data
  formData.value = {
    name: userStore.currentUser?.company.name || '',
    industry: userStore.currentUser?.company.industry || '',
    region: userStore.currentUser?.company.region || '',
    size: userStore.currentUser?.company.size || '',
    description: userStore.currentUser?.company.description || '',
    contactEmail: userStore.currentUser?.company.contactEmail || '',
    contactPhone: userStore.currentUser?.company.contactPhone || '',
    website: userStore.currentUser?.company.website || '',
    tags: userStore.currentUser?.company.tags.join(', ') || ''
  }
}

async function saveProfile() {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  userStore.updateCompany({
    name: formData.value.name,
    industry: formData.value.industry,
    region: formData.value.region,
    size: formData.value.size,
    description: formData.value.description,
    contactEmail: formData.value.contactEmail,
    contactPhone: formData.value.contactPhone,
    website: formData.value.website,
    tags: formData.value.tags.split(',').map(t => t.trim()).filter(t => t)
  })

  isSaving.value = false
  isEditing.value = false
}
</script>

<template>
  <div class="profile-view">
    <div class="card profile-card">
      <div class="card-header">
        <div class="profile-header">
          <div class="company-avatar">
            {{ initials }}
          </div>
          <div class="profile-info">
            <h2>{{ userStore.currentUser?.company.name }}</h2>
            <span class="badge">{{ userStore.currentUser?.company.industry }}</span>
          </div>
        </div>
        <button 
          v-if="!isEditing" 
          class="btn btn-secondary"
          @click="startEditing"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          수정
        </button>
      </div>

      <form @submit.prevent="saveProfile">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="label">기업명</label>
            <input 
              v-model="formData.name"
              type="text" 
              class="input"
              :disabled="!isEditing"
            />
          </div>

          <div class="form-group">
            <label class="label">업종</label>
            <select 
              v-model="formData.industry"
              class="select"
              :disabled="!isEditing"
            >
              <option v-for="industry in industries" :key="industry" :value="industry">
                {{ industry }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">지역</label>
            <select 
              v-model="formData.region"
              class="select"
              :disabled="!isEditing"
            >
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">기업 규모</label>
            <select 
              v-model="formData.size"
              class="select"
              :disabled="!isEditing"
            >
              <option v-for="size in companySizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">웹사이트</label>
            <input 
              v-model="formData.website"
              type="url" 
              class="input"
              placeholder="https://"
              :disabled="!isEditing"
            />
          </div>

          <div class="form-group full-width">
            <label class="label">기업 소개</label>
            <textarea 
              v-model="formData.description"
              class="textarea"
              rows="4"
              :disabled="!isEditing"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="label">연락처 이메일</label>
            <input 
              v-model="formData.contactEmail"
              type="email" 
              class="input"
              :disabled="!isEditing"
            />
          </div>

          <div class="form-group">
            <label class="label">연락처 전화번호</label>
            <input 
              v-model="formData.contactPhone"
              type="tel" 
              class="input"
              :disabled="!isEditing"
            />
          </div>

          <div class="form-group full-width">
            <label class="label">태그</label>
            <input 
              v-model="formData.tags"
              type="text" 
              class="input"
              placeholder="쉼표로 구분하여 입력 (예: AI, 빅데이터, B2B)"
              :disabled="!isEditing"
            />
            <span class="form-hint">쉼표로 구분하여 입력하세요</span>
          </div>
        </div>

        <div v-if="isEditing" class="form-actions">
          <button type="button" class="btn btn-secondary" @click="cancelEditing">
            취소
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner"></span>
            {{ isSaving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.company-avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
}

.profile-info h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.card-header .btn svg {
  width: 16px;
  height: 16px;
}

form {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

.input:disabled,
.select:disabled,
.textarea:disabled {
  background-color: var(--background);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>
