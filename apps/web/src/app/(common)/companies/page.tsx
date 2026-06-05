'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Building2, Heart, Search } from 'lucide-react'
import { AppBadge } from '@/components/ui/AppBadge'
import { AppButton } from '@/components/ui/AppButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { companySizes, industries, regions } from '@/data/companies'
import {
  useCompaniesDispatch,
  useCompaniesFiltered,
  useCompaniesState,
} from '@/state/CompaniesContext'

export default function CompaniesPage() {
  return (
    <Suspense fallback={<CompaniesPageShell />}>
      <CompaniesPageContent />
    </Suspense>
  )
}

function CompaniesPageShell() {
  return (
    <div className="bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 space-y-3">
          <AppBadge variant="blue">
            <Building2 className="h-4 w-4" />
            기업 디렉토리
          </AppBadge>
          <Skeleton className="h-10 w-2/5" />
          <Skeleton className="h-5 w-3/5" />
        </header>

        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_180px_auto]">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 w-28 rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-pill" />
                  <Skeleton className="h-6 w-20 rounded-pill" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompaniesPageContent() {
  const searchParams = useSearchParams()
  const { filter, favorites } = useCompaniesState()
  const dispatch = useCompaniesDispatch()
  const filteredCompanies = useCompaniesFiltered()

  useEffect(() => {
    const keywordFromQuery = searchParams.get('keyword')
    if (!keywordFromQuery) return

    dispatch({ type: 'companies/setFilter', payload: { keyword: keywordFromQuery } })
  }, [dispatch, searchParams])

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <AppBadge variant="blue">
            <Building2 className="h-4 w-4" />
            기업 디렉토리
          </AppBadge>
          <h1 className="text-kr-keep mt-5 text-[clamp(1.5rem,1.3rem+1vw,2rem)] font-bold text-foreground">
            기업 디렉토리
          </h1>
          <p className="text-kr-pretty mt-3 text-base leading-8 text-muted-foreground sm:text-lg">
            조건에 맞는 기업을 찾아 협업을 시작하세요.
          </p>
        </header>

        <Card className="mb-6 border-border bg-card shadow-ct-soft">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_180px_auto]">
              <label className="relative block">
                <span className="sr-only">키워드 검색</span>
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={filter.keyword}
                  onChange={(event) =>
                    dispatch({
                      type: 'companies/setFilter',
                      payload: { keyword: event.target.value },
                    })
                  }
                  placeholder="기업명, 설명, 태그로 검색"
                  className="h-12 rounded-xl bg-card pl-12 text-base"
                />
              </label>

              <label className="block">
                <span className="sr-only">업종</span>
                <Select
                  value={filter.industry || 'all'}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'companies/setFilter',
                      payload: { industry: value === 'all' ? '' : value },
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl bg-card text-base">
                    <SelectValue placeholder="전체 업종" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 업종</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="block">
                <span className="sr-only">지역</span>
                <Select
                  value={filter.region || 'all'}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'companies/setFilter',
                      payload: { region: value === 'all' ? '' : value },
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl bg-card text-base">
                    <SelectValue placeholder="전체 지역" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="block">
                <span className="sr-only">규모</span>
                <Select
                  value={filter.size || 'all'}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'companies/setFilter',
                      payload: { size: value === 'all' ? '' : value },
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl bg-card text-base">
                    <SelectValue placeholder="전체 규모" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 규모</SelectItem>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <AppButton
                variant="secondary"
                className="h-12 whitespace-nowrap"
                onClick={() => dispatch({ type: 'companies/clearFilter' })}
              >
                초기화
              </AppButton>
            </div>
          </CardContent>
        </Card>

        <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const isFavorite = favorites.includes(company.id)

            return (
              <Card
                key={company.id}
                className="border-border bg-card shadow-ct-soft transition hover:border-brand-light hover:shadow-ct-card"
              >
                <CardHeader className="p-4 pb-0 sm:p-5 sm:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="slate" className="text-kr-keep">
                          {company.industry}
                        </Badge>
                        <Badge variant="slate" className="text-kr-keep">
                          {company.region}
                        </Badge>
                      </div>
                      <CardTitle className="text-kr-pretty text-[15px] font-bold leading-6 text-foreground sm:text-[16px]">
                        {company.name}
                      </CardTitle>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={isFavorite ? '관심 기업 해제' : '관심 기업 추가'}
                      onClick={() =>
                        dispatch({ type: 'companies/toggleFavorite', payload: company.id })
                      }
                      className="shrink-0 rounded-xl"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite ? 'fill-danger text-danger' : 'text-ink-400'
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                  <p className="text-kr-pretty line-clamp-3 text-[15px] leading-6 text-muted-foreground">
                    {company.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.tags.map((tag) => (
                      <Badge key={tag} variant="info" size="sm" className="text-kr-keep">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-kr-keep text-[15px] font-semibold text-muted-foreground">
                      직원 {company.employeeCount.toLocaleString('ko-KR')}명 · 매출{' '}
                      {company.revenue}
                    </p>
                    <Link
                      href={`/companies/${company.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-hover"
                    >
                      상세
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredCompanies.length === 0 && (
            <Card className="border-border bg-card p-12 text-center shadow-ct-soft sm:col-span-2 lg:col-span-3">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-kr-pretty mt-4 text-lg font-semibold text-muted-foreground">
                조건에 맞는 기업이 없습니다.
              </p>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
