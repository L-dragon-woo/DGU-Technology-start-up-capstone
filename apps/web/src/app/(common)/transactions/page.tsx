'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  CheckCircle,
  Clock,
  PackageCheck,
  PencilLine,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import type { TransactionRole } from '@rootmatching/shared'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { transactionCases } from '@/data/transactionData'
import { cn } from '@/lib/cn'

type RoleFilter = TransactionRole | 'all'

function getRoleLabel(role: TransactionRole): string {
  return role === 'client' ? '내가 요청한 거래' : '내가 맡은 제작'
}

function getDetailPath(id: string, role: TransactionRole): string {
  return role === 'factory' ? `/transactions/${id}?mode=factory` : `/transactions/${id}`
}

function getStatusBadgeVariant(statusKey: string): BadgeProps['variant'] {
  if (statusKey === 'completed') return 'success'
  if (statusKey === 'inspection') return 'warning'
  if (statusKey === 'delayed') return 'destructive'
  return 'info'
}

export default function TransactionListPage() {
  const [activeRole, setActiveRole] = useState<RoleFilter>('all')

  const filteredTransactions = useMemo(() => {
    if (activeRole === 'all') return transactionCases
    return transactionCases.filter((item) => item.myRole === activeRole)
  }, [activeRole])

  const activeTransactions = filteredTransactions.filter((item) => item.statusKey !== 'completed')
  const inspectionTransactions = filteredTransactions.filter(
    (item) => item.statusKey === 'inspection',
  )
  const delayedTransactions = filteredTransactions.filter((item) => item.statusKey === 'delayed')

  const roleTabs: Array<{ value: RoleFilter; label: string; count: number }> = [
    { value: 'all', label: '전체 거래', count: transactionCases.length },
    {
      value: 'client',
      label: '내가 요청한 거래',
      count: transactionCases.filter((item) => item.myRole === 'client').length,
    },
    {
      value: 'factory',
      label: '내가 맡은 제작',
      count: transactionCases.filter((item) => item.myRole === 'factory').length,
    },
  ]

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-ct-soft">
          <div className="p-6 sm:p-8">
            <div className="text-kr-keep mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              거래 진행 관리
            </div>
            <h1 className="text-kr-keep text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold tracking-normal text-foreground">
              진행 중인 거래
            </h1>
            <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              계약 이후 제작, 납품, 검수 단계에 있는 거래를 한 곳에서 확인합니다.
            </p>
          </div>
        </header>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {roleTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={cn(
                    'rounded-pill transition',
                    activeRole !== tab.value && 'hover:bg-accent',
                  )}
                  onClick={() => setActiveRole(tab.value)}
                >
                  <Badge
                    variant={activeRole === tab.value ? 'info' : 'slate'}
                    className="text-kr-keep pointer-events-none"
                  >
                    {tab.label} {tab.count}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={<Truck className="h-6 w-6 text-brand" />}
            label="진행 중"
            value={activeTransactions.length}
          />
          <SummaryCard
            icon={<PackageCheck className="h-6 w-6 text-warning" />}
            label="검수 대기"
            value={inspectionTransactions.length}
          />
          <SummaryCard
            icon={<Clock className="h-6 w-6 text-danger" />}
            label="지연 주의"
            value={delayedTransactions.length}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTransactions.map((item) => (
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
                      <Badge
                        variant={getStatusBadgeVariant(item.statusKey)}
                        className="text-kr-keep"
                      >
                        {item.status}
                      </Badge>
                      <Badge
                        variant={item.myRole === 'client' ? 'success' : 'slate'}
                        className="text-kr-keep"
                      >
                        {getRoleLabel(item.myRole)}
                      </Badge>
                    </div>

                    <h2 className="text-kr-pretty mt-3 text-[15px] font-bold leading-6 text-foreground sm:text-[16px]">
                      {item.projectName}
                    </h2>
                    <p className="text-kr-pretty mt-2 text-[15px] text-muted-foreground">
                      {item.factory} · {item.amount}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <InfoCell
                        icon={<CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />}
                        label="납기"
                        value={item.dueDate}
                      />
                      <InfoCell
                        icon={<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />}
                        label="다음 조치"
                        value={item.nextAction}
                      />
                      <InfoCell
                        icon={<Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />}
                        label="최근 업데이트"
                        value={item.updatedAt}
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-kr-keep font-semibold text-muted-foreground">
                          진행률
                        </span>
                        <span className="font-bold text-foreground">{item.progressRate}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-brand"
                          style={{ width: `${item.progressRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                    <Button asChild variant="outline" size="sm" className="text-kr-keep flex-1">
                      <Link href={getDetailPath(item.id, item.myRole)}>
                        {item.myRole === 'client' ? '진행 확인' : '상세 보기'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    {item.myRole === 'factory' && (
                      <Button asChild size="sm" className="text-kr-keep flex-1">
                        <Link href={`/transactions/${item.id}?mode=factory`}>
                          <PencilLine className="h-4 w-4" />
                          진행 업데이트
                        </Link>
                      </Button>
                    )}
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
        <span className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </Card>
  )
}

function InfoCell({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
