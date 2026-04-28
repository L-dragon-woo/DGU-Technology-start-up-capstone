<script setup lang="ts">
import { computed } from 'vue'
import type { Company } from '@/types'
import { useCompanyStore } from '@/stores/companies'

const props = defineProps<{
  company: Company
  compact?: boolean
}>()

const companyStore = useCompanyStore()

const isFavorite = computed(() => companyStore.isFavorite(props.company.id))

const initials = computed(() => {
  return props.company.name.slice(0, 2)
})

function toggleFavorite(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  companyStore.toggleFavorite(props.company.id)
}
</script>

<template>
  <RouterLink 
    :to="`/companies/${company.id}`" 
    class="company-card"
    :class="{ compact }"
  >
    <div class="card-header">
      <div class="company-avatar">
        {{ initials }}
      </div>
      <div class="company-info">
        <h3 class="company-name">{{ company.name }}</h3>
        <div class="company-meta">
          <span>{{ company.industry }}</span>
          <span class="separator">|</span>
          <span>{{ company.region }}</span>
          <span class="separator">|</span>
          <span>{{ company.size }}</span>
        </div>
      </div>
      <button 
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <p v-if="!compact" class="company-description">
      {{ company.description }}
    </p>

    <div class="company-tags">
      <span v-for="tag in company.tags.slice(0, 4)" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.company-card {
  display: block;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all 0.2s ease;
}

.company-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.company-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.company-info {
  flex: 1;
  min-width: 0;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.separator {
  color: var(--border);
}

.favorite-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background-color: var(--background);
}

.favorite-btn.active {
  color: #ef4444;
}

.favorite-btn svg {
  width: 20px;
  height: 20px;
}

.company-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.company-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  background-color: var(--primary-light);
  border-radius: 9999px;
}

.compact .card-header {
  margin-bottom: 8px;
}

.compact .company-tags {
  display: none;
}
</style>
