'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Eye,
  Mail,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { mockActivityLogs } from '@/data/activityLogs'
import { mockCompanies } from '@/data/companies'
import { mockDashboardStats } from '@/data/dashboardStats'
import { useUserState } from '@/state/UserContext'
import { cn } from '@/lib/utils'

type ActivityType = (typeof mockActivityLogs)[number]['type']

interface SupportingStat {
  title: string
  value: number
  icon: LucideIcon
  delta: string
  deltaTone: 'success' | 'muted'
}

const supportingStats: SupportingStat[] = [
  {
    title: '총 조회수',
    value: mockDashboardStats.totalViews,
    icon: Eye,
    delta: '지난주 대비 +12.4%',
    deltaTone: 'success',
  },
  {
    title: '총 문의',
    value: mockDashboardStats.totalInquiries,
    icon: MessageCircle,
    delta: '지난주 대비 +8.1%',
    deltaTone: 'success',
  },
  {
    title: '이번 주 신규 매칭',
    value: mockDashboardStats.totalMatches,
    icon: Sparkles,
    delta: '이번 주 +5건',
    deltaTone: 'success',
  },
]

interface ActionTile {
  icon: LucideIcon
  label: string
  count: number
  href: string
  toneClass: string
}

interface ActivityStyle {
  icon: LucideIcon
  bg: string
  iconColor: string
  label: string
}

const activityStyles: Record<ActivityType, ActivityStyle> = {
  view: { icon: Eye, bg: 'bg-info-subtle', iconColor: 'text-info', label: '조회' },
  inquiry: {
    icon: MessageCircle,
    bg: 'bg-warning-subtle',
    iconColor: 'text-warning-foreground',
    label: '문의',
  },
  match: { icon: Sparkles, bg: 'bg-accent', iconColor: 'text-accent-foreground', label: '매칭' },
  message: { icon: Mail, bg: 'bg-primary/10', iconColor: 'text-primary', label: '메시지' },
}

function formatActivityDate(value: string): string {
  return new Date(value).toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
}

