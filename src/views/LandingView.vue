<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  Search,
  Shield,
  Scale,
  TrendingUp,
  Clock,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
  FileSignature,
  ArrowRight,
  Factory,
  Building2,
  Menu,
  X
} from 'lucide-vue-next'
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const metrics = [
  {
    icon: Clock,
    before: '14일',
    after: '3일',
    label: '파트너 탐색 기간',
    description: '기존 대비 78% 단축'
  },
  {
    icon: TrendingUp,
    value: '20%+',
    label: '신규 수주 증가',
    description: '플랫폼 활용 시 기대'
  },
  {
    icon: Settings,
    value: '6대',
    label: '공정 특화 매칭',
    description: '주조·금형·소성가공·용접·표면처리·열처리'
  },
  {
    icon: Shield,
    value: '통합',
    label: '계약·결제·분쟁 관리',
    description: '원스톱 서비스 제공'
  }
]

const factoryPains = [
  { icon: Users, text: '영업 인력 부재로 신규 고객 발굴 어려움' },
  { icon: AlertTriangle, text: '기존 거래처 의존도 높아 리스크 집중' },
  { icon: TrendingUp, text: '매출 성장 정체 및 수주 불안정' }
]

const clientPains = [
  { icon: Search, text: '신뢰할 수 있는 공장 탐색의 어려움' },
  { icon: AlertTriangle, text: '품질 불량 및 납기 지연 리스크' },
  { icon: Scale, text: '대금 분쟁 및 계약 불이행 위험' }
]

