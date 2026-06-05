'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Company, CompanyPortfolioItem } from '@rootmatching/shared'
import {
  CheckCircle2,
  Circle,
  Loader2,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useSidebarLayout } from '@/components/layout/AppLayout'
import { VerificationBadge, type VerificationState } from '@/components/profile/VerificationBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { mockCompanies } from '@/data/companies'
import { mockDashboardStats } from '@/data/dashboardStats'
import { cn } from '@/lib/cn'
import { useCompaniesDispatch, useCompaniesState } from '@/state/CompaniesContext'
import { useUserDispatch, useUserState } from '@/state/UserContext'

const profileSchema = z.object({
  name: z.string().min(1, '회사명을 입력해주세요.'),
  industry: z.string().min(1, '업종을 선택해주세요.'),
  region: z.string().min(1, '지역을 선택해주세요.'),
  size: z.string().min(1, '기업 규모를 선택해주세요.'),
  headline: z
    .string()
    .max(120, '한 줄 소개는 120자 이내로 입력해주세요.')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, '회사 소개는 1000자 이내로 입력해주세요.')
    .optional()
    .or(z.literal('')),
  contactEmail: z.string().email('올바른 이메일 형식이 아닙니다.').or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
  website: z.string().url('올바른 URL을 입력해주세요.').or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  strengths: z.string().optional().or(z.literal('')),
  certifications: z.string().optional().or(z.literal('')),
  establishedYear: z
    .string()
    .regex(/^\d{0,4}$/, '연도는 숫자로 입력해주세요.')
    .optional()
    .or(z.literal('')),
  employeeCount: z.string().regex(/^\d+$/, '직원 수는 숫자로 입력해주세요.').or(z.literal('')),
  revenue: z.string().optional().or(z.literal('')),
  profileColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, '컬러 코드를 선택해주세요.'),
  portfolioTitle1: z.string().optional().or(z.literal('')),
  portfolioDescription1: z.string().optional().or(z.literal('')),
  portfolioTitle2: z.string().optional().or(z.literal('')),
  portfolioDescription2: z.string().optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileColor {
  label: string
  value: string
}

interface CompletenessCheck {
  key: string
  label: string
  done: boolean
  anchor: string
}

const profileColors: ProfileColor[] = [
  { label: '루트 네이비', value: '#12344d' },
  { label: '매치 틸', value: '#0f9f8f' },
  { label: '팩토리 샌드', value: '#c49a5a' },
  { label: '안전 그린', value: '#15803d' },
  { label: '주의 앰버', value: '#b45309' },
]
const defaultProfileColor = '#12344d'

const industries = ['자동차', '전자부품', '기계장비', '금속가공', '소재/화학', '의료기기']
const regions = ['서울', '경기', '인천', '충청', '경상', '전라', '강원', '제주']
const companySizes = ['1-9명', '10-49명', '50-99명', '100-299명', '300명 이상']

const tabItems = [
  { label: '회사 프로필', href: '/mypage', current: true },
  { label: '활동 분석', href: '/mypage/analytics', current: false },
  { label: '계정 설정', href: '/mypage/settings', current: false },
]

const emptyCompany: Company = {
  id: 'fallback-company',
  name: '회사명 미등록',
  industry: '전자부품',
  region: '서울',
  size: '10-49명',
  description: '',
  tags: [],
  contactEmail: '',
  contactPhone: '',
  website: '',
  establishedYear: new Date().getFullYear(),
  employeeCount: 1,
  revenue: '',
  certifications: [],
  createdAt: new Date().toISOString(),
}

const inputClassName = 'h-11 bg-card text-[15px] disabled:bg-muted'
const textareaClassName = 'resize-none bg-card text-[15px] disabled:bg-muted'
const labelClassName = 'text-kr-keep text-[16px] font-semibold text-foreground'
const errorClassName = 'text-kr-pretty mt-1 text-[14px] font-semibold text-destructive'

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinList(value?: string[]): string {
  return value?.join(', ') ?? ''
}

