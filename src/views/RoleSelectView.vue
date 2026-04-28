<script setup lang="ts">
import { Building2, Factory, Check } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const roles = [
  {
    id: 'client',
    icon: Building2,
    title: '발주처',
    description: '제작 가능한 공장을 찾고 견적을 비교하고 싶어요.',
    features: [
      '수주 요청 등록',
      'AI 추천 공장 비교',
      '계약 및 결제 관리'
    ],
    buttonText: '발주 요청 시작하기',
    route: '/client/request'
  },
  {
    id: 'factory',
    icon: Factory,
    title: '공장',
    description: '내 공장을 등록하고 신규 수주를 받고 싶어요.',
    features: [
      '공장 프로필 등록',
      '포트폴리오 관리',
      '견적 제출 및 정산'
    ],
    buttonText: '공장 등록 시작하기',
    route: '/factory/onboarding'
  }
]

function selectRole(route: string) {
  router.push(route)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-slate-900 mb-3">
          어떤 목적으로 RootMatching을 사용하시나요?
        </h1>
        <p class="text-lg text-slate-600">
          사용 목적에 따라 맞춤형 기능을 제공합니다.
        </p>
      </div>

      <!-- Role Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="role in roles"
          :key="role.id"
          class="group bg-white rounded-2xl border border-slate-200 p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-emerald-300"
          @click="selectRole(role.route)"
        >
          <!-- Icon -->
          <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
            <component 
              :is="role.icon" 
              class="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" 
            />
          </div>

          <!-- Title & Description -->
          <h2 class="text-2xl font-bold text-slate-900 mb-3">
            {{ role.title }}
          </h2>
          <p class="text-slate-600 mb-6 leading-relaxed">
            {{ role.description }}
          </p>

          <!-- Features -->
          <ul class="space-y-3 mb-8">
            <li 
              v-for="feature in role.features" 
              :key="feature"
              class="flex items-center gap-3 text-slate-700"
            >
              <div class="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check class="w-3 h-3 text-emerald-600" />
              </div>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <!-- Button -->
          <button
            class="w-full py-4 px-6 bg-slate-900 text-white font-semibold rounded-xl transition-all duration-300 group-hover:bg-emerald-600"
          >
            {{ role.buttonText }}
          </button>
        </div>
      </div>

      <!-- Footer Link -->
      <p class="text-center mt-8 text-slate-500">
        이미 계정이 있으신가요?
        <router-link to="/dashboard" class="text-emerald-600 hover:text-emerald-700 font-medium">
          로그인하기
        </router-link>
      </p>
    </div>
  </div>
</template>
