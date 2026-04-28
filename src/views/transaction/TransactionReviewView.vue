<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle, MessageSquareText, RefreshCw, Star } from 'lucide-vue-next'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()

const review = reactive({
  projectName: '알루미늄 하우징 시제품 제작',
  factory: '문래정밀가공',
  rating: 5,
  content: '납기와 품질 모두 만족스러웠습니다. 작업 상태 공유가 빠르고 검사 결과서도 상세해서 다음 양산 건도 논의하고 싶습니다.',
  nextAction: 'reorder'
})

function submitReview() {
  console.log('Transaction Review:', { ...review })
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <header class="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <AppBadge variant="green">
          <CheckCircle class="h-4 w-4" />
          거래 완료
        </AppBadge>
        <h1 class="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">거래 완료 및 리뷰</h1>
        <p class="mt-3 text-lg text-slate-600">정산이 완료되었습니다. 거래 후기를 남기고 다음 거래를 관리하세요.</p>
      </header>

      <form class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" @submit.prevent="submitReview">
        <div class="mb-6 rounded-xl bg-slate-50 p-5">
          <p class="text-sm font-semibold text-slate-500">프로젝트</p>
          <h2 class="mt-2 text-xl font-bold text-slate-950">{{ review.projectName }}</h2>
          <p class="mt-1 text-base text-slate-600">{{ review.factory }}</p>
        </div>

        <section class="space-y-5">
          <div>
            <label class="mb-3 block text-base font-bold text-slate-950">평점</label>
            <div class="flex gap-2">
              <button
                v-for="score in 5"
                :key="score"
                type="button"
                class="rounded-lg p-2 transition hover:bg-amber-50"
                @click="review.rating = score"
              >
                <Star
                  class="h-8 w-8"
                  :class="score <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'"
                />
              </button>
            </div>
          </div>

          <div>
            <label for="reviewContent" class="mb-2 block text-base font-bold text-slate-950">거래 후기</label>
            <textarea
              id="reviewContent"
              v-model="review.content"
              rows="6"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            ></textarea>
          </div>

          <div>
            <label class="mb-3 block text-base font-bold text-slate-950">다음 관리</label>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input v-model="review.nextAction" type="radio" value="reorder" class="mt-1 h-5 w-5 text-blue-600" />
                <span>
                  <span class="flex items-center gap-2 font-bold text-slate-950">
                    <RefreshCw class="h-5 w-5 text-blue-600" />
                    재거래 후보로 저장
                  </span>
                  <span class="mt-1 block text-sm text-slate-600">다음 발주 시 우선 추천 공장으로 관리합니다.</span>
                </span>
              </label>
              <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input v-model="review.nextAction" type="radio" value="crm" class="mt-1 h-5 w-5 text-blue-600" />
                <span>
                  <span class="flex items-center gap-2 font-bold text-slate-950">
                    <MessageSquareText class="h-5 w-5 text-blue-600" />
                    CRM 메모로 관리
                  </span>
                  <span class="mt-1 block text-sm text-slate-600">거래 특이사항을 파트너 관리 기록에 남깁니다.</span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <AppButton type="submit" size="lg" full-width class="mt-8">
          <CheckCircle class="h-6 w-6" />
          리뷰 저장하고 대시보드로 이동
        </AppButton>
      </form>
    </div>
  </div>
</template>
