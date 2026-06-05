'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, LockKeyhole, Save, Settings, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { mockCurrentUser } from '@/data/users'
import { useUserDispatch, useUserState } from '@/state/UserContext'

const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  position: z.string().optional(),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const tabItems = [
  { label: '기업 프로필', href: '/mypage', current: false },
  { label: '활동 분석', href: '/mypage/analytics', current: false },
  { label: '계정 설정', href: '/mypage/settings', current: true },
]

const inputClassName = 'h-11 bg-card text-[15px]'
const labelClassName = 'text-kr-keep text-[16px] font-semibold text-foreground'
const errorClassName = 'mt-2 text-[15px] font-semibold text-destructive'
const successClassName = 'text-kr-pretty text-[15px] font-semibold text-success'

function buildDefaultValues(currentUser: typeof mockCurrentUser): ProfileFormValues {
  return {
    name: currentUser.name,
    position: currentUser.position ?? '',
    email: currentUser.email,
    phone: currentUser.phone ?? '',
  }
}

export default function MyPageSettingsPage() {
  const { currentUser } = useUserState()
  const dispatch = useUserDispatch()
  const user = currentUser ?? mockCurrentUser
  const [profileSaved, setProfileSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [notificationSaved, setNotificationSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: buildDefaultValues(user),
  })

  useEffect(() => {
    reset(buildDefaultValues(user))
  }, [reset, user])

  useEffect(() => {
    if (!profileSaved) return
    const timer = window.setTimeout(() => setProfileSaved(false), 3000)
    return () => window.clearTimeout(timer)
  }, [profileSaved])

  useEffect(() => {
    if (!notificationSaved) return
    const timer = window.setTimeout(() => setNotificationSaved(false), 3000)
    return () => window.clearTimeout(timer)
  }, [notificationSaved])

  function saveProfile(values: ProfileFormValues) {
    const profileUpdate = {
      name: values.name,
      position: values.position,
      email: values.email,
      phone: values.phone,
    }

    dispatch({ type: 'user/updateProfile', payload: profileUpdate })
    setProfileSaved(true)
  }

  function changePassword() {
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호와 확인이 일치하지 않습니다.')
      return
    }

    setPasswordError('')
    setPasswordSuccess('비밀번호가 변경되었습니다.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  function saveNotifications() {
    setNotificationSaved(true)
  }

  return (
    <div className="bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
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

        <header>
          <AppBadge variant="blue">
            <Settings className="h-4 w-4" />
            계정 설정
          </AppBadge>
          <h1 className="text-kr-pretty mt-5 text-[24px] font-bold text-foreground sm:text-[28px]">
            계정 설정
          </h1>
          <p className="text-kr-pretty mt-2 text-[15px] leading-7 text-muted-foreground">
            사용자 정보와 알림 설정을 관리하세요.
          </p>
        </header>

        <Card className="border-border bg-card shadow-ct-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <CardTitle className="text-kr-pretty text-[18px] font-bold">사용자 정보</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(saveProfile)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <Field label="이름" htmlFor="name" error={errors.name?.message}>
                <Input id="name" className={inputClassName} {...register('name')} />
              </Field>

              <Field label="직책" htmlFor="position" error={errors.position?.message}>
                <Input id="position" className={inputClassName} {...register('position')} />
              </Field>

              <Field label="이메일" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" className={inputClassName} {...register('email')} />
              </Field>

              <Field label="연락처" htmlFor="phone" error={errors.phone?.message}>
                <Input id="phone" type="tel" className={inputClassName} {...register('phone')} />
              </Field>

              <div className="flex items-center gap-4 sm:col-span-2">
                <AppButton type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4" />
                  정보 저장
                </AppButton>
                {profileSaved && <p className={successClassName}>정보가 저장되었습니다.</p>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-ct-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <CardTitle className="text-kr-pretty text-[18px] font-bold">비밀번호 변경</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="현재 비밀번호" htmlFor="currentPassword">
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="새 비밀번호" htmlFor="newPassword">
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="비밀번호 확인" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClassName}
              />
            </Field>

            {passwordError && <p className={errorClassName}>{passwordError}</p>}
            {passwordSuccess && <p className={successClassName}>{passwordSuccess}</p>}

            <div className="sm:col-span-2">
              <AppButton type="button" onClick={changePassword}>
                비밀번호 변경
              </AppButton>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-ct-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <CardTitle className="text-kr-pretty text-[18px] font-bold">알림 설정</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <ToggleRow
              label="이메일 알림"
              enabled={emailNotif}
              onToggle={() => setEmailNotif((value) => !value)}
            />
            <ToggleRow
              label="푸시 알림"
              enabled={pushNotif}
              onToggle={() => setPushNotif((value) => !value)}
            />

            <div className="flex items-center gap-4 pt-2">
              <AppButton type="button" onClick={saveNotifications}>
                알림 설정 저장
              </AppButton>
              {notificationSaved && <p className={successClassName}>알림 설정이 저장되었습니다.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label className={labelClassName} htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}

function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-4">
      <span className="text-kr-keep text-sm font-bold text-foreground">{label}</span>
      <Switch checked={enabled} onCheckedChange={onToggle} aria-label={label} />
    </div>
  )
}
