import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Company } from '@/types'
import { mockCurrentUser } from '@/data/mockData'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(mockCurrentUser)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function updateProfile(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
    }
  }

  function updateCompany(updates: Partial<Company>) {
    if (currentUser.value?.company) {
      currentUser.value.company = { ...currentUser.value.company, ...updates }
    }
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    updateProfile,
    updateCompany,
    logout
  }
})
