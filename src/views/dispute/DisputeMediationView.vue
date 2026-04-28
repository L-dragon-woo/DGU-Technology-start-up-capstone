<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  CalendarClock,
  CheckCircle,
  ClipboardList,
  FileText,
  Handshake,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Upload,
  X
} from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import ProcessStepper from '@/components/common/ProcessStepper.vue'

type DisputeType = 'delay' | 'quality' | 'payment' | 'contract'

interface DisputeOption {
  value: DisputeType
  label: string
  description: string
}

interface EvidenceState {
  contract: boolean
  chatHistory: boolean
  deliveryPhotos: boolean
  inspectionReport: boolean
}

const selectedDisputeType = ref<DisputeType>('quality')
const uploadedFiles = ref<File[]>([
  new File(['mock inspection data'], 'incoming_inspection_report.pdf', { type: 'application/pdf' }),
  new File(['mock photo data'], 'defect_photo_set.zip', { type: 'application/zip' }),
  new File(['mock chat export'], 'delivery_chat_history.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
])
const router = useRouter()

const evidence = reactive<EvidenceState>({
  contract: true,
  chatHistory: true,
  deliveryPhotos: true,
  inspectionReport: true
})

const disputeTypes: DisputeOption[] = [
  {
    value: 'delay',
    label: '납기 지연',
    description: '약속된 납품 일정이 지연되었어요.'
  },
  {
    value: 'quality',
    label: '품질 불량',
    description: '검수 결과 기준에 맞지 않는 문제가 있어요.'
  },
  {
    value: 'payment',
    label: '대금 문제',
    description: '결제, 정산, 추가 비용에 이견이 있어요.'
  },
  {
    value: 'contract',
    label: '계약 불이행',
    description: '계약 조건이 지켜지지 않았어요.'
  }
]

const transactionInfo = [
  { label: '프로젝트명', value: '알루미늄 하우징 시제품 제작' },
  { label: '발주처', value: '루트테크' },
  { label: '공장', value: '문래정밀가공' },
  { label: '계약 금액', value: '4,200,000원' },
  { label: '납기', value: '2026년 5월 20일' },
  { label: '현재 상태', value: '초도품 검수 이슈 접수' }
]

const mediationSteps = [
  {
    title: '분쟁 접수',
    description: '신청 내용과 거래 정보를 확인합니다.'
  },
  {
    title: '자료 검토',
    description: '계약서, 대화, 증빙 파일을 함께 검토합니다.'
  },
  {
    title: '조정안 제시',
    description: '양측 입장을 반영한 해결안을 제안합니다.'
  },
  {
    title: '합의 또는 법무 자문 연계',
    description: '합의가 어렵다면 다음 절차를 안내합니다.'
  }
]

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement

  if (!target.files) {
    return
  }

  Array.from(target.files).forEach((file) => uploadedFiles.value.push(file))
  target.value = ''
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

function handleSubmit() {
  console.log('Dispute Mediation Request:', {
    disputeType: selectedDisputeType.value,
    transactionInfo,
    evidence: { ...evidence },
    uploadedFiles: uploadedFiles.value.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  })

  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck class="h-4 w-4" />
              플랫폼 중재 센터
            </div>
            <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">분쟁 중재 신청</h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              계약서와 거래 이력을 기반으로 공정한 중재 절차를 진행합니다.
            </p>
          </div>

          <div class="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Handshake class="h-6 w-6" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-950">플랫폼이 개입하여 해결을 돕습니다</h2>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  거래 기록을 한곳에서 확인하고, 양측이 납득할 수 있는 조정안을 제시합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="space-y-8" @submit.prevent="handleSubmit">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <AlertTriangle class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">분쟁 유형 선택</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                v-for="type in disputeTypes"
                :key="type.value"
                class="cursor-pointer rounded-xl border p-5 transition"
                :class="selectedDisputeType === type.value ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'"
              >
                <input v-model="selectedDisputeType" type="radio" class="sr-only" :value="type.value" />
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <span class="text-lg font-bold text-slate-950">{{ type.label }}</span>
                    <p class="mt-2 text-base leading-7 text-slate-600">{{ type.description }}</p>
                  </div>
                  <CheckCircle
                    class="h-6 w-6 shrink-0"
                    :class="selectedDisputeType === type.value ? 'text-blue-600' : 'text-slate-300'"
                  />
                </div>
              </label>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <ClipboardList class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">거래 정보</h2>
            </div>

            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="item in transactionInfo"
                :key="item.label"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <dt class="text-sm font-semibold text-slate-500">{{ item.label }}</dt>
                <dd class="mt-2 text-lg font-bold text-slate-950">{{ item.value }}</dd>
              </div>
            </dl>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <FileText class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">증빙 자료</h2>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label class="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input v-model="evidence.contract" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <FileText class="h-5 w-5 text-slate-500" />
                <span class="text-base font-semibold text-slate-800">계약서</span>
              </label>
              <label class="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input v-model="evidence.chatHistory" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <MessageSquareText class="h-5 w-5 text-slate-500" />
                <span class="text-base font-semibold text-slate-800">채팅 기록</span>
              </label>
              <label class="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input v-model="evidence.deliveryPhotos" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <PackageCheck class="h-5 w-5 text-slate-500" />
                <span class="text-base font-semibold text-slate-800">납품 사진</span>
              </label>
              <label class="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input v-model="evidence.inspectionReport" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <BadgeCheck class="h-5 w-5 text-slate-500" />
                <span class="text-base font-semibold text-slate-800">검사 결과서</span>
              </label>
            </div>

            <div class="mt-5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400">
              <input id="evidenceFiles" type="file" multiple class="sr-only" @change="handleFileSelect" />
              <Upload class="mx-auto h-10 w-10 text-slate-400" />
              <label for="evidenceFiles" class="mt-3 inline-flex cursor-pointer rounded-lg bg-white px-5 py-3 text-base font-bold text-blue-700 shadow-sm ring-1 ring-slate-200">
                추가 파일 업로드
              </label>
              <p class="mt-3 text-sm text-slate-500">사진, PDF, 검사표 등 추가 자료를 첨부할 수 있습니다.</p>
            </div>

            <ul v-if="uploadedFiles.length" class="mt-4 space-y-3">
              <li
                v-for="(file, index) in uploadedFiles"
                :key="`${file.name}-${index}`"
                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <span class="truncate text-base font-medium text-slate-800">{{ file.name }}</span>
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
                  aria-label="첨부 파일 삭제"
                  @click="removeFile(index)"
                >
                  <X class="h-5 w-5" />
                </button>
              </li>
            </ul>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div class="mb-5 flex items-center gap-3">
              <CalendarClock class="h-6 w-6 text-blue-600" />
              <h2 class="text-2xl font-bold text-slate-950">중재 진행 절차</h2>
            </div>
            <ProcessStepper :steps="mediationSteps" :current-step="1" />
          </section>

          <AppButton type="submit" size="lg" full-width>
            <ShieldCheck class="h-6 w-6" />
            중재 요청하기
          </AppButton>
        </form>

        <aside class="space-y-5 xl:sticky xl:top-8 xl:self-start">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-start gap-3">
              <ShieldCheck class="h-7 w-7 shrink-0 text-blue-600" />
              <div>
                <h2 class="text-xl font-bold text-slate-950">중립적인 검토 기준</h2>
                <p class="mt-2 text-base leading-7 text-slate-600">
                  플랫폼은 계약 조건, 채팅 기록, 납품 및 검수 자료를 기준으로 분쟁 내용을 확인합니다.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h3 class="text-lg font-bold text-slate-950">요청 후 진행</h3>
            <ul class="mt-4 space-y-3 text-base leading-7 text-slate-700">
              <li class="flex gap-3">
                <CheckCircle class="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <span>담당자가 거래 이력을 먼저 확인합니다.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircle class="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <span>필요한 경우 양측에 추가 자료를 요청합니다.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircle class="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <span>합의 가능한 조정안을 문서로 안내합니다.</span>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center gap-3">
              <Banknote class="h-6 w-6 text-slate-600" />
              <h3 class="text-lg font-bold text-slate-950">대금 보호 안내</h3>
            </div>
            <p class="mt-3 text-base leading-7 text-slate-600">
              중재가 접수되면 관련 정산 상태를 함께 확인하여 일방적인 손실이 발생하지 않도록 검토합니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
