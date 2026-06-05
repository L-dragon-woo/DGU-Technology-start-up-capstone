'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { ButtonProps as ShadcnButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LegacyVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type LegacySize = 'md' | 'lg' | 'xl'

const variantMap: Record<LegacyVariant, ShadcnButtonProps['variant']> = {
  primary: 'brand',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'destructive',
}

const sizeMap: Record<LegacySize, ShadcnButtonProps['size']> = {
  md: 'lg',
  lg: 'xl',
  xl: '2xl',
}

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LegacyVariant
  size?: LegacySize
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
  className?: string
}

export function AppButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className,
  type = 'button',
  ...buttonProps
}: AppButtonProps) {
  return (
    <Button
      type={type}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      fullWidth={fullWidth}
      loading={loading}
      className={cn('tracking-tight', className)}
      {...buttonProps}
    >
      {children}
    </Button>
  )
}
