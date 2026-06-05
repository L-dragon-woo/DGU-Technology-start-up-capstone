'use client'

import { Bell, Building2, Mail, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Notification, NotificationType } from '@rootmatching/shared'
import { cn } from '@/lib/utils'
import { useNotificationsDispatch, useSortedNotifications } from '@/state/NotificationsContext'

interface NotificationDropdownProps {
  open: boolean
  onClose: () => void
  className?: string
}

const iconStyles: Record<NotificationType, typeof Mail> = {
  message: Mail,
  match: Sparkles,
  inquiry: Building2,
  system: Bell,
}

export function NotificationDropdown({ open, onClose, className }: NotificationDropdownProps) {
  const router = useRouter()
  const dispatch = useNotificationsDispatch()
  const notifications = useSortedNotifications().slice(0, 5)

  if (!open) return null

  function clickNotification(notification: Notification) {
    dispatch({ type: 'notifications/markAsRead', payload: { id: notification.id } })
    if (notification.link) {
      router.push(notification.link)
    }
    onClose()
  }

  return (
    <>
      <button
        type="button"
        aria-label="알림 닫기"
        className="fixed inset-0 z-30 cursor-default"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute right-0 top-full z-40 mt-2 w-[min(360px,calc(100vw-32px))] rounded-xl border border-border bg-popover text-popover-foreground shadow-ct-popover',
          className,
        )}
        role="dialog"
        aria-label="알림 목록"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-[15px] font-bold text-foreground">알림</h2>
          <button
            type="button"
            onClick={() => dispatch({ type: 'notifications/markAllAsRead' })}
            className="text-[15px] font-semibold text-primary transition hover:text-primary/80"
          >
            전체 읽음
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-[15px] font-medium text-muted-foreground">
            새 알림이 없습니다
          </div>
        ) : (
          <ul className="max-h-[400px] overflow-y-auto p-1.5">
            {notifications.map((notification) => {
              const Icon = iconStyles[notification.type]
              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => clickNotification(notification)}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-muted',
                      notification.isRead
                        ? 'text-muted-foreground'
                        : 'bg-accent/40 font-semibold text-foreground',
                    )}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary ring-1 ring-border">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-kr-pretty block text-[15px]">{notification.title}</span>
                      <span className="text-kr-pretty mt-0.5 block text-[14px] leading-relaxed text-muted-foreground">
                        {notification.content}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
