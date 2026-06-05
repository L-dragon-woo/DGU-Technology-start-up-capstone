'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ClipboardCheck,
  Factory,
  FileUp,
  Gauge,
  PackageCheck,
  PencilLine,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserRound,
} from 'lucide-react'
import type { TransactionUpdate } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProcessStepper } from '@/components/ui/ProcessStepper'
import { Separator } from '@/components/ui/separator'
import { transactionCases, transactionSteps } from '@/data/transactionData'
import { cn } from '@/lib/cn'

type ViewerRole = 'client' | 'factory'

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value))
}

function getProgressStage(rate: number): string {
  if (rate >= 100) return '납품 및 검수 단계'
  if (rate >= 75) return '마감 작업 및 출하 준비'
  if (rate >= 50) return '주요 가공/제작 진행'
  if (rate >= 25) return '자재 입고 및 초도 작업'
  return '계약/작업 준비'
}

export default function TransactionProgressPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const transaction = transactionCases.find((item) => item.id === params.id)
  const initialRole: ViewerRole =
    searchParams.get('mode') === 'factory' || transaction?.myRole === 'factory'
      ? 'factory'
      : 'client'
  const [viewerRole, setViewerRole] = useState<ViewerRole>(initialRole)
  const [progressInput, setProgressInput] = useState(transaction?.progressRate ?? 0)
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateDescription, setUpdateDescription] = useState('')
  const [localUpdates, setLocalUpdates] = useState<TransactionUpdate[]>([])

  const currentProgress = clampProgress(progressInput)
  const progressStage = getProgressStage(currentProgress)
  const canUpdateProgress =
    transaction?.myRole === 'factory' || searchParams.get('mode') === 'factory'

  const progressCheckpoints = useMemo(
    () => [
      { label: '계약/결제 완료', percent: 10, done: currentProgress >= 10 },
      { label: '자재 준비', percent: 25, done: currentProgress >= 25 },
      { label: '주요 제작 진행', percent: 50, done: currentProgress >= 50 },
      { label: '마감/품질 확인', percent: 75, done: currentProgress >= 75 },
      { label: '납품/검수 대기', percent: 100, done: currentProgress >= 100 },
    ],
    [currentProgress],
  )

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <Card className="w-full max-w-3xl border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-12">
              <Truck className="mx-auto h-12 w-12 text-ink-400" />
              <h1 className="text-kr-pretty mt-4 text-[24px] font-bold text-foreground sm:text-[28px]">
                거래를 찾을 수 없습니다.
              </h1>
              <Button asChild className="mt-6">
                <Link href="/transactions">목록으로 돌아가기</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const currentTransaction = transaction

  const displayedUpdates = [...localUpdates, ...transaction.updates]

  function submitProgressUpdate() {
    const title = updateTitle.trim() || progressStage
    const description =
      updateDescription.trim() || `공장이 현재 진행률을 ${currentProgress}%로 업데이트했습니다.`

    setLocalUpdates((updates) => [
      {
        title,
        description,
        date: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...updates,
    ])
    setUpdateTitle('')
    setUpdateDescription('')
  }

  function goToMediation() {
    const params = new URLSearchParams({
      txn: currentTransaction.id,
      counterparty: currentTransaction.factory,
      amount: currentTransaction.amount.replace(/[^0-9]/g, ''),
      projectName: currentTransaction.projectName,
    })

    router.push(`/disputes/mediation?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href="/transactions"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-700 transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          거래 진행 현황으로 돌아가기
        </Link>

        <Card className="mb-8 border-brand-light bg-card shadow-ct-soft">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge variant="info" className="text-kr-keep">
                  <ShieldCheck className="h-4 w-4" />
                  거래 진행 관리
                </Badge>
                <AppBadge variant="blue">
                  <ShieldCheck className="h-4 w-4" />
                  거래 진행 관리
                </AppBadge>
                <p className="text-kr-keep mt-5 text-sm font-bold text-muted-foreground">
                  {transaction.id}
                </p>
                <h1 className="text-kr-pretty mt-2 text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
                  {transaction.projectName}
                </h1>
                <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-7 text-foreground/80">
                  요청자는 공장의 작업 현황을 확인하고, 공장은 현재 작업 단계와 진행률을
                  업데이트합니다.
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-border bg-surface-muted p-1">
                {canUpdateProgress && (
                  <RoleButton
                    active={viewerRole === 'client'}
                    onClick={() => setViewerRole('client')}
                  >
                    <UserRound className="h-4 w-4" />
                    요청자 보기
                  </RoleButton>
                )}
                <RoleButton
                  active={viewerRole === 'factory'}
                  onClick={() => setViewerRole('factory')}
                >
                  <Factory className="h-4 w-4" />
                  공장 입력
                </RoleButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <main className="space-y-8">
            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                    현재 진행 위치
                  </CardTitle>
                  <CardDescription className="text-kr-pretty text-[15px]">
                    {progressStage}
                  </CardDescription>
                </div>
                <Badge
                  variant={transaction.statusKey === 'delayed' ? 'warning' : 'info'}
                  className="text-kr-keep"
                >
                  <CheckCircle className="h-4 w-4" />
                  {transaction.status}
                </Badge>
                <AppBadge variant={transaction.statusKey === 'delayed' ? 'amber' : 'blue'}>
                  <CheckCircle className="h-4 w-4" />
                  {transaction.status}
                </AppBadge>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl bg-surface-muted p-5">
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-400">전체 진행률</p>
                      <p className="mt-1 text-4xl font-black text-ink-950">{currentProgress}%</p>
                    </div>
                    <Gauge className="h-10 w-10 text-brand" />
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white ring-1 ring-border">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">
                  {progressCheckpoints.map((checkpoint) => (
                    <div
                      key={checkpoint.label}
                      className={cn(
                        'rounded-xl border p-4',
                        checkpoint.done
                          ? 'border-brand-light bg-brand-light'
                          : 'border-border bg-white',
                      )}
                    >
                      <div
                        className={cn(
                          'mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black',
                          checkpoint.done ? 'bg-brand text-white' : 'bg-surface-muted text-ink-400',
                        )}
                      >
                        {checkpoint.percent}
                      </div>
                      <p className="text-kr-pretty text-sm font-bold text-ink-700">
                        {checkpoint.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                  전체 거래 흐름
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessStepper steps={transactionSteps} currentStep={transaction.currentStep} />
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-brand" />
                  <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                    작업 진행 업데이트
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {viewerRole === 'factory' ? (
                  <div className="mb-6 rounded-2xl border border-brand-light bg-brand-light p-5">
                    <div className="mb-5 flex items-center gap-2">
                      <PencilLine className="h-5 w-5 text-brand" />
                      <h3 className="text-lg font-bold text-ink-950">공장 진행상황 입력</h3>
                    </div>

                    <Label className="block text-kr-keep text-sm font-bold text-ink-700">
                      현재 진행률
                      <div className="mt-3 grid grid-cols-[1fr_92px] gap-3">
                        <input
                          value={progressInput}
                          onChange={(event) => setProgressInput(Number(event.target.value))}
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          className="w-full accent-brand"
                        />
                        <Input
                          value={progressInput}
                          onChange={(event) => setProgressInput(Number(event.target.value))}
                          type="number"
                          min="0"
                          max="100"
                          className="h-11 text-right font-bold"
                        />
                      </div>
                    </Label>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="update-title"
                          className="text-kr-keep text-sm font-bold text-ink-700"
                        >
                          작업 제목
                        </Label>
                        <Input
                          id="update-title"
                          value={updateTitle}
                          onChange={(event) => setUpdateTitle(event.target.value)}
                          type="text"
                          placeholder="예: 2차 가공 완료"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="update-description"
                          className="text-kr-keep text-sm font-bold text-ink-700"
                        >
                          상세 내용
                        </Label>
                        <Input
                          id="update-description"
                          value={updateDescription}
                          onChange={(event) => setUpdateDescription(event.target.value)}
                          type="text"
                          placeholder="요청자가 확인할 현재 작업 상태"
                          className="h-12 text-kr-pretty"
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={submitProgressUpdate} className="mt-4">
                      진행상황 업데이트
                    </Button>
                  </div>
                ) : (
                  <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="flex items-start gap-3">
                      <Factory className="mt-0.5 h-5 w-5 text-emerald-700" />
                      <div>
                        <h3 className="font-bold text-ink-950">공장이 입력한 최신 진행상황</h3>
                        <p className="mt-1 text-sm leading-6 text-ink-700">
                          현재 {transaction.factory}에서 입력한 진행률은 {currentProgress}%이며,
                          단계는 {progressStage}입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <ol className="space-y-4">
                  {displayedUpdates.map((item) => (
                    <li
                      key={`${item.date}-${item.title}`}
                      className="rounded-xl border border-border bg-surface-muted p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-kr-pretty text-lg font-bold text-ink-950">
                            {item.title}
                          </h3>
                          <p className="text-kr-pretty mt-1 text-base leading-7 text-ink-700">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-kr-keep shrink-0 text-sm font-semibold text-ink-400">
                          {item.date}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-brand" />
                  <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                    납품 등록 및 검수
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FilePanel
                    icon={<FileUp className="h-5 w-5 text-brand" />}
                    label="납품 자료"
                    name={transaction.deliveryFile.name}
                  />
                  <FilePanel
                    icon={<ClipboardCheck className="h-5 w-5 text-brand" />}
                    label="검수 결과서"
                    name={transaction.inspectionFile.name}
                  />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => router.push('/transaction/review')}
                    fullWidth
                  >
                    <PackageCheck className="h-6 w-6" />
                    검수 승인 및 리뷰 작성
                  </Button>
                  <Button type="button" onClick={goToMediation} variant="outline" fullWidth>
                    <AlertTriangle className="h-6 w-6" />
                    문제 발생, 중재 요청
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-8 xl:self-start">
            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader>
                <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
                  거래 상세 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <DetailRow label="요청자" value={transaction.client} />
                  <DetailRow label="공장" value={transaction.factory} />
                  <DetailRow label="계약 금액" value={transaction.amount} />
                  <DetailRow label="납기" value={transaction.dueDate} />
                  <DetailRow label="최근 업데이트" value={transaction.updatedAt} />
                </dl>
              </CardContent>
            </Card>

            <Card className="border-brand-light bg-brand-light shadow-ct-soft">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-6 w-6 text-brand" />
                  <p className="text-kr-pretty text-base leading-7 text-ink-700">
                    요청자는 공장 입력 내용을 기준으로 진행 상태를 확인하고, 공장은 이 화면에서
                    진행률과 작업 로그를 갱신합니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function RoleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      className={cn(
        'h-11 text-sm font-bold',
        active ? 'bg-white text-brand shadow-sm' : 'text-ink-700 hover:text-ink-950',
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function FilePanel({ icon, label, name }: { icon: ReactNode; label: string; name: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-4">
      <div className="mb-3 flex items-center gap-2 text-base font-bold text-ink-950">
        {icon}
        <span className="text-kr-keep">{label}</span>
      </div>
      <Separator className="mb-3" />
      <p className="text-kr-keep truncate text-sm text-ink-700">{name}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-lg bg-muted px-4 py-3">
      <dt className="text-kr-keep text-ink-400">{label}</dt>
      <dd className="text-kr-pretty font-semibold text-ink-950">{value}</dd>
    </div>
  )
}
