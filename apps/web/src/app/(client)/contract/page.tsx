'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  FileSignature,
  Landmark,
  Settings,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcessStepper } from '@/components/ui/ProcessStepper'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUserState } from '@/state/UserContext'
import { useWorkflowDispatch, useWorkflowState } from '@/state/WorkflowContext'

const contractSteps = [
  { title: '계약 생성', description: '계약 조건 확인' },
  { title: '전자서명', description: '양측 서명 완료' },
  { title: '에스크로 결제', description: '대금 보호 적용' },
  { title: '작업 진행', description: '제작 진행 및 상태 업데이트' },
  { title: '납품 검수', description: '납품 자료 확인' },
]

const paymentMethods = [
  {
    value: 'bank-transfer',
    title: '계좌이체',
    description: '세금계산서와 정산 내역을 기준으로 직접 이체합니다.',
    icon: Landmark,
  },
  {
    value: 'credit-card',
    title: '신용카드',
    description: '카드 승인 후 계약 대금 결제 내역을 즉시 확인합니다.',
    icon: CreditCard,
  },
  {
    value: 'escrow',
    title: '에스크로 결제 (권장)',
    description: '거래 완료 시까지 대금을 안전하게 보호합니다.',
    icon: ShieldCheck,
  },
]

export default function ContractPage() {
  const router = useRouter()
  const workflowState = useWorkflowState()
  const workflowDispatch = useWorkflowDispatch()
  const { currentUser, isAuthenticated } = useUserState()
  const [paymentMethod, setPaymentMethod] = useState('escrow')

  const request = workflowState.matchingResults?.request
  const selectedFactory = workflowState.selectedFactory
  const projectName = request?.projectName ?? '신규 프로젝트'
  const clientCompanyName =
    isAuthenticated && currentUser ? currentUser.company.name : '테크솔루션 주식회사'

  async function completePayment() {
    if (!selectedFactory) return

    const factoryName = selectedFactory.name
    const amount = `${selectedFactory.estimateMin}만원 ~ ${selectedFactory.estimateMax}만원`
    const dueDate = request?.desiredDeadline ?? ''
    const fallbackTransactionId = 'TXN-2026-018'

    if (isAuthenticated) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
        const templateId = process.env.NEXT_PUBLIC_CONTRACT_TEMPLATE_ID ?? 'mock-template'
        const response = await fetch(`${apiUrl}/contracts`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId,
            title: projectName,
            participants: [
              {
                role: 'client',
                name: clientCompanyName,
                signingOrder: 1,
                signingMethodType: 'email',
              },
              {
                role: 'factory',
                name: factoryName,
                signingOrder: 2,
                signingMethodType: 'email',
              },
            ],
            factoryCompanyId: selectedFactory.id,
          }),
        })
        if (!response.ok) {
          console.warn(
            `Backend contract creation returned ${response.status}; continuing with demo flow`,
          )
        }
      } catch (error) {
        console.warn('Backend contract API unreachable, continuing with demo flow', error)
      }
    }

    workflowDispatch({
      type: 'workflow/setContract',
      payload: {
        transactionId: fallbackTransactionId,
        projectName,
        factoryName,
        amount,
        dueDate,
      },
    })
    workflowDispatch({ type: 'workflow/completePayment' })
    router.push(`/transactions/${fallbackTransactionId}`)
  }

  if (!workflowState.hydrated) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center gap-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
          <div className="text-center">
            <h2 className="text-kr-pretty text-xl font-bold text-foreground">
              계약 정보를 준비 중입니다
            </h2>
            <p className="text-kr-pretty mt-2 text-muted-foreground">
              선택한 공장과 견적 조건을 불러오고 있어요
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedFactory) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <Card className="w-full border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                <Settings className="h-8 w-8 text-brand" />
              </div>
              <h1 className="text-kr-pretty text-2xl font-bold text-foreground">
                선택한 공장이 없습니다.
              </h1>
              <p className="text-kr-pretty mt-3 text-base leading-7 text-muted-foreground">
                선택한 공장이 없습니다. 매칭에서 공장을 먼저 선택해주세요.
              </p>
              <Button asChild className="mt-6 text-kr-keep">
                <Link href="/matching">매칭으로 이동</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Card className="mb-8 overflow-hidden border-brand-light bg-card shadow-ct-soft">
          <CardHeader className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-light/70 blur-3xl" />
            <AppBadge variant="blue">
              <FileSignature className="h-4 w-4" />
              전자 계약서 작성
            </AppBadge>
            <CardTitle className="text-kr-pretty mt-4 text-[24px] font-bold tracking-normal text-foreground sm:text-[28px]">
              계약 및 에스크로 결제
            </CardTitle>
            <CardDescription className="text-kr-pretty mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
              선택한 공장 정보와 계약 조건을 확인하고 결제를 진행합니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <main className="space-y-8">
          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="p-5 pb-2 sm:p-7 sm:pb-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-brand" />
                <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                  계약 조건
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3 sm:p-7 sm:pt-3">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ContractDetail label="프로젝트명" value={projectName} />
                <ContractDetail label="발주처" value={clientCompanyName} />
                <ContractDetail label="공장" value={selectedFactory.name} />
                <ContractDetail
                  label="견적 범위"
                  value={`${selectedFactory.estimateMin}만원 ~ ${selectedFactory.estimateMax}만원`}
                />
                <ContractDetail label="희망 납기" value={request?.desiredDeadline ?? '-'} />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="p-5 pb-2 sm:p-7 sm:pb-2">
              <CardTitle className="text-kr-pretty flex items-center gap-2 text-[18px] font-bold text-foreground sm:text-[20px]">
                <WalletCards className="h-5 w-5 text-primary" />
                결제 방식 선택
              </CardTitle>
              <CardDescription className="text-kr-pretty text-[15px]">
                계약 체결 후 사용할 결제 방식을 선택하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3 sm:p-7 sm:pt-3">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-3"
              >
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const selected = paymentMethod === method.value

                  return (
                    <label
                      key={method.value}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition ${
                        selected
                          ? 'border-brand bg-brand-light/30 shadow-toss-sm'
                          : 'border-border bg-card hover:border-brand-light hover:bg-muted'
                      }`}
                    >
                      <RadioGroupItem value={method.value} className="mt-1" />
                      <span>
                        <span className="text-kr-keep flex items-center gap-2 text-lg font-bold text-foreground">
                          <Icon className="h-5 w-5 text-primary" />
                          {method.title}
                        </span>
                        <span className="text-kr-pretty mt-2 block text-sm leading-6 text-muted-foreground">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="p-5 pb-2 sm:p-7 sm:pb-2">
              <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                진행 단계
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-3 sm:p-7 sm:pt-3">
              <ProcessStepper steps={contractSteps} currentStep={3} />
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-5 sm:p-7">
              <AppButton size="lg" fullWidth onClick={() => void completePayment()}>
                계약 체결하고 결제하기
              </AppButton>
              <p className="text-kr-pretty mt-3 text-center text-sm text-muted-foreground">
                결제 진행 시 양측 전자서명이 자동으로 완료됩니다 (목 시뮬레이션).
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function ContractDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <dt className="text-kr-keep text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-kr-pretty mt-2 text-base font-bold text-foreground">{value}</dd>
    </div>
  )
}
