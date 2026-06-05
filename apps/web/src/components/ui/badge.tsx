import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill font-semibold leading-none transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-surface-muted text-ink-800',
        destructive: 'border-transparent bg-danger-bg text-danger',
        outline: 'border border-line text-foreground',
        info: 'border-transparent bg-brand-light text-brand',
        success: 'border-transparent bg-success-bg text-success',
        warning: 'border-transparent bg-warning-bg text-warning-text',
        slate: 'border-transparent bg-surface-muted text-ink-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-[15px]',
        default: 'px-2.5 py-1 text-[16px]',
        lg: 'px-3 py-1.5 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
