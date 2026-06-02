<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCompanyStore } from '@/stores/companies'
import { useUserStore } from '@/stores/user'
import { companySizes, industries, regions } from '@/data/mockData'
import type { Company, CompanyPortfolioItem } from '@/types'

const userStore = useUserStore()
const companyStore = useCompanyStore()

const isEditing = ref(false)
const isSaving = ref(false)

const profileColors = [
  { label: 'Blue', value: '#4f66e5' },
  { label: 'Green', value: '#059669' },
  { label: 'Slate', value: '#475569' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Amber', value: '#d97706' }
]

function companyToForm(company?: Company) {
  const portfolio = company?.portfolio ?? []

  return {
    name: company?.name || '',
    industry: company?.industry || '',
    region: company?.region || '',
    size: company?.size || '',
    headline: company?.headline || '',
    description: company?.description || '',
    contactEmail: company?.contactEmail || '',
    contactPhone: company?.contactPhone || '',
    website: company?.website || '',
    tags: company?.tags.join(', ') || '',
    strengths: company?.strengths?.join(', ') || '',
    certifications: company?.certifications.join(', ') || '',
    establishedYear: String(company?.establishedYear || new Date().getFullYear()),
    employeeCount: String(company?.employeeCount || 1),
    revenue: company?.revenue || '',
    profileColor: company?.profileColor || profileColors[0].value,
    portfolioTitle1: portfolio[0]?.title || '',
    portfolioDescription1: portfolio[0]?.description || '',
    portfolioTitle2: portfolio[1]?.title || '',
    portfolioDescription2: portfolio[1]?.description || ''
  }
}

const formData = ref(companyToForm(userStore.currentUser?.company))

const initials = computed(() => formData.value.name.slice(0, 2) || '회사')

const previewTags = computed(() => splitList(formData.value.tags).slice(0, 4))
const previewStrengths = computed(() => splitList(formData.value.strengths).slice(0, 4))
const previewCertifications = computed(() => splitList(formData.value.certifications))
const previewPortfolio = computed(() => buildPortfolio())

function splitList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function buildPortfolio(): CompanyPortfolioItem[] {
  return [
    {
      title: formData.value.portfolioTitle1.trim(),
      description: formData.value.portfolioDescription1.trim()
    },
    {
      title: formData.value.portfolioTitle2.trim(),
      description: formData.value.portfolioDescription2.trim()
    }
  ].filter(item => item.title || item.description)
}

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  formData.value = companyToForm(userStore.currentUser?.company)
}

async function saveProfile() {
  if (!userStore.currentUser?.company) return

  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  const companyUpdates: Partial<Company> = {
    name: formData.value.name,
    industry: formData.value.industry,
    region: formData.value.region,
    size: formData.value.size,
    headline: formData.value.headline,
    description: formData.value.description,
    contactEmail: formData.value.contactEmail,
    contactPhone: formData.value.contactPhone,
    website: formData.value.website,
    tags: splitList(formData.value.tags),
    strengths: splitList(formData.value.strengths),
    certifications: splitList(formData.value.certifications),
    establishedYear: Number(formData.value.establishedYear) || new Date().getFullYear(),
    employeeCount: Number(formData.value.employeeCount) || 1,
    revenue: formData.value.revenue,
    profileColor: formData.value.profileColor,
    portfolio: buildPortfolio()
  }

  userStore.updateCompany(companyUpdates)
  companyStore.updateCompany(userStore.currentUser.company.id, companyUpdates)

  isSaving.value = false
  isEditing.value = false
}
</script>

