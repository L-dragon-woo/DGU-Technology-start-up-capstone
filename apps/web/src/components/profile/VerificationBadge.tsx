'use client'

import { CheckCircle2, CircleDashed, Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/cn'

export type VerificationType =
  | 'business'
  | 'contact'
  | 'factory'
  | 'client'
  | 'escrow'
  | 'certification'
export type VerificationState = 'verified' | 'pending' | 'missing'

interface VerificationBadgeProps {
  type: VerificationType
  state: VerificationState
  evidence: string
  label: string
}

const stateMeta: Record<
  VerificationState,
  {
    text: string
    icon: typeof CheckCircle2
    className: string
    ariaSuffix: string
  }
> = {
  verified: {
    text: '확인 완료',
    icon: CheckCircle2,
    className: 'bg-success-subtle text-success hover:bg-success-subtle/80',
    ariaSuffix: '완료',
  },
  pending: {
    text: '확인 중',
    icon: Clock,
    className: 'bg-warning-subtle text-warning-foreground hover:bg-warning-subtle/80',
    ariaSuffix: '확인 중',
  },
  missing: {
    text: '미확인',
    icon: CircleDashed,
    className: 'bg-muted text-muted-foreground hover:bg-muted/80',
    ariaSuffix: '미확인',
  },
}

const typeDescriptions: Record<VerificationType, string> = {
  business: '사업자 정보와 등록 상태를 확인합니다.',
  contact: '담당자가 응답 가능한 연락 채널을 확인합니다.',
  factory: '생산 거점과 공장 위치 정보를 확인합니다.',
  client: '발주 기업의 기본 정보를 확인합니다.',
  escrow: '안전결제 이용 가능 여부를 확인합니다.',
  certification: '등록된 인증과 자격 정보를 확인합니다.',
}

export function VerificationBadge({ type, state, evidence, label }: VerificationBadgeProps) {
  const meta = stateMeta[state]
  const Icon = meta.icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`인증 배지: ${label} ${meta.ariaSuffix}`}
          className={cn(
            'text-kr-keep flex min-h-tap-min w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[15px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            meta.className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </span>
          <span className="shrink-0 text-[13px] font-extrabold">{meta.text}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="border-border bg-card shadow-ct-soft" align="start">
        <div className="space-y-2">
          <p className="text-kr-pretty text-[16px] font-extrabold text-foreground">
            무엇이 확인되었나요?
          </p>
          <p className="text-kr-pretty text-[14px] leading-6 text-muted-foreground">
            {typeDescriptions[type]}
          </p>
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-kr-pretty text-[14px] font-semibold text-foreground">{evidence}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