function companyToProfile(company: Company): ProfileFormValues {
  const [portfolio1, portfolio2] = company.portfolio ?? []

  return {
    name: company.name,
    industry: company.industry,
    region: company.region,
    size: company.size,
    headline: company.headline ?? '',
    description: company.description ?? '',
    contactEmail: company.contactEmail ?? '',
    contactPhone: company.contactPhone ?? '',
    website: company.website ?? '',
    tags: joinList(company.tags),
    strengths: joinList(company.strengths),
    certifications: joinList(company.certifications),
    establishedYear: String(company.establishedYear ?? ''),
    employeeCount: String(company.employeeCount ?? ''),
    revenue: company.revenue ?? '',
    profileColor: company.profileColor ?? defaultProfileColor,
    portfolioTitle1: portfolio1?.title ?? '',
    portfolioDescription1: portfolio1?.description ?? '',
    portfolioTitle2: portfolio2?.title ?? '',
    portfolioDescription2: portfolio2?.description ?? '',
  }
}

function buildPortfolio(values: ProfileFormValues) {
  return [
    {
      title: (values.portfolioTitle1 ?? '').trim(),
      description: (values.portfolioDescription1 ?? '').trim(),
    },
    {
      title: (values.portfolioTitle2 ?? '').trim(),
      description: (values.portfolioDescription2 ?? '').trim(),
    },
  ].filter((item) => item.title || item.description)
}

