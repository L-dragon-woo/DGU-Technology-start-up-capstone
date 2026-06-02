<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { MOCK_LOGIN_CREDENTIALS } from '@/stores/user'

const props = defineProps<{ mode?: 'login' | 'signup' }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', payload: { email: string; password: string }): void
  (e: 'signup', payload: { name: string; email: string; password: string; companyName: string; position: string; phone: string }): void
}>()

const viewMode = ref(props.mode ?? 'login')
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: MOCK_LOGIN_CREDENTIALS.email,
  password: MOCK_LOGIN_CREDENTIALS.password,
  companyName: '',
  position: '담당자',
  phone: '',
  agreeTerms: false
})

watch(
  () => props.mode,
  (value) => {
    if (value) {
      viewMode.value = value
      errorMessage.value = ''
    }
  }
)

const title = computed(() => (viewMode.value === 'login' ? '로그인' : '회원가입'))
const ctaText = computed(() => (viewMode.value === 'login' ? '로그인' : '계정 생성'))
const switchText = computed(() => (viewMode.value === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'))

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email)
}

function submitForm() {
  errorMessage.value = ''

  if (!validateEmail(form.email)) {
    errorMessage.value = '유효한 이메일을 입력하세요.'
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = '비밀번호는 6자 이상이어야 합니다.'
    return
  }

  if (viewMode.value === 'signup') {
    if (!form.name.trim() || !form.companyName.trim()) {
      errorMessage.value = '이름과 회사명을 입력하세요.'
      return
    }
    if (!form.agreeTerms) {
      errorMessage.value = '이용 약관에 동의해야 합니다.'
      return
    }
    emit('signup', {
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      companyName: form.companyName.trim(),
      position: form.position.trim() || '담당자',
      phone: form.phone.trim() || '010-0000-0000'
    })
    return
  }

  if (form.email !== MOCK_LOGIN_CREDENTIALS.email || form.password !== MOCK_LOGIN_CREDENTIALS.password) {
    errorMessage.value = '이메일 또는 비밀번호가 일치하지 않습니다.'
    return
  }

  emit('login', {
    email: form.email,
    password: form.password
  })
}

function toggleMode() {
  viewMode.value = viewMode.value === 'login' ? 'signup' : 'login'
  errorMessage.value = ''
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="auth-modal-overlay" @click="closeModal">
    <div class="auth-modal" @click.stop>
      <div class="auth-modal-header">
        <div>
          <p class="eyebrow">ROOTMATCHING</p>
          <h2>{{ title }}</h2>
        </div>
        <button class="close-button" type="button" aria-label="닫기" @click="closeModal">x</button>
      </div>

      <p class="auth-modal-description">
        {{ viewMode === 'login' ? '이메일과 비밀번호로 로그인하세요.' : '회원가입 후 RootMatching을 시작하세요.' }}
      </p>

      <div class="auth-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" v-model="form.email" type="email" class="input" placeholder="example@company.com" />
        </div>

        <div v-if="viewMode === 'signup'" class="form-group">
          <label for="name">이름</label>
          <input id="name" v-model="form.name" type="text" class="input" placeholder="홍길동" />
        </div>

        <div v-if="viewMode === 'signup'" class="form-group">
          <label for="companyName">회사명</label>
          <input id="companyName" v-model="form.companyName" type="text" class="input" placeholder="회사명을 입력하세요" />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input id="password" v-model="form.password" type="password" class="input" placeholder="6자 이상 입력" />
        </div>

        <div v-if="viewMode === 'signup'" class="form-grid">
          <div class="form-group">
            <label for="position">직책</label>
            <input id="position" v-model="form.position" type="text" class="input" placeholder="대표 / 담당자" />
          </div>
          <div class="form-group">
            <label for="phone">연락처</label>
            <input id="phone" v-model="form.phone" type="tel" class="input" placeholder="010-1234-5678" />
          </div>
        </div>

        <div v-if="viewMode === 'signup'" class="form-group checkbox-group">
          <input id="agreeTerms" v-model="form.agreeTerms" type="checkbox" />
          <label for="agreeTerms">이용 약관 및 개인정보 처리방침에 동의합니다.</label>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button class="btn btn-primary btn-lg w-full" type="button" @click="submitForm">{{ ctaText }}</button>
        <button class="btn btn-ghost btn-sm w-full" type="button" @click="toggleMode">{{ switchText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 2000;
}

.auth-modal {
  width: min(100%, 520px);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 28px;
  border: 1px solid var(--border);
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.eyebrow {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary);
}

.auth-modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
}

.close-button {
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
}

.auth-modal-description {
  margin-bottom: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.auth-form {
  display: grid;
  gap: 16px;
}

.form-group {
  display: grid;
  gap: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
}

.error-message {
  color: var(--error);
  font-size: 13px;
  margin-bottom: 0;
}

button.w-full {
  width: 100%;
}
</style>
