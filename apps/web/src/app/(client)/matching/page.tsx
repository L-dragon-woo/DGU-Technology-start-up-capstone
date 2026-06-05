'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  UsersRound,
  Wallet,
  Zap,
} from 'lucide-react'
import type { FactoryRecommendation, QuoteRequestDraft } from '@rootmatching/shared'
import { mockFactoryRecommendations } from '@rootmatching/shared/fixtures/factory-data'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/cn'
import { useDemoMode } from '@/lib/demo-mode'

const MATCHING_RESULTS_KEY = 'rm:matchingResults'
const SELECTED_FACTORY_KEY = 'rm:selectedFactory'
const STALE_AFTER_MS = 60 * 60 * 1000

const PROCESS_OPTIONS = [
  '전체',
  'CNC 절삭',
  '금형',
  '소성가공',
  '용접',
  '표면처리',
  '주조',
  '열처리',
]
const REGION_OPTIONS = ['전체', '서울', '경기', '인천']
const TRUST_SCORE_OPTIONS = ['전체', '90점 이상', '85점 이상', '80점 이상']

interface MatchingResultsPayload {
  results: DemoFactoryRecommendation[]
  request: QuoteRequestDraft
  submittedAt: number
}

type DemoFactoryRecommendation = FactoryRecommendation & {
  matchScore?: number
  reorderCustomerCount?: number
  distanceKm?: number
  employeeCount?: number
  industrialComplex?: string
  aiReasonBullets?: string[]
}

type LoadState = 'loading' | 'ready' | 'empty'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isFactoryRecommendation(value: unknown): value is FactoryRecommendation {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.location === 'string' &&
    isStringArray(value.processes) &&
    typeof value.trustScore === 'number' &&
    typeof value.deliveryRate === 'number' &&
    typeof value.reorderRate === 'number' &&
    typeof value.estimateMin === 'number' &&
    typeof value.estimateMax === 'number' &&
    typeof value.aiReason === 'string' &&
    typeof value.qualityScore === 'number' &&
    typeof value.deliveryScore === 'number' &&
    typeof value.priceCompetitiveness === 'number'
  )
}

function isQuoteRequestDraft(value: unknown): value is QuoteRequestDraft {
  if (!isRecord(value)) return false

  return (
    typeof value.projectName === 'string' &&
    typeof value.processType === 'string' &&
    typeof value.productItem === 'string' &&
    typeof value.estimatedQuantity === 'string' &&
    typeof value.desiredDeadline === 'string' &&
    typeof value.budgetRange === 'string' &&
    typeof value.detailRequirements === 'string'
  )
}

function isMatchingResultsPayload(value: unknown): value is MatchingResultsPayload {
  if (!isRecord(value)) return false

  return (
    Array.isArray(value.results) &&
    value.results.every(isFactoryRecommendation) &&
    isQuoteRequestDraft(value.request) &&
    typeof value.submittedAt === 'number'
  )
}

function formatPrice(value: number): string {
  return `${value}만원`
}

function getMatchScore(factory: DemoFactoryRecommendation): number {
  return (
    factory.matchScore ??
    Math.round(
      factory.trustScore * 0.3 +
        factory.deliveryScore * 0.25 +
        factory.qualityScore * 0.25 +
        factory.priceCompetitiveness * 0.2,
    )
  )
}

function getDeliveryTone(rate: number): {
  text: string
  bg: string
  badge: 'green' | 'amber' | 'red'
} {
  if (rate >= 90) return { text: 'text-success', bg: 'bg-success', badge: 'green' }
  if (rate >= 70) return { text: 'text-warning-text', bg: 'bg-warning', badge: 'amber' }
  return { text: 'text-danger', bg: 'bg-danger', badge: 'red' }
}

function getTrustScoreVariant(score: number): 'green' | 'blue' | 'amber' {
  if (score >= 90) return 'green'
  if (score >= 80) return 'blue'
  return 'amber'
}

function getTrustScoreTextClass(score: number): string {
  if (score >= 90) return 'text-success'
  if (score >= 80) return 'text-brand'
  return 'text-warning'
}

function getTrustScoreBorderClass(score: number): string {
  if (score >= 90) return 'border-emerald-200'
  if (score >= 80) return 'border-brand-light'
  return 'border-amber-200'
}

