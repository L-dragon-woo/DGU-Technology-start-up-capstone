import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * RootMatch Logo — v0.2 brand identity.
 *
 * Variants:
 *  - primary: full-color horizontal logo (default, 헤더/푸터)
 *  - monochrome: 단색 horizontal logo (관리자 / 인쇄 / dark surface)
 *  - symbol: 심볼만 (모바일 collapsed header, favicon fallback)
 *
 * Backgrounds:
 *  - transparent (default): light/sand surface 위
 *  - whiteBg: dark/photo surface 위 (gradient/이미지 등)
 */
type LogoVariant = 'primary' | 'monochrome' | 'symbol'
type LogoBackground = 'transparent' | 'whiteBg'
type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

const sourceMap = {
  primary: {
    transparent: {
      src: '/brand/rootmatch_primary_horizontal_logo.png',
      width: 1175,
      height: 344,
    },
    whiteBg: {
      src: '/brand/rootmatch_primary_horizontal_logo_white_bg.png',
      width: 1176,
      height: 344,
    },
  },
  monochrome: {
    transparent: {
      src: '/brand/rootmatch_monochrome_horizontal_logo.png',
      width: 626,
      height: 189,
    },
    whiteBg: {
      src: '/brand/rootmatch_monochrome_horizontal_logo_white_bg.png',
      width: 626,
      height: 189,
    },
  },
  symbol: {
    transparent: {
      src: '/brand/rootmatch_symbol_only.png',
      width: 301,
      height: 344,
    },
    whiteBg: {
      src: '/brand/rootmatch_symbol_only_white_bg.png',
      width: 301,
      height: 344,
    },
  },
} as const satisfies Record<
  LogoVariant,
  Record<LogoBackground, { src: string; width: number; height: number }>
>

const sizeClassMap: Record<LogoSize, string> = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-12 w-auto',
}

interface LogoProps {
  variant?: LogoVariant
  background?: LogoBackground
  size?: LogoSize
  /** href=null → 링크 없음 (footer 등). 기본 '/'. */
  href?: string | null
  /** Landing hero 등 LCP 후보일 때만 true */
  priority?: boolean
  className?: string
  alt?: string
}

export function Logo({
  variant = 'primary',
  background = 'transparent',
  size = 'md',
  href = '/',
  priority = false,
  className,
  alt = 'RootMatch',
}: LogoProps) {
  const source = sourceMap[variant][background]
  const sizeClass = sizeClassMap[size]

  const image = (
    <Image
      src={source.src}
      width={source.width}
      height={source.height}
      alt={alt}
      priority={priority}
      className={cn(sizeClass, 'select-none', className)}
      sizes={
        variant === 'symbol' ? '(max-width: 640px) 32px, 48px' : '(max-width: 640px) 140px, 220px'
      }
    />
  )

  if (href === null) {
    return image
  }

  return (
    <Link
      href={href}
      aria-label={alt}
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
    >
      {image}
    </Link>
  )
}
