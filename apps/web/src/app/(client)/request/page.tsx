'use client'

import { useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Brain,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { FactoryRecommendation, QuoteRequestDraft } from '@rootmatching/shared'
import { mockFactoryRecommendations } from '@rootmatching/shared/fixtures/factory-data'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/cn'
import { useDemoMode } from '@/lib/demo-mode'
import { useSidebarLayout } from '@/components/layout/AppLayout'

const quoteRequestSchema = z.object({
  projectName: z.string().trim().min(1, '프로젝트명을 입력하세요.'),
  processType: z.string().trim().min(1, '공정 유형을 선택하세요.'),
  productItem: z.string().trim().min(1, '제작 품목을 입력하세요.'),
  estimatedQuantity: z.string().trim().min(1, '예상 수량을 입력하세요.'),
  desiredDeadline: z.string().trim().min(1, '희망 납기를 선택하세요.'),
  budgetRange: z.string(),
  detailRequirements: z.string(),
}) satisfies z.ZodType<QuoteRequestDraft>

const initialRequest: QuoteRequestDraft = {
  projectName: '알루미늄 하우징 시제품 제작',
  processType: 'mold',
  productItem: '전장 모듈용 알루미늄 케이스',
  estimatedQuantity: '1차 500개, 양산 월 3,000개',
  desiredDeadline: '2026-05-20',
  budgetRange: '3,000만원 ~ 4,500만원',
  detailRequirements:
    '6061 알루미늄 소재 기준으로 CNC 정밀가공과 표면 아노다이징 처리가 필요합니다. 외관 스크래치 기준이 엄격하며, 초도품 검수 후 양산 전환 예정입니다.',
}

const demoRequest: QuoteRequestDraft = {
  projectName: '알루미늄 하우징 시제품',
  processType: 'surface',
  productItem: '알루미늄 하우징 시제품',
  estimatedQuantity: '초도 5,000개',
  desiredDeadline: '2026-04-30',
  budgetRange: '400만원 ~ 500만원',
  detailRequirements: 'RoHS 준수, 표면 거칠기 Ra 0.8 이하, 안정적 납기 보증 우선',
}

const initialFiles: UploadedFile[] = [
  { name: 'housing_2d_drawing.pdf', size: 2400000, type: 'application/pdf' },
  { name: 'housing_3d_model.step', size: 8200000, type: 'model/step' },
]

const processTypes = [
  { value: 'casting', label: '주조' },
  { value: 'mold', label: '금형' },
  { value: 'forming', label: '소성가공' },
  { value: 'welding', label: '용접' },
  { value: 'surface', label: '표면처리' },
  { value: 'heat', label: '열처리' },
]

const quantityCadenceOptions = [
  { value: '월', label: '월' },
  { value: '분기', label: '분기' },
  { value: '연', label: '연' },
  { value: '일회성', label: '일회성' },
]

const customQuantityUnitValue = 'custom'
const quantityUnitOptions = ['개', '세트', 'EA', '대', 'kg']
const deadlineWeekHeaders = ['1', '2', '3', '4', '5', '6', '7']

type CriteriaImportance = 1 | 2 | 3 | 4 | 5

const importanceValues: CriteriaImportance[] = [1, 2, 3, 4, 5]

const importanceHints: Record<CriteriaImportance, string> = {
  1: '덜 중요 — 참고만 합니다',
  2: '조금 중요 — 가볍게 반영합니다',
  3: '보통 — 균형 있게 반영합니다',
  4: '중요 — 비중 있게 반영합니다',
  5: '꼭 필요 — 가장 크게 반영합니다',
}

function clampImportance(value: number): CriteriaImportance {
  if (value <= 1) return 1
  if (value >= 5) return 5
  return value as CriteriaImportance
}

interface AICriterion {
  id: string
  icon: LucideIcon
  label: string
  description: string
}

const aiCriteriaItems: AICriterion[] = [
  {
    id: 'process',
    icon: Sparkles,
    label: '공정 적합도',
    description: '요청한 공정을 공장이 잘 다루는지',
  },
  {
    id: 'delivery',
    icon: Clock,
    label: '납기 가능성',
    description: '원하는 납기 안에 만들 수 있는지',
  },
  {
    id: 'quality',
    icon: Star,
    label: '품질 평가',
    description: '이전 거래처가 매긴 품질 점수',
  },
  {
    id: 'reorder',
    icon: RefreshCw,
    label: '재거래 비율',
    description: '한 번 거래한 곳이 다시 맡긴 비율',
  },
  {
    id: 'budget',
    icon: DollarSign,
    label: '가격 경쟁력',
    description: '내 예산 안에서 좋은 가격을 제시하는지',
  },
]

const defaultCriteriaImportance: Record<string, CriteriaImportance> = {
  process: 5,
  delivery: 5,
  quality: 3,
  reorder: 3,
  budget: 2,
}

const matchingLoadingSteps = [
  { title: '요청 분석 중...', description: '도면·공정·납기 조건을 분석하고 있습니다.' },
  {
    title: '유사 공장 검색 중...',
    description: '국내 공장 프로필과 거래 이력을 검색합니다.',
  },
  { title: 'AI 추천 분석 중...', description: '품질·납기·거리·재거래 데이터를 종합합니다.' },
  { title: '추천 결과 정리 중...', description: '상위 추천 공장과 추천 사유를 구성합니다.' },
]

interface UploadedFile {
  name: string
  size: number
  type: string
  file?: File
}

interface QuantityDetails {
  firstRun: string
  production: string
  cadence: string
  unit: string
  customUnit: string
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

function parseDateString(value: string): Date | null {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

function formatDateLabel(value: string): string {
  const date = parseDateString(value)

  if (!date) {
    return ''
  }

  return `${date.getFullYear()}.${padDatePart(date.getMonth() + 1)}.${padDatePart(date.getDate())}`
}

function parseQuantityDetails(value: string): QuantityDetails {
  const numbers = value.match(/\d[\d,]*/g) ?? []
  const cadence =
    quantityCadenceOptions.find((option) => value.includes(option.value))?.value ?? '월'
  const unitMatches = [...value.matchAll(/\d[\d,]*\s*([^\s,]+)/g)]
  const parsedUnit = unitMatches[unitMatches.length - 1]?.[1] ?? ''
  const unit = quantityUnitOptions.find(
    (nextUnit) => nextUnit === parsedUnit || value.includes(nextUnit),
  )
  const customUnit = unit ? '' : parsedUnit

  return {
    firstRun: numbers[0] ?? '',
    production: numbers[1] ?? '',
    cadence,
    unit: unit ?? (customUnit ? customQuantityUnitValue : '개'),
    customUnit,
  }
}

function formatQuantityValue(value: string, unit: string): string {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  return `${trimmedValue}${unit}`
}

function buildEstimatedQuantity(input: {
  firstRunQuantity: string
  productionQuantity: string
  quantityCadence: string
  selectedQuantityUnit: string
}): string {
  const firstRun = formatQuantityValue(input.firstRunQuantity, input.selectedQuantityUnit)
  const production = formatQuantityValue(input.productionQuantity, input.selectedQuantityUnit)

  if (firstRun && production && input.quantityCadence !== '일회성') {
    return `초도 ${firstRun}, 양산 ${input.quantityCadence} ${production}`
  }

  if (firstRun && production) {
    return `초도 ${firstRun}, 추가 ${production}`
  }

  if (firstRun) {
    return `초도 ${firstRun}`
  }

  if (production && input.quantityCadence !== '일회성') {
    return `양산 ${input.quantityCadence} ${production}`
  }

  return production
}

function parseBudgetRange(value: string): { min: string; max: string } {
  const values = value.match(/\d[\d,]*/g) ?? []

  return {
    min: values[0] ?? '',
    max: values[1] ?? '',
  }
}

function formatBudgetValue(value: string): string {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  return /원$/.test(trimmedValue) ? trimmedValue : `${trimmedValue}만원`
}

function buildBudgetRange(input: { budgetMin: string; budgetMax: string }): string {
  const min = formatBudgetValue(input.budgetMin)
  const max = formatBudgetValue(input.budgetMax)

  if (min && max) {
    return `${min} ~ ${max}`
  }

  if (min) {
    return `${min} 이상`
  }

  if (max) {
    return `${max} 이하`
  }

  return ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fieldClassName = 'space-y-1.5'
const inputClassName = 'h-11 bg-card text-[15px]'
const labelClassName = 'text-kr-keep text-[16px] font-semibold text-foreground'
const errorClassName = 'mt-2 text-[15px] font-semibold text-destructive'
const cardClassName = 'border-border bg-card shadow-ct-soft'

export default function ClientRequestPage() {
  const router = useRouter()
  const isDemoMode = useDemoMode()
  const sidebarLayout = useSidebarLayout()
  const parsedQuantity = useMemo(() => parseQuantityDetails(initialRequest.estimatedQuantity), [])
  const parsedBudget = useMemo(() => parseBudgetRange(initialRequest.budgetRange), [])
  const [firstRunQuantity, setFirstRunQuantity] = useState(parsedQuantity.firstRun)
  const [productionQuantity, setProductionQuantity] = useState(parsedQuantity.production)
  const [quantityCadence, setQuantityCadence] = useState(parsedQuantity.cadence)
  const [quantityUnit, setQuantityUnit] = useState(parsedQuantity.unit)
  const [customQuantityUnit, setCustomQuantityUnit] = useState(parsedQuantity.customUnit)
  const [budgetMin, setBudgetMin] = useState(parsedBudget.min)
  const [budgetMax, setBudgetMax] = useState(parsedBudget.max)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [criteriaImportance, setCriteriaImportance] =
    useState<Record<string, CriteriaImportance>>(defaultCriteriaImportance)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function setCriterionImportance(id: string, value: CriteriaImportance) {
    setCriteriaImportance((prev) => ({ ...prev, [id]: value }))
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestDraft>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: initialRequest,
  })

  const desiredDeadline = watch('desiredDeadline')
  const watchedProjectName = watch('projectName')
  const watchedProcessType = watch('processType')
  const watchedProductItem = watch('productItem')
  const selectedQuantityUnit =
    quantityUnit === customQuantityUnitValue ? customQuantityUnit.trim() : quantityUnit

  const requiredFilledFlags = [
    !!watchedProjectName?.trim(),
    !!watchedProductItem?.trim(),
    !!watchedProcessType?.trim(),
    !!(firstRunQuantity.trim() || productionQuantity.trim()),
    !!desiredDeadline?.trim(),
  ]
  const requiredFilledCount = requiredFilledFlags.filter(Boolean).length
  const requiredTotal = requiredFilledFlags.length
  const requiredProgress = Math.round((requiredFilledCount / requiredTotal) * 100)
  const isFormComplete = requiredFilledCount === requiredTotal

  function fillDemoRequest() {
    const quantity = parseQuantityDetails(demoRequest.estimatedQuantity)
    const budget = parseBudgetRange(demoRequest.budgetRange)

    setValue('projectName', demoRequest.projectName, { shouldDirty: true, shouldValidate: true })
    setValue('processType', demoRequest.processType, { shouldDirty: true, shouldValidate: true })
    setValue('productItem', demoRequest.productItem, { shouldDirty: true, shouldValidate: true })
    setValue('desiredDeadline', demoRequest.desiredDeadline, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('detailRequirements', demoRequest.detailRequirements, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setFirstRunQuantity(quantity.firstRun)
    setProductionQuantity(quantity.production)
    setQuantityCadence(quantity.cadence)
    setQuantityUnit(quantity.unit)
    setCustomQuantityUnit(quantity.customUnit)
    setBudgetMin(budget.min)
    setBudgetMax(budget.max)
  }

  function wait(ms: number) {
    return new Promise((resolve) => window.setTimeout(resolve, ms))
  }

  function addFiles(fileList: FileList) {
    const nextFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }))

    setUploadedFiles((currentFiles) => [...currentFiles, ...nextFiles])
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files)
    }
  }

  function removeFile(indexToRemove: number) {
    setUploadedFiles((currentFiles) => currentFiles.filter((_, index) => index !== indexToRemove))
  }

  async function submitRequest(values: QuoteRequestDraft) {
    setSubmitError(null)
    setLoadingStep(1)
    const estimatedQuantity = buildEstimatedQuantity({
      firstRunQuantity,
      productionQuantity,
      quantityCadence,
      selectedQuantityUnit,
    })
    const budgetRange = buildBudgetRange({ budgetMin, budgetMax })
    const request = quoteRequestSchema.parse({
      ...values,
      estimatedQuantity,
      budgetRange,
    })

    const matchingRequest = fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/matching/recommend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    )

    try {
      await wait(900)
      setLoadingStep(2)
      await wait(900)
      setLoadingStep(3)

      const response = await matchingRequest

      if (!response.ok) {
        throw new Error('AI 매칭 중 오류가 발생했습니다.')
      }

      const results = (await response.json()) as FactoryRecommendation[]
      await wait(1200)
      setLoadingStep(4)
      await wait(500)
      sessionStorage.setItem(
        'rm:matchingResults',
        JSON.stringify({ results, request, submittedAt: Date.now() }),
      )
      router.push('/matching')
    } catch {
      if (process.env.NODE_ENV === 'production') {
        setLoadingStep(0)
        setSubmitError('AI 매칭 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }
      await wait(700)
      setLoadingStep(4)
      await wait(500)
      sessionStorage.setItem(
        'rm:matchingResults',
        JSON.stringify({ results: mockFactoryRecommendations, request, submittedAt: Date.now() }),
      )
      router.push('/matching?demo=true')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <header className="mb-6 rounded-xl border border-border bg-card p-5 shadow-ct-soft sm:p-6">
            <AppBadge variant="blue">
              <Sparkles className="h-4 w-4" />
              AI 공장 매칭
            </AppBadge>
            <h1 className="text-kr-pretty mt-4 text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
              새 견적 요청
            </h1>
            <p className="text-kr-pretty mt-2 max-w-3xl text-[15px] leading-7 text-muted-foreground">
              제작 조건을 입력하면 AI가 6대 뿌리공정 공장 중 가장 잘 맞는 곳을 추천합니다.
            </p>
            {isDemoMode && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-accent p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-kr-keep text-[15px] font-bold text-primary">
                    Demo Mode · 빠른 입력
                  </p>
                  <p className="text-kr-pretty mt-1 text-[15px] leading-6 text-foreground/80">
                    CNC 절삭 + 표면처리, 5,000개, 4-6주 납기 조건을 한 번에 채웁니다.
                  </p>
                </div>
                <AppButton type="button" variant="secondary" size="md" onClick={fillDemoRequest}>
                  <Sparkles className="h-4 w-4" />
                  예시 데이터로 채우기
                </AppButton>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <main>
              <form id="request-form" onSubmit={handleSubmit(submitRequest)} className="space-y-6">
                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-kr-pretty text-[18px] font-bold">
                      제작 기본 정보
                    </CardTitle>
                    <CardDescription className="text-kr-pretty text-[15px]">
                      품목, 공정, 납기 조건을 간결하게 입력하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className={fieldClassName}>
                        <Label htmlFor="projectName" className={labelClassName}>
                          프로젝트명 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="projectName"
                          placeholder="예: 2024년 신제품 부품 제작"
                          className={inputClassName}
                          {...register('projectName')}
                        />
                        {errors.projectName && (
                          <p className={errorClassName}>{errors.projectName.message}</p>
                        )}
                      </div>
                      <div className={fieldClassName}>
                        <Label htmlFor="productItem" className={labelClassName}>
                          제작 품목 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="productItem"
                          placeholder="예: 알루미늄 케이스, 스틸 브라켓"
                          className={inputClassName}
                          {...register('productItem')}
                        />
                        {errors.productItem && (
                          <p className={errorClassName}>{errors.productItem.message}</p>
                        )}
                      </div>
                    </div>

                    <div className={fieldClassName}>
                      <Label className={labelClassName}>
                        공정 유형 <span className="text-destructive">*</span>
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={watch('processType')}
                        onValueChange={(value) =>
                          value &&
                          setValue('processType', value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      >
                        {processTypes.map((type) => (
                          <ToggleGroupItem
                            key={type.value}
                            value={type.value}
                            className="text-kr-keep h-10 rounded-lg border border-input bg-card text-[16px] font-semibold data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-primary"
                          >
                            {type.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      {errors.processType && (
                        <p className={errorClassName}>{errors.processType.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-kr-pretty text-[18px] font-bold">
                      수량 · 납기 · 예산
                    </CardTitle>
                    <CardDescription className="text-kr-pretty text-[15px]">
                      AI 추천에 필요한 조건을 숫자 중심으로 입력하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className={fieldClassName}>
                      <Label className={labelClassName}>
                        예상 수량 <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="firstRunQuantity"
                            className="text-kr-keep text-[13px] font-bold text-muted-foreground"
                          >
                            초도 수량
                          </Label>
                          <Input
                            id="firstRunQuantity"
                            value={firstRunQuantity}
                            onChange={(event) => setFirstRunQuantity(event.target.value)}
                            inputMode="numeric"
                            placeholder="예: 500"
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="productionQuantity"
                            className="text-kr-keep text-[13px] font-bold text-muted-foreground"
                          >
                            양산 수량
                          </Label>
                          <Input
                            id="productionQuantity"
                            value={productionQuantity}
                            onChange={(event) => setProductionQuantity(event.target.value)}
                            inputMode="numeric"
                            placeholder="예: 3,000"
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="quantity-cadence"
                            className="text-kr-keep text-[13px] font-bold text-muted-foreground"
                          >
                            양산 주기
                          </Label>
                          <Select value={quantityCadence} onValueChange={setQuantityCadence}>
                            <SelectTrigger
                              id="quantity-cadence"
                              className={inputClassName}
                              aria-label="양산 주기"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {quantityCadenceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="quantity-unit"
                            className="text-kr-keep text-[13px] font-bold text-muted-foreground"
                          >
                            단위
                          </Label>
                          <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                            <SelectTrigger
                              id="quantity-unit"
                              className={inputClassName}
                              aria-label="단위"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {quantityUnitOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                              <SelectItem value={customQuantityUnitValue}>직접 입력</SelectItem>
                            </SelectContent>
                          </Select>
                          {quantityUnit === customQuantityUnitValue && (
                            <Input
                              value={customQuantityUnit}
                              onChange={(event) => setCustomQuantityUnit(event.target.value)}
                              placeholder="단위 입력"
                              className={inputClassName}
                              aria-label="사용자 지정 단위"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DeadlinePicker
                        value={desiredDeadline}
                        error={errors.desiredDeadline?.message}
                        onChange={(value) =>
                          setValue('desiredDeadline', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                      />
                      <div className={fieldClassName}>
                        <Label className={labelClassName}>예산 범위</Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                          <div className="relative">
                            <Input
                              id="budgetMin"
                              value={budgetMin}
                              onChange={(event) => setBudgetMin(event.target.value)}
                              inputMode="numeric"
                              placeholder="하한"
                              className={cn(inputClassName, 'pr-12')}
                            />
                            <span className="text-kr-keep pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground">
                              만원
                            </span>
                          </div>
                          <span className="hidden text-center text-muted-foreground sm:block">
                            ~
                          </span>
                          <div className="relative">
                            <Input
                              id="budgetMax"
                              value={budgetMax}
                              onChange={(event) => setBudgetMax(event.target.value)}
                              inputMode="numeric"
                              placeholder="상한"
                              className={cn(inputClassName, 'pr-12')}
                            />
                            <span className="text-kr-keep pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground">
                              만원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-kr-pretty text-[18px] font-bold">
                      자료 · 상세 요구사항
                    </CardTitle>
                    <CardDescription className="text-kr-pretty text-[15px]">
                      도면과 요구사항은 매칭 정확도를 높입니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className={fieldClassName}>
                      <Label className={labelClassName}>도면/파일 업로드</Label>
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="도면 또는 파일 업로드 — 드래그하거나 Enter를 눌러 선택"
                        onDragOver={(event) => {
                          event.preventDefault()
                          setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            fileInputRef.current?.click()
                          }
                        }}
                        className={cn(
                          'relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30',
                          isDragging
                            ? 'border-primary bg-accent'
                            : 'border-border bg-muted hover:border-primary/30',
                        )}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.jpg,.jpeg,.png"
                          onChange={(event) => {
                            if (event.target.files) {
                              addFiles(event.target.files)
                              event.target.value = ''
                            }
                          }}
                          className="sr-only"
                        />
                        <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-kr-pretty text-[16px] text-foreground">
                          파일을 드래그하거나{' '}
                          <span className="font-semibold text-primary">클릭하여 업로드</span>
                        </p>
                        <p className="text-kr-pretty mt-1 text-[14px] text-muted-foreground">
                          PDF, DWG, DXF, STEP, IGES, JPG, PNG (최대 50MB)
                        </p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <li
                              key={`${file.name}-${file.size}-${index}`}
                              className="flex items-center justify-between rounded-xl border border-border bg-muted p-3"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-anywhere text-[15px] font-semibold text-foreground">
                                    {file.name}
                                  </p>
                                  <p className="text-kr-keep text-[14px] text-muted-foreground">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="rounded-full p-1 text-muted-foreground transition hover:bg-border hover:text-foreground"
                                aria-label={`${file.name} 삭제`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className={fieldClassName}>
                      <Label htmlFor="detailRequirements" className={labelClassName}>
                        상세 요구사항
                      </Label>
                      <Textarea
                        id="detailRequirements"
                        rows={5}
                        placeholder="추가적인 요구사항이나 특이사항을 입력하세요..."
                        className="resize-none text-[15px]"
                        {...register('detailRequirements')}
                      />
                    </div>

                    {submitError && (
                      <div className="text-kr-pretty rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[15px] font-semibold text-destructive">
                        {submitError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="xl"
                      fullWidth
                      loading={isSubmitting}
                      disabled={!isFormComplete || isSubmitting}
                    >
                      <Sparkles className={cn('h-5 w-5', isSubmitting && 'animate-spin')} />
                      {isSubmitting
                        ? 'AI가 공장을 분석하는 중...'
                        : isFormComplete
                          ? 'AI 매칭 시작하기'
                          : `필수 정보 ${requiredTotal - requiredFilledCount}개 더 입력해 주세요`}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </main>

            <AICriteriaPanel
              importance={criteriaImportance}
              onImportanceChange={setCriterionImportance}
            />
          </div>
        </div>
      </div>
      {!isSubmitting && (
        <div
          role="region"
          aria-label="견적 요청 진행 상태"
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card shadow-toss-lg',
            sidebarLayout.open && 'lg:left-[260px]',
          )}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-kr-keep text-[13px] font-bold text-foreground sm:text-[14px]">
                  필수 정보{' '}
                  <span
                    className={cn('tabular-nums', isFormComplete ? 'text-success' : 'text-primary')}
                  >
                    {requiredFilledCount}
                  </span>
                  /{requiredTotal} 완료
                </p>
                <span className="text-kr-keep text-[12px] font-bold tabular-nums text-muted-foreground">
                  {requiredProgress}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-[width] duration-300 ease-out',
                    isFormComplete ? 'bg-success' : 'bg-primary',
                  )}
                  style={{ width: `${requiredProgress}%` }}
                />
              </div>
            </div>
            <Button
              type="submit"
              form="request-form"
              size="lg"
              loading={isSubmitting}
              disabled={!isFormComplete}
              className={cn(
                'text-kr-keep shadow-toss-md sm:min-w-[200px]',
                !isFormComplete &&
                  'disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none',
              )}
            >
              <Sparkles className="h-5 w-5" />
              {isFormComplete
                ? 'AI 매칭 시작'
                : `필수 정보 ${requiredTotal - requiredFilledCount}개 남음`}
            </Button>
          </div>
        </div>
      )}
      {isSubmitting && <MatchingLoadingOverlay currentStep={loadingStep} />}
    </>
  )
}

const loadingStepIcons = [Sparkles, Search, Brain, Sparkles, CheckCircle] as const

function MatchingLoadingOverlay({ currentStep }: { currentStep: number }) {
  const safeStep = Math.max(1, Math.min(currentStep, matchingLoadingSteps.length))
  const progress = Math.round((safeStep / matchingLoadingSteps.length) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4 py-6 backdrop-blur-sm">
      <section
        role="status"
        aria-live="polite"
        aria-label="AI 매칭 진행 중"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-toss-lg sm:p-8"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/50 blur-3xl" />
        <div className="relative space-y-6">
          <div className="space-y-3">
            <AppBadge variant="blue">
              <Sparkles className="h-4 w-4" />
              AI 매칭 엔진 실행
            </AppBadge>
            <h2 className="text-kr-pretty text-[22px] font-bold leading-tight text-foreground sm:text-[26px]">
              요청 조건을 분석해 최적 공장을 찾고 있습니다
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px] font-bold tabular-nums text-muted-foreground">
                <span className="text-kr-keep">
                  단계 {safeStep} / {matchingLoadingSteps.length}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <ol className="space-y-2.5">
            {matchingLoadingSteps.map((step, index) => {
              const stepNumber = index + 1
              const isDone = stepNumber < safeStep
              const isActive = stepNumber === safeStep
              const StepIcon = loadingStepIcons[stepNumber] ?? Sparkles

              return (
                <li
                  key={step.title}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-3.5 transition-all',
                    isActive
                      ? 'border-primary/40 bg-accent/40 shadow-ct-soft ring-1 ring-primary/20'
                      : isDone
                        ? 'border-success/20 bg-success-subtle/60'
                        : 'border-border bg-muted/40 opacity-70',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-extrabold tabular-nums shadow-ct-soft',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isDone
                          ? 'bg-success text-success-foreground'
                          : 'bg-card text-muted-foreground ring-1 ring-border',
                    )}
                  >
                    {isDone ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isActive ? (
                      <StepIcon className="h-5 w-5 animate-pulse" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          'text-kr-pretty text-[15px] font-bold sm:text-[16px]',
                          isActive
                            ? 'text-foreground'
                            : isDone
                              ? 'text-success'
                              : 'text-muted-foreground',
                        )}
                      >
                        {step.title}
                      </p>
                      {isActive && (
                        <span className="text-kr-keep inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[12px] font-extrabold text-primary">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                          </span>
                          진행 중
                        </span>
                      )}
                      {isDone && (
                        <span className="text-kr-keep inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-extrabold text-success">
                          <CheckCircle className="h-3.5 w-3.5" />
                          완료
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-kr-pretty mt-0.5 text-[13px] leading-5 sm:text-[14px]',
                        isActive ? 'text-foreground/80' : 'text-muted-foreground',
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          <p className="text-kr-pretty text-center text-[13px] text-muted-foreground">
            요청 조건을 분석해 가장 잘 맞는 공장을 찾고 있습니다.
          </p>
        </div>
      </section>
    </div>
  )
}

function DeadlinePicker({
  value,
  error,
  onChange,
}: {
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const initialDeadlineDate = parseDateString(value) ?? new Date()
  const [isOpen, setIsOpen] = useState(false)
  const [viewedYear, setViewedYear] = useState(initialDeadlineDate.getFullYear())
  const [viewedMonth, setViewedMonth] = useState(initialDeadlineDate.getMonth())

  const monthLabel = `${viewedYear}.${padDatePart(viewedMonth + 1)}`
  const formattedDeadline = formatDateLabel(value)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewedYear, viewedMonth, 1).getDay()
    const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate()
    const leadingDays = Array.from({ length: firstDay }, () => null)
    const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    return [...leadingDays, ...monthDays]
  }, [viewedMonth, viewedYear])

  function changeDeadlineMonth(offset: number) {
    const nextMonth = new Date(viewedYear, viewedMonth + offset, 1)
    setViewedYear(nextMonth.getFullYear())
    setViewedMonth(nextMonth.getMonth())
  }

  function handleDeadlineFocus() {
    const selectedDate = parseDateString(value)

    if (selectedDate) {
      setViewedYear(selectedDate.getFullYear())
      setViewedMonth(selectedDate.getMonth())
    }

    setIsOpen(true)
  }

  function isSelectedDeadlineDay(day: number | null): boolean {
    const selectedDate = parseDateString(value)

    if (!day || !selectedDate) {
      return false
    }

    return (
      selectedDate.getFullYear() === viewedYear &&
      selectedDate.getMonth() === viewedMonth &&
      selectedDate.getDate() === day
    )
  }

  function selectDeadlineDay(day: number | null) {
    if (!day) {
      return
    }

    onChange(`${viewedYear}-${padDatePart(viewedMonth + 1)}-${padDatePart(day)}`)
    setIsOpen(false)
  }

  return (
    <div className={fieldClassName}>
      <Label htmlFor="desiredDeadline" className={labelClassName}>
        희망 납기 <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <button
          id="desiredDeadline"
          type="button"
          onClick={handleDeadlineFocus}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-md border border-input bg-card px-3 text-left text-[15px] shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring',
            formattedDeadline ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <span>{formattedDeadline || 'YYYY.MM.DD'}</span>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full min-w-72 rounded-xl border border-border bg-popover p-3 shadow-ct-popover">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeDeadlineMonth(-1)}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-kr-keep text-sm font-bold tabular-nums text-foreground">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => changeDeadlineMonth(1)}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold tabular-nums text-muted-foreground">
              {deadlineWeekHeaders.map((header) => (
                <span key={header} className="py-1">
                  {header}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={`${monthLabel}-${index}`}
                  type="button"
                  disabled={!day}
                  onClick={() => selectDeadlineDay(day)}
                  className={cn(
                    'aspect-square rounded-md text-sm font-semibold tabular-nums transition disabled:pointer-events-none disabled:opacity-0',
                    isSelectedDeadlineDay(day)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-primary',
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}

interface AICriteriaPanelProps {
  importance: Record<string, CriteriaImportance>
  onImportanceChange: (id: string, value: CriteriaImportance) => void
}

function AICriteriaPanel({ importance, onImportanceChange }: AICriteriaPanelProps) {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <Card className={cardClassName}>
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[19px]">
              AI 추천 기준
            </h2>
          </div>
          <p className="text-kr-pretty mb-5 text-[15px] leading-6 text-muted-foreground">
            각 기준에 별을 1~5개 매겨주세요. 별이 많을수록 추천에 더 크게 반영됩니다.
          </p>

          <ul className="space-y-6">
            {aiCriteriaItems.map((criterion) => {
              const Icon = criterion.icon
              const currentLevel = importance[criterion.id] ?? 3
              const groupId = `criteria-${criterion.id}-label`

              return (
                <li key={criterion.id} className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        id={groupId}
                        className="text-kr-keep text-[16px] font-bold text-foreground sm:text-[17px]"
                      >
                        {criterion.label}
                      </h3>
                      <p className="text-kr-pretty mt-0.5 text-[14px] leading-5 text-muted-foreground">
                        {criterion.description}
                      </p>
                    </div>
                  </div>

                  <ImportanceScale
                    groupId={groupId}
                    criterionLabel={criterion.label}
                    currentValue={currentLevel}
                    onChange={(value) => onImportanceChange(criterion.id, value)}
                  />
                </li>
              )
            })}
          </ul>

          <div className="mt-6 rounded-xl border border-primary/20 bg-accent p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p className="text-kr-pretty text-[15px] leading-6 text-accent-foreground">
                점수가 높을수록 추천에 더 크게 반영됩니다. 상세 요구사항을 함께 입력하면 정확도가 더
                올라갑니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

interface ImportanceScaleProps {
  groupId: string
  criterionLabel: string
  currentValue: CriteriaImportance
  onChange: (value: CriteriaImportance) => void
}

function ImportanceScale({
  groupId,
  criterionLabel,
  currentValue,
  onChange,
}: ImportanceScaleProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, value: CriteriaImportance) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(clampImportance(value - 1))
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(clampImportance(value + 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(1)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(5)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span
          aria-hidden="true"
          className="text-kr-keep text-[13px] font-bold text-muted-foreground"
        >
          덜 중요
        </span>
        <span className="text-kr-keep inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[13px] font-extrabold text-primary">
          별 {currentValue}개 · {importanceHints[currentValue].split(' — ')[0]}
        </span>
        <span
          aria-hidden="true"
          className="text-kr-keep text-[13px] font-bold text-muted-foreground"
        >
          꼭 필요
        </span>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="flex w-full items-center justify-between gap-0.5"
      >
        {importanceValues.map((value) => {
          const isFilled = currentValue >= value
          const isCurrent = currentValue === value

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isCurrent}
              aria-label={`${criterionLabel} 별 ${value}개 — ${importanceHints[value]}`}
              onClick={() => onChange(value)}
              onKeyDown={(event) => handleKeyDown(event, value)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30',
                isCurrent && 'scale-110 bg-warning-bg shadow-ct-soft',
                !isCurrent && 'hover:bg-warning-bg/60',
              )}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  isFilled
                    ? 'fill-warning text-warning'
                    : 'fill-transparent text-muted-foreground/40',
                )}
                strokeWidth={2}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
