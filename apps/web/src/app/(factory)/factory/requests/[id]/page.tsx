'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Factory,
  FileText,
  Package,
  Send,
  Wallet,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Message, ReceivedQuoteRequestStatus } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
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
import { mockReceivedQuoteRequests } from '@/data/requestData'
import { useMessagesDispatch } from '@/state/MessagesContext'
import { useUserState } from '@/state/UserContext'

const quoteSubmissionSchema = z.object({
  quoteAmount: z.string().min(1, '견적 금액을 입력해주세요'),
  productionPeriod: z.string().min(1, '제작 기간을 입력해주세요'),
  possibleDeadline: z.string().min(1, '가능 납기를 입력해주세요'),
  paymentTerms: z.string().min(1, '결제 조건을 선택해주세요'),
  proposalMessage: z.string().min(10, '제안 메시지를 10자 이상 입력해주세요'),
})

type QuoteSubmission = z.infer<typeof quoteSubmissionSchema>

const PAYMENT_TERM_OPTIONS = [
  '선급 30%, 잔금 70% (납품 후)',
  '30일 후 결제',
  '60일 후 결제',
  '현금 결제 (납품 시)',
]

const labelClassName = 'text-kr-keep text-[16px] font-bold text-foreground'
const inputClassName = 'h-11 bg-card text-[15px]'
const errorClassName = 'mt-2 text-[15px] font-semibold text-destructive'

function getStatusLabel(status: ReceivedQuoteRequestStatus): string {
  if (status === 'new') return '신규 요청'
  if (status === 'reviewing') return '검토 중'
  return '견적 제출 완료'
}

function getStatusVariant(status: ReceivedQuoteRequestStatus): 'blue' | 'green' | 'amber' {
  if (status === 'new') return 'blue'
  if (status === 'reviewing') return 'amber'
  return 'green'
}

