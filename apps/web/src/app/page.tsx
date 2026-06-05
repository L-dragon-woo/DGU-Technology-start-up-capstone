import Link from 'next/link'
import { ArrowRight, CheckCircle2, Factory } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-x-0 top-8 -z-10 mx-auto h-80 max-w-5xl rounded-full bg-accent blur-3xl sm:top-12 lg:top-16" />
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
          <div className="space-y-6 text-center sm:space-y-8 lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Logo variant="primary" size="lg" priority />
            </div>
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-kr-balance text-[clamp(2rem,1.35rem+3.4vw,4.25rem)] font-bold leading-[1.12] tracking-tight text-foreground">
                뿌리산업 B2B 수주를 한곳에서 매칭합니다
              </h1>
              <p className="text-kr-pretty mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-[18px] lg:mx-0">
                6대 뿌리공정(금형, 소성가공, 주조, 용접, 표면처리, 열처리)을 다루는 공장과 발주처를
                빠르고 명확하게 연결하는 플랫폼입니다.
              </p>
            </div>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button asChild size="xl" className="shadow-toss-md">
                <Link href="/quotes">
                  <Factory className="h-5 w-5" />
                  견적 모집 게시판 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/request">견적 요청하기</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border bg-card shadow-ct-soft transition-shadow hover:shadow-ct-card">
            <CardContent className="space-y-5 p-4 sm:p-6">
              <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-toss-md sm:p-6">
                <p className="text-kr-keep text-[15px] font-semibold opacity-90">
                  오늘의 매칭 흐름
                </p>
                <p className="mt-3 text-[32px] font-bold leading-none sm:text-[40px]">3단계</p>
                <p className="text-kr-pretty mt-3 text-[15px] leading-7 opacity-90">
                  견적 요청 등록 → 공장 추천 → 거래 진행
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {['공정별 조건 정리', '공장 견적 기회 확인', '진행 상태 한눈에 보기'].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-kr-keep text-[15px] font-semibold text-foreground">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