function buildCompanyPayload(
  baseCompany: Company,
  values: ProfileFormValues,
): { company: Company; portfolio: CompanyPortfolioItem[] } {
  const portfolio: CompanyPortfolioItem[] = buildPortfolio(values)
  const employeeCount = Number(values.employeeCount ?? '0') || baseCompany.employeeCount
  const establishedYear = Number(values.establishedYear ?? '0') || baseCompany.establishedYear

  return {
    portfolio,
    company: {
      ...baseCompany,
      name: values.name.trim() || baseCompany.name,
      industry: values.industry,
      region: values.region,
      size: values.size,
      description: values.description?.trim() || baseCompany.description,
      headline: values.headline?.trim() || baseCompany.headline,
      profileColor: values.profileColor,
      tags: splitList(values.tags ?? ''),
      strengths: splitList(values.strengths ?? ''),
      certifications: splitList(values.certifications ?? ''),
      contactEmail: values.contactEmail || baseCompany.contactEmail,
      contactPhone: values.contactPhone || baseCompany.contactPhone,
      website: values.website || baseCompany.website,
      establishedYear,
      employeeCount,
      revenue: values.revenue || baseCompany.revenue,
      portfolio,
    },
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export default function MyPageProfilePage() {
  const userState = useUserState()
  const userDispatch = useUserDispatch()
  const companiesDispatch = useCompaniesDispatch()
  const { companies } = useCompaniesState()
  const currentUser = userState.currentUser
  const baseCompany = currentUser?.company ?? mockCompanies[0] ?? emptyCompany
  const derivedProfile = useMemo(() => companyToProfile(baseCompany), [baseCompany])
  const sidebarLayout = useSidebarLayout()
  const [isEditing, setIsEditing] = useState(false)
  const [savedProfile, setSavedProfile] = useState<ProfileFormValues>(derivedProfile)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: derivedProfile,
    resolver: zodResolver(profileSchema),
  })
  const formData = watch()
  const previewCompany = useMemo(
    () => buildCompanyPayload(baseCompany, formData).company,
    [baseCompany, formData],
  )

  useEffect(() => {
    reset(derivedProfile)
    setSavedProfile(derivedProfile)
    setIsEditing(false)
  }, [currentUser?.company?.id, derivedProfile, reset])

  const initials = useMemo(() => formData.name.slice(0, 2) || '회사', [formData.name])
  const previewTags = useMemo(() => splitList(formData.tags ?? '').slice(0, 4), [formData.tags])
  const previewStrengths = useMemo(
    () => splitList(formData.strengths ?? '').slice(0, 4),
    [formData.strengths],
  )
  const previewCertifications = useMemo(
    () => splitList(formData.certifications ?? ''),
    [formData.certifications],
  )
  const previewPortfolio = useMemo(() => buildPortfolio(formData), [formData])
  const accountType = currentUser?.accountType ?? 'client'
  const verificationState = useMemo(
    () => ({
      business: 'verified' as VerificationState,
      contact: 'verified' as VerificationState,
      factory: accountType === 'factory' ? ('missing' as VerificationState) : null,
      client: accountType === 'factory' ? null : ('pending' as VerificationState),
      escrow: 'pending' as VerificationState,
      certification:
        (previewCompany.certifications?.length ?? 0) > 0
          ? ('verified' as VerificationState)
          : ('missing' as VerificationState),
    }),
    [accountType, previewCompany.certifications?.length],
  )
  const verifiedCount = [
    verificationState.business,
    verificationState.contact,
    verificationState.factory ?? verificationState.client,
    verificationState.escrow,
    verificationState.certification,
  ].filter((state) => state === 'verified').length
  const completenessChecks: CompletenessCheck[] = [
    { key: 'logo', label: '로고 추가', done: !!previewCompany.logo, anchor: '#basic-info' },
    {
      key: 'headline',
      label: '한 줄 설명',
      done: !!previewCompany.headline?.trim(),
      anchor: '#basic-info',
    },
    {
      key: 'portfolio',
      label: '대표 프로젝트 1개+',
      done: (previewCompany.portfolio?.length ?? 0) > 0,
      anchor: '#portfolio-info',
    },
    {
      key: 'certifications',
      label: '인증·자격 1개+',
      done: (previewCompany.certifications?.length ?? 0) > 0,
      anchor: '#trust-info',
    },
    {
      key: 'contactPhone',
      label: '연락처 완성',
      done: !!previewCompany.contactPhone?.trim(),
      anchor: '#contact-info',
    },
  ]
  const completedCount = completenessChecks.filter((check) => check.done).length
  const completenessPercentage = Math.round((completedCount / completenessChecks.length) * 100)
  const nextMissingCheck = completenessChecks.find((check) => !check.done)

  function startEditing() {
    setIsEditing(true)
    requestAnimationFrame(() => {
      const formSection = document.getElementById('basic-info')
      formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const nameInput = document.getElementById('name') as HTMLInputElement | null
      nameInput?.focus({ preventScroll: true })
    })
  }

  function cancelEditing() {
    reset(savedProfile)
    setIsEditing(false)
  }

  async function saveProfile(values: ProfileFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const fallbackCompany =
      userState.currentUser?.company ?? companies[0] ?? mockCompanies[0] ?? emptyCompany
    const { company } = buildCompanyPayload(fallbackCompany, values)
    userDispatch({ type: 'user/updateCompany', payload: company })
    companiesDispatch({ type: 'companies/updateCompany', payload: company })
    setSavedProfile(values)
    reset(values)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8',
        isEditing && 'pb-32 sm:pb-28',
      )}
    >
      <div className="mx-auto grid max-w-4xl gap-6">
        <nav aria-label="마이페이지 메뉴" className="flex flex-wrap gap-2">
          {tabItems.map((item) =>
            item.current ? (
              <span
                key={item.href}
                aria-current="page"
                className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-kr-keep rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-accent hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <section className="grid gap-4">
          <Card className="border border-border bg-card shadow-ct-soft">
            <CardContent className="p-5 sm:p-6">
              <div className="grid items-center gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
                <Avatar className="h-20 w-20 border border-border bg-primary text-primary-foreground shadow-ct-soft sm:h-24 sm:w-24">
                  <AvatarImage src={previewCompany.logo ?? currentUser?.avatar} alt="회사 로고" />
                  <AvatarFallback className="bg-primary text-[22px] font-extrabold text-primary-foreground sm:text-[26px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="text-kr-keep mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-extrabold text-accent-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    공개 회사 프로필
                  </span>
                  <h1 className="text-kr-pretty text-rm-h2 font-bold text-foreground">
                    {formData.name || '회사명을 입력하세요'}
                  </h1>
                  <p className="text-kr-pretty mt-2 leading-7 text-muted-foreground">
                    {formData.headline ||
                      '다른 회사가 한눈에 이해할 수 있는 한 줄 소개를 입력하세요.'}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <PreviewMeta value={formData.industry || '업종'} />
                    <PreviewMeta value={formData.region || '지역'} />
                    <PreviewMeta value={`${formData.employeeCount || 0}명`} />
                    <PreviewMeta value={`${formData.establishedYear || '-'}년 설립`} />
                  </div>
                </div>
                {isEditing ? (
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <span className="text-kr-keep inline-flex items-center justify-center gap-1.5 rounded-full bg-warning-subtle px-3 py-1.5 text-[13px] font-extrabold text-warning-foreground">
                      <PencilLine className="h-3.5 w-3.5" />
                      편집 중
                    </span>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="lg" onClick={cancelEditing}>
                        <RotateCcw className="h-4 w-4" />
                        취소
                      </Button>
                      <Button type="submit" form="profile-form" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSubmitting ? '저장 중...' : '저장'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="outline" size="lg" onClick={startEditing}>
                    <PencilLine className="h-4 w-4" />
                    프로필 편집
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-subtle text-success">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-kr-pretty text-[20px] font-bold">
                    신뢰 인증 현황 · {verifiedCount}/5
                  </CardTitle>
                  <CardDescription className="text-kr-pretty text-[15px]">
                    다른 회사가 거래 전 확인하는 외부 신뢰 지표입니다.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                <VerificationBadge
                  type="business"
                  state={verificationState.business}
                  label="사업자 확인"
                  evidence="사업자등록번호와 회사명이 정상적으로 일치합니다."
                />
                <VerificationBadge
                  type="contact"
                  state={verificationState.contact}
                  label="연락처 확인"
                  evidence="대표 이메일과 전화 응답 채널이 확인되었습니다."
                />
                {verificationState.factory ? (
                  <VerificationBadge
                    type="factory"
                    state={verificationState.factory}
                    label="공장 위치 확인"
                    evidence="공장 주소 증빙 제출이 아직 필요합니다."
                  />
                ) : (
                  <VerificationBadge
                    type="client"
                    state={verificationState.client ?? 'pending'}
                    label="기업 인증"
                    evidence="발주 기업 기본 정보 확인을 진행 중입니다."
                  />
                )}
                <VerificationBadge
                  type="escrow"
                  state={verificationState.escrow}
                  label="안전결제 가능"
                  evidence="안전결제 계정 연결 검토가 진행 중입니다."
                />
                <VerificationBadge
                  type="certification"
                  state={verificationState.certification}
                  label="인증 자격"
                  evidence={`${previewCompany.certifications?.length ?? 0}개의 인증·자격이 등록되어 있습니다.`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-kr-pretty text-[20px] font-bold">
                      프로필 완성도 {completenessPercentage}%
                    </CardTitle>
                  </div>
                  <span className="text-kr-keep rounded-full bg-muted px-3 py-1 text-[13px] font-bold text-muted-foreground">
                    {completedCount}/5 완료
                  </span>
                </div>
                <CardDescription className="text-kr-pretty mt-2 text-[15px]">
                  내부 프로필 작성 진척 상태입니다. 완성도가 높을수록 추천 정확도가 올라갑니다.
                </CardDescription>
                <Progress
                  value={completenessPercentage}
                  className={cn(
                    'mt-3 h-2.5 bg-muted',
                    completenessPercentage === 100 ? '[&>div]:bg-success' : '[&>div]:bg-primary',
                  )}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {completenessChecks.map((check) => (
                    <div key={check.key} className="flex items-center gap-2.5">
                      {check.done ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          'text-kr-keep text-[15px] font-semibold',
                          check.done ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
                {nextMissingCheck ? (
                  <a
                    href={nextMissingCheck.anchor}
                    className="text-kr-keep inline-flex min-h-tap-min w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-[16px] font-extrabold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {nextMissingCheck.label} 완료하고 완성도 +20% 올리기
                  </a>
                ) : (
                  <span className="text-kr-keep inline-flex min-h-tap-min w-full items-center justify-center rounded-xl bg-success px-4 py-2.5 text-[16px] font-extrabold text-success-foreground">
                    모든 핵심 정보가 완성되었습니다
                  </span>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-ct-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-kr-pretty text-[20px] font-bold">활동 요약</CardTitle>
                  <Link
                    href="/mypage/analytics"
                    className="text-kr-keep text-[14px] font-extrabold text-primary transition hover:text-primary/80"
                  >
                    활동 분석 →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 rounded-xl bg-muted p-3">
                  <StatCell label="조회수" value={mockDashboardStats.totalViews} />
                  <StatCell label="문의" value={mockDashboardStats.totalInquiries} />
                  <StatCell label="매칭" value={mockDashboardStats.totalMatches} />
                  <StatCell label="메시지" value={mockDashboardStats.recentMessages} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-kr-pretty text-[20px] font-bold">담당자 연락처</CardTitle>
              <CardDescription className="text-kr-pretty text-[15px]">
                빠른 협의를 위한 공개 연락 채널입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {previewCompany.contactPhone ? (
                  <a
                    href={`tel:${previewCompany.contactPhone}`}
                    className="text-kr-keep inline-flex min-h-tap-primary items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-rm-data-lg font-extrabold text-primary-foreground transition hover:bg-primary/90"
                  >
                    <Phone className="h-5 w-5" />
                    {previewCompany.contactPhone}
                  </a>
                ) : null}
                {previewCompany.contactEmail ? (
                  <a
                    href={`mailto:${previewCompany.contactEmail}`}
                    className="text-kr-keep inline-flex min-h-tap-secondary items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-4 py-3 text-[16px] font-extrabold text-accent-foreground transition hover:bg-accent/80"
                  >
                    <Mail className="h-5 w-5" />
                    {previewCompany.contactEmail}
                  </a>
                ) : null}
              </div>
              <div className="mt-4 grid gap-2 rounded-xl bg-muted p-4 text-[15px] font-semibold text-foreground sm:grid-cols-2">
                <span className="text-kr-keep inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {previewCompany.region || '지역 미등록'} 권역
                </span>
                <span className="text-kr-keep">🕘 상담 가능 시간: 평일 09:00 – 18:00</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PreviewPanel title="핵심 강점">
              {previewStrengths.length ? (
                <ChipList items={previewStrengths} className="bg-success-subtle text-success" />
              ) : (
                <p className="leading-7 text-muted-foreground">
                  강점을 입력하면 회사 상세 화면에서 더 잘 보입니다.
                </p>
              )}
            </PreviewPanel>

            <PreviewPanel title="태그">
              {previewTags.length ? (
                <ChipList items={previewTags} className="bg-accent text-accent-foreground" />
              ) : (
                <p className="leading-7 text-muted-foreground">검색에 걸릴 키워드를 입력하세요.</p>
              )}
            </PreviewPanel>

            <PreviewPanel title="인증/자격">
              {previewCertifications.length ? (
                <ChipList items={previewCertifications} className="bg-escrow-subtle text-escrow" />
              ) : (
                <p className="leading-7 text-muted-foreground">
                  인증을 입력하면 회사 상세 화면에서 신뢰 배지로 표시됩니다.
                </p>
              )}
            </PreviewPanel>

            <PreviewPanel title="대표 프로젝트" className="lg:col-span-2">
              {previewPortfolio.length ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {previewPortfolio.map((item) => (
                    <article
                      key={`${item.title}-${item.description}`}
                      className="rounded-xl border border-border bg-muted p-3.5"
                    >
                      <strong className="mb-1.5 block text-foreground">
                        {item.title || '프로젝트명'}
                      </strong>
                      <p className="leading-7 text-muted-foreground">
                        {item.description || '프로젝트 설명을 입력하세요.'}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="leading-7 text-muted-foreground">
                  대표 납품, 협업, 구축 사례를 추가해 신뢰도를 높이세요.
                </p>
              )}
            </PreviewPanel>
          </div>
        </section>

        <Card
          className={cn(
            'bg-card shadow-ct-soft transition-colors',
            isEditing ? 'border-primary/40 bg-accent/20' : 'border-border',
          )}
        >
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-kr-pretty text-[20px] font-bold">프로필 정보</CardTitle>
                <CardDescription className="text-kr-pretty text-[15px]">
                  {isEditing
                    ? '변경 후 상단 또는 하단의 저장 버튼을 눌러주세요.'
                    : '저장한 내용은 회사 목록과 회사 상세 프로필에 반영됩니다.'}
                </CardDescription>
              </div>
              {isEditing && (
                <span className="text-kr-keep inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-3 py-1.5 text-[13px] font-extrabold text-warning-foreground">
                  <PencilLine className="h-3.5 w-3.5" />
                  편집 중
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit(saveProfile)} className="space-y-6">
              <FormSection id="basic-info" title="기본 정보">
                <Field
                  className="sm:col-span-2"
                  label="회사명"
                  htmlFor="name"
                  error={errors.name?.message}
                >
                  <Input
                    id="name"
                    className={inputClassName}
                    disabled={!isEditing}
                    {...register('name')}
                  />
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="한 줄 소개"
                  htmlFor="headline"
                  error={errors.headline?.message}
                >
                  <Input
                    id="headline"
                    className={inputClassName}
                    placeholder="예: AI 기반 제조 품질 분석 솔루션을 제공합니다"
                    disabled={!isEditing}
                    {...register('headline')}
                  />
                </Field>

                <SelectField
                  id="industry"
                  label="업종"
                  disabled={!isEditing}
                  value={formData.industry}
                  onValueChange={(value) =>
                    setValue('industry', value, { shouldDirty: true, shouldValidate: true })
                  }
                  options={industries}
                  error={errors.industry?.message}
                />
                <SelectField
                  id="region"
                  label="지역"
                  disabled={!isEditing}
                  value={formData.region}
                  onValueChange={(value) =>
                    setValue('region', value, { shouldDirty: true, shouldValidate: true })
                  }
                  options={regions}
                  error={errors.region?.message}
                />
                <SelectField
                  id="size"
                  label="기업 규모"
                  disabled={!isEditing}
                  value={formData.size}
                  onValueChange={(value) =>
                    setValue('size', value, { shouldDirty: true, shouldValidate: true })
                  }
                  options={companySizes}
                  error={errors.size?.message}
                />

                <Field label="웹사이트" htmlFor="website" error={errors.website?.message}>
                  <Input
                    id="website"
                    type="url"
                    className={inputClassName}
                    placeholder="https://"
                    disabled={!isEditing}
                    {...register('website')}
                  />
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="회사 소개"
                  htmlFor="description"
                  error={errors.description?.message}
                >
                  <Textarea
                    id="description"
                    rows={4}
                    className={textareaClassName}
                    disabled={!isEditing}
                    {...register('description')}
                  />
                </Field>
              </FormSection>

              <FormSection id="trust-info" title="공개 신뢰 정보" separated>
                <Field
                  label="설립연도"
                  htmlFor="establishedYear"
                  error={errors.establishedYear?.message}
                >
                  <Input
                    id="establishedYear"
                    type="number"
                    className={inputClassName}
                    disabled={!isEditing}
                    {...register('establishedYear')}
                  />
                </Field>

                <Field
                  label="직원 수"
                  htmlFor="employeeCount"
                  error={errors.employeeCount?.message}
                >
                  <Input
                    id="employeeCount"
                    type="number"
                    className={inputClassName}
                    disabled={!isEditing}
                    {...register('employeeCount')}
                  />
                </Field>

                <Field label="매출 규모" htmlFor="revenue" error={errors.revenue?.message}>
                  <Input
                    id="revenue"
                    type="text"
                    className={inputClassName}
                    placeholder="예: 50억원"
                    disabled={!isEditing}
                    {...register('revenue')}
                  />
                </Field>

                <Field
                  label="프로필 컬러"
                  htmlFor="profileColor"
                  error={errors.profileColor?.message}
                >
                  <div className="flex min-h-11 items-center gap-2.5">
                    {profileColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={cn(
                          'h-8 w-8 rounded-full border-2 border-transparent transition disabled:cursor-not-allowed disabled:opacity-65',
                          formData.profileColor === color.value &&
                            'border-foreground ring-4 ring-border',
                        )}
                        style={{ backgroundColor: color.value }}
                        disabled={!isEditing}
                        aria-label={color.label}
                        onClick={() =>
                          setValue('profileColor', color.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    ))}
                  </div>
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="핵심 강점"
                  htmlFor="strengths"
                  error={errors.strengths?.message}
                >
                  <Input
                    id="strengths"
                    type="text"
                    className={inputClassName}
                    placeholder="쉼표로 구분: 빠른 응답, 품질 관리, 대량 생산"
                    disabled={!isEditing}
                    {...register('strengths')}
                  />
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="인증/자격"
                  htmlFor="certifications"
                  error={errors.certifications?.message}
                >
                  <Input
                    id="certifications"
                    type="text"
                    className={inputClassName}
                    placeholder="쉼표로 구분: ISO 9001, 벤처기업인증"
                    disabled={!isEditing}
                    {...register('certifications')}
                  />
                  <span className="text-kr-pretty mt-1.5 text-xs text-muted-foreground">
                    인증은 회사 상세 화면에서 신뢰 배지로 표시됩니다.
                  </span>
                </Field>

                <Field
                  className="sm:col-span-2"
                  label="검색 태그"
                  htmlFor="tags"
                  error={errors.tags?.message}
                >
                  <Input
                    id="tags"
                    type="text"
                    className={inputClassName}
                    placeholder="쉼표로 구분: AI, 제조, B2B"
                    disabled={!isEditing}
                    {...register('tags')}
                  />
                </Field>
              </FormSection>

              <FormSection id="portfolio-info" title="대표 프로젝트" separated singleColumn>
                <Field
                  label="첫 번째 프로젝트명"
                  htmlFor="portfolioTitle1"
                  error={errors.portfolioTitle1?.message}
                >
                  <Input
                    id="portfolioTitle1"
                    type="text"
                    className={inputClassName}
                    placeholder="프로젝트명"
                    disabled={!isEditing}
                    {...register('portfolioTitle1')}
                  />
                </Field>
                <Field
                  label="첫 번째 프로젝트 설명"
                  htmlFor="portfolioDescription1"
                  error={errors.portfolioDescription1?.message}
                >
                  <Textarea
                    id="portfolioDescription1"
                    rows={3}
                    className={textareaClassName}
                    placeholder="성과, 납품 품목, 협업 내용을 입력하세요"
                    disabled={!isEditing}
                    {...register('portfolioDescription1')}
                  />
                </Field>
                <Field
                  label="두 번째 프로젝트명"
                  htmlFor="portfolioTitle2"
                  error={errors.portfolioTitle2?.message}
                >
                  <Input
                    id="portfolioTitle2"
                    type="text"
                    className={inputClassName}
                    placeholder="프로젝트명"
                    disabled={!isEditing}
                    {...register('portfolioTitle2')}
                  />
                </Field>
                <Field
                  label="두 번째 프로젝트 설명"
                  htmlFor="portfolioDescription2"
                  error={errors.portfolioDescription2?.message}
                >
                  <Textarea
                    id="portfolioDescription2"
                    rows={3}
                    className={textareaClassName}
                    placeholder="성과, 납품 품목, 협업 내용을 입력하세요"
                    disabled={!isEditing}
                    {...register('portfolioDescription2')}
                  />
                </Field>
              </FormSection>

              <FormSection id="contact-info" title="연락처" separated>
                <Field
                  label="연락 이메일"
                  htmlFor="contactEmail"
                  error={errors.contactEmail?.message}
                >
                  <Input
                    id="contactEmail"
                    type="email"
                    className={inputClassName}
                    disabled={!isEditing}
                    {...register('contactEmail')}
                  />
                </Field>

                <Field
                  label="연락 전화번호"
                  htmlFor="contactPhone"
                  error={errors.contactPhone?.message}
                >
                  <Input
                    id="contactPhone"
                    type="tel"
                    className={inputClassName}
                    disabled={!isEditing}
                    {...register('contactPhone')}
                  />
                </Field>
              </FormSection>
            </form>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div
          role="region"
          aria-label="프로필 편집 액션"
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md shadow-toss-lg sm:px-6',
            sidebarLayout.open && 'lg:left-[260px]',
          )}
        >
          <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-kr-keep flex items-center gap-2 text-[14px] font-bold text-foreground">
              <PencilLine className="h-4 w-4 text-primary" />
              편집 중 · 저장하지 않으면 변경이 사라집니다
            </p>
            <div className="flex gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={cancelEditing}
                className="flex-1 sm:flex-initial"
              >
                <RotateCcw className="h-4 w-4" />
                취소
              </Button>
              <Button
                type="submit"
                form="profile-form"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? '저장 중...' : '변경사항 저장'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PreviewMeta({ value }: { value: string }) {
  return (
    <span className="text-kr-keep rounded-lg bg-muted px-2.5 py-1 text-[15px] font-semibold text-foreground">
      {value}
    </span>
  )
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-kr-keep text-[12px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-rm-data-lg font-extrabold tabular-nums text-foreground">
        {formatNumber(value)}
      </p>
    </div>
  )
}

function PreviewPanel({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-card p-[18px] shadow-ct-soft', className)}
    >
      <h3 className="text-kr-pretty mb-3 text-base font-bold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function ChipList({ items, className }: { items: string[]; className: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            'text-kr-keep rounded-full px-3 py-1.5 text-[15px] font-semibold',
            className,
          )}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function FormSection({
  id,
  title,
  children,
  separated = false,
  singleColumn = false,
}: {
  id?: string
  title: string
  children: ReactNode
  separated?: boolean
  singleColumn?: boolean
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-24', separated && 'mt-7 border-t border-border pt-6')}
    >
      <h3 className="text-kr-pretty mb-3 text-base font-bold text-foreground">{title}</h3>
      <div
        className={cn('grid gap-5', singleColumn ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}
      >
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
  className,
  error,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
  error?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </Label>
      {children}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}

function SelectField({
  id,
  label,
  options,
  disabled,
  value,
  onValueChange,
  error,
}: {
  id: string
  label: string
  options: string[]
  disabled: boolean
  value: string
  onValueChange: (value: string) => void
  error?: string
}) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={inputClassName}>
          <SelectValue placeholder={`${label} 선택`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
