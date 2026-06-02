<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Circle,
  FileText,
  MessageSquareText,
  ShieldCheck,
  UserRound
} from 'lucide-vue-next'
import { disputeCases, disputeStatusStyles } from '@/data/disputeData'

const route = useRoute()
const dispute = computed(() => disputeCases.find((item) => item.id === route.params.id))
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <RouterLink
        to="/disputes"
        class="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700"
      >
        <ArrowLeft class="h-4 w-4" />
        분쟁 중재 현황으로 돌아가기
      </RouterLink>

      <template v-if="dispute">
        <header class="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div class="mb-4 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{{ dispute.id }}</span>
                <span class="rounded-full px-3 py-1 text-sm font-bold ring-1" :class="disputeStatusStyles[dispute.status]">
                  {{ dispute.statusLabel }}
                </span>
                <span class="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{{ dispute.type }}</span>
              </div>
              <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{{ dispute.projectName }}</h1>
              <p class="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{{ dispute.summary }}</p>
            </div>

            <div class="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-semibold text-blue-700">현재 진행률</span>
                <span class="font-bold text-slate-950">{{ dispute.progress }}%</span>
              </div>
              <div class="h-3 rounded-full bg-white">
                <div class="h-3 rounded-full bg-blue-600" :style="{ width: `${dispute.progress}%` }" />
              </div>
              <p class="mt-4 text-sm font-semibold leading-6 text-slate-700">
                다음 조치: {{ dispute.nextAction }}
              </p>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main class="space-y-8">
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div class="mb-6 flex items-center gap-3">
                <ShieldCheck class="h-6 w-6 text-blue-600" />
                <h2 class="text-2xl font-bold text-slate-950">현재 진행 과정</h2>
              </div>

              <ol class="space-y-4">
                <li
                  v-for="step in dispute.steps"
                  :key="step.title"
                  class="flex gap-4 rounded-xl border p-4"
                  :class="step.completed ? 'border-blue-100 bg-blue-50' : 'border-slate-200 bg-white'"
                >
                  <CheckCircle v-if="step.completed" class="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                  <Circle v-else class="mt-1 h-6 w-6 shrink-0 text-slate-300" />
                  <div>
                    <h3 class="text-lg font-bold text-slate-950">{{ step.title }}</h3>
                    <p class="mt-1 text-base leading-7 text-slate-600">{{ step.description }}</p>
                  </div>
                </li>
              </ol>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div class="mb-6 flex items-center gap-3">
                <MessageSquareText class="h-6 w-6 text-blue-600" />
                <h2 class="text-2xl font-bold text-slate-950">진행 이력</h2>
              </div>

              <div class="space-y-4">
                <div
                  v-for="item in dispute.timeline"
                  :key="`${item.title}-${item.date}`"
                  class="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 class="text-base font-bold text-slate-950">{{ item.title }}</h3>
                    <span class="text-sm font-semibold text-slate-500">{{ item.date }}</span>
                  </div>
                  <p class="mt-2 text-base leading-7 text-slate-600">{{ item.description }}</p>
                </div>
              </div>
            </section>
          </main>

          <aside class="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="mb-5 flex items-center gap-3">
                <FileText class="h-6 w-6 text-blue-600" />
                <h2 class="text-xl font-bold text-slate-950">상세 정보</h2>
              </div>
              <dl class="space-y-4">
                <div>
                  <dt class="text-sm font-semibold text-slate-500">요청자</dt>
                  <dd class="mt-1 text-base font-bold text-slate-950">{{ dispute.requester }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-semibold text-slate-500">상대방</dt>
                  <dd class="mt-1 text-base font-bold text-slate-950">{{ dispute.respondent }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-semibold text-slate-500">계약일</dt>
                  <dd class="mt-1 text-base font-bold text-slate-950">{{ dispute.contractDate }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-semibold text-slate-500">납기</dt>
                  <dd class="mt-1 text-base font-bold text-slate-950">{{ dispute.dueDate }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-semibold text-slate-500">계약 금액</dt>
                  <dd class="mt-1 text-base font-bold text-slate-950">{{ dispute.amount }}</dd>
                </div>
              </dl>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="mb-5 flex items-center gap-3">
                <UserRound class="h-6 w-6 text-blue-600" />
                <h2 class="text-xl font-bold text-slate-950">담당 중재자</h2>
              </div>
              <p class="text-base font-bold text-slate-950">{{ dispute.mediator }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">최근 업데이트: {{ dispute.updatedAt }}</p>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="mb-5 flex items-center gap-3">
                <CalendarClock class="h-6 w-6 text-blue-600" />
                <h2 class="text-xl font-bold text-slate-950">요청 해결안</h2>
              </div>
              <p class="text-base leading-7 text-slate-700">{{ dispute.requestedResolution }}</p>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-xl font-bold text-slate-950">증빙 자료</h2>
              <ul class="space-y-3">
                <li
                  v-for="file in dispute.evidenceFiles"
                  :key="file"
                  class="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <FileText class="h-4 w-4 shrink-0 text-slate-500" />
                  <span class="truncate">{{ file }}</span>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </template>

      <section v-else class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 class="text-2xl font-bold text-slate-950">분쟁 정보를 찾을 수 없습니다.</h1>
        <p class="mt-2 text-slate-600">목록에서 다시 확인해 주세요.</p>
      </section>
    </div>
  </div>
</template>
