import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/**
 * RootMatch Tailwind config — v0.2 (Toss precision × RootMatch senior-trust hybrid)
 *
 * Layered token system (3-tier, deprecation aware):
 *   1) shadcn HSL semantic vars (--primary/--accent/--success/...):
 *      defined in globals.css, mapped to RootMatch v0.2 brand.
 *   2) RootMatch v0.2 canonical brand:
 *      root-navy (primary CTA), match-teal (accent/links),
 *      root-green (verification), factory-sand (sections),
 *      escrow (안심결제), iron-black/steel-gray/line-gray (neutrals).
 *   3) Toss/cointoss canonical (보존, deprecation):
 *      ct-* typography, ink/line/surface scale, toss palette.
 *      New code MUST use v0.2 tokens; existing usage 점진 마이그레이션.
 *
 * Decision notes (designer critique on RootMatch v0.2 doc):
 *   - Toss precision (shadow/ink scale) 채택, "border-only" 폐기안 거절
 *   - root-navy = primary (CTA의 신뢰 무게), match-teal = accent (링크의 활기)
 *   - factory-sand는 hero/section 한정 (전체 배경 X)
 *   - Senior touch sizes (52/56/60) 토큰화
 *   - Density mode 토큰만 정의, 적용은 Phase 2
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'var(--font-pretendard)',
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        // ─── RootMatch v0.2 typography (canonical, prefer for new code) ───
        'rm-display': ['40px', { lineHeight: '52px', fontWeight: '700' }], // 랜딩 hero (desktop)
        'rm-display-m': ['32px', { lineHeight: '42px', fontWeight: '700' }], // hero (mobile)
        'rm-h1': ['32px', { lineHeight: '44px', fontWeight: '700' }], // 페이지 제목
        'rm-h1-m': ['28px', { lineHeight: '38px', fontWeight: '700' }],
        'rm-h2': ['24px', { lineHeight: '34px', fontWeight: '700' }], // 섹션 제목
        'rm-h2-m': ['22px', { lineHeight: '32px', fontWeight: '700' }],
        'rm-h3': ['20px', { lineHeight: '30px', fontWeight: '600' }], // 카드 그룹 제목
        'rm-body-lg': ['18px', { lineHeight: '30px', fontWeight: '400' }], // 안내문
        'rm-body': ['17px', { lineHeight: '28px', fontWeight: '400' }], // 기본 본문 (factory mobile default)
        'rm-body-d': ['16px', { lineHeight: '26px', fontWeight: '400' }], // 데스크탑 본문
        'rm-body-sm': ['15px', { lineHeight: '24px', fontWeight: '400' }], // 보조 설명
        'rm-caption': ['14px', { lineHeight: '22px', fontWeight: '500' }], // 메타, 태그
        'rm-data-lg': ['24px', { lineHeight: '32px', fontWeight: '700' }], // 견적·D-day
        'rm-data-xl': ['32px', { lineHeight: '40px', fontWeight: '700' }], // 대시보드 핵심 수치

        // ─── Toss/cointoss canonical (보존, 기존 코드 호환) ───
        'ct-display': ['32px', { lineHeight: '42px', fontWeight: '700' }],
        'ct-title1': ['28px', { lineHeight: '38px', fontWeight: '700' }],
        'ct-title2': ['24px', { lineHeight: '33px', fontWeight: '700' }],
        'ct-title3': ['22px', { lineHeight: '31px', fontWeight: '600' }],
        'ct-body-l': ['20px', { lineHeight: '30px', fontWeight: '400' }],
        'ct-body': ['18px', { lineHeight: '27px', fontWeight: '400' }],
        'ct-body-s': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'ct-caption': ['14px', { lineHeight: '21px', fontWeight: '400' }],

        // ─── Senior-readable (sr-*) 보존 ───
        'sr-display': ['32px', { lineHeight: '42px', fontWeight: '700' }],
        'sr-h1': ['28px', { lineHeight: '38px', fontWeight: '700' }],
        'sr-h2': ['24px', { lineHeight: '33px', fontWeight: '700' }],
        'sr-h3': ['22px', { lineHeight: '31px', fontWeight: '600' }],
        'sr-h4': ['20px', { lineHeight: '29px', fontWeight: '600' }],
        'sr-body': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'sr-body-bold': ['18px', { lineHeight: '1.6', fontWeight: '600' }],
        'sr-label': ['17px', { lineHeight: '1.5', fontWeight: '500' }],
        'sr-input': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'sr-button-lg': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'sr-button-xl': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'sr-help': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'sr-metadata': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      colors: {
        // ─── shadcn HSL semantic (globals.css에서 정의, v0.2 색에 매핑) ───
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          subtle: 'hsl(var(--success-subtle))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          subtle: 'hsl(var(--warning-subtle))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          subtle: 'hsl(var(--info-subtle))',
        },
        escrow: {
          DEFAULT: 'hsl(var(--escrow))',
          foreground: 'hsl(var(--escrow-foreground))',
          subtle: 'hsl(var(--escrow-subtle))',
        },

        // ─── RootMatch v0.2 brand (canonical) ───
        'root-navy': {
          DEFAULT: '#0F2537',
          hover: '#1a3a52',
          active: '#051625',
          soft: '#E5EAEF', // very light tint (subtle bg)
          subtle: '#C5D0DC',
          foreground: '#FFFFFF',
        },
        'match-teal': {
          DEFAULT: '#0E8A8A',
          hover: '#0A6F6F',
          active: '#075A5A',
          soft: '#E0F2F2', // accent bg (링크 hover, badge bg)
          subtle: '#B5DDDD',
          foreground: '#FFFFFF',
        },
        'root-green': {
          DEFAULT: '#4EAF50',
          hover: '#3D8C3F',
          active: '#2F6B30',
          soft: '#E8F5E9', // verification bg
          subtle: '#C8E6C9',
          foreground: '#FFFFFF',
        },
        'factory-sand': {
          DEFAULT: '#F5F1EA', // hero/section bg
          soft: '#FAF7F2',
          deep: '#EBE6DC',
        },
        'iron-black': '#111827',
        'steel-gray': '#6B7280',
        'line-gray': '#D1D5DB',

        // ─── Brand alias (BC: 기존 `.bg-brand` 호환, v0.2 root-navy 매핑) ───
        brand: {
          DEFAULT: '#0F2537', // v0.2 root-navy (was #3182f6 toss-blue-500)
          hover: '#1a3a52',
          active: '#051625',
          light: '#E5EAEF', // light tint (was #e8f3ff)
          subtle: '#C5D0DC',
        },

        // ─── Toss/cointoss neutrals (보존, v0.2와 호환) ───
        ink: {
          950: '#191f28',
          900: '#191f28',
          800: '#333d4b',
          700: '#4e5968',
          600: '#6b7684',
          500: '#8b95a1',
          400: '#b0b8c1',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f2f4f6',
          subtle: '#f9fafb',
          warm: '#f8fafc',
          sand: '#F5F1EA', // v0.2 factory-sand alias
        },
        line: {
          DEFAULT: '#e5e8eb',
          subtle: '#f2f4f6',
          strong: '#D1D5DB', // v0.2 line-gray
        },
        'success-bg': '#f0faf6',
        'warning-bg': '#fff9e7',
        'warning-text': '#dd7d02',
        danger: {
          DEFAULT: '#DC2626', // v0.2 error (was #f04452)
          subtle: '#FCA5A5',
          bg: '#FEE2E2',
        },
        'danger-bg': '#FEE2E2',

        // ─── Toss palette (DEPRECATED v0.2 since 2026-06-04) ───
        // @deprecated New code MUST use root-navy/match-teal/root-green/iron-black 등 v0.2 tokens.
        toss: {
          blue: {
            50: '#e8f3ff',
            100: '#c9e2ff',
            200: '#90c2ff',
            300: '#64a8ff',
            400: '#4593fc',
            500: '#3182f6',
            600: '#2272eb',
            700: '#1b64da',
            800: '#1957c2',
            900: '#194aa6',
          },
          grey: {
            50: '#f9fafb',
            100: '#f2f4f6',
            200: '#e5e8eb',
            300: '#d1d6db',
            400: '#b0b8c1',
            500: '#8b95a1',
            600: '#6b7684',
            700: '#4e5968',
            800: '#333d4b',
            900: '#191f28',
          },
          red: {
            50: '#ffeeee',
            100: '#ffd4d6',
            200: '#feafb4',
            300: '#fb8890',
            400: '#f66570',
            500: '#f04452',
            600: '#e42939',
            700: '#d22030',
            800: '#bc1b2a',
            900: '#a51926',
          },
          green: {
            50: '#f0faf6',
            100: '#aeefd5',
            200: '#76e4b8',
            300: '#3fd599',
            400: '#15c47e',
            500: '#03b26c',
            600: '#02a262',
            700: '#029359',
            800: '#028450',
            900: '#027648',
          },
          yellow: {
            50: '#fff9e7',
            100: '#ffefbf',
            200: '#ffe69b',
            300: '#ffdd78',
            400: '#ffd158',
            500: '#ffc342',
            600: '#ffb331',
            700: '#faa131',
            800: '#ee8f11',
            900: '#dd7d02',
          },
        },
      },
      borderRadius: {
        // v0.2 radius scale (--radius = 14px = v0.2 lg)
        sm: 'calc(var(--radius) - 8px)', // 6px  (v0.2 sm — tags, small badges)
        md: 'calc(var(--radius) - 4px)', // 10px (v0.2 md — inputs, dropdowns)
        lg: 'var(--radius)', // 14px (v0.2 lg — default cards)
        xl: 'calc(var(--radius) + 4px)', // 18px (v0.2 xl — mobile cards, modals)
        '2xl': 'calc(var(--radius) + 8px)', // 22px
        pill: '9999px',
      },
      minHeight: {
        // v0.2 touch sizes (senior-friendly)
        'tap-min': '48px', // v0.2 minimum hit area (was 44px)
        'tap-secondary': '52px', // v0.2 secondary button (rec)
        'tap-primary': '56px', // v0.2 primary button (rec, was 52px)
        'tap-critical': '60px', // 계약·안심결제 등 critical
      },
      maxWidth: {
        'chat-content': '820px',
        'compact-col': '440px',
      },
      boxShadow: {
        // Toss precision shadows (보존) — v0.2 navy 기반으로 톤 조정
        'toss-sm': '0 1px 2px 0 rgba(15, 37, 55, 0.04)',
        'toss-md': '0 2px 8px 0 rgba(15, 37, 55, 0.06)',
        'toss-lg': '0 8px 24px 0 rgba(15, 37, 55, 0.08)',
        'ct-soft': '0 1px 2px rgba(17, 24, 39, 0.04)',
        'ct-lift': '0 4px 12px rgba(17, 24, 39, 0.06)',
        'ct-card': '0 2px 8px rgba(15, 37, 55, 0.06)',
        'ct-modal': '0 24px 70px rgba(15, 23, 42, 0.22)',
        'ct-popover': '0 20px 52px rgba(15, 23, 42, 0.16)',
        'focus-brand': '0 0 0 3px #0F2537, 0 0 0 5px #ffffff', // v0.2 root-navy
        // v0.2-specific elevations
        'rm-card': '0 1px 3px rgba(15, 37, 55, 0.06), 0 1px 2px rgba(15, 37, 55, 0.04)',
        'rm-floating': '0 10px 30px rgba(15, 37, 55, 0.12)',
      },
      spacing: {
        // v0.2 section/page spacing alias (Tailwind 8pt scale와 호환)
        'rm-section': '32px', // 주요 블록 간격
        'rm-page': '48px', // 랜딩·hero 간격
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
