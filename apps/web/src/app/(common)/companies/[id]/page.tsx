'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { Message } from '@rootmatching/shared'
import { Building2, Globe, Heart, Mail, Phone, Send } from 'lucide-react'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCompaniesDispatch, useCompaniesState } from '@/state/CompaniesContext'
import { useMessagesDispatch } from '@/state/MessagesContext'
import { useUserState } from '@/state/UserContext'

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { companies, favorites } = useCompaniesState()
  const companiesDispatch = useCompaniesDispatch()
  const messagesDispatch = useMessagesDispatch()
  const userState = useUserState()
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [inquirySubject, setInquirySubject] = useState('')
  const [inquiryContent, setInquiryContent] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const foundCompany = companies.find((item) => item.id === id)

  if (!foundCompany) {
    return (
      <div className="bg-background">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <Card className="border-border bg-card text-center shadow-ct-soft">
            <CardContent className="p-12">
              <Building2 className="mx-auto h-12 w-12 text-ink-400" />
              <p className="text-kr-pretty mt-4 text-[18px] font-semibold text-foreground/80">
                기업을 찾을 수 없습니다.
              </p>
              <Button asChild className="mt-5">
                <Link href="/companies">기업 디렉토리</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const company = foundCompany
  const isFavorite = favorites.includes(id)
  const portfolio = company.portfolio ?? []

  function closeInquiry() {
    setIsInquiryOpen(false)
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedSubject = inquirySubject.trim()
    const trimmedContent = inquiryContent.trim()
    if (!trimmedSubject || trimmedContent.length < 10) return

    const newId = `msg-inquiry-${Date.now()}`
    const newMessage: Message = {
      id: newId,
      senderId: userState.currentUser?.id ?? 'user1',
      senderName: userState.currentUser?.name ?? '홍길동',
      senderCompany: userState.currentUser?.company.name ?? '테크솔루션 주식회사',
      receiverId: 'company-' + company.id,
      receiverName: company.name,
      receiverCompany: company.name,
      subject: `[문의] ${trimmedSubject}`,
      content: trimmedContent,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    messagesDispatch({ type: 'messages/sendMessage', payload: newMessage })
    setIsInquiryOpen(false)
    setInquirySubject('')
    setInquiryContent('')
    setSuccessMessage('문의 메시지가 전송되었습니다.')
    window.setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link
          href="/companies"
          className="inline-flex text-sm font-bold text-ink-700 transition hover:text-brand"
        >
          ← 기업 디렉토리
        </Link>

        <Card className="relative border-border bg-card shadow-ct-soft">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <Avatar className="h-14 w-14 border border-border bg-accent text-primary">
                  <AvatarFallback className="bg-accent text-[18px] font-bold text-primary">
                    {company.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Badge variant="slate" className="text-kr-keep">
                    {company.industry}
                  </Badge>
                  <AppBadge variant="slate">{company.industry}</AppBadge>
                  <h1 className="text-kr-pretty mt-4 text-[24px] font-bold text-foreground sm:text-[28px]">
                    {company.name}
                  </h1>
                  <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-7 text-foreground/80">
                    {company.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  type="button"
                  aria-label={isFavorite ? '관심 기업 해제' : '관심 기업 추가'}
                  onClick={() =>
                    companiesDispatch({ type: 'companies/toggleFavorite', payload: company.id })
                  }
                  variant="outline"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? 'fill-danger text-danger' : 'text-ink-400'}`}
                  />
                  관심
                </Button>
                <Button onClick={() => setIsInquiryOpen(true)}>
                  <Send className="h-4 w-4" />
                  문의하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {successMessage && (
          <div className="text-kr-pretty rounded-xl border border-success/20 bg-success-bg px-4 py-3 text-sm font-bold text-success shadow-ct-soft">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <main className="space-y-6">
            <Section title="기본 정보">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoTile label="업종" value={company.industry} />
                <InfoTile label="지역" value={company.region} />
                <InfoTile label="규모" value={company.size} />
                <InfoTile label="설립연도" value={`${company.establishedYear}년`} />
                <InfoTile
                  label="직원수"
                  value={`${company.employeeCount.toLocaleString('ko-KR')}명`}
                />
                <InfoTile label="매출" value={company.revenue} />
              </dl>
            </Section>

            <Section title="대표 프로젝트">
              {portfolio.length ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {portfolio.map((item) => (
                    <article
                      key={`${item.title}-${item.description}`}
                      className="rounded-xl bg-muted p-4"
                    >
                      <h3 className="text-kr-pretty font-bold text-foreground">{item.title}</h3>
                      <p className="text-kr-pretty mt-2 text-sm leading-6 text-foreground/80">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-kr-pretty rounded-xl bg-muted p-4 text-sm font-semibold text-muted-foreground">
                  등록된 대표 프로젝트가 없습니다.
                </p>
              )}
            </Section>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <Section title="태그">
              <ChipList items={company.tags.map((tag) => `#${tag}`)} variant="info" />
            </Section>

            <Section title="인증/자격">
              <ChipList items={company.certifications} variant="success" />
            </Section>

            <Section title="연락처">
              <div className="space-y-3">
                <ContactItem icon={<Mail className="h-5 w-5" />} label="이메일">
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="text-brand hover:text-brand-hover"
                  >
                    {company.contactEmail}
                  </a>
                </ContactItem>
                <ContactItem icon={<Phone className="h-5 w-5" />} label="전화">
                  {company.contactPhone}
                </ContactItem>
                <ContactItem icon={<Globe className="h-5 w-5" />} label="웹사이트">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:text-brand-hover"
                  >
                    {company.website}
                  </a>
                </ContactItem>
              </div>
            </Section>
          </aside>
        </div>
      </div>

      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="border-border bg-card shadow-ct-modal sm:rounded-xl">
          <form onSubmit={submitInquiry} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-kr-pretty text-[20px] font-bold text-foreground">
                기업 문의
              </DialogTitle>
              <DialogDescription className="text-kr-pretty leading-6">
                {company.name}에 보낼 문의 내용을 작성하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <Label htmlFor="inquiry-subject" className="text-kr-keep text-[16px] font-semibold">
                제목
              </Label>
              <Input
                id="inquiry-subject"
                value={inquirySubject}
                onChange={(event) => setInquirySubject(event.target.value)}
                required
                minLength={1}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inquiry-content" className="text-kr-keep text-[16px] font-semibold">
                내용
              </Label>
              <Textarea
                id="inquiry-content"
                value={inquiryContent}
                onChange={(event) => setInquiryContent(event.target.value)}
                required
                minLength={10}
                rows={6}
                className="text-kr-pretty resize-none"
              />
            </div>

            <Separator />

            <DialogFooter>
              <AppButton type="button" variant="secondary" onClick={closeInquiry}>
                취소
              </AppButton>
              <Button type="submit">보내기</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-border bg-card shadow-ct-soft">
      <CardHeader>
        <CardTitle className="text-kr-pretty text-[18px] font-bold sm:text-[20px]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <dt className="text-kr-keep text-sm font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-kr-pretty mt-1 text-base font-bold text-foreground">{value}</dd>
    </div>
  )
}

function ChipList({ items, variant }: { items: string[]; variant: 'info' | 'success' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} variant={variant} className="text-kr-keep">
          {item}
        </Badge>
      ))}
    </div>
  )
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
      <div className="mt-0.5 text-ink-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-kr-keep text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-anywhere mt-1 break-words text-sm font-bold text-foreground">
          {children}
        </p>
      </div>
    </div>
  )
}
