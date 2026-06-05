'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Factory,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  PackageCheck,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface AppSidebarProps {
  className?: string
  onNavigate?: () => void
  /** Desktop only. Mobile Sheet은 컴포넌트 자체의 X 버튼 사용. */
  onClose?: () => void
}

const navGroups: NavGroup[] = [
  {
    title: '공통',
    items: [
      { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
      { href: '/messages', label: '메시지', icon: MessageSquare },
      { href: '/companies', label: '기업 디렉토리', icon: Building2 },
    ],
  },
  {
    title: '발주처',
    items: [
      { href: '/request', label: '견적 요청', icon: FileText },
      { href: '/matching', label: 'AI 매칭', icon: Sparkles },
      { href: '/requests', label: '내 요청', icon: Inbox },
    ],
  },
  {
    title: '공장',
    items: [
      { href: '/factory/onboarding', label: '공장 등록', icon: Factory },
      { href: '/factory/requests', label: '받은 요청', icon: Inbox },
      { href: '/quotes', label: '공개 견적', icon: Search },
    ],
  },
  {
    title: '거래/분쟁',
    items: [
      { href: '/transactions', label: '거래 현황', icon: PackageCheck },
      { href: '/disputes', label: '분쟁 중재', icon: AlertTriangle },
    ],
  },
  {
    title: '마이페이지',
    items: [
      { href: '/mypage', label: '프로필', icon: User },
      { href: '/mypage/analytics', label: '활동 분석', icon: BarChart3 },
      { href: '/mypage/settings', label: '설정', icon: Settings },
    ],
  },
]

export function AppSidebar({ className, onNavigate, onClose }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex h-full flex-col overflow-y-auto bg-card px-3 py-4', className)}>
      <div className="mb-5 flex items-center justify-between gap-2 px-2 py-1.5">
        <Link href="/" onClick={onNavigate} className="inline-flex items-center">
          <Logo variant="primary" size="md" href={null} alt="RootMatch — 홈으로" />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
            aria-label="사이드바 닫기"
            title="사이드바 닫기"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5">
        {navGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-1.5 px-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h2>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[16px] font-semibold transition',
                        active
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-kr-keep truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </nav>
    </div>
  )
}