<template>
  <div class="profile-view">
    <section class="profile-preview">
      <div class="preview-hero" :style="{ '--profile-color': formData.profileColor }">
        <div class="preview-avatar">{{ initials }}</div>
        <div class="preview-main">
          <span class="preview-label">공개 회사 프로필</span>
          <h2>{{ formData.name || '회사명을 입력하세요' }}</h2>
          <p>{{ formData.headline || '다른 회사가 한눈에 이해할 수 있는 한 줄 소개를 입력하세요.' }}</p>
          <div class="preview-meta">
            <span>{{ formData.industry || '업종' }}</span>
            <span>{{ formData.region || '지역' }}</span>
            <span>{{ formData.employeeCount || 0 }}명</span>
            <span>{{ formData.establishedYear || '-' }}년 설립</span>
          </div>
        </div>
        <button v-if="!isEditing" class="btn btn-secondary" type="button" @click="startEditing">
          프로필 꾸미기
        </button>
      </div>

      <div class="preview-grid">
        <div class="preview-panel">
          <h3>핵심 강점</h3>
          <div v-if="previewStrengths.length" class="chip-list">
            <span v-for="strength in previewStrengths" :key="strength" class="chip strong">{{ strength }}</span>
          </div>
          <p v-else>강점을 입력하면 회사 상세 화면에서 더 잘 보입니다.</p>
        </div>

        <div class="preview-panel">
          <h3>태그</h3>
          <div v-if="previewTags.length" class="chip-list">
            <span v-for="tag in previewTags" :key="tag" class="chip">{{ tag }}</span>
          </div>
          <p v-else>검색에 걸릴 키워드를 입력하세요.</p>
        </div>

        <div class="preview-panel">
          <h3>인증/자격</h3>
          <div v-if="previewCertifications.length" class="chip-list">
            <span v-for="certification in previewCertifications" :key="certification" class="chip cert">
              {{ certification }}
            </span>
          </div>
          <p v-else>인증을 입력하면 회사 신뢰 배지로 표시됩니다.</p>
        </div>

        <div class="preview-panel wide">
          <h3>대표 프로젝트</h3>
          <div v-if="previewPortfolio.length" class="portfolio-preview">
            <article v-for="item in previewPortfolio" :key="item.title || item.description">
              <strong>{{ item.title || '프로젝트명' }}</strong>
              <p>{{ item.description || '프로젝트 설명을 입력하세요.' }}</p>
            </article>
          </div>
          <p v-else>대표 납품, 협업, 구축 사례를 추가해 신뢰도를 높이세요.</p>
        </div>
      </div>
    </section>

    <div class="card profile-card">
      <div class="card-header">
        <div>
          <h2>프로필 정보</h2>
          <p>저장한 내용은 회사 목록과 회사 상세 프로필에 반영됩니다.</p>
        </div>
      </div>

      <form @submit.prevent="saveProfile">
        <div class="form-section">
          <h3>기본 정보</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="label">회사명</label>
              <input v-model="formData.name" type="text" class="input" :disabled="!isEditing" />
            </div>

            <div class="form-group full-width">
              <label class="label">한 줄 소개</label>
              <input
                v-model="formData.headline"
                type="text"
                class="input"
                placeholder="예: AI 기반 제조 품질 분석 솔루션을 제공합니다"
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group">
              <label class="label">업종</label>
              <select v-model="formData.industry" class="select" :disabled="!isEditing">
                <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">지역</label>
              <select v-model="formData.region" class="select" :disabled="!isEditing">
                <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">기업 규모</label>
              <select v-model="formData.size" class="select" :disabled="!isEditing">
                <option v-for="size in companySizes" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">웹사이트</label>
              <input v-model="formData.website" type="url" class="input" placeholder="https://" :disabled="!isEditing" />
            </div>

            <div class="form-group full-width">
              <label class="label">회사 소개</label>
              <textarea v-model="formData.description" class="textarea" rows="4" :disabled="!isEditing"></textarea>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>공개 신뢰 정보</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="label">설립연도</label>
              <input v-model="formData.establishedYear" type="number" class="input" :disabled="!isEditing" />
            </div>

            <div class="form-group">
              <label class="label">직원 수</label>
              <input v-model="formData.employeeCount" type="number" class="input" :disabled="!isEditing" />
            </div>

            <div class="form-group">
              <label class="label">매출 규모</label>
              <input v-model="formData.revenue" type="text" class="input" placeholder="예: 50억원" :disabled="!isEditing" />
            </div>

            <div class="form-group">
              <label class="label">프로필 컬러</label>
              <div class="color-picker">
                <button
                  v-for="color in profileColors"
                  :key="color.value"
                  type="button"
                  class="color-swatch"
                  :class="{ active: formData.profileColor === color.value }"
                  :style="{ backgroundColor: color.value }"
                  :disabled="!isEditing"
                  :aria-label="color.label"
                  @click="formData.profileColor = color.value"
                ></button>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="label">핵심 강점</label>
              <input
                v-model="formData.strengths"
                type="text"
                class="input"
                placeholder="쉼표로 구분: 빠른 응답, 품질 관리, 대량 생산"
                :disabled="!isEditing"
              />
            </div>

            <div class="form-group full-width">
              <label class="label">인증/자격</label>
              <input
                v-model="formData.certifications"
                type="text"
                class="input"
                placeholder="쉼표로 구분: ISO 9001, 벤처기업인증"
                :disabled="!isEditing"
              />
              <span class="form-hint">인증은 회사 상세 화면에서 신뢰 배지로 표시됩니다.</span>
            </div>

            <div class="form-group full-width">
              <label class="label">검색 태그</label>
              <input
                v-model="formData.tags"
                type="text"
                class="input"
                placeholder="쉼표로 구분: AI, 제조, B2B"
                :disabled="!isEditing"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>대표 프로젝트</h3>
          <div class="portfolio-form">
            <div class="portfolio-fields">
              <input v-model="formData.portfolioTitle1" type="text" class="input" placeholder="프로젝트명" :disabled="!isEditing" />
              <textarea v-model="formData.portfolioDescription1" class="textarea" rows="3" placeholder="성과, 납품 품목, 협업 내용을 입력하세요" :disabled="!isEditing"></textarea>
            </div>
            <div class="portfolio-fields">
              <input v-model="formData.portfolioTitle2" type="text" class="input" placeholder="프로젝트명" :disabled="!isEditing" />
              <textarea v-model="formData.portfolioDescription2" class="textarea" rows="3" placeholder="성과, 납품 품목, 협업 내용을 입력하세요" :disabled="!isEditing"></textarea>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>연락처</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="label">연락 이메일</label>
              <input v-model="formData.contactEmail" type="email" class="input" :disabled="!isEditing" />
            </div>

            <div class="form-group">
              <label class="label">연락 전화번호</label>
              <input v-model="formData.contactPhone" type="tel" class="input" :disabled="!isEditing" />
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="form-actions">
          <button type="button" class="btn btn-secondary" @click="cancelEditing">취소</button>
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
.profile-view {
  display: grid;
  gap: 24px;
}

