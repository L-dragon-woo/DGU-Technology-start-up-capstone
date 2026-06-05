'use client'

import { Suspense, useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Mail, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import type { Message } from '@rootmatching/shared'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'
import { useMessagesDispatch, useMessagesState, useSortedMessages } from '@/state/MessagesContext'
import { useUserState } from '@/state/UserContext'

type MessageFilter = 'all' | 'unread'

function formatMessageDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function MessagesPageContent() {
  const searchParams = useSearchParams()
  const { messages } = useMessagesState()
  const dispatch = useMessagesDispatch()
  const sortedMessages = useSortedMessages()
  const { currentUser } = useUserState()
  const [activeFilter, setActiveFilter] = useState<MessageFilter>('all')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const msgId = searchParams?.get('message')
    if (msgId) {
      setSelectedMessageId(msgId)
      const msg = messages.find((message) => message.id === msgId)
      if (msg && !msg.isRead) {
        dispatch({ type: 'messages/markAsRead', payload: { id: msgId } })
      }
    }
  }, [searchParams, messages, dispatch])

  const unreadCount = useMemo(
    () => sortedMessages.filter((message) => !message.isRead).length,
    [sortedMessages],
  )
  const visibleMessages = useMemo(
    () =>
      activeFilter === 'unread'
        ? sortedMessages.filter((message) => !message.isRead)
        : sortedMessages,
    [activeFilter, sortedMessages],
  )
  const selectedMessage = useMemo(
    () => sortedMessages.find((message) => message.id === selectedMessageId) ?? null,
    [selectedMessageId, sortedMessages],
  )
  const selectedReplies = selectedMessage ? (replies[selectedMessage.id] ?? []) : []

  function selectMessage(message: Message) {
    setSelectedMessageId(message.id)
    if (!message.isRead) {
      dispatch({ type: 'messages/markAsRead', payload: { id: message.id } })
    }
  }

  function submitReply() {
    const trimmedReply = replyText.trim()
    if (!selectedMessage || !trimmedReply) return

    setReplies((currentReplies) => ({
      ...currentReplies,
      [selectedMessage.id]: [...(currentReplies[selectedMessage.id] ?? []), trimmedReply],
    }))
    setReplyText('')
  }

  function handleReplyKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitReply()
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-ct-soft">
          <div className="p-6 sm:p-8">
            <AppBadge variant="blue" className="mb-4 px-4 py-2 text-sm font-semibold">
              <Mail className="h-4 w-4" />
              메시지
            </AppBadge>
            <h1 className="text-kr-keep text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold tracking-normal text-foreground">
              메시지
            </h1>
            <p className="text-kr-pretty mt-3 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              수신/발신 메시지를 한 곳에서 확인하세요.
            </p>
          </div>
        </header>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={cn(
                  'rounded-pill transition',
                  activeFilter !== 'all' && 'hover:bg-accent',
                )}
              >
                <Badge
                  variant={activeFilter === 'all' ? 'info' : 'slate'}
                  className="text-kr-keep pointer-events-none"
                >
                  전체 ({sortedMessages.length})
                </Badge>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('unread')}
                className={cn(
                  'rounded-pill transition',
                  activeFilter !== 'unread' && 'hover:bg-accent',
                )}
              >
                <Badge
                  variant={activeFilter === 'unread' ? 'info' : 'slate'}
                  className="text-kr-keep pointer-events-none"
                >
                  읽지 않음 ({unreadCount})
                </Badge>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid min-h-[600px] grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="overflow-hidden border-border bg-card shadow-ct-soft">
            <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-4">
              <div>
                <p className="text-kr-keep text-sm font-semibold text-muted-foreground">메시지함</p>
                <p className="text-kr-keep mt-1 text-lg font-bold text-foreground">
                  {visibleMessages.length}개
                </p>
              </div>
              <AppButton
                variant="secondary"
                className="px-3 py-2 text-xs"
                onClick={() => dispatch({ type: 'messages/markAllAsRead' })}
              >
                전체 읽음 처리
              </AppButton>
            </div>

            {visibleMessages.length > 0 ? (
              <div className="divide-y divide-border">
                {visibleMessages.map((message) => {
                  const isSelected = message.id === selectedMessageId
                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => selectMessage(message)}
                      className={cn(
                        'block w-full px-5 py-4 text-left transition hover:bg-muted',
                        isSelected && 'bg-accent',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {!message.isRead && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                            )}
                            <p
                              className={cn(
                                'text-kr-keep truncate text-sm text-foreground',
                                message.isRead ? 'font-semibold' : 'font-extrabold',
                              )}
                            >
                              {message.senderName}
                            </p>
                          </div>
                          <p
                            className={cn(
                              'text-kr-pretty mt-2 line-clamp-1 text-base text-foreground',
                              message.isRead ? 'font-semibold' : 'font-extrabold',
                            )}
                          >
                            {message.subject}
                          </p>
                          <p
                            className={cn(
                              'text-kr-pretty mt-1 line-clamp-1 text-sm',
                              message.isRead
                                ? 'text-muted-foreground'
                                : 'font-semibold text-foreground/80',
                            )}
                          >
                            {message.content}
                          </p>
                        </div>
                        <time className="text-kr-keep shrink-0 text-xs font-semibold text-muted-foreground">
                          {formatMessageDate(message.createdAt)}
                        </time>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center p-8 text-center">
                <p className="text-kr-pretty text-base font-semibold text-muted-foreground">
                  메시지가 없습니다.
                </p>
              </div>
            )}
          </Card>

          <Card className="border-border bg-card shadow-ct-soft">
            <CardContent className="p-5 sm:p-6">
              {selectedMessage ? (
                <div className="flex h-full flex-col gap-5">
                  <section className="rounded-xl border border-border bg-card p-5 shadow-ct-soft">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-kr-pretty text-xl font-bold text-foreground">
                            {selectedMessage.senderName}
                          </h2>
                          {selectedMessage.subject.includes('견적') && (
                            <Badge variant="success" className="text-kr-keep">
                              견적 협의
                            </Badge>
                          )}
                        </div>
                        <p className="text-kr-pretty mt-1 text-sm font-semibold text-muted-foreground">
                          {selectedMessage.senderCompany}
                        </p>
                        <p className="text-kr-pretty mt-3 text-lg font-bold text-foreground">
                          {selectedMessage.subject}
                        </p>
                        <time className="text-kr-keep mt-2 block text-sm font-medium text-muted-foreground">
                          {formatMessageDate(selectedMessage.createdAt)}
                        </time>
                      </div>
                      <Badge
                        variant={selectedMessage.isRead ? 'slate' : 'info'}
                        className="text-kr-keep"
                      >
                        {selectedMessage.isRead ? '읽음' : '읽지 않음'}
                      </Badge>
                    </div>
                  </section>

                  <section className="rounded-xl border border-border bg-muted p-5">
                    <p className="text-kr-pretty whitespace-pre-wrap text-base leading-8 text-foreground/80">
                      {selectedMessage.content}
                    </p>
                  </section>

                  <section className="flex min-h-[220px] flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-5">
                    <div className="flex-1 space-y-3">
                      {selectedReplies.map((reply, index) => (
                        <div key={`${selectedMessage.id}-${index}`} className="flex justify-end">
                          <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-brand-light px-4 py-3 text-brand shadow-sm">
                            <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold">
                              <span>{currentUser?.name ?? '나'}</span>
                              <time>방금 전</time>
                            </div>
                            <p className="text-kr-pretty whitespace-pre-wrap text-sm leading-6 text-foreground">
                              {reply}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <Textarea
                        rows={2}
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value)}
                        onKeyDown={handleReplyKeyDown}
                        placeholder="답장을 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
                        className="min-h-[76px] resize-none rounded-xl bg-card text-base"
                      />
                      <Button
                        variant="default"
                        onClick={submitReply}
                        disabled={!replyText.trim()}
                        className="text-kr-keep"
                      >
                        <Send className="h-4 w-4" />
                        전송
                      </Button>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex min-h-[560px] items-center justify-center rounded-xl border border-border bg-muted p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-light text-brand">
                      <Mail className="h-10 w-10" />
                    </div>
                    <p className="text-kr-pretty mt-5 text-xl font-bold text-foreground">
                      메시지를 선택하세요.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesPageShell />}>
      <MessagesPageContent />
    </Suspense>
  )
}

function MessagesPageShell() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-9 w-1/4" />
          <Skeleton className="h-5 w-2/5" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="border-border bg-card">
            <CardContent className="space-y-3 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg p-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-11 w-24 rounded-lg" />
                <Skeleton className="h-11 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
