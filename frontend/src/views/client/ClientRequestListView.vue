<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Clock, FileText, Search, SlidersHorizontal, Sparkles } from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import { mockReceivedQuoteRequests } from '@/data/requestData'

const keyword = ref('')
const statusFilter = ref('all')

const filteredRequests = computed(() => {
  return mockReceivedQuoteRequests.filter((request) => {
    const searchableText = `${request.projectName} ${request.productItem} ${request.processType}`.toLowerCase()
    const matchesKeyword = searchableText.includes(keyword.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || request.status === statusFilter.value

    return matchesKeyword && matchesStatus
  })
})

function getStatusLabel(status: string) {
  if (status === 'new') return '공장 검토 전'
  if (status === 'reviewing') return '공장 검토 중'
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
      <header class="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles class="h-4 w-4" />
              견적 요청 관리
            </div>
            <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">내 견적 요청 내역</h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              내가 등록한 견적 요청의 검토 상태, 요청 조건, 첨부 자료를 한 곳에서 확인합니다.
            </p>
          </div>

        </div>
      </header>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <label class="relative block">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="keyword"
              type="search"
              placeholder="프로젝트명, 품목, 공정으로 검색"
              class="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label class="relative block">
            <SlidersHorizontal class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              v-model="statusFilter"
              class="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">전체 상태</option>
              <option value="new">공장 검토 전</option>
              <option value="reviewing">공장 검토 중</option>
              <option value="quoted">견적 도착</option>
            </select>
          </label>
        </div>
      </section>

      <main class="grid grid-cols-1 gap-5">
        <article
          v-for="request in filteredRequests"
          :key="request.id"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <AppBadge :variant="getStatusVariant(request.status)">{{ getStatusLabel(request.status) }}</AppBadge>
                <span class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <Clock class="h-4 w-4" />
                  {{ request.requestedAt }}
                </span>
              </div>
              <h2 class="text-2xl font-bold text-slate-950">{{ request.projectName }}</h2>
              <p class="mt-2 text-base text-slate-600">{{ request.productItem }}</p>
            </div>

            <RouterLink
              :to="`/client/requests/${request.id}`"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {{ request.status === 'quoted' ? '매칭 결과 보기' : '요청 수정' }}
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <dl class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-semibold text-slate-500">공정</dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.processType }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-semibold text-slate-500">수량</dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.quantity }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-semibold text-slate-500">예산</dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.budgetRange }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <dt class="text-sm font-semibold text-slate-500">희망 납기</dt>
              <dd class="mt-1 font-bold text-slate-950">{{ request.desiredDeadline }}</dd>
            </div>
          </dl>

          <div class="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <FileText class="h-4 w-4" />
            첨부 자료 {{ request.attachments.length }}개
          </div>
        </article>

        <div v-if="filteredRequests.length === 0" class="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Sparkles class="mx-auto h-12 w-12 text-slate-300" />
          <p class="mt-4 text-lg font-semibold text-slate-700">조건에 맞는 견적 요청이 없습니다.</p>
        </div>
      </main>
    </div>
  </div>
</template>