.profile-preview {
  display: grid;
  gap: 16px;
}

.preview-hero {
  --profile-color: #4f66e5;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--border);
  border-left: 6px solid var(--profile-color);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.preview-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--profile-color) 14%, white);
  color: var(--profile-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
}

.preview-main {
  min-width: 0;
}

.preview-label {
  display: block;
  margin-bottom: 6px;
  color: var(--profile-color);
  font-size: 12px;
  font-weight: 700;
}

.preview-main h2,
.card-header h2 {
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
}

.preview-main p,
.card-header p,
.preview-panel p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.preview-meta span {
  padding: 5px 10px;
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.preview-panel {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.preview-panel.wide {
  grid-column: 1 / -1;
}

.preview-panel h3,
.form-section h3 {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
}

.chip.strong {
  background: #ecfdf5;
  color: #047857;
}

.chip.cert {
  background: #eff6ff;
  color: #1d4ed8;
}

.portfolio-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.portfolio-preview article {
  padding: 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--background);
}

.portfolio-preview strong {
  display: block;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.profile-card {
  padding: 0;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

form {
  padding: 24px;
}

.form-section + .form-section {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-hint {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 12px;
}

.color-picker {
  display: flex;
  gap: 10px;
  min-height: 44px;
  align-items: center;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 50%;
}

.color-swatch.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--border);
}

.color-swatch:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.portfolio-form {
  display: grid;
  gap: 16px;
}

.portfolio-fields {
  display: grid;
  gap: 10px;
}

.input:disabled,
.select:disabled,
.textarea:disabled {
  background-color: var(--background);
  cursor: not-allowed;
  opacity: 0.75;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

@media (max-width: 760px) {
  .preview-hero {
    grid-template-columns: 1fr;
  }

  .preview-grid,
  .portfolio-preview,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>
