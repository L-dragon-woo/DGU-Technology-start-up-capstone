import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { mockFactoryRecommendations } from '@/data/factoryData'
import type { FactoryRecommendation } from '@/types'
import { matchFactories } from '@/services/aiMatching'

export interface QuoteRequestDraft {
  projectName: string
  processType: string
  productItem: string
  estimatedQuantity: string
  desiredDeadline: string
  budgetRange: string
  detailRequirements: string
}

export interface MockWorkflowFile {
  name: string
  size: number
  type: string
}

export interface TransactionReviewDraft {
  rating: number
  content: string
  nextAction: 'reorder' | 'crm'
}

const initialRequest: QuoteRequestDraft = {
  projectName: '알루미늄 하우징 시제품 제작',
  processType: 'mold',
  productItem: '전장 모듈용 알루미늄 케이스',
  estimatedQuantity: '1차 500개, 양산 월 3,000개',
  desiredDeadline: '2026-05-20',
  budgetRange: '3,000만원 ~ 4,500만원',
  detailRequirements:
    '6061 알루미늄 소재 기준으로 CNC 정밀가공과 표면 아노다이징 처리가 필요합니다. 외관 스크래치 기준이 엄격하며, 초도품 검수 후 양산 전환 예정입니다.'
}

const initialFiles: MockWorkflowFile[] = [
  { name: 'housing_2d_drawing.pdf', size: 2400000, type: 'application/pdf' },
  { name: 'housing_3d_model.step', size: 8200000, type: 'model/step' }
]

function formatEstimate(factory: FactoryRecommendation | null) {
  if (!factory) return '견적 산정 대기'
  return `${factory.estimateMin.toLocaleString()}만원 ~ ${factory.estimateMax.toLocaleString()}만원`
}

export const useWorkflowStore = defineStore('workflow', () => {
  const currentRequest = ref<QuoteRequestDraft>({ ...initialRequest })
  const requestFiles = ref<MockWorkflowFile[]>([...initialFiles])
  const recommendations = ref<FactoryRecommendation[]>(mockFactoryRecommendations)
  const selectedFactory = ref<FactoryRecommendation | null>(recommendations.value[0] ?? null)
  const paymentMethod = ref<'escrow'>('escrow')
  const transactionStatus = ref('납품 검수 대기')
  const progressRate = ref(100)
  const deliveryFile = ref<MockWorkflowFile>({
    name: 'delivery_photo_package.zip',
    size: 12800000,
    type: 'application/zip'
  })
  const inspectionFile = ref<MockWorkflowFile>({
    name: 'final_inspection_report.pdf',
    size: 3100000,
    type: 'application/pdf'
  })
  const review = ref<TransactionReviewDraft>({
    rating: 5,
    content:
      '납기와 품질 모두 만족스러웠습니다. 작업 상태 공유가 빠르고 검사 결과서도 상세해서 다음 양산 건도 논의하고 싶습니다.',
    nextAction: 'reorder'
  })
  const isMatching = ref(false)
  const matchingError = ref<string | null>(null)

  const contract = computed(() => ({
    projectName: currentRequest.value.projectName,
    client: '루트테크',
    factory: selectedFactory.value?.name ?? '공장 선택 대기',
    amount: formatEstimate(selectedFactory.value),
    dueDate: currentRequest.value.desiredDeadline,
    paymentMethod: paymentMethod.value
  }))

  const transaction = computed(() => ({
    projectName: currentRequest.value.projectName,
    client: '루트테크',
    factory: selectedFactory.value?.name ?? '공장 선택 대기',
    amount: formatEstimate(selectedFactory.value),
    dueDate: currentRequest.value.desiredDeadline,
    status: transactionStatus.value,
    progressRate: progressRate.value,
    deliveryFile: deliveryFile.value,
    inspectionFile: inspectionFile.value
  }))

  const reviewContext = computed(() => ({
    projectName: currentRequest.value.projectName,
    factory: selectedFactory.value?.name ?? '공장 선택 대기'
  }))

  function submitRequest(request: QuoteRequestDraft, files: MockWorkflowFile[]) {
    currentRequest.value = { ...request }
    requestFiles.value = [...files]
    selectedFactory.value = recommendations.value[0] ?? null
    transactionStatus.value = '납품 검수 대기'
    progressRate.value = 100
  }

  function selectFactory(factory: FactoryRecommendation) {
    selectedFactory.value = factory
  }

  function completePayment() {
    transactionStatus.value = '납품 검수 대기'
  }

  function approveInspection() {
    transactionStatus.value = '거래 완료'
  }

  function submitReview(nextReview: TransactionReviewDraft) {
    review.value = { ...nextReview }
  }

  async function runAIMatching() {
    isMatching.value = true
    matchingError.value = null
    try {
      const results = await matchFactories(currentRequest.value)
      recommendations.value = results
      selectedFactory.value = results[0] ?? null
    } catch (error) {
      console.error('AI 매칭 오류:', error)
      matchingError.value =
        error instanceof Error ? error.message : 'AI 매칭 중 오류가 발생했습니다.'
      recommendations.value = mockFactoryRecommendations
      selectedFactory.value = mockFactoryRecommendations[0] ?? null
    } finally {
      isMatching.value = false
    }
  }

  return {
    currentRequest,
    requestFiles,
    recommendations,
    selectedFactory,
    paymentMethod,
    transactionStatus,
    progressRate,
    deliveryFile,
    inspectionFile,
    review,
    contract,
    transaction,
    reviewContext,
    submitRequest,
    selectFactory,
    completePayment,
    approveInspection,
    submitReview,
    isMatching,
    matchingError,
    runAIMatching
  }
})
