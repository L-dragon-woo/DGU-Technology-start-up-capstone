<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthModal from '@/components/common/AuthModal.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const authMode = computed(() => (route.query.mode === 'signup' ? 'signup' : 'login'))
const redirectPath = computed(() => {
  const nextPath = route.query.redirect

  if (typeof nextPath === 'string' && nextPath.startsWith('/')) {
    return nextPath
  }

  return '/dashboard'
})

function handleLogin(payload: { email: string; password: string }) {
  if (userStore.login(payload.email, payload.password)) {
    router.push(redirectPath.value)
  }
}

function handleSignup(payload: { name: string; email: string; password: string; companyName: string; position: string; phone: string }) {
  userStore.register(payload)
  router.push(route.query.role === 'factory' ? '/factory/onboarding' : redirectPath.value)
}

function goHome() {
  router.push({ name: 'landing' })
}
</script>

<template>
  <div class="login-page">
    <AuthModal :mode="authMode" @close="goHome" @login="handleLogin" @signup="handleSignup" />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
