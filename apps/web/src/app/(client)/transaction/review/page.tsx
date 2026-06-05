'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, CheckCircle, RotateCcw, Star, type LucideIcon } from 'lucide-react'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'
import { useWorkflowDispatch, useWorkflowState } from '@/state/WorkflowContext'

type FollowUpAction = 'reorder' | 'crm'

const followUpOptions: Array<{
  value: FollowUpAction
  label: string
  description: string
  icon: LucideIcon
}> = [
  {
    value: 'reorder',
    label: '동일 공장에 재의뢰',
    description: '이번 거래 조건을 기반으로 새 견적 요청을 시작합니다.',
    icon: RotateCcw,
  },
  {
    value: 'crm',
    label: '거래처로 관리',
    description: '공장 정보를 거래처 목록에 저장하고 후속 관리를 이어갑니다.',
    icon: Bookmark,
  },
]

export default function TransactionReviewPage() {
  const router = useRouter()
  const workflowState = useWorkflowState()
  const workflowDispatch = useWorkflowDispatch()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [followUpAction, setFollowUpAction] = useState<FollowUpAction | ''>('')

  const contract = workflowState.hydrated ? workflowState.contract : null
  const displayedRating = hoverRating || rating
  const trimmedContent = content.trim()
  const validationMessage = getValidationMessage(rating, trimmedContent, followUpAction)
  const canSubmit = validationMessage === null
  const projectName = contract?.projectName ?? '이전 거래'
  const factoryName = contract?.factoryName

  function submitReview() {
    if (!canSubmit) return

    workflowDispatch({
      type: 'workflow/submitReview',
      payload: {
        transactionId: workflowState.contract?.transactionId ?? 'TXN-2026-018',
        rating,
        content: trimmedContent,
        submittedAt: new Date().toISOString(),
      },
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card className="mb-8 overflow-hidden border-emerald-100 bg-card shadow-ct-soft">
          <CardHeader className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-success-bg blur-3xl" />
            <AppBadge variant="green">
              <CheckCircle className="h-4 w-4" />
              거래 완료
            </AppBadge>
            <CardTitle className="text-kr-pretty mt-4 text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
              거래 완료 및 리뷰 작성
            </CardTitle>
            <CardDescription className="text-kr-pretty mt-3 text-lg leading-8 text-muted-foreground">
              거래에 대한 후기를 남기고 후속 액션을 선택하세요.
            </CardDescription>
            <div className="mt-6 rounded-2xl bg-muted p-4">
              <p className="text-kr-keep text-xs font-semibold text-muted-foreground">거래 요약</p>
              <p className="text-kr-pretty mt-2 text-lg font-bold text-foreground">{projectName}</p>
              {factoryName && (
                <p className="text-kr-pretty mt-1 text-sm text-muted-foreground">{factoryName}</p>
              )}
            </div>
          </CardHeader>
        </Card>

        <main className="space-y-6">
          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="p-5 pb-2 sm:p-7 sm:pb-2">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                  평점
                </CardTitle>
                <Badge variant={rating > 0 ? 'warning' : 'slate'} className="text-kr-keep">
                  {rating}/5
                </Badge>
              </div>
              <CardDescription className="text-kr-pretty text-[15px]">
                별을 눌러 거래 만족도를 선택하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3 sm:p-7 sm:pt-3">
              <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`${index}점 선택`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHoverRating(index)}
                    className="rounded-xl p-1 transition hover:bg-warning-bg focus:outline-none focus:ring-4 focus:ring-ring/20"
                  >
                    <Star
                      className={cn(
                        'h-10 w-10 transition',
                        index <= displayedRating
                          ? 'fill-warning text-warning'
                          : 'text-ink-300 hover:text-warning',
                      )}
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-5 sm:p-7">
              <label className="block">
                <span className="text-kr-pretty mb-4 block text-[18px] font-bold text-foreground sm:text-[20px]">
                  후기
                </span>
                <Textarea
                  rows={5}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="공장과의 거래 경험을 공유해주세요..."
                  className="text-kr-pretty min-h-36 rounded-xl border-input bg-card px-4 py-3 text-base focus-visible:ring-ring"
                />
              </label>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="p-5 pb-2 sm:p-7 sm:pb-2">
              <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                후속 액션
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-3 sm:p-7 sm:pt-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {followUpOptions.map((option) => {
                  const Icon = option.icon
                  const selected = followUpAction === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFollowUpAction(option.value)}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-ring/20',
                        selected
                          ? 'border-brand bg-brand-light/30'
                          : 'border-border bg-card hover:border-brand-light hover:bg-muted',
                      )}
                    >
                      <Icon className="mt-0.5 h-5 w-5 text-brand" />
                      <span>
                        <span className="text-kr-keep block text-base font-bold text-foreground">
                          {option.label}
                        </span>
                        <span className="text-kr-pretty mt-1 block text-sm leading-6 text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-5 sm:p-7">
              <AppButton size="lg" fullWidth disabled={!canSubmit} onClick={submitReview}>
                리뷰 제출
              </AppButton>
              {validationMessage && (
                <p className="text-kr-pretty mt-3 text-center text-sm font-semibold text-destructive">
                  {validationMessage}
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function getValidationMessage(
  rating: number,
  content: string,
  followUpAction: FollowUpAction | '',
): string | null {
  if (rating === 0) return '평점을 선택해주세요.'
  if (content.length < 10) return '후기를 10자 이상 입력해주세요.'
  if (!followUpAction) return '후속 액션을 선택해주세요.'
  return null
}
