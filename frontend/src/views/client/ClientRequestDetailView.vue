<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Package,
  Sparkles,
  Wallet
} from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import { mockFactoryRecommendations } from '@/data/factoryData'
import { mockReceivedQuoteRequests } from '@/data/requestData'

const route = useRoute()
const requestId = computed(() => String(route.params.id ?? ''))
const request = computed(() => mockReceivedQuoteRequests.find((item) => item.id === requestId.value))
const matchedFactories = computed(() => (request.value?.status === 'quoted' ? mockFactoryRecommendations.slice(0, 3) : []))

function getStatusLabel(status: string) {
  if (status === 'new') return '공장 검토 대기'
  if (status === 'reviewing') return '공장 검토 중'
  return '견적 도착'
}

function getStatusVariant(status: string): 'blue' | 'green' | 'amber' | 'slate' {
  if (status === 'new') return 'blue'
  if (status === 'reviewing') return 'amber'
  return 'green'
}

function formatPrice(value: number) {
  return `${value}만원`
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <main class="mx-auto max-w-6xl">
      <RouterLink
        to="/client/requests"
        class="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
      >
        <ArrowLeft class="h-4 w-4" />
        견적 요청 내역
      </RouterLink>

      <section v-if="request" class="space-y-6">
        <header class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="mb-4 flex flex-wrap items-center gap-2">
                <AppBadge :variant="getStatusVariant(request.status)">
                  {{ getStatusLabel(request.status) }}
                </AppBadge>
                <span class="text-sm font-semibold text-slate-500">{{ request.id }}</span>
              </div>
              <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                {{ request.projectName }}
              </h1>
              <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {{ request.description }}
              </p>
            </div>

            <RouterLink
              to="/client/request"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              요청 수정
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>
        </header>

        <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package class="h-5 w-5" />
            </div>
            <p class="text-sm font-semibold text-slate-500">품목 / 공정</p>
            <p class="mt-2 font-bold text-slate-950">{{ request.productItem }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ request.processType }}</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 class="h-5 w-5" />
            </div>
            <p class="text-sm font-semibold text-slate-500">예상 수량</p>
            <p class="mt-2 font-bold text-slate-950">{{ request.quantity }}</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wallet class="h-5 w-5" />
            </div>
            <p class="text-sm font-semibold text-slate-500">예산 범위</p>
            <p class="mt-2 font-bold text-slate-950">{{ request.budgetRange }}</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CalendarDays class="h-5 w-5" />
            </div>
            <p class="text-sm font-semibold text-slate-500">희망 납기</p>
            <p class="mt-2 font-bold text-slate-950">{{ request.desiredDeadline }}</p>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-950">요청 상세 정보</h2>
            <dl class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-semibold text-slate-500">요청 기업</dt>
                <dd class="mt-1 font-bold text-slate-950">{{ request.clientName }}</dd>
              </div>
              <div>
                <dt class="text-sm font-semibold text-slate-500">요청일</dt>
                <dd class="mt-1 font-bold text-slate-950">{{ request.requestedAt }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-semibold text-slate-500">첨부 자료</dt>
                <dd class="mt-3 space-y-2">
                  <a
                    v-for="attachment in request.attachments"
                    :key="attachment.id"
                    :href="attachment.url"
                    class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span class="inline-flex items-center gap-2">
                      <FileText class="h-4 w-4" />
                      {{ attachment.name }}
                    </span>
                    <span class="text-xs text-slate-400">{{ Math.round(attachment.size / 1000).toLocaleString() }}KB</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <aside class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-950">진행 상태</h2>
            <ol class="mt-5 space-y-4">
              <li class="flex gap-3">
                <CheckCircle2 class="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p class="font-bold text-slate-950">요청 등록 완료</p>
                  <p class="text-sm text-slate-500">등록 조건과 첨부 자료가 저장되었습니다.</p>
                </div>
              </li>
              <li class="flex gap-3">
                <Clock
                  class="mt-0.5 h-5 w-5"
                  :class="request.status === 'new' ? 'text-slate-300' : 'text-amber-500'"
                />
                <div>
                  <p class="font-bold text-slate-950">공장 검토</p>
                  <p class="text-sm text-slate-500">조건에 맞는 공장이 요청서를 확인합니다.</p>
                </div>
              </li>
              <li class="flex gap-3">
                <Sparkles
                  class="mt-0.5 h-5 w-5"
                  :class="request.status === 'quoted' ? 'text-blue-600' : 'text-slate-300'"
                />
                <div>
                  <p class="font-bold text-slate-950">견적 결과 확인</p>
                  <p class="text-sm text-slate-500">도착한 견적과 공장 정보를 이 화면에서 확인합니다.</p>
                </div>
              </li>
            </ol>
          </aside>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-950">매칭 결과 정보</h2>
              <p class="mt-1 text-sm text-slate-500">
                이 견적 요청에 연결된 공장 견적과 핵심 지표입니다.
              </p>
            </div>
            <AppBadge :variant="request.status === 'quoted' ? 'green' : 'slate'">
              {{ request.status === 'quoted' ? `${matchedFactories.length}개 견적 도착` : '견적 대기' }}
            </AppBadge>
          </div>

          <div v-if="matchedFactories.length" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <article
              v-for="factory in matchedFactories"
              :key="factory.id"
              class="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
            >
              <div class="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-lg font-bold text-slate-950">{{ factory.name }}</h3>
                  <p class="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin class="h-4 w-4" />
                    {{ factory.location }}
                  </p>
                </div>
                <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  신뢰 {{ factory.trustScore }}점
                </span>
              </div>

              <dl class="grid grid-cols-2 gap-3 text-sm">
                <div class="rounded-xl bg-slate-50 p-3">
                  <dt class="font-semibold text-slate-500">예상 견적</dt>
                  <dd class="mt-1 font-bold text-slate-950">
                    {{ formatPrice(factory.estimateMin) }} ~ {{ formatPrice(factory.estimateMax) }}
                  </dd>
                </div>
                <div class="rounded-xl bg-slate-50 p-3">
                  <dt class="font-semibold text-slate-500">납기 준수</dt>
                  <dd class="mt-1 font-bold text-slate-950">{{ factory.deliveryRate }}%</dd>
                </div>
              </dl>

              <p class="mt-4 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-800">
                {{ factory.aiReason }}
              </p>

              <RouterLink
                :to="`/factories/${factory.id}`"
                class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                공장 상세 보기
                <ArrowRight class="h-4 w-4" />
              </RouterLink>
            </article>
          </div>

          <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Sparkles class="mx-auto h-10 w-10 text-slate-300" />
            <p class="mt-3 font-bold text-slate-700">아직 도착한 견적이 없습니다.</p>
            <p class="mt-1 text-sm text-slate-500">공장 검토가 끝나면 이 영역에 매칭 결과가 표시됩니다.</p>
          </div>
        </section>
      </section>

      <section v-else class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <FileText class="mx-auto h-12 w-12 text-slate-300" />
        <h1 class="mt-4 text-2xl font-bold text-slate-950">견적 요청을 찾을 수 없습니다.</h1>
        <RouterLink
          to="/client/requests"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          목록으로 돌아가기
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </section>
    </main>
  </div>
</template>
