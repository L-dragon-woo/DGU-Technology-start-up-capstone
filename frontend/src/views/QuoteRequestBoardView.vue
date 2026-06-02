<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Factory,
  FileText,
  Package,
  Search,
  SlidersHorizontal,
  Wallet
} from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import { mockReceivedQuoteRequests } from '@/data/requestData'

const keyword = ref('')
const processFilter = ref('all')
const statusFilter = ref('all')

const processOptions = computed(() => {
  const processes = mockReceivedQuoteRequests.map((request) => request.processType)
  return ['all', ...Array.from(new Set(processes))]
})

const filteredRequests = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return mockReceivedQuoteRequests.filter((request) => {
    const searchableText = [
      request.projectName,
      request.clientName,
      request.productItem,
      request.processType,
      request.description
    ]
      .join(' ')
      .toLowerCase()

    const matchesKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword)
    const matchesProcess = processFilter.value === 'all' || request.processType === processFilter.value
    const matchesStatus = statusFilter.value === 'all' || request.status === statusFilter.value

    return matchesKeyword && matchesProcess && matchesStatus
  })
})

function getStatusLabel(status: string) {
  if (status === 'new') return '모집 중'
  if (status === 'reviewing') return '검토 중'
  return '견적 도착'
}

function getStatusVariant(status: string): 'blue' | 'green' | 'amber' | 'slate' {
  if (status === 'new') return 'blue'
  if (status === 'reviewing') return 'amber'
  return 'green'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <div>
            <AppBadge variant="blue">
              <Factory class="h-4 w-4" />
              공개 견적 모집
            </AppBadge>
            <h1 class="mt-4 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              견적 요청 게시판
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              여러 회사가 등록한 견적 모집글을 한눈에 확인하고, 조건에 맞는 요청에 견적을 제안할 수 있습니다.
            </p>
          </div>
        </div>
      </header>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_240px_180px]">
          <label class="relative block">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="keyword"
              type="search"
              placeholder="프로젝트명, 회사명, 품목, 공정으로 검색"
              class="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label class="relative block">
            <SlidersHorizontal class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              v-model="processFilter"
              class="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">전체 공정</option>
              <option v-for="process in processOptions.filter((item) => item !== 'all')" :key="process" :value="process">
                {{ process }}
              </option>
            </select>
          </label>

          <label class="relative block">
            <select
              v-model="statusFilter"
              class="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">전체 상태</option>
              <option value="new">모집 중</option>
              <option value="reviewing">검토 중</option>
              <option value="quoted">견적 도착</option>
            </select>
          </label>
        </div>
      </section>

      <main class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <article
          v-for="request in filteredRequests"
          :key="request.id"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <AppBadge :variant="getStatusVariant(request.status)">
                  {{ getStatusLabel(request.status) }}
                </AppBadge>
                <span class="text-sm font-semibold text-slate-500">{{ request.requestedAt }}</span>
              </div>
              <h2 class="text-2xl font-bold text-slate-950">{{ request.projectName }}</h2>
              <p class="mt-2 flex items-center gap-2 text-base font-semibold text-slate-600">
                <Building2 class="h-4 w-4 text-slate-400" />
                {{ request.clientName }}
              </p>
            </div>

            <RouterLink
              :to="`/factory/requests/${request.id}`"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              상세 보기
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <p class="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
            {{ request.description }}
          </p>

          <dl class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Package class="h-4 w-4" />
                품목 / 공정
              </dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.productItem }}</dd>
              <dd class="mt-1 text-sm text-slate-500">{{ request.processType }}</dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Wallet class="h-4 w-4" />
                예산 / 수량
              </dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.budgetRange }}</dd>
              <dd class="mt-1 text-sm text-slate-500">{{ request.quantity }}</dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CalendarDays class="h-4 w-4" />
                희망 납기
              </dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.desiredDeadline }}</dd>
            </div>

            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <FileText class="h-4 w-4" />
                첨부 자료
              </dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.attachments.length }}개</dd>
            </div>
          </dl>
        </article>

        <div
          v-if="filteredRequests.length === 0"
          class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm xl:col-span-2"
        >
          <Factory class="mx-auto h-12 w-12 text-slate-300" />
          <p class="mt-4 text-lg font-semibold text-slate-700">조건에 맞는 견적 모집글이 없습니다.</p>
        </div>
      </main>
    </div>
  </div>
</template>
