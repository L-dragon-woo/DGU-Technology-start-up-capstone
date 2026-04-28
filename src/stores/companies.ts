import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company, CompanyFilter } from '@/types'
import { mockCompanies } from '@/data/mockData'

export const useCompanyStore = defineStore('companies', () => {
  const companies = ref<Company[]>(mockCompanies)
  const filter = ref<CompanyFilter>({})
  const favorites = ref<string[]>([])

  const filteredCompanies = computed(() => {
    let result = [...companies.value]

    if (filter.value.industry) {
      result = result.filter(c => c.industry === filter.value.industry)
    }

    if (filter.value.region) {
      result = result.filter(c => c.region === filter.value.region)
    }

    if (filter.value.size) {
      result = result.filter(c => c.size === filter.value.size)
    }

    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(keyword) ||
        c.description.toLowerCase().includes(keyword) ||
        c.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    }

    return result
  })

  function setFilter(newFilter: CompanyFilter) {
    filter.value = newFilter
  }

  function clearFilter() {
    filter.value = {}
  }

  function getCompanyById(id: string) {
    return companies.value.find(c => c.id === id)
  }

  function toggleFavorite(companyId: string) {
    const index = favorites.value.indexOf(companyId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(companyId)
    }
  }

  function isFavorite(companyId: string) {
    return favorites.value.includes(companyId)
  }

  const favoriteCompanies = computed(() => 
    companies.value.filter(c => favorites.value.includes(c.id))
  )

  return {
    companies,
    filter,
    favorites,
    filteredCompanies,
    favoriteCompanies,
    setFilter,
    clearFilter,
    getCompanyById,
    toggleFavorite,
    isFavorite
  }
})