const chartConfig = {
  view: { label: '조회', color: 'hsl(var(--info))' },
  inquiry: { label: '문의', color: 'hsl(var(--warning))' },
  match: { label: '매칭', color: 'hsl(var(--accent))' },
  message: { label: '메시지', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

const weeklyActivity = [
  { day: '월', view: 18, inquiry: 3, match: 6, message: 1 },
  { day: '화', view: 22, inquiry: 4, match: 8, message: 0 },
  { day: '수', view: 15, inquiry: 2, match: 5, message: 1 },
  { day: '목', view: 25, inquiry: 5, match: 9, message: 0 },
  { day: '금', view: 20, inquiry: 4, match: 7, message: 1 },
  { day: '토', view: 12, inquiry: 3, match: 5, message: 0 },
  { day: '일', view: 15, inquiry: 2, match: 5, message: 1 },
]

const activityDistribution = [
  {
    name: 'view',
    label: '조회',
    value: mockDashboardStats.totalViews,
    fill: 'var(--color-view)',
  },
  {
    name: 'inquiry',
    label: '문의',
    value: mockDashboardStats.totalInquiries,
    fill: 'var(--color-inquiry)',
  },
  {
    name: 'match',
    label: '매칭',
    value: mockDashboardStats.totalMatches,
    fill: 'var(--color-match)',
  },
  {
    name: 'message',
    label: '메시지',
    value: mockDashboardStats.recentMessages,
    fill: 'var(--color-message)',
  },
]

const totalActivityCount = activityDistribution.reduce((sum, item) => sum + item.value, 0)

export default function DashboardPage() {
  const { currentUser } = useUserState()
  const recommendedCompanies = mockCompanies.slice(0, 3)
  const recentActivities = mockActivityLogs.slice(0, 5)
  const todayActionCount = mockDashboardStats.totalMatches + mockDashboardStats.recentMessages

  const actionTiles: ActionTile[] = [
    {
      icon: Sparkles,
      label: '새 매칭 결과 확인',
      count: mockDashboardStats.totalMatches,
      href: '/matching',
      toneClass: 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10',
    },
    {
      icon: MessageCircle,
      label: '답장 필요한 문의',
      count: mockDashboardStats.totalInquiries,
      href: '/messages',
      toneClass: 'border-warning/30 bg-warning-subtle text-warning-foreground hover:bg-warning/10',
    },
    {
      icon: Mail,
      label: '미확인 메시지',
      count: mockDashboardStats.recentMessages,
      href: '/messages',
      toneClass: 'border-info/30 bg-info-subtle text-info hover:bg-info/10',
    },
  ]

  return (
    <div className="bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-ct-soft sm:p-8">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-accent/50 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative space-y-6">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-3">
                <p className="text-kr-keep text-[13px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  오늘의 액션 센터
                </p>
                <h1 className="text-kr-balance text-[26px] font-bold leading-tight text-foreground sm:text-[32px]">
                  {currentUser ? `${currentUser.name}님, ` : '환영합니다. '}
                  <br className="hidden sm:block" />
                  오늘 확인할 활동이 <span className="text-primary">{todayActionCount}건</span>{' '}
                  있습니다.
                </h1>
                <p className="text-kr-pretty text-[15px] leading-7 text-muted-foreground sm:text-[16px]">
                  아래 카드를 눌러 바로 다음 행동을 진행하세요.
                </p>
              </div>
              <Button asChild size="xl" className="w-full shadow-toss-md sm:w-auto">
                <Link href="/matching">
                  <Sparkles className="h-5 w-5" />
                  AI 매칭 결과 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {actionTiles.map((tile) => {
                const Icon = tile.icon
                return (
                  <Link
                    key={tile.label}
                    href={tile.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                      tile.toneClass,
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card/80 shadow-ct-soft">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-kr-keep text-[13px] font-bold opacity-80">{tile.label}</p>
                      <p className="text-kr-keep text-[22px] font-extrabold leading-tight tabular-nums">
                        {tile.count.toLocaleString('ko-KR')}건
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <Card className="border-primary/20 bg-primary text-primary-foreground shadow-ct-card sm:col-span-2 lg:col-span-1">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-kr-keep text-[14px] font-bold opacity-90">매칭된 기업</p>
                  <p className="text-kr-keep text-[13px] font-semibold opacity-70">
                    이번 주 +5건 누적
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>
              <div>
                <p className="text-[52px] font-bold leading-none tabular-nums sm:text-[60px]">
                  {mockDashboardStats.totalMatches.toLocaleString('ko-KR')}
                </p>
                <Link
                  href="/matching"
                  className="text-kr-keep mt-4 inline-flex items-center gap-1 text-[14px] font-bold opacity-90 transition hover:gap-2 hover:opacity-100"
                >
                  추천 결과 보기 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {supportingStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.title}
                className="border-border bg-card shadow-ct-soft transition-shadow hover:shadow-ct-card"
              >
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-kr-keep text-[14px] font-bold text-muted-foreground">
                      {stat.title}
                    </p>
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[30px] font-bold leading-none tabular-nums text-foreground">
                      {stat.value.toLocaleString('ko-KR')}
                    </p>
                    <p
                      className={cn(
                        'text-kr-keep text-[13px] font-semibold',
                        stat.deltaTone === 'success' ? 'text-success' : 'text-muted-foreground',
                      )}
                    >
                      {stat.delta}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section
          className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]"
          aria-labelledby="dashboard-charts-heading"
        >
          <h2 id="dashboard-charts-heading" className="sr-only">
            활동 시각화
          </h2>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader>
              <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                이번 주 활동 추이
              </CardTitle>
              <CardDescription className="text-kr-pretty text-[14px]">
                요일별 조회·문의·매칭·메시지 분포
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[260px] w-full sm:h-[300px]">
                <BarChart accessibilityLayer data={weeklyActivity}>
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={13}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="view" stackId="a" fill="var(--color-view)" />
                  <Bar dataKey="inquiry" stackId="a" fill="var(--color-inquiry)" />
                  <Bar dataKey="match" stackId="a" fill="var(--color-match)" />
                  <Bar
                    dataKey="message"
                    stackId="a"
                    fill="var(--color-message)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardHeader>
              <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
                활동 유형 비율
              </CardTitle>
              <CardDescription className="text-kr-pretty text-[14px]">
                전체{' '}
                <span className="font-semibold tabular-nums text-foreground">
                  {totalActivityCount.toLocaleString('ko-KR')}
                </span>
                건
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[240px] sm:h-[280px]"
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                  <Pie
                    data={activityDistribution}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={90}
                    strokeWidth={2}
                    label={({ payload, percent }) => {
                      if (typeof percent !== 'number' || percent <= 0) return ''
                      const rawLabel =
                        (payload && typeof payload === 'object' && 'label' in payload
                          ? (payload as { label?: string }).label
                          : '') ?? ''
                      return `${rawLabel} ${Math.round(percent * 100)}%`
                    }}
                    labelLine={false}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="label" />}
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-kr-pretty text-[20px] font-bold text-foreground sm:text-[22px]">
                추천 기업
              </h2>
              <p className="text-kr-pretty mt-1 text-[14px] text-muted-foreground">
                최근 활동을 기반으로 추천된 기업입니다.
              </p>
            </div>
            <Link
              href="/companies"
              className="text-kr-keep hidden shrink-0 text-[14px] font-bold text-primary hover:underline sm:inline-flex"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedCompanies.map((company) => (
              <Card
                key={company.id}
                className="group border-border bg-card shadow-ct-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-ct-card"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-kr-pretty truncate text-[17px] font-bold text-foreground">
                        {company.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="slate" size="sm" className="text-kr-keep">
                          {company.industry}
                        </Badge>
                        <Badge variant="slate" size="sm" className="text-kr-keep">
                          {company.region}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-kr-pretty mt-4 line-clamp-2 flex-1 text-[14px] leading-6 text-muted-foreground">
                    {company.description}
                  </p>
                  <Link
                    href={`/companies/${company.id}`}
                    className="text-kr-keep mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-primary transition group-hover:gap-2"
                  >
                    기업 상세 보기 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-kr-pretty text-[20px] font-bold text-foreground sm:text-[22px]">
                최근 활동
              </h2>
              <p className="text-kr-pretty mt-1 text-[14px] text-muted-foreground">
                조회·문의·매칭·메시지를 최신순으로 확인하세요.
              </p>
            </div>
          </div>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {recentActivities.map((activity) => {
                  const style = activityStyles[activity.type]
                  const Icon = style.icon
                  return (
                    <li key={activity.id}>
                      <Link
                        href={`/companies/${activity.targetCompanyId}`}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        aria-label={`${style.label} · ${activity.description} · ${activity.targetCompanyName}`}
                      >
                        <span
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                            style.bg,
                          )}
                        >
                          <Icon className={cn('h-5 w-5', style.iconColor)} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="slate" size="sm" className="shrink-0 text-kr-keep">
                              {style.label}
                            </Badge>
                            <p className="text-kr-pretty min-w-0 truncate text-[15px] font-bold text-foreground">
                              {activity.description}
                            </p>
                          </div>
                          <p className="text-kr-pretty mt-1 truncate text-[13px] text-muted-foreground">
                            {activity.targetCompanyName}
                          </p>
                        </div>
                        <time className="text-kr-keep shrink-0 text-[13px] font-semibold text-muted-foreground">
                          {formatActivityDate(activity.createdAt)}
                        </time>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
