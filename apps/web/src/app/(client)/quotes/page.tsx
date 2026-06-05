'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Factory,
  FileText,
  Package,
  Search,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react'
import type { ReceivedQuoteRequestStatus } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockReceivedQuoteRequests } from '@/data/requestData'

type StatusFilter = ReceivedQuoteRequestStatus | 'all'

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: '전체 상태' },
  { value: 'new', label: '모집 중' },
  { value: 'reviewing', label: '검토 중' },
  { value: 'quoted', label: '견적 도착' },
]

function getStatusLabel(status: ReceivedQuoteRequestStatus): string {
  if (status === 'new') return '모집 중'
  if (status === 'reviewing') return '검토 중'
  return '견적 도착'
}

function getStatusBadgeVariant(status: ReceivedQuoteRequestStatus): BadgeProps['variant'] {
  if (status === 'new') return 'info'
  if (status === 'reviewing') return 'warning'
  return 'success'
}

export default function QuoteRequestBoardPage() {
  const [keyword, setKeyword] = useState('')
  const [processFilter, setProcessFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const processOptions = useMemo<string[]>(() => {
    const processes = mockReceivedQuoteRequests.map((request) => request.processType)
    return ['all', ...Array.from(new Set(processes))]
  }, [])

  const filteredRequests = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return mockReceivedQuoteRequests.filter((request) => {
      const searchableText = [
        request.projectName,
        request.clientName,
        request.productItem,
        request.processType,
        request.description,
      ]
        .join(' ')
        .toLowerCase()

      const matchesKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword)
      const matchesProcess = processFilter === 'all' || request.processType === processFilter
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter

      return matchesKeyword && matchesProcess && matchesStatus
    })
  }, [keyword, processFilter, statusFilter])

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-ct-soft sm:p-8">
          <AppBadge variant="blue">
            <Factory className="h-4 w-4" />
            공개 견적 모집
          </AppBadge>
          <h1 className="text-kr-keep mt-4 text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold tracking-normal text-foreground">
            견적 요청 게시판
          </h1>
          <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            여러 회사가 등록한 견적 모집글을 한눈에 확인하고, 조건에 맞는 요청에 견적을 제안할 수
            있습니다.
          </p>
        </header>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_240px_180px]">
              <label className="relative block">
                <span className="sr-only">견적 요청 검색</span>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="search"
                  placeholder="프로젝트명, 회사명, 품목, 공정으로 검색"
                  className="h-12 rounded-xl bg-card pl-12 text-base"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">공정 필터</span>
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Select value={processFilter} onValueChange={setProcessFilter}>
                  <SelectTrigger className="h-12 rounded-xl bg-card pl-12 text-base">
                    <SelectValue placeholder="전체 공정" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 공정</SelectItem>
                    {processOptions
                      .filter((item) => item !== 'all')
                      .map((process) => (
                        <SelectItem key={process} value={process}>
                          {process}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="relative block">
                <span className="sr-only">상태 필터</span>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-card text-base">
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
          </CardContent>
        </Card>

        <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="border-border bg-card shadow-ct-soft transition hover:border-brand-light hover:shadow-ct-card"
            >
              <CardHeader className="p-4 pb-0 sm:p-5 sm:pb-0">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant={getStatusBadgeVariant(request.status)}
                        className="text-kr-keep"
                      >
                        {getStatusLabel(request.status)}
                      </Badge>
                      <span className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                        {request.requestedAt}
                      </span>
                    </div>
                    <CardTitle className="text-kr-pretty text-[15px] font-bold leading-6 text-foreground sm:text-[16px]">
                      {request.projectName}
                    </CardTitle>
                    <p className="text-kr-keep mt-2 flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {request.clientName}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-kr-keep w-full sm:w-auto"
                  >
                    <Link href={`/factory/requests/${request.id}`}>
                      상세 보기
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                <p className="text-kr-pretty line-clamp-2 text-[15px] leading-6 text-muted-foreground">
                  {request.description}
                </p>

                <dl className="mt-5 grid grid-cols-1 gap-3">
                  <div className="rounded-xl bg-surface-muted p-4">
                    <dt className="text-kr-keep flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                      <Package className="h-4 w-4" />
                      품목 / 공정
                    </dt>
                    <dd className="text-kr-pretty mt-1 font-bold text-foreground">
                      {request.productItem}
                    </dd>
                    <dd className="text-kr-keep mt-1 text-[15px] text-muted-foreground">
                      {request.processType}
                    </dd>
                  </div>

                  <div className="rounded-xl bg-surface-muted p-4">
                    <dt className="text-kr-keep flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                      <Wallet className="h-4 w-4" />
                      예산 / 수량
                    </dt>
                    <dd className="text-kr-keep mt-1 font-bold text-foreground">
                      {request.budgetRange}
                    </dd>
                    <dd className="text-kr-keep mt-1 text-[15px] text-muted-foreground">
                      {request.quantity}
                    </dd>
                  </div>

                  <div className="rounded-xl bg-surface-muted p-4">
                    <dt className="text-kr-keep flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      희망 납기
                    </dt>
                    <dd className="text-kr-keep mt-1 font-bold text-foreground">
                      {request.desiredDeadline}
                    </dd>
                  </div>

                  <div className="rounded-xl bg-surface-muted p-4">
                    <dt className="text-kr-keep flex items-center gap-2 text-[15px] font-semibold text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      첨부 자료
                    </dt>
                    <dd className="text-kr-keep mt-1 font-bold text-foreground">
                      {request.attachments.length}개
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card className="border-border bg-card p-12 text-center shadow-ct-soft sm:col-span-2 lg:col-span-3">
              <Factory className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-kr-pretty mt-4 text-lg font-semibold text-muted-foreground">
                조건에 맞는 견적 모집글이 없습니다.
              </p>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
