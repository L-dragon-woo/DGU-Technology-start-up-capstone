<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, FileText, Inbox, Search, Send, SlidersHorizontal } from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import { mockReceivedQuoteRequests } from '@/data/requestData'

const router = useRouter()
const keyword = ref('')
const statusFilter = ref('all')

const filteredRequests = computed(() => {
  return mockReceivedQuoteRequests.filter((request) => {
    const matchesKeyword = `${request.projectName} ${request.clientName} ${request.productItem}`
      .toLowerCase()
      .includes(keyword.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || request.status === statusFilter.value

    return matchesKeyword && matchesStatus
  })
})

function getStatusLabel(status: string) {
  if (status === 'new') return '신규 요청'
  if (status === 'reviewing') return '검토 중'
  return '견적 제출'
}

function getStatusVariant(status: string): 'blue' | 'green' | 'amber' | 'slate' {
  if (status === 'new') return 'blue'
  if (status === 'reviewing') return 'amber'
  return 'green'
}

function openRequest(id: string) {
  router.push(`/factory/requests/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <AppBadge variant="blue">
          <Inbox class="h-4 w-4" />
          공장 수신함
        </AppBadge>
        <h1 class="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">받은 견적 요청</h1>
        <p class="mt-3 text-lg text-slate-600">발주처가 보낸 요청을 검토하고 견적을 제출하세요.</p>
      </header>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <label class="relative block">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="keyword"
              type="search"
              placeholder="프로젝트명, 발주처, 품목으로 검색"
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
              <option value="new">신규 요청</option>
              <option value="reviewing">검토 중</option>
              <option value="quoted">견적 제출</option>
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
              <p class="mt-2 text-base text-slate-600">{{ request.clientName }} · {{ request.productItem }}</p>
            </div>
            <AppButton type="button" @click="openRequest(request.id)">
              <Send class="h-4 w-4" />
              요청 검토하기
            </AppButton>
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
          <Inbox class="mx-auto h-12 w-12 text-slate-300" />
          <p class="mt-4 text-lg font-semibold text-slate-700">조건에 맞는 요청이 없습니다.</p>
        </div>
      </main>
    </div>
  </div>
</template>
