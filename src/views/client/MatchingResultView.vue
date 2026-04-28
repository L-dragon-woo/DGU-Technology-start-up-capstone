<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockFactoryRecommendations } from '@/data/factoryData'
import type { FactoryRecommendation } from '@/types'
import {
  MapPin,
  Settings,
  Clock,
  RefreshCw,
  Wallet,
  Sparkles,
  ChevronDown,
  Check,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-vue-next'

const router = useRouter()

const factories = ref<FactoryRecommendation[]>(mockFactoryRecommendations)

const selectedFactory = ref<FactoryRecommendation | null>(factories.value[0])

// Filter states
const processFilter = ref('')
const regionFilter = ref('')
const trustScoreFilter = ref('')
const deliveryFilter = ref(false)

const processOptions = ['전체', '금형', '소성가공', '용접', '표면처리', '주조', '열처리']
const regionOptions = ['전체', '서울', '경기', '인천']
const trustScoreOptions = ['전체', '90점 이상', '85점 이상', '80점 이상']

const filteredFactories = computed(() => {
  return factories.value.filter(factory => {
    if (processFilter.value && processFilter.value !== '전체') {
      if (!factory.processes.includes(processFilter.value)) return false
    }
    if (regionFilter.value && regionFilter.value !== '전체') {
      if (!factory.location.includes(regionFilter.value)) return false
    }
    if (trustScoreFilter.value && trustScoreFilter.value !== '전체') {
      const minScore = parseInt(trustScoreFilter.value)
      if (factory.trustScore < minScore) return false
    }
    if (deliveryFilter.value && factory.deliveryRate < 90) {
      return false
    }
    return true
  })
})

function selectFactory(factory: FactoryRecommendation) {
  selectedFactory.value = factory
}

function goToDetail(id: string) {
  router.push(`/factories/${id}`)
}

function requestQuote() {
  router.push('/contract')
}

function formatPrice(value: number): string {
  return `${value}만원`
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 80) return 'text-blue-600'
  return 'text-amber-600'
}

function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-emerald-50 border-emerald-200'
  if (score >= 80) return 'bg-blue-50 border-blue-200'
  return 'bg-amber-50 border-amber-200'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">AI 추천 공장</h1>
        </div>
        <p class="text-slate-600 ml-13">
          입력한 요구사항을 기반으로 가장 적합한 공장을 추천했습니다.
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <!-- Process Filter -->
          <div class="relative min-w-[160px]">
            <label class="block text-xs font-medium text-slate-500 mb-1">공정</label>
            <div class="relative">
              <select
                v-model="processFilter"
                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="option in processOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <!-- Region Filter -->
          <div class="relative min-w-[160px]">
            <label class="block text-xs font-medium text-slate-500 mb-1">지역</label>
            <div class="relative">
              <select
                v-model="regionFilter"
                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="option in regionOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <!-- Trust Score Filter -->
          <div class="relative min-w-[160px]">
            <label class="block text-xs font-medium text-slate-500 mb-1">신뢰 점수</label>
            <div class="relative">
              <select
                v-model="trustScoreFilter"
                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="option in trustScoreOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <!-- Delivery Filter -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
              <input
                type="checkbox"
                v-model="deliveryFilter"
                class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span class="text-sm text-slate-700">납기 가능</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Factory Cards List -->
        <div class="flex-1 space-y-4">
          <div
            v-for="factory in filteredFactories"
            :key="factory.id"
            @click="selectFactory(factory)"
            class="bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
            :class="[
              selectedFactory?.id === factory.id
                ? 'border-blue-500 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            ]"
          >
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-slate-900">{{ factory.name }}</h3>
                  <span
                    :class="[getScoreBg(factory.trustScore), 'px-2.5 py-0.5 rounded-full text-xs font-semibold border', getScoreColor(factory.trustScore)]"
                  >
                    신뢰 {{ factory.trustScore }}점
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin class="w-4 h-4" />
                  <span>{{ factory.location }}</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="process in factory.processes"
                  :key="process"
                  class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                >
                  {{ process }}
                </span>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Clock class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">납기 준수율</p>
                  <p class="text-sm font-semibold text-slate-900">{{ factory.deliveryRate }}%</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <RefreshCw class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">재거래율</p>
                  <p class="text-sm font-semibold text-slate-900">{{ factory.reorderRate }}%</p>
                </div>
              </div>
              <div class="flex items-center gap-2 col-span-2 sm:col-span-2">
                <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Wallet class="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p class="text-xs text-slate-500">예상 견적</p>
                  <p class="text-sm font-semibold text-slate-900">
                    {{ formatPrice(factory.estimateMin) }} ~ {{ formatPrice(factory.estimateMax) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- AI Reason -->
            <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
              <Sparkles class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p class="text-sm text-blue-800">{{ factory.aiReason }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click.stop="goToDetail(factory.id)"
                class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                상세 보기
              </button>
              <button
                @click.stop="requestQuote"
                class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                견적 요청
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredFactories.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings class="w-8 h-8 text-slate-400" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">검색 결과가 없습니다</h3>
            <p class="text-slate-500">필터 조건을 변경해 보세요.</p>
          </div>
        </div>

        <!-- Comparison Panel -->
        <div class="lg:w-80 lg:sticky lg:top-8 lg:self-start">
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div class="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
              <h3 class="text-white font-semibold flex items-center gap-2">
                <TrendingUp class="w-5 h-5" />
                선택한 공장 비교
              </h3>
            </div>

            <div v-if="selectedFactory" class="p-5">
              <div class="mb-4 pb-4 border-b border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-1">{{ selectedFactory.name }}</h4>
                <p class="text-sm text-slate-500">{{ selectedFactory.location }}</p>
              </div>

              <div class="space-y-4">
                <!-- Quality Score -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <Shield class="w-4 h-4 text-emerald-600" />
                      <span class="text-sm font-medium text-slate-700">품질 점수</span>
                    </div>
                    <span class="text-sm font-semibold text-slate-900">{{ selectedFactory.qualityScore }}점</span>
                  </div>
                  <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      :style="{ width: `${selectedFactory.qualityScore}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Delivery Score -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <Clock class="w-4 h-4 text-blue-600" />
                      <span class="text-sm font-medium text-slate-700">납기 점수</span>
                    </div>
                    <span class="text-sm font-semibold text-slate-900">{{ selectedFactory.deliveryScore }}점</span>
                  </div>
                  <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-blue-500 rounded-full transition-all duration-500"
                      :style="{ width: `${selectedFactory.deliveryScore}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Price Competitiveness -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <Zap class="w-4 h-4 text-amber-600" />
                      <span class="text-sm font-medium text-slate-700">가격 경쟁력</span>
                    </div>
                    <span class="text-sm font-semibold text-slate-900">{{ selectedFactory.priceCompetitiveness }}점</span>
                  </div>
                  <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-amber-500 rounded-full transition-all duration-500"
                      :style="{ width: `${selectedFactory.priceCompetitiveness}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- AI Summary -->
              <div class="mt-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <Sparkles class="w-4 h-4 text-blue-600" />
                  <span class="text-sm font-semibold text-slate-900">종합 추천 이유</span>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {{ selectedFactory.aiReason }}
                </p>
              </div>

              <!-- CTA Button -->
              <button
                @click="requestQuote"
                class="w-full mt-5 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check class="w-4 h-4" />
                이 공장에 견적 요청
              </button>
            </div>

            <div v-else class="p-8 text-center">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings class="w-6 h-6 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500">공장을 선택하면<br />상세 비교 정보를 확인할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