export default function FactoryRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const dispatch = useMessagesDispatch()
  const { currentUser } = useUserState()
  const request = mockReceivedQuoteRequests.find((item) => item.id === params.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteSubmission>({
    resolver: zodResolver(quoteSubmissionSchema),
    defaultValues: {
      quoteAmount: '',
      productionPeriod: '',
      possibleDeadline: '',
      paymentTerms: '',
      proposalMessage: '',
    },
  })
  const selectedPaymentTerms = watch('paymentTerms')

  if (!request) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
        <main className="mx-auto max-w-4xl">
          <section className="rounded-xl border border-border bg-card p-12 text-center shadow-ct-soft">
            <Factory className="mx-auto h-12 w-12 text-ink-400" />
            <h1 className="text-kr-pretty mt-4 text-2xl font-bold text-foreground">
              요청을 찾을 수 없습니다.
            </h1>
            <Link
              href="/factory/requests"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-hover"
            >
              받은 요청 목록
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>
      </div>
    )
  }

  const currentRequest = request

  function submitQuote(data: QuoteSubmission) {
    const newMessageId = `msg-quote-${Date.now()}`
    const senderName = currentUser?.accountType === 'factory' ? currentUser.name : '박공장'
    const senderCompany =
      currentUser?.accountType === 'factory' ? currentUser.company.name : '문래정밀가공'
    const newMessage: Message = {
      id: newMessageId,
      senderId: currentUser?.accountType === 'factory' ? currentUser.id : 'factory-user1',
      senderName,
      senderCompany,
      receiverId: 'client-' + currentRequest.id,
      receiverName: currentRequest.clientName,
      receiverCompany: currentRequest.clientName,
      subject: `[견적 협의] ${currentRequest.projectName}`,
      content: `프로젝트: ${currentRequest.projectName}\n견적 금액: ${data.quoteAmount}\n제작 기간: ${data.productionPeriod}일\n가능 납기: ${data.possibleDeadline}\n결제 조건: ${data.paymentTerms}\n\n${data.proposalMessage}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: 'messages/sendMessage', payload: newMessage })
    router.push(`/messages?message=${newMessageId}&context=quote`)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <main className="mx-auto max-w-4xl">
        <Link
          href="/factory/requests"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-700 transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          받은 요청 목록
        </Link>

        <section className="space-y-6">
          <header className="rounded-xl border border-border bg-card p-5 shadow-ct-soft sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <AppBadge variant={getStatusVariant(request.status)}>
                    {getStatusLabel(request.status)}
                  </AppBadge>
                  <span className="text-kr-keep text-sm font-semibold text-muted-foreground">
                    {request.requestedAt}
                  </span>
                </div>
                <h1 className="text-kr-pretty text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
                  {request.projectName}
                </h1>
                <p className="text-kr-keep mt-3 flex items-center gap-2 text-base font-semibold text-muted-foreground">
                  <Building2 className="h-4 w-4 text-ink-400" />
                  {request.clientName}
                </p>
              </div>

              <AppBadge variant="blue">
                <Factory className="h-4 w-4" />
                받은 견적 요청
              </AppBadge>
            </div>
          </header>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader>
              <CardTitle className="text-kr-pretty text-[18px] font-bold">요청 상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailItem
                  icon={<Package className="h-5 w-5" />}
                  label="품목 / 공정"
                  title={request.productItem}
                  subtitle={request.processType}
                />
                <DetailItem
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  label="수량"
                  title={request.quantity}
                />
                <DetailItem
                  icon={<Wallet className="h-5 w-5" />}
                  label="예산"
                  title={request.budgetRange}
                />
                <DetailItem
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="희망 납기"
                  title={request.desiredDeadline}
                />
                <div className="rounded-xl bg-surface-muted p-4 md:col-span-2">
                  <dt className="text-sm font-semibold text-ink-400">요청 내용</dt>
                  <dd className="mt-2 whitespace-pre-line text-base leading-7 text-ink-700">
                    {request.description}
                  </dd>
                </div>
                <div className="rounded-xl bg-surface-muted p-4 md:col-span-2">
                  <dt className="text-sm font-semibold text-ink-400">첨부 자료</dt>
                  <dd className="mt-3 space-y-2">
                    {request.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-light hover:bg-brand-light/40 hover:text-brand"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {attachment.name}
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
              <CardTitle className="text-kr-pretty text-[18px] font-bold">견적 제출</CardTitle>
              <CardDescription className="text-kr-pretty text-[15px]">
                발주처가 바로 검토할 수 있도록 금액, 납기, 결제 조건을 명확히 작성해주세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitQuote)} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="quoteAmount" className={labelClassName}>
                      견적 금액
                    </Label>
                    <Input
                      id="quoteAmount"
                      type="text"
                      placeholder="예: 5,000,000원"
                      className={inputClassName}
                      {...register('quoteAmount')}
                    />
                    {errors.quoteAmount && (
                      <p className={errorClassName}>{errors.quoteAmount.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="productionPeriod" className={labelClassName}>
                      제작 기간 (일)
                    </Label>
                    <Input
                      id="productionPeriod"
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 30"
                      className={inputClassName}
                      {...register('productionPeriod')}
                    />
                    {errors.productionPeriod && (
                      <p className={errorClassName}>{errors.productionPeriod.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="possibleDeadline" className={labelClassName}>
                      가능 납기
                    </Label>
                    <Input
                      id="possibleDeadline"
                      type="text"
                      placeholder="예: 2026-06-15"
                      className={inputClassName}
                      {...register('possibleDeadline')}
                    />
                    {errors.possibleDeadline && (
                      <p className={errorClassName}>{errors.possibleDeadline.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="paymentTerms" className={labelClassName}>
                      결제 조건
                    </Label>
                    <Select
                      value={selectedPaymentTerms}
                      onValueChange={(value) =>
                        setValue('paymentTerms', value, { shouldDirty: true, shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="paymentTerms" className={inputClassName}>
                        <SelectValue placeholder="결제 조건을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERM_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.paymentTerms && (
                      <p className={errorClassName}>{errors.paymentTerms.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="proposalMessage" className={labelClassName}>
                    제안 메시지
                  </Label>
                  <Textarea
                    id="proposalMessage"
                    rows={6}
                    placeholder="발주처에 전달할 제안 내용..."
                    className="resize-none text-[15px]"
                    {...register('proposalMessage')}
                  />
                  {errors.proposalMessage && (
                    <p className={errorClassName}>{errors.proposalMessage.message}</p>
                  )}
                </div>

                <AppButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  <Send className="h-5 w-5" />
                  견적 제출하기
                </AppButton>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="rounded-xl bg-surface-muted p-4">
      <dt className="text-kr-keep flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-kr-pretty mt-2 font-bold text-foreground">{title}</dd>
      {subtitle && <dd className="text-kr-keep mt-1 text-sm text-muted-foreground">{subtitle}</dd>}
    </div>
  )
}
