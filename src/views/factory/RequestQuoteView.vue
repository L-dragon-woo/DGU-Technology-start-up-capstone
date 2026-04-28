<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calculator, CheckCircle, Clock, FileText, Send, ShieldCheck } from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import ProcessStepper from '@/components/common/ProcessStepper.vue'
import { mockReceivedQuoteRequests } from '@/data/requestData'

const route = useRoute()
const router = useRouter()

const request = computed(() => {
  return mockReceivedQuoteRequests.find((item) => item.id === route.params.id) || mockReceivedQuoteRequests[0]
})

const quoteForm = reactive({
  estimateAmount: '4,200,000원',
  productionPeriod: '계약 후 18일',
  availableDeliveryDate: '2026년 5월 18일',
  paymentCondition: '에스크로 결제, 검수 완료 후 정산',
  message:
    '보유 중인 5축 CNC와 아노다이징 협력 라인으로 요청 사양 대응 가능합니다. 초도품 10개 선검수 후 잔여 수량 제작 방식으로 진행을 제안드립니다.'
})

const steps = [
  { title: '요청 수신', description: '발주처 요청 접수' },
  { title: '요청 검토', description: '도면과 조건 확인' },
  { title: '견적 제출', description: '금액과 납기 제안' },
  { title: '발주처 승인', description: '견적 비교 및 확정' },
  { title: '계약 진행', description: '표준 계약과 에스크로' }
]

function submitQuote() {
  console.log('Factory Quote Submitted:', {
    requestId: request.value.id,
    projectName: request.value.projectName,
    quote: { ...quoteForm }
  })

  router.push('/contract')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <AppBadge variant="blue">
          <Calculator class="h-4 w-4" />
          견적 검토
        </AppBadge>
        <h1 class="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">요청 상세 및 견적 제출</h1>
        <p class="mt-3 text-lg text-slate-600">발주처 요청 조건을 확인하고 견적을 제출하세요.</p>
      </header>

      <div class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main class="space-y-8">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center justify-between gap-4">
              <h2 class="text-2xl font-bold text-slate-950">{{ request.projectName }}</h2>
              <AppBadge variant="blue">신규 요청</AppBadge>
            </div>

            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">발주처</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.clientName }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">품목</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.productItem }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">공정</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.processType }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">희망 납기</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.desiredDeadline }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">수량</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.quantity }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">예산</dt>
                <dd class="mt-1 text-lg font-bold text-slate-950">{{ request.budgetRange }}</dd>
              </div>
            </dl>

            <div class="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h3 class="font-bold text-slate-950">상세 요구사항</h3>
              <p class="mt-2 leading-7 text-slate-600">{{ request.description }}</p>
            </div>

            <div class="mt-5">
              <h3 class="mb-3 font-bold text-slate-950">첨부 자료</h3>
              <ul class="space-y-2">
                <li
                  v-for="file in request.attachments"
                  :key="file.id"
                  class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span class="flex min-w-0 items-center gap-2">
                    <FileText class="h-5 w-5 shrink-0 text-blue-600" />
                    <span class="truncate font-medium text-slate-800">{{ file.name }}</span>
                  </span>
                  <span class="text-sm text-slate-500">{{ (file.size / 1024 / 1024).toFixed(1) }}MB</span>
                </li>
              </ul>
            </div>
          </section>

          <form class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" @submit.prevent="submitQuote">
            <div class="mb-5 flex items-center gap-3">
              <Send class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">견적 제출</h2>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="estimateAmount" class="mb-2 block text-base font-bold text-slate-950">견적 금액</label>
                <input
                  id="estimateAmount"
                  v-model="quoteForm.estimateAmount"
                  required
                  class="h-14 w-full rounded-xl border border-slate-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label for="productionPeriod" class="mb-2 block text-base font-bold text-slate-950">제작 기간</label>
                <input
                  id="productionPeriod"
                  v-model="quoteForm.productionPeriod"
                  required
                  class="h-14 w-full rounded-xl border border-slate-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label for="availableDeliveryDate" class="mb-2 block text-base font-bold text-slate-950">가능 납기</label>
                <input
                  id="availableDeliveryDate"
                  v-model="quoteForm.availableDeliveryDate"
                  required
                  class="h-14 w-full rounded-xl border border-slate-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label for="paymentCondition" class="mb-2 block text-base font-bold text-slate-950">결제 조건</label>
                <input
                  id="paymentCondition"
                  v-model="quoteForm.paymentCondition"
                  required
                  class="h-14 w-full rounded-xl border border-slate-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div class="sm:col-span-2">
                <label for="message" class="mb-2 block text-base font-bold text-slate-950">제안 메시지</label>
                <textarea
                  id="message"
                  v-model="quoteForm.message"
                  rows="5"
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                ></textarea>
              </div>
            </div>

            <AppButton type="submit" size="lg" full-width class="mt-6">
              <CheckCircle class="h-6 w-6" />
              견적 제출하고 계약으로 이동
            </AppButton>
          </form>
        </main>

        <aside class="space-y-5 xl:sticky xl:top-8 xl:self-start">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="mb-5 text-xl font-bold text-slate-950">요청 처리 흐름</h2>
            <ProcessStepper :steps="steps" :current-step="3" />
          </div>

          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div class="flex items-start gap-3">
              <ShieldCheck class="h-6 w-6 text-blue-600" />
              <p class="text-base leading-7 text-slate-700">
                견적 제출 후 발주처가 승인하면 표준 계약서, 전자서명, 에스크로 결제로 이어집니다.
              </p>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center gap-2 text-slate-600">
              <Clock class="h-5 w-5" />
              <span class="font-semibold">요청 시간</span>
            </div>
            <p class="mt-2 text-lg font-bold text-slate-950">{{ request.requestedAt }}</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
