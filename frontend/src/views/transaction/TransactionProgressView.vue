<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ClipboardCheck,
  Factory,
  FileUp,
  Gauge,
  PackageCheck,
  PencilLine,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserRound
} from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import ProcessStepper from '@/components/common/ProcessStepper.vue'
import { transactionCases, transactionSteps, type TransactionUpdate } from '@/data/transactionData'
import { useWorkflowStore } from '@/stores/workflow'

type ViewerRole = 'client' | 'factory'

const router = useRouter()
const route = useRoute()
const workflowStore = useWorkflowStore()

const progressInput = ref<number | null>(null)
const updateTitle = ref('')
const updateDescription = ref('')
const localUpdates = ref<TransactionUpdate[]>([])

const transaction = computed(() => transactionCases.find((item) => item.id === route.params.id) ?? transactionCases[0])
const viewerRole = ref<ViewerRole>(route.query.mode === 'factory' || transaction.value.myRole === 'factory' ? 'factory' : 'client')
const canUpdateProgress = computed(() => transaction.value.myRole === 'factory' || route.query.mode === 'factory')

const currentProgress = computed(() => {
  const input = progressInput.value ?? transaction.value.progressRate
  return Math.min(100, Math.max(0, input))
})

const displayedUpdates = computed(() => [...localUpdates.value, ...transaction.value.updates])

const progressStage = computed(() => {
  const rate = currentProgress.value
  if (rate >= 100) return '납품 및 검수 단계'
  if (rate >= 75) return '마감 작업 및 출하 준비'
  if (rate >= 50) return '주요 가공/제작 진행'
  if (rate >= 25) return '자재 입고 및 초도 작업'
  return '계약/작업 준비'
})

const progressCheckpoints = computed(() => [
  { label: '계약/결제 완료', percent: 10, done: currentProgress.value >= 10 },
  { label: '자재 준비', percent: 25, done: currentProgress.value >= 25 },
  { label: '주요 제작 진행', percent: 50, done: currentProgress.value >= 50 },
  { label: '마감/품질 확인', percent: 75, done: currentProgress.value >= 75 },
  { label: '납품/검수 대기', percent: 100, done: currentProgress.value >= 100 }
])

watch(
  transaction,
  (nextTransaction) => {
    progressInput.value = nextTransaction.progressRate
    if (route.query.mode !== 'factory') {
      viewerRole.value = nextTransaction.myRole === 'factory' ? 'factory' : 'client'
    }
  },
  { immediate: true }
)

function setRole(role: ViewerRole) {
  viewerRole.value = role
}