function parseMinimumTrustScore(option: string): number | null {
  if (option === '전체') return null

  const parsed = Number.parseInt(option, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function ProgressMetric({
  icon,
  label,
  value,
  barClassName,
}: {
  icon: ReactNode
  label: string
  value: number
  barClassName: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-ink-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-ink-950">{value}점</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barClassName)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="min-w-[160px] flex-1 space-y-1.5 sm:flex-none">
      <span className="text-kr-keep block text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-border bg-muted text-sm text-foreground shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-kr-keep">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function MatchingResultPage() {
  const router = useRouter()
  const isDemoMode = useDemoMode()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [factories, setFactories] = useState<DemoFactoryRecommendation[]>([])
  const [request, setRequest] = useState<QuoteRequestDraft | null>(null)
  const [selectedFactory, setSelectedFactory] = useState<DemoFactoryRecommendation | null>(null)
  const [expandedFactoryId, setExpandedFactoryId] = useState<string | null>('1')
  const [processFilter, setProcessFilter] = useState('전체')
  const [regionFilter, setRegionFilter] = useState('전체')
  const [trustScoreFilter, setTrustScoreFilter] = useState('전체')
  const [deliveryFilter, setDeliveryFilter] = useState(false)

  useEffect(() => {
    function showDemoFactories() {
      setFactories(mockFactoryRecommendations as DemoFactoryRecommendation[])
      setRequest({
        projectName: '알루미늄 하우징 시제품',
        processType: 'CNC 절삭 + 표면처리',
        productItem: '알루미늄 하우징 시제품',
        estimatedQuantity: '초도 5,000개',
        desiredDeadline: '2026년 4월말',
        budgetRange: '400만원 ~ 500만원',
        detailRequirements: 'RoHS 준수, 표면 거칠기 Ra 0.8 이하, 안정적 납기 보증 우선',
      })
      setSelectedFactory((mockFactoryRecommendations as DemoFactoryRecommendation[])[0] ?? null)
      setLoadState('ready')
    }

    if (isDemoMode) {
      showDemoFactories()
      return
    }

    const storedValue = window.sessionStorage.getItem(MATCHING_RESULTS_KEY)

    if (!storedValue) {
      setLoadState('empty')
      return
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue)

      if (!isMatchingResultsPayload(parsedValue)) {
        setLoadState('empty')
        return
      }

      if (Date.now() - parsedValue.submittedAt > STALE_AFTER_MS) {
        setLoadState('empty')
        return
      }

      setFactories(parsedValue.results)
      setRequest(parsedValue.request)
      setSelectedFactory(parsedValue.results[0] ?? null)
      setLoadState('ready')
    } catch {
      setLoadState('empty')
    }
  }, [isDemoMode])

  const filteredFactories = useMemo(() => {
    const minimumTrustScore = parseMinimumTrustScore(trustScoreFilter)

    return factories.filter((factory) => {
      if (processFilter !== '전체' && !factory.processes.includes(processFilter)) return false
      if (regionFilter !== '전체' && !factory.location.includes(regionFilter)) return false
      if (minimumTrustScore !== null && factory.trustScore < minimumTrustScore) return false
      if (deliveryFilter && factory.deliveryRate < 90) return false
      return true
    })
  }, [deliveryFilter, factories, processFilter, regionFilter, trustScoreFilter])

  useEffect(() => {
    if (loadState !== 'ready') return
    if (!selectedFactory) return
    if (filteredFactories.some((factory) => factory.id === selectedFactory.id)) return
    setSelectedFactory(filteredFactories[0] ?? null)
  }, [filteredFactories, loadState, selectedFactory])

  function goToDetail(id: string) {
    router.push(`/factories/${id}`)
  }

  function requestQuote(factory?: DemoFactoryRecommendation) {
    const factoryToStore = factory ?? selectedFactory ?? filteredFactories[0]

    if (factoryToStore) {
      setSelectedFactory(factoryToStore)
      window.sessionStorage.setItem(SELECTED_FACTORY_KEY, JSON.stringify(factoryToStore))
    }

    router.push('/contract')
  }

  function showExampleRecommendations() {
    setFactories(mockFactoryRecommendations as DemoFactoryRecommendation[])
    setSelectedFactory((mockFactoryRecommendations as DemoFactoryRecommendation[])[0] ?? null)
    setRequest({
      projectName: '알루미늄 하우징 시제품',
      processType: 'CNC 절삭 + 표면처리',
      productItem: '알루미늄 하우징 시제품',
      estimatedQuantity: '초도 5,000개',
      desiredDeadline: '2026년 4월말',
      budgetRange: '400만원 ~ 500만원',
      detailRequirements: 'RoHS 준수, 표면 거칠기 Ra 0.8 이하, 안정적 납기 보증 우선',
    })
    setLoadState('ready')
  }

  const averageMatchScore = useMemo(() => {
    if (factories.length === 0) return 0
    return factories.reduce((sum, factory) => sum + getMatchScore(factory), 0) / factories.length
  }, [factories])

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center">
          <Card className="w-full border-primary/30 bg-accent/40 shadow-ct-soft">
            <CardContent className="flex items-center gap-5 p-6 sm:p-8">
              <div
                className="size-12 shrink-0 animate-spin rounded-full border-4 border-primary border-t-transparent"
                aria-hidden="true"
                role="status"
                aria-label="AI 매칭 진행 중"
              />
              <div className="space-y-1.5">
                <p className="text-kr-pretty text-[18px] font-bold text-foreground">
                  AI가 최적 공장을 분석 중입니다
                </p>
                <p className="text-kr-pretty text-[15px] text-muted-foreground">
                  공정·납기·품질·가격을 종합적으로 검토하고 있어요. 5-10초가량 소요됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border bg-card">
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loadState === 'empty') {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <Card className="w-full border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                <Settings className="h-8 w-8 text-brand" />
              </div>
              <h1 className="text-kr-pretty text-2xl font-bold text-foreground">
                최근 매칭 결과가 없습니다
              </h1>
              <p className="text-kr-pretty mt-3 text-base leading-7 text-muted-foreground">
                저장된 추천 결과가 없거나 1시간이 지나 만료되었습니다. 새 견적 요청을 등록하면 AI가
                적합한 공장을 다시 추천해 드립니다.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <AppButton
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/request')}
                >
                  <Sparkles className="h-5 w-5" />새 견적 요청 등록
                </AppButton>
                {isDemoMode && (
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={showExampleRecommendations}
                  >
                    예시 추천 보기
                  </AppButton>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Card className="mb-8 overflow-hidden border-border bg-card shadow-ct-soft">
          <CardHeader className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-light/70 blur-3xl" />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <AppBadge variant="blue">
                  <Sparkles className="h-4 w-4" />
                  AI 추천 공장
                </AppBadge>
                <CardTitle className="text-kr-pretty mt-4 text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
                  AI 매칭 결과 {filteredFactories.length}곳
                </CardTitle>
                <CardDescription className="text-kr-pretty mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                  총 {factories.length}개 공장 매칭 · 평균 점수 {averageMatchScore.toFixed(1)} ·
                  점수순 정렬
                </CardDescription>
              </div>

              {request && (
                <dl className="grid min-w-full grid-cols-1 gap-3 rounded-2xl bg-muted p-4 sm:grid-cols-3 lg:min-w-[520px]">
                  <div>
                    <dt className="text-kr-keep text-xs font-semibold text-muted-foreground">
                      프로젝트
                    </dt>
                    <dd className="text-kr-pretty mt-1 truncate text-sm font-bold text-foreground">
                      {request.projectName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-kr-keep text-xs font-semibold text-muted-foreground">
                      품목 / 공정
                    </dt>
                    <dd className="text-kr-pretty mt-1 truncate text-sm font-bold text-foreground">
                      {request.productItem} · {request.processType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-kr-keep text-xs font-semibold text-muted-foreground">
                      희망 납기
                    </dt>
                    <dd className="text-kr-keep mt-1 truncate text-sm font-bold text-foreground">
                      {request.desiredDeadline}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <FilterSelect
                label="공정"
                value={processFilter}
                options={PROCESS_OPTIONS}
                onChange={setProcessFilter}
              />
              <FilterSelect
                label="지역"
                value={regionFilter}
                options={REGION_OPTIONS}
                onChange={setRegionFilter}
              />
              <FilterSelect
                label="신뢰 점수"
                value={trustScoreFilter}
                options={TRUST_SCORE_OPTIONS}
                onChange={setTrustScoreFilter}
              />

              <div className="flex items-end">
                <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-muted px-4 transition hover:border-brand-light hover:bg-brand-light/40">
                  <Checkbox
                    checked={deliveryFilter}
                    onCheckedChange={(checked) => setDeliveryFilter(checked === true)}
                  />
                  <span className="text-kr-keep text-sm text-foreground">납기 가능</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <main className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredFactories.map((factory) => {
              const isSelected = selectedFactory?.id === factory.id
              const matchScore = getMatchScore(factory)
              const deliveryTone = getDeliveryTone(factory.deliveryRate)
              const isExpanded = expandedFactoryId === factory.id
              const reasons = factory.aiReasonBullets ?? [factory.aiReason]

              return (
                <Card
                  key={factory.id}
                  onClick={() => setSelectedFactory(factory)}
                  className={cn(
                    'cursor-pointer border bg-card shadow-ct-soft transition hover:border-brand-light hover:shadow-ct-card',
                    isSelected
                      ? 'border-brand shadow-ct-card ring-4 ring-brand-light'
                      : 'border-border',
                  )}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <h2 className="text-kr-pretty text-lg font-bold text-foreground">
                            {factory.name}
                          </h2>
                          <Badge
                            variant={
                              getTrustScoreVariant(factory.trustScore) === 'green'
                                ? 'success'
                                : getTrustScoreVariant(factory.trustScore) === 'blue'
                                  ? 'info'
                                  : 'warning'
                            }
                            className={cn(
                              'text-kr-keep border',
                              getTrustScoreBorderClass(factory.trustScore),
                              getTrustScoreTextClass(factory.trustScore),
                            )}
                          >
                            <Trophy className="h-4 w-4" />
                            신뢰 {factory.trustScore}
                          </Badge>
                        </div>
                        <p className="text-kr-pretty flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {factory.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {factory.processes.map((process) => (
                          <Badge key={process} variant="slate" className="text-kr-keep">
                            {process}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 rounded-2xl border border-brand-light bg-brand-light/40 p-4">
                      <div className="mb-2 flex items-end justify-between">
                        <span className="text-kr-keep text-sm font-bold text-brand">
                          AI 매칭 점수
                        </span>
                        <span className="text-3xl font-black tabular-nums text-foreground">
                          {matchScore}
                        </span>
                      </div>
                      <Progress
                        value={matchScore}
                        className="h-3 bg-card ring-1 ring-brand-light"
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-brand-light/60 pt-2.5 text-[13px] font-bold text-foreground/85">
                        <span className="inline-flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 text-warning" />
                          <span className="tabular-nums">
                            {formatPrice(factory.estimateMin)} ~ {formatPrice(factory.estimateMax)}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-muted-foreground">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className={cn('h-3.5 w-3.5', deliveryTone.text)} />
                          납기{' '}
                          <span className={cn('tabular-nums', deliveryTone.text)}>
                            {factory.deliveryRate}%
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-muted-foreground">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-ink-700" />
                          <span className="tabular-nums">{factory.distanceKm ?? '-'}km</span>
                        </span>
                      </div>
                    </div>

                    <dl className="mb-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-success-bg">
                          <Clock className={cn('h-4 w-4', deliveryTone.text)} />
                        </div>
                        <div>
                          <dt className="text-kr-keep text-xs text-muted-foreground">
                            납기 준수율
                          </dt>
                          <dd className={cn('text-sm font-black', deliveryTone.text)}>
                            {factory.deliveryRate}%
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light">
                          <RefreshCw className="h-4 w-4 text-brand" />
                        </div>
                        <div>
                          <dt className="text-kr-keep text-xs text-muted-foreground">재거래율</dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {factory.reorderRate}% · {factory.reorderCustomerCount ?? '-'}곳
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted">
                          <MapPin className="h-4 w-4 text-ink-700" />
                        </div>
                        <div>
                          <dt className="text-kr-keep text-xs text-muted-foreground">거리</dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {factory.distanceKm ?? '-'}km
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted">
                          <UsersRound className="h-4 w-4 text-ink-700" />
                        </div>
                        <div>
                          <dt className="text-kr-keep text-xs text-muted-foreground">규모</dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {factory.employeeCount ?? '-'}명
                          </dd>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
                          <Wallet className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <dt className="text-kr-keep text-xs text-muted-foreground">예상 견적</dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {formatPrice(factory.estimateMin)} ~ {formatPrice(factory.estimateMax)}
                          </dd>
                        </div>
                      </div>
                    </dl>

                    <div className="mb-4 flex items-start gap-2 rounded-xl bg-brand-light p-3">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                      <p className="text-kr-pretty text-sm leading-6 text-brand">
                        {factory.aiReason}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation()
                        setExpandedFactoryId(isExpanded ? null : factory.id)
                      }}
                      className="text-kr-keep mb-4 w-full border-brand-light bg-card text-brand hover:bg-brand-light"
                    >
                      AI 추천 이유 {isExpanded ? '접기' : '자세히 보기'}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>

                    {isExpanded && (
                      <ul className="mb-4 space-y-2 rounded-2xl border border-border bg-muted p-4">
                        {reasons.slice(0, 5).map((reason) => (
                          <li
                            key={reason}
                            className="text-kr-pretty flex gap-2 text-sm leading-6 text-foreground"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {isSelected ? (
                        <span className="text-kr-keep inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-extrabold text-brand">
                          <Check className="h-3.5 w-3.5" />
                          선택됨 — 우측 패널에서 진행
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedFactory(factory)
                          }}
                          className="text-kr-keep"
                        >
                          이 공장 선택
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation()
                          goToDetail(factory.id)
                        }}
                        className="text-kr-keep"
                      >
                        상세 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredFactories.length === 0 && (
              <Card className="border-border bg-card text-center shadow-ct-soft xl:col-span-2">
                <CardContent className="p-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                    <Settings className="h-8 w-8 text-ink-400" />
                  </div>
                  <h2 className="text-kr-pretty mb-2 text-lg font-bold text-foreground">
                    검색 결과가 없습니다
                  </h2>
                  <p className="text-kr-pretty text-muted-foreground">필터 조건을 변경해 보세요.</p>
                </CardContent>
              </Card>
            )}
          </main>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Card className="overflow-hidden border-border bg-card shadow-ct-soft">
              <CardHeader className="bg-ink-950 px-5 py-4">
                <CardTitle className="text-kr-keep flex items-center gap-2 font-semibold text-white">
                  <TrendingUp className="h-5 w-5" />
                  선택한 공장 상세
                </CardTitle>
              </CardHeader>

              {selectedFactory ? (
                <CardContent className="p-5">
                  <div className="mb-4 pb-4">
                    <h3 className="text-kr-pretty mb-1 font-semibold text-foreground">
                      {selectedFactory.name}
                    </h3>
                    <p className="text-kr-pretty text-sm text-muted-foreground">
                      {selectedFactory.location}
                    </p>
                  </div>
                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    <ProgressMetric
                      icon={<Shield className="h-4 w-4 text-success" />}
                      label="품질 점수"
                      value={selectedFactory.qualityScore}
                      barClassName="bg-success"
                    />
                    <ProgressMetric
                      icon={<Clock className="h-4 w-4 text-brand" />}
                      label="납기 점수"
                      value={selectedFactory.deliveryScore}
                      barClassName="bg-brand"
                    />
                    <ProgressMetric
                      icon={<Zap className="h-4 w-4 text-warning" />}
                      label="가격 경쟁력"
                      value={selectedFactory.priceCompetitiveness}
                      barClassName="bg-warning"
                    />
                  </div>

                  <div className="mt-6 rounded-xl bg-muted p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand" />
                      <span className="text-kr-keep text-sm font-semibold text-foreground">
                        종합 추천 이유
                      </span>
                    </div>
                    <p className="text-kr-pretty text-sm leading-6 text-muted-foreground">
                      {selectedFactory.aiReason}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => requestQuote()}
                    fullWidth
                    className="text-kr-keep mt-5"
                  >
                    <Check className="h-4 w-4" />이 공장으로 견적 진행
                  </Button>
                  <p className="text-kr-pretty mt-2 text-center text-[13px] text-muted-foreground">
                    선택 후 계약·에스크로 결제 단계로 넘어갑니다.
                  </p>
                </CardContent>
              ) : (
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
                    <Settings className="h-6 w-6 text-ink-400" />
                  </div>
                  <p className="text-kr-pretty text-sm leading-6 text-muted-foreground">
                    공장을 선택하면
                    <br />
                    상세 정보를 확인할 수 있습니다.
                  </p>
                </CardContent>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
