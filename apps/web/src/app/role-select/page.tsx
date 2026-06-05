'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Factory, Sparkles } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { AppButton } from '@/components/ui/AppButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient, type AccountTypeValue } from '@/lib/auth-client'

export default function RoleSelectPage() {
  const router = useRouter()
  const session = authClient.useSession()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function selectAccountType(accountType: AccountTypeValue, target: string) {
    setSubmitError('')
    if (!session.data?.user) {
      router.push(`/login?redirectTo=${encodeURIComponent('/role-select')}`)
      return
    }
    setIsSubmitting(true)
    const { error } = await authClient.updateUser({ accountType })
    setIsSubmitting(false)
    if (error) {
      setSubmitError(error.message ?? '계정 유형을 변경하지 못했습니다')
      return
    }
    router.push(target)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <header className="text-center">
          <Logo variant="primary" size="md" className="mx-auto" />
          <p className="text-kr-keep mt-4 text-[14px] font-bold text-muted-foreground">시작 설정</p>
          <h1 className="text-kr-balance mt-2 text-[24px] font-bold text-foreground sm:text-[28px]">
            어떤 역할로 시작하시나요?
          </h1>
          <p className="text-kr-pretty mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground sm:text-[18px]">
            발주처는 견적을 요청하고, 공장은 견적을 제출합니다.
          </p>
        </header>

        {submitError && (
          <p className="text-kr-pretty rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-[15px] font-bold text-destructive">
            {submitError}
          </p>
        )}

        <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          <RoleCard
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            eyebrow="발주처"
            title="발주처로 시작"
            description="제작 의뢰를 등록하고 AI 추천 공장과 매칭하세요."
            buttonLabel="견적 요청 등록하기"
            disabled={isSubmitting}
            onClick={() => selectAccountType('client', '/request')}
          />

          <RoleCard
            icon={<Factory className="h-8 w-8 text-primary" />}
            eyebrow="공장"
            title="공장으로 시작"
            description="공장 프로필을 등록하고 견적 기회를 받아보세요."
            buttonLabel="공장 프로필 등록하기"
            disabled={isSubmitting}
            onClick={() => selectAccountType('factory', '/factory/onboarding')}
          />
        </section>

        <Link
          href="/login"
          className="text-kr-keep inline-flex w-full justify-center text-[15px] font-bold text-muted-foreground transition hover:text-primary"
        >
          이미 가입했어요 → 로그인
        </Link>
      </div>
    </main>
  )
}

function RoleCard({
  icon,
  eyebrow,
  title,
  description,
  buttonLabel,
  disabled,
  onClick,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <Card className="group border-border bg-card shadow-ct-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-ct-card">
      <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent shadow-toss-sm">
          {icon}
        </div>
        <CardDescription className="text-kr-keep text-[14px] font-bold text-primary">
          {eyebrow}
        </CardDescription>
        <CardTitle className="text-kr-pretty text-[20px] font-bold text-foreground sm:text-[24px]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <p className="text-kr-pretty min-h-0 text-base leading-8 text-muted-foreground sm:min-h-16">
          {description}
        </p>
        <AppButton type="button" size="lg" fullWidth disabled={disabled} onClick={onClick}>
          {buttonLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </AppButton>
      </CardContent>
    </Card>
  )
}
