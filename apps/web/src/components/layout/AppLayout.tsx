'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

interface SidebarLayoutValue {
  /** Desktop sidebar가 열려 있는지. lg 미만에서는 의미 없음(false 취급). */
  open: boolean
  /** Sidebar 너비(px). 닫혀 있으면 0. lg breakpoint 미만에서는 의미 없음. */
  widthPx: number
}

const SIDEBAR_WIDTH_PX = 260

const SidebarLayoutContext = createContext<SidebarLayoutValue>({
  open: false,
  widthPx: 0,
})

/**
 * AppLayout 내부에서 desktop sidebar 열림 상태를 읽기 위한 hook.
 * Sticky/fixed footer 등에서 lg 사이드바 너비만큼 offset 줄 때 사용.
 */
export function useSidebarLayout(): SidebarLayoutValue {
  return useContext(SidebarLayoutContext)
}

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': '대시보드',
  '/quotes': '견적 모집 게시판',
  '/request': '새 견적 요청',
  '/matching': 'AI 매칭 결과',
  '/requests': '내 견적 요청',
  '/factory/onboarding': '공장 프로필 등록',
  '/factory/requests': '받은 견적 요청',
  '/contract': '계약 및 결제',
  '/transactions': '거래 진행 현황',
  '/transaction/review': '거래 완료 및 리뷰',
  '/transaction/progress': '거래 진행 상세',
  '/disputes': '분쟁 중재 센터',
  '/disputes/mediation': '분쟁 중재 신청',
  '/companies': '기업 디렉토리',
  '/messages': '메시지',
  '/mypage': '마이페이지',
  '/mypage/analytics': '활동 분석',
  '/mypage/settings': '계정 설정',
}

const DYNAMIC_TITLE_PREFIXES: Array<{ prefix: string; title: string }> = [
  { prefix: '/factories/', title: '공장 상세' },
  { prefix: '/factory/requests/', title: '견적 제출' },
  { prefix: '/requests/', title: '견적 요청 상세' },
  { prefix: '/transactions/', title: '거래 진행 상세' },
  { prefix: '/disputes/', title: '분쟁 상세' },
  { prefix: '/companies/', title: '기업 상세' },
]

function resolveTitleForPath(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  for (const { prefix, title } of DYNAMIC_TITLE_PREFIXES) {
    if (pathname.startsWith(prefix)) return title
  }
  return '홈'
}

const SIDEBAR_STORAGE_KEY = 'rm:sidebar-open'

export function AppLayout({ children, className }: AppLayoutProps) {
  const pathname = usePathname()
  /**
   * SSR-safe sidebar open state.
   * Default = open. Client에서 localStorage 읽고 동기화 (첫 frame mismatch 방지를 위해
   * 초기값은 항상 true로 두고, useEffect에서 closed 시에만 false로 전환).
   */
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'closed') {
      setSidebarOpen(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarOpen ? 'open' : 'closed')
  }, [sidebarOpen])

  useEffect(() => {
    const title = resolveTitleForPath(pathname)
    document.title = `${title} | RootMatch`
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <SidebarLayoutContext.Provider
      value={{ open: sidebarOpen, widthPx: sidebarOpen ? SIDEBAR_WIDTH_PX : 0 }}
    >
      <div
        className={cn(
          'min-h-screen bg-background',
          sidebarOpen ? 'lg:grid lg:grid-cols-[260px_minmax(0,1fr)]' : 'lg:block',
          className,
        )}
      >
        <aside
          className={cn(
            'hidden border-r border-border bg-card lg:sticky lg:top-0 lg:z-40 lg:h-screen',
            sidebarOpen ? 'lg:block' : 'lg:hidden',
          )}
        >
          <AppSidebar onClose={() => setSidebarOpen(false)} />
        </aside>
        <div className="flex min-h-screen min-w-0 flex-col">
          <AppHeader sidebarHidden={!sidebarOpen} onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarLayoutContext.Provider>
  )
}
