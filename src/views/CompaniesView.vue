<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyStore } from '@/stores/companies'
import { industries, regions, companySizes } from '@/data/mockData'
import CompanyCard from '@/components/companies/CompanyCard.vue'

const route = useRoute()
const companyStore = useCompanyStore()

const selectedIndustry = ref('')
const selectedRegion = ref('')
const selectedSize = ref('')
const keyword = ref('')

onMounted(() => {
  if (route.query.keyword) {
    keyword.value = route.query.keyword as string
    applyFilter()
  }
})

function applyFilter() {
  companyStore.setFilter({
    industry: selectedIndustry.value || undefined,
    region: selectedRegion.value || undefined,
    size: selectedSize.value || undefined,
    keyword: keyword.value || undefined
  })
}

function clearFilter() {
  selectedIndustry.value = ''
  selectedRegion.value = ''
  selectedSize.value = ''
  keyword.value = ''
  companyStore.clearFilter()
}

function handleSearch() {
  applyFilter()
}
</script>

<template>
  <div class="companies-page">
    <header class="page-header">
      <h1>기업 디렉토리</h1>
      <p>비즈니스 파트너를 찾아보세요</p>
    </header>

    <!-- Filters -->
    <section class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            v-model="keyword"
            type="text" 
            placeholder="기업명, 키워드로 검색..." 
            class="input search-input"
            @keyup.enter="handleSearch"
          />
        </div>

        <select v-model="selectedIndustry" class="select" @change="applyFilter">
          <option value="">전체 업종</option>
          <option v-for="industry in industries" :key="industry" :value="industry">
            {{ industry }}
          </option>
        </select>

        <select v-model="selectedRegion" class="select" @change="applyFilter">
          <option value="">전체 지역</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>

        <select v-model="selectedSize" class="select" @change="applyFilter">
          <option value="">전체 규모</option>
          <option v-for="size in companySizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>

        <button class="btn btn-secondary" @click="clearFilter">
          초기화
        </button>
      </div>
    </section>

    <!-- Results -->
    <section class="results-section">
      <div class="results-header">
        <span class="results-count">
          총 <strong>{{ companyStore.filteredCompanies.length }}</strong>개 기업
        </span>
      </div>

      <div v-if="companyStore.filteredCompanies.length > 0" class="companies-grid">
        <CompanyCard 
          v-for="company in companyStore.filteredCompanies" 
          :key="company.id" 
          :company="company"
        />
      </div>

      <div v-else class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 조건으로 검색해 보세요</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.companies-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
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

.filter-section {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-input {
  padding-left: 44px;
}

.select {
  min-width: 140px;
}

.results-section {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.results-header {
  margin-bottom: 20px;
}

.results-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.results-count strong {
  color: var(--text-primary);
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }
}
</style>