function submitProgressUpdate() {
  const title = updateTitle.value.trim() || progressStage.value
  const description = updateDescription.value.trim() || `공장이 현재 진행률을 ${currentProgress.value}%로 업데이트했습니다.`

  localUpdates.value.unshift({
    title,
    description,
    date: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  updateTitle.value = ''
  updateDescription.value = ''
}

function approveInspection() {
  workflowStore.approveInspection()
  router.push('/transaction/review')
}

function reportIssue() {
  router.push('/disputes/mediation')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <RouterLink
        to="/transactions"
        class="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
      >
        <ArrowLeft class="h-4 w-4" />
        거래 진행 현황으로 돌아가기
      </RouterLink>

      <header class="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <AppBadge variant="blue">
              <ShieldCheck class="h-4 w-4" />
              거래 진행 관리
            </AppBadge>
            <p class="mt-5 text-sm font-bold text-slate-500">{{ transaction.id }}</p>
            <h1 class="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              {{ transaction.projectName }}
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              요청자는 공장의 작업 현황을 확인하고, 공장은 현재 작업 단계와 진행률을 업데이트합니다.
            </p>
          </div>

          <div class="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              v-if="canUpdateProgress"
              type="button"
              class="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold transition"
              :class="viewerRole === 'client' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'"
              @click="setRole('client')"
            >
              <UserRound class="h-4 w-4" />
              요청자 보기
            </button>
            <button
              type="button"
              class="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold transition"
              :class="viewerRole === 'factory' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'"
              @click="setRole('factory')"
            >
              <Factory class="h-4 w-4" />
              공장 입력
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main class="space-y-8">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-2xl font-bold text-slate-950">현재 진행 위치</h2>
                <p class="mt-1 text-sm text-slate-500">{{ progressStage }}</p>
              </div>
              <AppBadge :variant="transaction.statusKey === 'delayed' ? 'amber' : 'blue'">
                <CheckCircle class="h-4 w-4" />
                {{ transaction.status }}
              </AppBadge>
            </div>

            <div class="rounded-2xl bg-slate-50 p-5">
              <div class="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-slate-500">전체 진행률</p>
                  <p class="mt-1 text-4xl font-black text-slate-950">{{ currentProgress }}%</p>
                </div>
                <Gauge class="h-10 w-10 text-blue-600" />
              </div>
              <div class="h-4 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                <div class="h-full rounded-full bg-blue-600 transition-all" :style="{ width: `${currentProgress}%` }" />
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">
              <div
                v-for="checkpoint in progressCheckpoints"
                :key="checkpoint.label"
                class="rounded-xl border p-4"
                :class="checkpoint.done ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'"
              >
                <div
                  class="mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black"
                  :class="checkpoint.done ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'"
                >
                  {{ checkpoint.percent }}
                </div>
                <p class="text-sm font-bold text-slate-800">{{ checkpoint.label }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 class="mb-5 text-2xl font-bold text-slate-950">전체 거래 흐름</h2>
            <ProcessStepper :steps="transactionSteps" :current-step="transaction.currentStep" />
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <RefreshCw class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">작업 진행 업데이트</h2>
            </div>

            <div v-if="viewerRole === 'factory'" class="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div class="mb-5 flex items-center gap-2">
                <PencilLine class="h-5 w-5 text-blue-700" />
                <h3 class="text-lg font-bold text-slate-950">공장 진행상황 입력</h3>
              </div>

              <label class="block">
                <span class="text-sm font-bold text-slate-700">현재 진행률</span>
                <div class="mt-3 grid grid-cols-[1fr_92px] gap-3">
                  <input
                    v-model.number="progressInput"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="w-full accent-blue-600"
                  />
                  <input
                    v-model.number="progressInput"
                    type="number"
                    min="0"
                    max="100"
                    class="h-11 rounded-xl border border-slate-300 px-3 text-right font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </label>

              <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label class="block">
                  <span class="text-sm font-bold text-slate-700">작업 제목</span>
                  <input
                    v-model="updateTitle"
                    type="text"
                    placeholder="예: 2차 가공 완료"
                    class="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label class="block">
                  <span class="text-sm font-bold text-slate-700">상세 내용</span>
                  <input
                    v-model="updateDescription"
                    type="text"
                    placeholder="요청자가 확인할 현재 작업 상태"
                    class="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>

              <AppButton type="button" class="mt-4" @click="submitProgressUpdate">
                진행상황 업데이트
              </AppButton>
            </div>

            <div v-else class="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div class="flex items-start gap-3">
                <Factory class="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <h3 class="font-bold text-slate-950">공장이 입력한 최신 진행상황</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600">
                    현재 {{ transaction.factory }}에서 입력한 진행률은 {{ currentProgress }}%이며, 단계는 {{ progressStage }}입니다.
                  </p>
                </div>
              </div>
            </div>

            <ol class="space-y-4">
              <li
                v-for="item in displayedUpdates"
                :key="`${item.date}-${item.title}`"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 class="text-lg font-bold text-slate-950">{{ item.title }}</h3>
                    <p class="mt-1 text-base leading-7 text-slate-600">{{ item.description }}</p>
                  </div>
                  <span class="shrink-0 text-sm font-semibold text-slate-500">{{ item.date }}</span>
                </div>
              </li>
            </ol>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <Truck class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">납품 등록 및 검수</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
                  <FileUp class="h-5 w-5 text-blue-600" />
                  납품 자료
                </div>
                <p class="truncate text-sm text-slate-600">{{ transaction.deliveryFile.name }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
                  <ClipboardCheck class="h-5 w-5 text-blue-600" />
                  검수 결과서
                </div>
                <p class="truncate text-sm text-slate-600">{{ transaction.inspectionFile.name }}</p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AppButton type="button" size="lg" full-width @click="approveInspection">
                <PackageCheck class="h-6 w-6" />
                검수 승인 및 리뷰 작성
              </AppButton>
              <AppButton type="button" size="lg" variant="secondary" full-width @click="reportIssue">
                <AlertTriangle class="h-6 w-6" />
                문제 발생, 중재 요청
              </AppButton>
            </div>
          </section>
        </main>

        <aside class="space-y-5 xl:sticky xl:top-8 xl:self-start">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-950">거래 상세 정보</h2>
            <dl class="mt-5 space-y-4">
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500">요청자</dt>
                <dd class="font-semibold text-slate-950">{{ transaction.client }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500">공장</dt>
                <dd class="font-semibold text-slate-950">{{ transaction.factory }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500">계약 금액</dt>
                <dd class="font-semibold text-slate-950">{{ transaction.amount }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500">납기</dt>
                <dd class="font-semibold text-slate-950">{{ transaction.dueDate }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500">최근 업데이트</dt>
                <dd class="font-semibold text-slate-950">{{ transaction.updatedAt }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div class="flex items-start gap-3">
              <RefreshCw class="h-6 w-6 text-blue-600" />
              <p class="text-base leading-7 text-slate-700">
                요청자는 공장 입력 내용을 기준으로 진행 상태를 확인하고, 공장은 이 화면에서 진행률과 작업 로그를 갱신합니다.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
