'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Circle,
  FileText,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { disputeCases, disputeStatusStyles } from '@/data/disputeData'
import { cn } from '@/lib/cn'

function getDisputeBadgeVariant(status: string): 'info' | 'success' | 'warning' | 'destructive' {
  if (status === 'resolved') return 'success'
  if (status === 'reviewing') return 'info'
  if (status === 'escalated') return 'destructive'
  return 'warning'
}

export default function DisputeDetailPage() {
  const params = useParams<{ id: string }>()
  const dispute = disputeCases.find((item) => item.id === params.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href="/disputes"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-700 transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          분쟁 중재 현황으로 돌아가기
        </Link>

        {dispute ? (
          <>
            <Card className="mb-8 overflow-hidden border-brand-light bg-card shadow-ct-soft">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-start">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="slate" className="text-kr-keep">
                      {dispute.id}
                    </Badge>
                    <Badge
                      variant={getDisputeBadgeVariant(dispute.status)}
                      className="text-kr-keep"
                    >
                      {dispute.statusLabel}
                    </Badge>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-sm font-bold ring-1',
                        disputeStatusStyles[dispute.status],
                      )}
                    >
                      {dispute.statusLabel}
                    </span>
                    <Badge variant="info" className="text-kr-keep">
                      {dispute.type}
                    </Badge>
                  </div>
                  <h1 className="text-kr-pretty text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
                    {dispute.projectName}
                  </h1>
                  <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-7 text-foreground/80">
                    {dispute.summary}
                  </p>
                </div>

                <div className="rounded-xl border border-brand-light bg-brand-light p-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand">현재 진행률</span>
                    <span className="font-bold text-ink-950">{dispute.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white">
                    <div
                      className="h-3 rounded-full bg-brand"
                      style={{ width: `${dispute.progress}%` }}
                    />
                  </div>
                  <p className="text-kr-pretty mt-4 text-sm font-semibold leading-6 text-ink-700">
                    다음 조치: {dispute.nextAction}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
              <main className="space-y-8">
                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-brand" />
                      <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                        현재 진행 과정
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      {dispute.steps.map((step) => (
                        <li
                          key={step.title}
                          className={cn(
                            'flex gap-4 rounded-xl border p-4',
                            step.completed
                              ? 'border-primary/30 bg-accent'
                              : 'border-border bg-white',
                          )}
                        >
                          {step.completed ? (
                            <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-brand" />
                          ) : (
                            <Circle className="mt-1 h-6 w-6 shrink-0 text-slate-300" />
                          )}
                          <div>
                            <h3 className="text-kr-pretty text-lg font-bold text-ink-950">
                              {step.title}
                            </h3>
                            <p className="text-kr-pretty mt-1 text-base leading-7 text-ink-700">
                              {step.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MessageSquareText className="h-6 w-6 text-brand" />
                      <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                        진행 이력
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dispute.timeline.map((item) => (
                        <div
                          key={`${item.title}-${item.date}`}
                          className="rounded-xl border border-border bg-muted p-4"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-kr-pretty text-base font-bold text-ink-950">
                              {item.title}
                            </h3>
                            <span className="text-kr-keep text-sm font-semibold text-ink-400">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-kr-pretty mt-2 text-base leading-7 text-ink-700">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </main>

              <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-brand" />
                      <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                        상세 정보
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <DetailItem label="요청자" value={dispute.requester} />
                      <DetailItem label="상대방" value={dispute.respondent} />
                      <DetailItem label="계약일" value={dispute.contractDate} />
                      <DetailItem label="납기" value={dispute.dueDate} />
                      <DetailItem label="계약 금액" value={dispute.amount} />
                    </dl>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-border bg-accent text-primary">
                        <AvatarFallback className="bg-accent text-primary">
                          <UserRound className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                        담당 중재자
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kr-keep text-base font-bold text-ink-950">
                      {dispute.mediator}
                    </p>
                    <p className="text-kr-pretty mt-2 text-sm leading-6 text-ink-700">
                      최근 업데이트: {dispute.updatedAt}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CalendarClock className="h-6 w-6 text-brand" />
                      <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                        요청 해결안
                      </CardTitle>
                    </div>
                    <CardDescription className="text-kr-pretty text-base leading-7 text-ink-700">
                      {dispute.requestedResolution}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-border bg-card shadow-ct-soft">
                  <CardHeader>
                    <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                      증빙 자료
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {dispute.evidenceFiles.map((file) => (
                        <li
                          key={file}
                          className="flex items-center gap-3 rounded-lg bg-surface-muted px-4 py-3 text-sm font-semibold text-ink-700"
                        >
                          <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                          <span className="text-kr-keep truncate">{file}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </>
        ) : (
          <Card className="border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-8">
              <h1 className="text-kr-pretty text-[24px] font-bold text-foreground sm:text-[28px]">
                분쟁 정보를 찾을 수 없습니다.
              </h1>
              <p className="text-kr-pretty mt-2 text-foreground/80">목록에서 다시 확인해 주세요.</p>
              <Separator className="my-6" />
              <Button asChild>
                <Link href="/disputes">분쟁 목록으로 돌아가기</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted px-4 py-3">
      <dt className="text-kr-keep text-sm font-semibold text-ink-400">{label}</dt>
      <dd className="text-kr-pretty mt-1 text-base font-bold text-ink-950">{value}</dd>
    </div>
  )
}
