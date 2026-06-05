import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-toss-sm hover:bg-primary/90',
        brand: 'bg-brand text-white shadow-toss-sm hover:bg-brand-hover active:bg-brand-active',
        destructive:
          'bg-destructive text-destructive-foreground shadow-toss-sm hover:bg-destructive/90',
        outline:
          'border border-line-strong bg-surface text-foreground shadow-toss-sm hover:border-brand-subtle hover:bg-brand-light/40 hover:text-brand',
        secondary:
          'border border-line bg-surface text-foreground shadow-toss-sm hover:bg-surface-muted',
        ghost: 'bg-transparent text-foreground hover:bg-surface-muted',
        link: 'text-brand underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground shadow-toss-sm hover:bg-success/90',
      },
      size: {
        // v0.2 §6.1 senior-friendly touch sizes — every step +4~8px from prior version
        sm: 'h-10 rounded-md px-3 text-[15px] [&_svg]:size-4', // 40px (보조 액션, 컴팩트 영역)
        default: 'h-12 px-4 text-[16px] [&_svg]:size-4', // 48px (v0.2 minimum hit area)
        lg: 'h-[52px] px-5 text-[17px] [&_svg]:size-5', // 52px (v0.2 secondary button)
        xl: 'h-[56px] px-6 text-[18px] [&_svg]:size-5', // 56px (v0.2 primary button)
        '2xl': 'h-[60px] px-7 text-[20px] font-bold [&_svg]:size-5', // 60px (계약/안심결제 등 critical)
        icon: 'h-12 w-12 [&_svg]:size-5',
        'icon-sm': 'h-10 w-10 [&_svg]:size-4',
        'icon-lg': 'h-[52px] w-[52px] [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
