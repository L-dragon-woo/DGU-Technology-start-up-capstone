'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: AuthTab
  className?: string
}

export function AuthModal({ open, onClose, defaultTab = 'login', className }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
      setSubmitError('')
    }
  }, [defaultTab, open])

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
    onClose()
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
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn('sm:max-w-lg', className)}>
        <DialogHeader>
          <DialogTitle className="text-kr-pretty text-[20px] font-bold">계정 시작하기</DialogTitle>
          <DialogDescription className="text-kr-pretty text-[16px]">
            로그인하거나 새 계정을 만들어 시작하세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as AuthTab)
            setSubmitError('')
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="register">회원가입</TabsTrigger>
          </TabsList>

          {submitError && (
            <p className="text-kr-pretty mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[15px] font-semibold text-destructive">
              {submitError}
            </p>
          )}

          <TabsContent value="login" className="mt-4">
            <form onSubmit={loginForm.handleSubmit(submitLogin)} className="space-y-4">
              <Field
                label="이메일"
                htmlFor="login-email"
                error={loginForm.formState.errors.email?.message}
              >
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  {...loginForm.register('email')}
                />
              </Field>
              <Field
                label="비밀번호"
                htmlFor="login-password"
                error={loginForm.formState.errors.password?.message}
              >
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                />
              </Field>
              <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={registerForm.handleSubmit(submitRegister)} className="space-y-4">
              <Field
                label="이름"
                htmlFor="register-name"
                error={registerForm.formState.errors.name?.message}
              >
                <Input id="register-name" type="text" {...registerForm.register('name')} />
              </Field>
              <Field
                label="이메일"
                htmlFor="register-email"
                error={registerForm.formState.errors.email?.message}
              >
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  {...registerForm.register('email')}
                />
              </Field>
              <Field
                label="비밀번호"
                htmlFor="register-password"
                error={registerForm.formState.errors.password?.message}
              >
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  {...registerForm.register('password')}
                />
              </Field>
              <fieldset>
                <legend className="text-kr-keep mb-2 text-[16px] font-semibold text-foreground">
                  계정 유형
                </legend>
                <RadioGroup
                  defaultValue="client"
                  onValueChange={(value) =>
                    registerForm.setValue('accountType', value as 'client' | 'factory', {
                      shouldDirty: true,
                    })
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  <Label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-card px-3 py-2.5 text-[16px] font-semibold has-[input:checked]:border-primary has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                    <RadioGroupItem value="client" />
                    발주처
                  </Label>
                  <Label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-card px-3 py-2.5 text-[16px] font-semibold has-[input:checked]:border-primary has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                    <RadioGroupItem value="factory" />
                    공장
                  </Label>
                </RadioGroup>
              </fieldset>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-muted/40 p-3 text-[16px] font-semibold">
                <Checkbox
                  className="mt-0.5"
                  onCheckedChange={(checked) =>
                    registerForm.setValue('terms', Boolean(checked), {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="text-kr-pretty">
                  서비스 이용약관과 개인정보 처리방침에 동의합니다.
                </span>
              </Label>
              {registerForm.formState.errors.terms?.message && (
                <p className="text-[15px] font-semibold text-destructive">
                  {registerForm.formState.errors.terms.message}
                </p>
              )}
              <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
                {isSubmitting ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[16px] font-semibold">
        {label}
      </Label>
      {children}
      {error && <p className="text-[15px] font-semibold text-destructive">{error}</p>}
    </div>
  )
}
