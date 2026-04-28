# RootMatching Design System

RootMatching은 뿌리산업 B2B 거래를 다루는 업무형 플랫폼입니다. 화면은 신뢰감, 안정감, 명확한 진행 상태를 중심으로 설계합니다.

## Design Principles

- **Trust First**: 계약, 결제, 분쟁, 정산처럼 민감한 흐름은 차분한 블루와 명확한 상태 표시를 사용합니다.
- **Operational Clarity**: 사용자가 다음 행동을 바로 알 수 있도록 CTA, 진행 단계, 상태 배지를 가까이 배치합니다.
- **Large Form UX**: 고령 공장주도 쉽게 입력할 수 있도록 입력 영역은 크게, 라벨은 명확하게 유지합니다.
- **Responsive by Default**: 데스크톱은 2컬럼 업무 화면, 모바일은 단일 컬럼으로 자연스럽게 전환합니다.

## Color Tokens

### Primary

| Token | Value | Usage |
| --- | --- | --- |
| `--primary` | `#2563eb` | Primary CTA, active nav, key icons |
| `--primary-hover` | `#1d4ed8` | Primary CTA hover |
| `--primary-light` | `#dbeafe` | Active background, info badge, focus ring |

### Neutral

| Token | Value | Usage |
| --- | --- | --- |
| `--background` | `#f8fafc` | App page background |
| `--surface` | `#ffffff` | Cards, panels, forms |
| `--border` | `#e2e8f0` | Default border |
| `--border-light` | `#f1f5f9` | Dividers, subtle sections |
| `--text-primary` | `#0f172a` | Main heading/body emphasis |
| `--text-secondary` | `#475569` | Body copy |
| `--text-muted` | `#94a3b8` | Metadata, placeholders |

### Semantic

| Token | Value | Usage |
| --- | --- | --- |
| `--success` | `#10b981` | 완료, 검수 승인, 재거래 |
| `--warning` | `#f59e0b` | 검토 중, 주의 |
| `--error` | `#ef4444` | 삭제, 위험, 분쟁 |

## Typography

- Font family: `Noto Sans KR`, system sans-serif
- Page title: `text-3xl sm:text-4xl`, `font-bold`, `text-slate-950`
- Section title: `text-2xl`, `font-bold`, `text-slate-950`
- Card title: `text-lg` or `text-xl`, `font-bold`
- Body: `text-base`, `text-slate-600`
- Metadata: `text-sm`, `text-slate-500`
- Button: `font-semibold` or `font-bold`

Do not use negative letter spacing. Keep Korean labels compact and readable.

## Spacing & Radius

| Token | Value | Usage |
| --- | --- | --- |
| `--sidebar-width` | `260px` | Desktop sidebar |
| `--header-height` | `64px` | App header |
| `--radius-sm` | `6px` | Small controls |
| `--radius-md` | `8px` | Buttons, inputs |
| `--radius-lg` | `12px` | Cards, panels |

Common layout:

- Page padding: `px-4 py-8 sm:px-6 lg:px-8`
- Max width: `max-w-7xl` for main app pages
- Section/card padding: `p-5 sm:p-7` or `p-6 sm:p-8`
- Grid gap: `gap-6` to `gap-8`

## Layout Patterns

### App Shell

- `AppSidebar`: fixed desktop sidebar
- `AppHeader`: sticky top header
- `AppLayout`: wraps all authenticated/workflow pages
- Landing and role selection use `meta.layout = 'none'`

### Two Column Workflow

Use for forms and review flows:

```html
<div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
  <main>...</main>
  <aside class="lg:sticky lg:top-8 lg:self-start">...</aside>
</div>
```

### Full Width Workflow

Use for list/search screens:

```html
<div class="mx-auto max-w-7xl">
  <header>...</header>
  <section>filters</section>
  <main>list</main>
</div>
```

## Components

### AppButton

File: `src/components/common/AppButton.vue`

Variants:

- `primary`: main action
- `secondary`: alternate action
- `danger`: destructive action

Sizes:

- `md`: default compact button
- `lg`: primary workflow CTA

Usage:

```vue
<AppButton type="submit" size="lg" full-width>
  저장하기
</AppButton>
```

### AppBadge

File: `src/components/common/AppBadge.vue`

Variants:

- `blue`: default status/info
- `green`: success/complete
- `amber`: reviewing/warning
- `slate`: neutral metadata

Usage:

```vue
<AppBadge variant="green">거래 완료</AppBadge>
```

### ProcessStepper

File: `src/components/common/ProcessStepper.vue`

Use for contract, transaction, dispute, request handling progress.

- Uses auto-fit grid: adapts to narrow side panels and wide content sections.
- Current step uses blue fill.
- Future steps use muted slate background.

Usage:

```vue
<ProcessStepper :steps="steps" :current-step="3" />
```

## Form System

Input style:

```html
class="h-14 w-full rounded-xl border border-slate-300 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
```

Textarea style:

```html
class="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
```

Guidelines:

- Labels are always visible.
- Required fields use red asterisk.
- Use `text-lg` and `h-14` for primary workflow forms.
- Use 2-column grids on desktop, 1-column on mobile.
- File uploads use dashed border and clear accepted file context.

## Card System

Default card:

```html
class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
```

Compact data cell:

```html
class="rounded-xl bg-slate-50 p-4"
```

Interactive list card:

```html
class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
```

## Navigation

Primary app routes:

- `/dashboard`
- `/client/request`
- `/client/matching`
- `/factory/onboarding`
- `/factory/requests`
- `/factory/requests/:id`
- `/factories/:id`
- `/contract`
- `/transaction/progress`
- `/transaction/review`
- `/disputes/mediation`

Sidebar active state:

- Active background: `--primary-light`
- Active text/icon: `--primary`

## Workflow Patterns

### Client Request Flow

`/client/request` → `/client/matching` → `/factories/:id` or `/contract`

### Factory Received Request Flow

`/factory/requests` → `/factory/requests/:id` → `/contract`

### Contract & Transaction Flow

`/contract` → `/transaction/progress` → `/transaction/review` → `/dashboard`

Problem branch:

`/transaction/progress` → `/disputes/mediation` → `/transaction/review`

## Responsive Rules

- Main forms: `grid-cols-1 sm:grid-cols-2`
- Page shell side panels: `grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]`
- Stepper: auto-fit grid with `minmax(220px, 1fr)`
- Tables should be avoided for mobile-critical flows; use cards.
- Header/sidebar remains desktop oriented; mobile sidebar behavior exists but needs a menu trigger if full mobile nav is required.

## Icon Usage

Use `lucide-vue-next`.

Common mapping:

- Request: `FileText`, `Inbox`, `Send`
- Factory: `Factory`
- Contract: `FileSignature`, `ShieldCheck`, `CreditCard`
- Transaction: `PackageCheck`, `Truck`, `ClipboardCheck`
- Dispute: `AlertTriangle`, `Handshake`
- Success: `CheckCircle`

## Tone

Use direct, reassuring Korean labels:

- Good: `검수 승인하고 리뷰 작성`
- Good: `문제 발생, 중재 신청`
- Good: `견적 제출하고 계약으로 이동`
- Avoid vague labels like `확인`, `다음`, `처리`

## Current Brand Direction

- Primary color: blue
- Surface-heavy B2B SaaS style
- Avoid decorative gradients except controlled hero/CTA sections
- Avoid orange as primary brand color
- Status colors should remain semantic and limited
