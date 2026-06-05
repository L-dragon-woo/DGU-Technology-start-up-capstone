import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { AppProviders } from '@/state/AppProviders'
import './globals.css'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
})

export const metadata: Metadata = {
  title: {
    default: 'RootMatch — 뿌리산업 B2B 수주 매칭·안심 계약',
    template: '%s | RootMatch',
  },
  description:
    '영세 뿌리산업 제조 공장과 발주 기업을 잇는 매칭·검증·안심결제 플랫폼. 6대 공정 발주부터 계약·정산까지.',
  applicationName: 'RootMatch',
  keywords: [
    '뿌리산업',
    '제조 매칭',
    'B2B 수주',
    '안심결제',
    '에스크로',
    '전자계약',
    '공장 검증',
    '견적 비교',
  ],
}

export const viewport: Viewport = {
  themeColor: '#0F2537',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
