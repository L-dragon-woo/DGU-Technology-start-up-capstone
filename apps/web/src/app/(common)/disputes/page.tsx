'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Handshake,
  MessageSquareText,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import type { DisputeStatus } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { disputeCases } from '@/data/disputeData'
import { cn } from '@/lib/cn'

type StatusFilter = DisputeStatus | 'all'

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'reviewing', label: '자료 검토 중' },
  { value: 'proposal', label: '조정안 제시' },
  { value: 'waiting', label: '상대방 답변 대기' },
  { value: 'resolved', label: '합의 완료' },
]

function getDisputeBadgeVariant(status: DisputeStatus): BadgeProps['variant'] {
  if (status === 'resolved') return 'success'
  if (status === 'proposal') return 'warning'
  if (status === 'waiting') return 'info'
  return 'slate'
}

export default function DisputeListPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const activeCases = useMemo(() => disputeCases.filter((item) => item.status !== 'resolved'), [])
  const resolvedCases = useMemo(() => disputeCases.filter((item) => item.status === 'resolved'), [])
  const filteredCases = useMemo(
    () => disputeCases.filter((item) => statusFilter === 'all' || item.status === statusFilter),
    [statusFilter],
  )

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-ct-soft">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <AppBadge variant="blue" className="mb-4 px-4 py-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" />
                분쟁 중재 센터
              </AppBadge>
              <h1 className="text-kr-keep text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold tracking-normal text-foreground">
                진행 중인 분쟁 중재
              </h1>
              <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                접수된 분쟁의 검토 상태, 다음 조치, 조정 진행률을 한 곳에서 확인합니다.
              </p>
            </div>

            <Button asChild size="lg" className="text-kr-keep">
              <Link href="/disputes">
                <Plus className="h-5 w-5" />
                중재 요청하기
              </Link>
            </Button>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<AlertTriangle className="h-6 w-6 text-brand" />}
            label="진행 중"
            value={activeCases.length}
          />
          <SummaryCard
            icon={<Handshake className="h-6 w-6 text-amber-600" />}
            label="조정안 단계"
            value={disputeCases.filter((item) => item.status === 'proposal').length}
          />
          <SummaryCard
            icon={<Clock className="h-6 w-6 text-violet-600" />}
            label="답변 대기"
            value={disputeCases.filter((item) => item.status === 'waiting').length}
          />
          <SummaryCard
            icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
            label="완료"
            value={resolvedCases.length}
          />
        </section>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    'rounded-pill transition',
                    statusFilter !== filter.value && 'hover:bg-accent',
                  )}
                >
                  <Badge
                    variant={statusFilter === filter.value ? 'info' : 'slate'}
                    className="text-kr-keep pointer-events-none"
                  >
                    {filter.label}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((item) => (
            <Card
              key={item.id}
              className="border-border bg-card shadow-ct-soft transition hover:border-brand-light hover:shadow-ct-card"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex h-full flex-col gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-kr-keep text-[15px] font-bold text-muted-foreground">
                        {item.id}
                      </span>
                      <Badge variant={getDisputeBadgeVariant(item.status)} className="text-kr-keep">
                        {item.statusLabel}
                      </Badge>
                      <Badge variant="slate" className="text-kr-keep">
                        {item.type}
                      </Badge>
                    </div>

                    <h2 className="text-kr-pretty mt-3 text-[15px] font-bold leading-6 text-foreground sm:text-[16px]">
                      {item.projectName}
                    </h2>
                    <p className="text-kr-pretty mt-2 text-[15px] text-muted-foreground">
                      {item.counterparty} · {item.amount}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <InfoTile
                        icon={<CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />}
                        label="접수일"
                        value={item.requestedAt}
                      />
                      <InfoTile
                        icon={
                          <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
                        }
                        label="담당"
                        value={item.mediator}
                      />
                      <InfoTile
                        icon={<FileText className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />}
                        label="다음 조치"
                        value={item.nextAction}
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-kr-keep font-semibold text-muted-foreground">
                          진행률
                        </span>
                        <span className="font-bold text-foreground">{item.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-brand"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <span className="text-kr-keep text-sm font-semibold text-muted-foreground">
                      최근 업데이트
                    </span>
                    <span className="text-kr-keep text-base font-bold text-foreground">
                      {item.updatedAt}
                    </span>
                    <Button asChild variant="outline" size="sm" className="text-kr-keep">
                      <Link href={`/disputes/${item.id}`}>
                        상세 보기
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card className="border-border bg-card p-5 shadow-ct-soft">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-kr-keep text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </Card>
  )
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
      {icon}
      <div>
        <p className="text-kr-keep text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="text-kr-pretty mt-1 text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