const solutions = [
  {
    layer: 'LAYER 1',
    title: 'AI 수주 매칭 엔진',
    description: '공정별 전문성, 설비 역량, 평판 데이터를 기반으로 최적의 파트너를 자동 매칭합니다.',
    icon: Zap,
    features: ['6대 공정 특화 분석', '설비·인증 기반 필터링', '실시간 가용량 확인']
  },
  {
    layer: 'LAYER 2',
    title: '안심 계약 시스템',
    description: '표준 계약서, 전자서명, 에스크로 결제로 거래의 신뢰를 보장합니다.',
    icon: FileSignature,
    features: ['법률 검토 완료 표준 계약서', '공인 전자서명', '에스크로 안전 결제']
  },
  {
    layer: 'LAYER 3',
    title: '분쟁 중재 시스템',
    description: '전문 중재 위원회가 공정하고 신속하게 분쟁을 해결합니다.',
    icon: Scale,
    features: ['전문가 중재 위원회', '투명한 처리 프로세스', '이행 보증 제도']
  }
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Factory class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">ROOTMATCHING</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <a href="#service" class="text-gray-600 hover:text-blue-600 transition-colors">서비스 소개</a>
            <a href="#matching" class="text-gray-600 hover:text-blue-600 transition-colors">AI 매칭</a>
            <a href="#contract" class="text-gray-600 hover:text-blue-600 transition-colors">안심 계약</a>
            <a href="#contact" class="text-gray-600 hover:text-blue-600 transition-colors">문의</a>
          </nav>

          <!-- Desktop CTA -->
          <div class="hidden md:flex items-center gap-3">
            <RouterLink
              to="/login"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              로그인
            </RouterLink>
            <RouterLink
              to="/client/request"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              견적 요청하기
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100">
          <nav class="flex flex-col gap-3">
            <a href="#service" class="px-3 py-2 text-gray-600 hover:text-blue-600">서비스 소개</a>
            <a href="#matching" class="px-3 py-2 text-gray-600 hover:text-blue-600">AI 매칭</a>
            <a href="#contract" class="px-3 py-2 text-gray-600 hover:text-blue-600">안심 계약</a>
            <a href="#contact" class="px-3 py-2 text-gray-600 hover:text-blue-600">문의</a>
            <div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
              <RouterLink to="/login" class="px-3 py-2 text-gray-700">로그인</RouterLink>
              <RouterLink
                to="/client/request"
                class="mx-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-center font-medium"
              >
                견적 요청하기
              </RouterLink>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          AI로 찾는 신뢰 기반<br class="hidden sm:block" />
          <span class="text-blue-600">뿌리산업 수주 매칭</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          공장 탐색부터 견적, 계약, 결제, 분쟁 중재까지<br class="hidden sm:block" />
          한 번에 관리하세요.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink
            to="/client/request"
            class="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
          >
            <Building2 class="w-5 h-5" />
            발주처로 견적 요청하기
            <ArrowRight class="w-5 h-5" />
          </RouterLink>
          <RouterLink
            to="/factory/onboarding"
            class="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Factory class="w-5 h-5" />
            공장 등록하기
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Metrics Section -->
    <section id="service" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">핵심 성과 지표</h2>
          <p class="text-gray-600 text-lg">RootMatching이 만들어내는 변화</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <component :is="metric.icon" class="w-6 h-6 text-blue-600" />
            </div>
            <div v-if="metric.before" class="flex items-center gap-2 mb-2">
              <span class="text-gray-400 line-through">{{ metric.before }}</span>
              <ArrowRight class="w-4 h-4 text-blue-600" />
              <span class="text-2xl font-bold text-blue-600">{{ metric.after }}</span>
            </div>
            <div v-else class="text-2xl font-bold text-blue-600 mb-2">{{ metric.value }}</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ metric.label }}</h3>
            <p class="text-sm text-gray-500">{{ metric.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pain Points Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">이런 고민, 있으신가요?</h2>
          <p class="text-gray-600 text-lg">공장과 발주처 모두가 겪는 어려움을 해결합니다</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Factory Pain Points -->
          <div class="bg-white rounded-2xl p-8 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Factory class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">공장의 어려움</h3>
            </div>
            <ul class="space-y-4">
              <li
                v-for="pain in factoryPains"
                :key="pain.text"
                class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <component :is="pain.icon" class="w-4 h-4 text-red-500" />
                </div>
                <span class="text-gray-700">{{ pain.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Client Pain Points -->
          <div class="bg-white rounded-2xl p-8 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Building2 class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">발주처의 어려움</h3>
            </div>
            <ul class="space-y-4">
              <li
                v-for="pain in clientPains"
                :key="pain.text"
                class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <component :is="pain.icon" class="w-4 h-4 text-red-500" />
                </div>
                <span class="text-gray-700">{{ pain.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions Section -->
    <section id="matching" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">RootMatching의 솔루션</h2>
          <p class="text-gray-600 text-lg">3단계 시스템으로 안전하고 효율적인 거래를 보장합니다</p>
        </div>
        <div class="space-y-6">
          <div
            v-for="solution in solutions"
            :key="solution.layer"
            class="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow"
          >
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                  <component :is="solution.icon" class="w-7 h-7 text-white" />
                </div>
                <div>
                  <span class="text-sm font-semibold text-blue-600">{{ solution.layer }}</span>
                  <h3 class="text-xl font-bold text-gray-900">{{ solution.title }}</h3>
                </div>
              </div>
              <div class="flex-1 lg:pl-6 lg:border-l lg:border-blue-200">
                <p class="text-gray-600 mb-4">{{ solution.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="feature in solution.features"
                    :key="feature"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-full text-sm text-gray-700"
                  >
                    <CheckCircle class="w-4 h-4 text-blue-600" />
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contract" class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          지금 바로 시작하세요
        </h2>
        <p class="text-blue-100 text-lg mb-8">
          RootMatching과 함께 새로운 비즈니스 기회를 만나보세요
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink
            to="/client/request"
            class="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
          >
            발주처로 시작하기
            <ArrowRight class="w-5 h-5" />
          </RouterLink>
          <RouterLink
            to="/factory/onboarding"
            class="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white border-2 border-white/30 rounded-xl hover:bg-blue-800 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
          >
            공장 등록하기
            <ArrowRight class="w-5 h-5" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <!-- Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Factory class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-white">ROOTMATCHING</span>
            </div>
            <p class="text-gray-400 mb-4">
              뿌리산업 공장과 발주처를 연결하는<br />
              신뢰 기반 B2B 수주 매칭 플랫폼
            </p>
            <div class="space-y-2 text-sm">
              <p>사업자등록번호: 000-00-00000</p>
              <p>대표: 홍길동</p>
              <p>주소: 서울특별시 강남구 테헤란로 123</p>
              <p>이메일: contact@rootmatching.kr</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-4">서비스</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-blue-400 transition-colors">AI 매칭</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">안심 계약</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">에스크로 결제</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">분쟁 중재</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-semibold mb-4">고객지원</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-blue-400 transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">이용 가이드</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">1:1 문의</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">공지사항</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm">&copy; 2024 RootMatching. All rights reserved.</p>
          <div class="flex items-center gap-6 text-sm">
            <a href="#" class="hover:text-blue-400 transition-colors">이용약관</a>
            <a href="#" class="hover:text-blue-400 transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
