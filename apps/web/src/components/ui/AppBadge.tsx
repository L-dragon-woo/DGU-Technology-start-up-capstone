import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import type { BadgeProps as ShadcnBadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type LegacyVariant = 'blue' | 'green' | 'yellow' | 'amber' | 'red' | 'slate'
type LegacySize = 'sm' | 'md' | 'lg'

const variantMap: Record<LegacyVariant, ShadcnBadgeProps['variant']> = {
  blue: 'info',
  green: 'success',
  yellow: 'warning',
  amber: 'warning',
  red: 'destructive',
  slate: 'slate',
}

const sizeMap: Record<LegacySize, ShadcnBadgeProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
}

interface AppBadgeProps {
  variant?: LegacyVariant
  size?: LegacySize
  children: ReactNode
  className?: string
}

export function AppBadge({ variant = 'blue', size = 'md', children, className }: AppBadgeProps) {
  return (
    <Badge variant={variantMap[variant]} size={sizeMap[size]} className={cn(className)}>
      {children}
    </Badge>
  )
}
