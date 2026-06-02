<script setup lang="ts">
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Handshake,
  MessageSquareText,
  Plus,
  ShieldCheck
} from 'lucide-vue-next'
import { disputeCases, disputeStatusStyles } from '@/data/disputeData'

const activeCases = disputeCases.filter((item) => item.status !== 'resolved')
const resolvedCases = disputeCases.filter((item) => item.status === 'resolved')
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck class="h-4 w-4" />
              분쟁 중재 센터
            </div>
            <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">진행 중인 분쟁 중재</h1>
            <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              접수된 분쟁의 검토 상태, 다음 조치, 조정 진행률을 한 곳에서 확인합니다.
            </p>
          </div>

          <RouterLink
            to="/disputes/mediation"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus class="h-5 w-5" />
            중재 요청하기
          </RouterLink>
        </div>
      </header>

      <section class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <AlertTriangle class="h-6 w-6 text-blue-600" />
            <span class="text-sm font-semibold text-slate-500">진행 중</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ activeCases.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <Handshake class="h-6 w-6 text-amber-600" />
            <span class="text-sm font-semibold text-slate-500">조정안 단계</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ disputeCases.filter((item) => item.status === 'proposal').length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <Clock class="h-6 w-6 text-violet-600" />
            <span class="text-sm font-semibold text-slate-500">답변 대기</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ disputeCases.filter((item) => item.status === 'waiting').length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <CheckCircle class="h-6 w-6 text-emerald-600" />
            <span class="text-sm font-semibold text-slate-500">완료</span>
          </div>
          <p class="mt-3 text-3xl font-bold text-slate-950">{{ resolvedCases.length }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <article
          v-for="item in disputeCases"
          :key="item.id"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
        >
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-bold text-slate-500">{{ item.id }}</span>
                <span class="rounded-full px-3 py-1 text-xs font-bold ring-1" :class="disputeStatusStyles[item.status]">
                  {{ item.statusLabel }}
                </span>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{ item.type }}</span>
              </div>

              <h2 class="mt-3 text-xl font-bold text-slate-950">{{ item.projectName }}</h2>
              <p class="mt-2 text-base text-slate-600">{{ item.counterparty }} · {{ item.amount }}</p>

              <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <CalendarClock class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">접수일</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.requestedAt }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <MessageSquareText class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">담당</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.mediator }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <FileText class="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p class="text-xs font-semibold text-slate-500">다음 조치</p>
                    <p class="mt-1 text-sm font-bold text-slate-900">{{ item.nextAction }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <div class="mb-2 flex items-center justify-between text-sm">
                  <span class="font-semibold text-slate-600">진행률</span>
                  <span class="font-bold text-slate-950">{{ item.progress }}%</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-blue-600" :style="{ width: `${item.progress}%` }" />
                </div>
              </div>
            </div>

            <div class="flex min-w-[180px] flex-col gap-3 lg:items-end">
              <span class="text-sm font-semibold text-slate-500">최근 업데이트</span>
              <span class="text-base font-bold text-slate-900">{{ item.updatedAt }}</span>
              <RouterLink
                :to="`/disputes/${item.id}`"
                class="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                상세 보기
                <ArrowRight class="h-4 w-4" />
              </RouterLink>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
