'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Logo } from '@/components/brand/Logo'
import { AppButton } from '@/components/ui/AppButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authClient } from '@/lib/auth-client'

type AuthTab = 'login' | 'register'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
})

const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  name: z.string().min(1, '이름을 입력해주세요'),
  accountType: z.enum(['client', 'factory']),
  terms: z.boolean().refine((value) => value, '약관 동의가 필요합니다'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.input<typeof registerSchema>

const tabStyles: Record<AuthTab, string> = {
  login: '로그인',
  register: '회원가입',
}

function resolveRedirectTarget(fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const target = new URLSearchParams(window.location.search).get('redirectTo')
  if (!target) return fallback
  if (!target.startsWith('/')) return fallback
  if (target.startsWith('//')) return fallback
  return target
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      accountType: 'client',
      terms: false,
    },
  })

  async function submitLogin(values: LoginFormValues) {
    setSubmitError('')
    setIsSubmitting(true)
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })
    setIsSubmitting(false)
    if (error) {
      setSubmitError(error.message ?? '이메일 또는 비밀번호가 올바르지 않습니다')
      return
    }
    router.push(resolveRedirectTarget('/dashboard'))
  }

  async function submitRegister(values: RegisterFormValues) {
    setSubmitError('')
    setIsSubmitting(true)
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      accountType: values.accountType,
    })
    setIsSubmitting(false)
    if (error) {
      setSubmitError(error.message ?? '회원가입 중 오류가 발생했습니다')
      return
    }
    router.push(resolveRedirectTarget('/dashboard'))
  }

  function handleTabChange(value: string) {
    if (value !== 'login' && value !== 'register') return
    setActiveTab(value)
    setSubmitError('')
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-compact-col space-y-6 sm:space-y-8">
        <header className="text-center">
          <Logo variant="primary" size="md" className="mx-auto" />
          <h1 className="text-kr-balance mt-5 text-[24px] font-bold text-foreground sm:text-[28px]">
            로그인 / 회원가입
          </h1>
          <p className="text-kr-pretty mt-2 text-[15px] text-muted-foreground">
            발주처와 공장을 안전하게 연결하기 위한 시작 단계입니다.
          </p>
        </header>

        <Card className="border-border bg-card shadow-ct-soft">
          <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
            <CardTitle className="text-kr-pretty text-[18px] font-bold text-foreground sm:text-[20px]">
              계정 접속
            </CardTitle>
            <CardDescription className="text-kr-pretty text-[15px]">
              기존 계정으로 로그인하거나 새 계정을 만들어 역할을 선택하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-5">
              <TabsList className="grid h-11 w-full grid-cols-2 bg-muted p-1">
                {(['login', 'register'] as const).map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="text-kr-keep text-[16px] font-bold">
                    {tabStyles[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {submitError && (
                <p className="text-kr-pretty rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-[15px] font-bold text-destructive">
                  {submitError}
                </p>
              )}

              <TabsContent value="login" className="mt-0">
                <form
                  onSubmit={loginForm.handleSubmit(submitLogin)}
                  className="space-y-4 sm:space-y-5"
                >
                  <Field
                    htmlFor="login-email"
                    label="이메일"
                    error={loginForm.formState.errors.email?.message}
                  >
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      className="h-12 rounded-lg bg-card text-[17px]"
                      {...loginForm.register('email')}
                    />
                  </Field>
                  <Field
                    htmlFor="login-password"
                    label="비밀번호"
                    error={loginForm.formState.errors.password?.message}
                  >
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      className="h-12 rounded-lg bg-card text-[17px]"
                      {...loginForm.register('password')}
                    />
                  </Field>
                  <AppButton type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? '로그인 중...' : '로그인'}
                  </AppButton>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form
                  onSubmit={registerForm.handleSubmit(submitRegister)}
                  className="space-y-4 sm:space-y-5"
                >
                  <Field
                    htmlFor="register-name"
                    label="이름"
                    error={registerForm.formState.errors.name?.message}
                  >
                    <Input
                      id="register-name"
                      type="text"
                      className="h-12 rounded-lg bg-card text-[17px]"
                      {...registerForm.register('name')}
                    />
                  </Field>
                  <Field
                    htmlFor="register-email"
                    label="이메일"
                    error={registerForm.formState.errors.email?.message}
                  >
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      className="h-12 rounded-lg bg-card text-[17px]"
                      {...registerForm.register('email')}
                    />
                  </Field>
                  <Field
                    htmlFor="register-password"
                    label="비밀번호"
                    error={registerForm.formState.errors.password?.message}
                  >
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      className="h-12 rounded-lg bg-card text-[17px]"
                      {...registerForm.register('password')}
                    />
                  </Field>
                  <fieldset className="rounded-xl border border-border bg-muted p-4">
                    <legend className="text-kr-keep px-2 text-[16px] font-bold text-foreground">
                      계정 유형
                    </legend>
                    <Controller
                      control={registerForm.control}
                      name="accountType"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                        >
                          <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-[16px] font-semibold text-foreground transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-primary">
                            <RadioGroupItem value="client" />
                            <span className="text-kr-keep">발주처 (client)</span>
                          </Label>
                          <Label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-[16px] font-semibold text-foreground transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-primary">
                            <RadioGroupItem value="factory" />
                            <span className="text-kr-keep">공장 (factory)</span>
                          </Label>
                        </RadioGroup>
                      )}
                    />
                  </fieldset>
                  <Controller
                    control={registerForm.control}
                    name="terms"
                    render={({ field }) => (
                      <Label className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4 text-[16px] font-semibold text-foreground">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className="mt-1"
                        />
                        <span className="text-kr-pretty">
                          서비스 이용약관과 개인정보 처리방침에 동의합니다.
                        </span>
                      </Label>
                    )}
                  />
                  {registerForm.formState.errors.terms?.message && (
                    <p className="text-kr-pretty text-[15px] font-semibold text-destructive">
                      {registerForm.formState.errors.terms.message}
                    </p>
                  )}
                  <AppButton type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? '가입 중...' : '회원가입'}
                  </AppButton>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Link
          href="/"
          className="text-kr-keep inline-flex w-full justify-center text-[15px] font-bold text-muted-foreground transition hover:text-primary"
        >
          ← 처음으로
        </Link>
      </div>
    </main>
  )
}

function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-kr-keep text-[16px] font-semibold text-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-kr-pretty text-[15px] font-semibold text-destructive">{error}</p>
      )}
    </div>
  )
}
