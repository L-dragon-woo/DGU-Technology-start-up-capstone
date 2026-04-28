<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle, CreditCard, FileSignature, LockKeyhole, ShieldCheck } from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import ProcessStepper from '@/components/common/ProcessStepper.vue'

const router = useRouter()

const contract = reactive({
  projectName: '알루미늄 하우징 시제품 제작',
  client: '루트테크',
  factory: '문래정밀가공',
  amount: '4,200,000원',
  dueDate: '2026년 5월 20일',
  paymentMethod: 'escrow'
})

const steps = [
  { title: '계약 확인', description: '프로젝트 조건과 금액을 확인합니다.' },
  { title: '전자서명', description: '양측 서명 후 계약이 확정됩니다.' },
  { title: '에스크로 결제', description: '대금을 플랫폼이 안전하게 보관합니다.' },
  { title: '거래 시작', description: '공장이 제작을 시작합니다.' }
]

function completePayment() {
  console.log('Contract Escrow Payment:', { ...contract })
  router.push('/transaction/progress')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <AppBadge variant="blue">
          <ShieldCheck class="h-4 w-4" />
          안심 계약
        </AppBadge>
        <h1 class="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">계약 및 에스크로 결제</h1>
        <p class="mt-3 text-lg leading-8 text-slate-600">
          계약 조건을 확인하고 에스크로 결제를 완료하면 거래가 시작됩니다.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main class="space-y-8">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <FileSignature class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">계약 정보</h2>
            </div>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">프로젝트명</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ contract.projectName }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">계약 금액</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ contract.amount }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">발주처</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ contract.client }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-sm font-semibold text-slate-500">공장</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ contract.factory }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <dt class="text-sm font-semibold text-slate-500">납기</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ contract.dueDate }}</dd>
              </div>
            </dl>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <CreditCard class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">결제 방식</h2>
            </div>
            <label class="flex cursor-pointer items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <input v-model="contract.paymentMethod" type="radio" value="escrow" class="mt-1 h-5 w-5 text-blue-600" />
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-slate-950">에스크로 결제</span>
                  <AppBadge variant="green">권장</AppBadge>
                </div>
                <p class="mt-2 text-base leading-7 text-slate-600">
                  발주 대금은 플랫폼이 보관하고, 납품 및 검수 완료 후 공장에 정산됩니다.
                </p>
              </div>
            </label>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 class="mb-5 text-2xl font-bold text-slate-950">진행 절차</h2>
            <ProcessStepper :steps="steps" :current-step="3" />
          </section>
        </main>

        <aside class="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-start gap-3">
              <LockKeyhole class="h-7 w-7 text-blue-600" />
              <div>
                <h2 class="text-xl font-bold text-slate-950">대금 보호</h2>
                <p class="mt-2 text-base leading-7 text-slate-600">
                  결제 완료 후에도 검수 전까지 대금이 바로 정산되지 않아 양측의 거래 리스크를 줄입니다.
                </p>
              </div>
            </div>
          </div>

          <AppButton type="button" size="lg" full-width @click="completePayment">
            <CheckCircle class="h-6 w-6" />
            결제 완료하고 작업 진행으로 이동
          </AppButton>
        </aside>
      </div>
    </div>
  </div>
</template>
