'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, FileText, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
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

function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || value === 'new' || value === 'reviewing' || value === 'quoted'
}

function getStatusLabel(status: ReceivedQuoteRequestStatus): string {
  if (status === 'new') return '공장 검토 전'
  if (status === 'reviewing') return '공장 검토 중'
  return '견적 도착'
}

function getStatusVariant(status: ReceivedQuoteRequestStatus): BadgeProps['variant'] {
  if (status === 'new') return 'info'
  if (status === 'reviewing') return 'warning'
  return 'success'
}

export default function ClientRequestListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredRequests = useMemo(() => {
    const normalizedKeyword = keyword.toLowerCase()

    return mockReceivedQuoteRequests.filter((request) => {
      const searchableText =
        `${request.projectName} ${request.productItem} ${request.processType}`.toLowerCase()
      const matchesKeyword = searchableText.includes(normalizedKeyword)
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter

      return matchesKeyword && matchesStatus
    })
  }, [keyword, statusFilter])

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-ct-soft">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <AppBadge
                variant="blue"
                className="text-kr-keep mb-4 px-4 py-2 text-sm font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                견적 요청 관리
              </AppBadge>
              <h1 className="text-kr-keep text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold tracking-normal text-foreground">
                내 견적 요청 내역
              </h1>
              <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                내가 등록한 견적 요청의 검토 상태, 요청 조건, 첨부 자료를 한 곳에서 확인합니다.
              </p>
            </div>
          </div>
        </header>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
              <label className="relative block">
                <span className="sr-only">견적 요청 검색</span>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  type="search"
                  placeholder="프로젝트명, 품목, 공정으로 검색"
                  className="h-12 rounded-xl bg-card pl-12 text-base"
                />
              </label>
              <label className="relative block">
                <span className="sr-only">상태 필터</span>
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    if (isStatusFilter(value)) {
                      setStatusFilter(value)
                    }
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-card pl-12 text-base">
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="new">공장 검토 전</SelectItem>
                    <SelectItem value="reviewing">공장 검토 중</SelectItem>
                    <SelectItem value="quoted">견적 도착</SelectItem>
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
                      <Badge variant={getStatusVariant(request.status)} className="text-kr-keep">
                        {getStatusLabel(request.status)}
                      </Badge>
                      <span className="text-kr-keep inline-flex items-center gap-1.5 text-[15px] font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {request.requestedAt}
                      </span>
                    </div>
                    <CardTitle className="text-kr-pretty text-[15px] font-bold leading-6 text-foreground sm:text-[16px]">
                      {request.projectName}
                    </CardTitle>
                    <p className="text-kr-pretty mt-2 text-[15px] text-muted-foreground">
                      {request.productItem}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-kr-keep w-full sm:w-auto"
                  >
                    <Link href={`/requests/${request.id}`}>
                      {request.status === 'quoted' ? '매칭 결과 보기' : '요청 수정'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                <dl className="grid grid-cols-1 gap-3">
                  <DataCell label="공정" value={request.processType} />
                  <DataCell label="수량" value={request.quantity} />
                  <DataCell label="예산" value={request.budgetRange} />
                  <DataCell label="희망 납기" value={request.desiredDeadline} />
                </dl>

                <div className="text-kr-keep mt-4 flex items-center gap-2 text-[15px] text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  첨부 자료 {request.attachments.length}개
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card className="border-border bg-card p-12 text-center shadow-ct-soft sm:col-span-2 lg:col-span-3">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-kr-pretty mt-4 text-lg font-semibold text-muted-foreground">
                조건에 맞는 견적 요청이 없습니다.
              </p>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-muted p-4">
      <dt className="text-kr-keep text-[15px] font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-kr-pretty mt-1 font-bold text-foreground">{value}</dd>
    </div>
  )
}
