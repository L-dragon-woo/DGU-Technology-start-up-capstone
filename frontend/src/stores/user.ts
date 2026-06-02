import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Company } from '@/types'
import { mockCurrentUser } from '@/data/mockData'

export const MOCK_LOGIN_CREDENTIALS = {
  email: 'hong@techsolution.co.kr',
  password: '123456'
} as const

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function login(email: string, password: string) {
    if (email !== MOCK_LOGIN_CREDENTIALS.email || password !== MOCK_LOGIN_CREDENTIALS.password) {
      return false
    }

    currentUser.value = {
      ...mockCurrentUser,
      id: `user-${Date.now()}`,
      email,
      name: mockCurrentUser.name
    }
    return true
  }

  function register(payload: {
    name: string
    email: string
    password: string
    companyName: string
    position: string
    phone: string
  }) {
    currentUser.value = {
      id: `user-${Date.now()}`,
      email: payload.email,
      name: payload.name,
      position: payload.position,
      phone: payload.phone,
      role: 'member',
      company: {
        id: `company-${Date.now()}`,
        name: payload.companyName,
        industry: '제조/서비스',
        region: '서울',
        size: '중소기업',
        description: `${payload.companyName} 회원사`,
        tags: ['회원가입'],
        contactEmail: payload.email,
        contactPhone: payload.phone,
        website: '',
        establishedYear: new Date().getFullYear(),
        employeeCount: 10,
        certifications: [],
        createdAt: new Date().toISOString()
      }
    }
  }

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
    login,
    register,
    updateProfile,
    updateCompany,
    logout
  }
})
