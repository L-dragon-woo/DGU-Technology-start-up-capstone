'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Package,
  Sparkles,
  Wallet,
} from 'lucide-react'
import type { FactoryRecommendation, ReceivedQuoteRequestStatus } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockReceivedQuoteRequests } from '@/data/requestData'
import { cn } from '@/lib/cn'

const matchedFactoryRecommendations: FactoryRecommendation[] = [
  {
    id: 'factory-001',
    name: '문래정밀가공',
    location: '서울 영등포구 문래동',
    processes: ['CNC 정밀가공', '표면처리'],
    trustScore: 94,
    deliveryRate: 96,
    reorderRate: 82,
    estimateMin: 3200,
    estimateMax: 4100,
    aiReason: '알루미늄 정밀가공과 아노다이징 협력망이 강해 외관 품질 기준을 맞추기 좋습니다.',
    qualityScore: 93,
    deliveryScore: 96,
    priceCompetitiveness: 88,
  },
  {
    id: 'factory-002',
    name: '서울메탈웍스',
    location: '경기 시흥시 정왕동',
    processes: ['소성가공', '용접', '표면처리'],
    trustScore: 89,
    deliveryRate: 91,
    reorderRate: 76,
    estimateMin: 3400,
    estimateMax: 4300,
    aiReason: '중소량 양산 전환 경험이 많고 검사 성적서 대응 속도가 안정적입니다.',
    qualityScore: 88,
    deliveryScore: 91,
    priceCompetitiveness: 86,
  },
  {
    id: 'factory-003',
    name: '미래정밀',
    location: '인천 남동구 고잔동',
    processes: ['CNC 정밀가공', '금형'],
    trustScore: 87,
    deliveryRate: 90,
    reorderRate: 73,
    estimateMin: 3000,
    estimateMax: 4450,
    aiReason: '초도품 대응 단가가 경쟁력 있고 3D 모델 기반 가공 검토가 빠릅니다.',
    qualityScore: 86,
    deliveryScore: 90,
    priceCompetitiveness: 91,
  },
]

function getStatusLabel(status: ReceivedQuoteRequestStatus): string {
  if (status === 'new') return '공장 검토 대기'
  if (status === 'reviewing') return '공장 검토 중'
  return '견적 도착'
}

function getStatusVariant(status: ReceivedQuoteRequestStatus): 'blue' | 'green' | 'amber' {
  if (status === 'new') return 'blue'
  if (status === 'reviewing') return 'amber'
  return 'green'
}

function getBadgeVariant(status: ReceivedQuoteRequestStatus): 'info' | 'success' | 'warning' {
  if (status === 'new') return 'info'
  if (status === 'reviewing') return 'warning'
  return 'success'
}

function formatPrice(value: number): string {
  return `${value}만원`
}

