'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Menu, PanelLeftOpen, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMessagesUnreadCount } from '@/state/MessagesContext'
import { useNotificationsUnreadCount } from '@/state/NotificationsContext'
import { useUserState } from '@/state/UserContext'
import { Logo } from '@/components/brand/Logo'
import { NotificationDropdown } from '@/components/notification/NotificationDropdown'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { AppSidebar } from '@/components/layout/AppSidebar'

interface AppHeaderProps {
  className?: string
  /** Desktop sidebar가 collapse된 상태인지 — true면 open trigger를 desktop에서 노출. */
  sidebarHidden?: boolean
  onOpenSidebar?: () => void
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed.slice(0, 1).toUpperCase()
}

export function AppHeader({ className, sidebarHidden = false, onOpenSidebar }: AppHeaderProps) {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const notificationUnreadCount = useNotificationsUnreadCount()
  const messageUnreadCount = useMessagesUnreadCount()
  const totalUnreadCount = notificationUnreadCount + messageUnreadCount
  const { currentUser, isAuthenticated } = useUserState()

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = keyword.trim()
    if (!value) return
    router.push(`/companies?keyword=${encodeURIComponent(value)}`)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-14 border-b border-border bg-card/95 px-4 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between gap-3 lg:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="메뉴 열기">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
              <SheetHeader className="sr-only">
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>

          {sidebarHidden && onOpenSidebar && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                onClick={onOpenSidebar}
                className="hidden lg:inline-flex"
                aria-label="사이드바 열기"
                title="사이드바 열기"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
              <Logo
                variant="primary"
                size="md"
                className="hidden lg:block"
                alt="RootMatch — 홈으로"
              />
            </>
          )}

          <form onSubmit={submitSearch} className="min-w-0 flex-1 sm:max-w-md">
            <label className="relative block">
              <span className="sr-only">검색</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                type="search"
                placeholder="기업, 키워드 검색"
                className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-[16px] font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20"
              />
            </label>
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="relative"
              aria-label={totalUnreadCount > 0 ? `알림 ${totalUnreadCount}개` : '알림'}
            >
              <Bell className="h-5 w-5" />
              {totalUnreadCount > 0 && (
                <span
                  className="absolute right-1 top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[12px] font-bold leading-none text-destructive-foreground ring-2 ring-card"
                  aria-hidden="true"
                >
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
              )}
            </Button>
            <NotificationDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
          </div>

          {isAuthenticated && currentUser ? (
            <Link
              href="/mypage"
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
              aria-label={`${currentUser.name} 마이페이지로 이동`}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {getInitial(currentUser.name)}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="text-kr-keep block text-[14px] font-bold text-foreground">
                  {currentUser.name}
                </span>
                <span className="text-kr-keep block text-[12px] font-semibold text-muted-foreground">
                  {currentUser.position ?? '회원'}
                </span>
              </span>
            </Link>
          ) : (
            <Button variant="secondary" size="default" onClick={() => router.push('/login')}>
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
