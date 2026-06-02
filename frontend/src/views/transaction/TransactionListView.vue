<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CalendarClock, CheckCircle, Clock, PackageCheck, PencilLine, ShieldCheck, Truck } from 'lucide-vue-next'
import { transactionCases, transactionStatusStyles } from '@/data/transactionData'

const activeRole = ref<'all' | 'client' | 'factory'>('all')

const filteredTransactions = computed(() => {
  if (activeRole.value === 'all') return transactionCases
  return transactionCases.filter((item) => item.myRole === activeRole.value)
})

const activeTransactions = computed(() => filteredTransactions.value.filter((item) => item.statusKey !== 'completed'))
const inspectionTransactions = computed(() => filteredTransactions.value.filter((item) => item.statusKey === 'inspection'))
const delayedTransactions = computed(() => filteredTransactions.value.filter((item) => item.statusKey === 'delayed'))

function getRoleLabel(role: 'client' | 'factory') {
  return role === 'client' ? '내가 요청한 거래' : '내가 맡은 제작'
}

function getDetailPath(id: string, role: 'client' | 'factory') {
  return role === 'factory' ? `/transactions/${id}?mode=factory` : `/transactions/${id}`
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div class="p-6 sm:p-8">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck class="h-4 w-4" />
              거래 진행 관리
            </div>
            <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">진행 중인 거래</h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              계약 이후 제작, 납품, 검수 단계에 있는 거래를 한 곳에서 확인합니다.
            </p>
          </div>
        </div>
      </header>

      <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeRole === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'"
            @click="activeRole = 'all'"
          >
            전체 거래 {{ transactionCases.length }}
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeRole === 'client' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'"
            @click="activeRole = 'client'"
          >
            내가 요청한 거래 {{ transactionCases.filter((item) => item.myRole === 'client').length }}
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeRole === 'factory' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'"
            @click="activeRole = 'factory'"
          >
            내가 맡은 제작 {{ transactionCases.filter((item) => item.myRole === 'factory').length }}
          </button>
        </div>
      </section>

      <section class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <Truck class="h-6 w-6 text-blue-600" />
            <span class="text-sm font-semibold text-slate-500">진행 중</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ activeTransactions.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <PackageCheck class="h-6 w-6 text-amber-600" />
            <span class="text-sm font-semibold text-slate-500">검수 대기</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ inspectionTransactions.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <Clock class="h-6 w-6 text-red-600" />
            <span class="text-sm font-semibold text-slate-500">지연 주의</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ delayedTransactions.length }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <article
          v-for="item in filteredTransactions"
          :key="item.id"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
        >
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-bold text-slate-500">{{ item.id }}</span>
                <span class="rounded-full px-3 py-1 text-xs font-bold ring-1" :class="transactionStatusStyles[item.statusKey]">
                  {{ item.status }}
                </span>
                <span
                  class="rounded-full px-3 py-1 text-xs font-bold ring-1"
                  :class="item.myRole === 'client' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-indigo-50 text-indigo-700 ring-indigo-100'"
                >
                  {{ getRoleLabel(item.myRole) }}
                </span>
              </div>

              <h2 class="mt-3 text-xl font-bold text-slate-950">{{ item.projectName }}</h2>
              <p class="mt-2 text-base text-slate-600">{{ item.factory }} · {{ item.amount }}</p>

              <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <CalendarClock class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">납기</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.dueDate }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <CheckCircle class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">다음 조치</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.nextAction }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Clock class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">최근 업데이트</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.updatedAt }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <div class="mb-2 flex items-center justify-between text-sm">
                  <span class="font-semibold text-slate-600">진행률</span>
                  <span class="font-bold text-slate-950">{{ item.progressRate }}%</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-blue-600" :style="{ width: `${item.progressRate}%` }" />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <RouterLink
                :to="getDetailPath(item.id, item.myRole)"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {{ item.myRole === 'client' ? '진행 확인' : '상세 보기' }}
                <ArrowRight class="h-4 w-4" />
              </RouterLink>
              <RouterLink
                v-if="item.myRole === 'factory'"
                :to="`/transactions/${item.id}?mode=factory`"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <PencilLine class="h-4 w-4" />
                진행 업데이트
              </RouterLink>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