export default function ClientRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const request = mockReceivedQuoteRequests.find((item) => item.id === params.id)

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <Card className="border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-12">
              <FileText className="mx-auto h-12 w-12 text-ink-400" />
              <h1 className="text-kr-pretty mt-4 text-[24px] font-bold text-foreground sm:text-[28px]">
                견적 요청을 찾을 수 없습니다.
              </h1>
              <Button asChild className="mt-6">
                <Link href="/requests">
                  목록으로 돌아가기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const matchedFactories =
    request.status === 'quoted' ? matchedFactoryRecommendations.slice(0, 3) : []

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href="/requests"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-700 transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          견적 요청 내역
        </Link>

        <section className="space-y-6 sm:space-y-8">
          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant={getBadgeVariant(request.status)} className="text-kr-keep">
                      {getStatusLabel(request.status)}
                    </Badge>
                    <AppBadge variant={getStatusVariant(request.status)}>
                      {getStatusLabel(request.status)}
                    </AppBadge>
                    <span className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                      {request.id}
                    </span>
                  </div>
                  <h1 className="text-kr-pretty text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
                    {request.projectName}
                  </h1>
                  <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-7 text-foreground/80">
                    {request.description}
                  </p>
                </div>

                <Button asChild variant="outline">
                  <Link href="/request">
                    요청 수정
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Package className="h-5 w-5" />}
              tone="blue"
              label="품목 / 공정"
              title={request.productItem}
              subtitle={request.processType}
            />
            <MetricCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              tone="green"
              label="예상 수량"
              title={request.quantity}
            />
            <MetricCard
              icon={<Wallet className="h-5 w-5" />}
              tone="amber"
              label="예산 범위"
              title={request.budgetRange}
            />
            <MetricCard
              icon={<CalendarDays className="h-5 w-5" />}
              tone="violet"
              label="희망 납기"
              title={request.desiredDeadline}
            />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                  요청 상세 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                      요청 기업
                    </dt>
                    <dd className="mt-1 font-bold text-ink-950">{request.clientName}</dd>
                  </div>
                  <div>
                    <dt className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                      요청일
                    </dt>
                    <dd className="mt-1 font-bold text-ink-950">{request.requestedAt}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                      첨부 자료
                    </dt>
                    <dd className="mt-3 space-y-2">
                      {request.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-light hover:bg-brand-light/40 hover:text-brand"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-kr-keep">{attachment.name}</span>
                          </span>
                          <span className="text-xs text-ink-400">
                            {Math.round(attachment.size / 1000).toLocaleString()}KB
                          </span>
                        </a>
                      ))}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                  진행 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  <ProgressItem
                    icon={<CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />}
                    title="요청 등록 완료"
                    description="등록 조건과 첨부 자료가 저장되었습니다."
                  />
                  <ProgressItem
                    icon={
                      <Clock
                        className={cn(
                          'mt-0.5 h-5 w-5',
                          request.status === 'new' ? 'text-ink-400' : 'text-warning',
                        )}
                      />
                    }
                    title="공장 검토"
                    description="조건에 맞는 공장이 요청서를 확인합니다."
                  />
                  <ProgressItem
                    icon={
                      <Sparkles
                        className={cn(
                          'mt-0.5 h-5 w-5',
                          request.status === 'quoted' ? 'text-brand' : 'text-ink-400',
                        )}
                      />
                    }
                    title="견적 결과 확인"
                    description="도착한 견적과 공장 정보를 이 화면에서 확인합니다."
                  />
                </ol>
              </CardContent>
            </Card>
          </section>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                  매칭 결과 정보
                </CardTitle>
                <CardDescription className="text-kr-pretty text-[15px]">
                  이 견적 요청에 연결된 공장 견적과 핵심 지표입니다.
                </CardDescription>
              </div>
              <Badge
                variant={request.status === 'quoted' ? 'success' : 'slate'}
                className="text-kr-keep"
              >
                {request.status === 'quoted'
                  ? `${matchedFactories.length}개 견적 도착`
                  : '견적 대기'}
              </Badge>
              <AppBadge variant={request.status === 'quoted' ? 'green' : 'slate'}>
                {request.status === 'quoted'
                  ? `${matchedFactories.length}개 견적 도착`
                  : '견적 대기'}
              </AppBadge>
            </CardHeader>
            <CardContent>
              {matchedFactories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {matchedFactories.map((factory) => (
                    <article
                      key={factory.id}
                      className="rounded-2xl border border-border p-5 transition hover:border-brand-light hover:shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-kr-pretty text-[16px] font-bold text-foreground">
                            {factory.name}
                          </h3>
                          <p className="text-kr-keep mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {factory.location}
                          </p>
                        </div>
                        <Badge variant="info" size="sm" className="text-kr-keep">
                          신뢰 {factory.trustScore}점
                        </Badge>
                      </div>

                      <Separator className="mb-4" />

                      <dl className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-surface-muted p-3">
                          <dt className="text-kr-keep font-semibold text-muted-foreground">
                            예상 견적
                          </dt>
                          <dd className="mt-1 font-bold text-ink-950">
                            {formatPrice(factory.estimateMin)} ~ {formatPrice(factory.estimateMax)}
                          </dd>
                        </div>
                        <div className="rounded-xl bg-surface-muted p-3">
                          <dt className="text-kr-keep font-semibold text-muted-foreground">
                            납기 준수
                          </dt>
                          <dd className="mt-1 font-bold text-ink-950">{factory.deliveryRate}%</dd>
                        </div>
                      </dl>

                      <p className="text-kr-pretty mt-4 rounded-xl bg-brand-light p-3 text-sm leading-6 text-blue-800">
                        {factory.aiReason}
                      </p>

                      <Button asChild variant="outline" fullWidth className="mt-4">
                        <Link href={`/factories/${factory.id}`}>
                          공장 상세 보기
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-ink-400" />
                  <p className="text-kr-pretty mt-3 font-bold text-ink-700">
                    아직 도착한 견적이 없습니다.
                  </p>
                  <p className="text-kr-pretty mt-1 text-sm text-ink-400">
                    공장 검토가 끝나면 이 영역에 매칭 결과가 표시됩니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

function MetricCard({
  icon,
  tone,
  label,
  title,
  subtitle,
}: {
  icon: ReactNode
  tone: 'blue' | 'green' | 'amber' | 'violet'
  label: string
  title: string
  subtitle?: string
}) {
  const toneClassName = {
    blue: 'bg-brand-light text-brand',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-warning',
    violet: 'bg-violet-50 text-violet-600',
  }[tone]

  return (
    <Card className="border-border bg-card shadow-ct-soft">
      <CardContent className="p-5">
        <div
          className={cn(
            'mb-3 flex h-10 w-10 items-center justify-center rounded-xl',
            toneClassName,
          )}
        >
          {icon}
        </div>
        <p className="text-kr-keep text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-kr-pretty mt-2 font-bold text-foreground">{title}</p>
        {subtitle && <p className="text-kr-keep mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

function ProgressItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <li className="bg-muted/40 px-4 py-3 first:rounded-t-lg last:rounded-b-lg">
      <div className="flex gap-3">
        {icon}
        <div>
          <p className="text-kr-pretty font-bold text-foreground">{title}</p>
          <p className="text-kr-pretty text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </li>
  )
}
