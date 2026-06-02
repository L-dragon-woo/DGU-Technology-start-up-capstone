<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle, ClipboardCheck, ImagePlus, Lightbulb, Plus, Trash2, Upload } from 'lucide-vue-next'

const router = useRouter()

interface ProductCapacity {
  productName: string
  monthlyCapacity: string
  note: string
}

interface FactoryProfileForm {
  factoryName: string
  ownerName: string
  location: string
  contact: string
  mainProcesses: string[]
  facilities: string
  producibleItems: string
  productCapacities: ProductCapacity[]
  certifications: string
  introduction: string
}

const processOptions = ['주조', '금형', '소성가공', '용접', '표면처리', '열처리']

const form = reactive<FactoryProfileForm>({
  factoryName: '문래정밀가공',
  ownerName: '박정훈',
  location: '서울 영등포구 문래동',
  contact: '02-2678-4567',
  mainProcesses: ['금형', '소성가공', '표면처리'],
  facilities: '5축 CNC 머시닝센터 4대, Wire-cut EDM 2대, 고속 밀링머신 3대, 정밀 연삭기 2대, 3차원 측정기 1대',
  producibleItems: '알루미늄 하우징, 자동차 정밀 브라켓, 전자기기 케이스, 소형 금형 부품, 산업용 지그',
  productCapacities: [
    { productName: '알루미늄 하우징', monthlyCapacity: '월 5,000개', note: 'CNC 가공 기준' },
    { productName: '정밀 브라켓', monthlyCapacity: '월 8,000개', note: '소재 수급 완료 시' },
    { productName: '시제품', monthlyCapacity: '월 300건', note: '도면 확정 후 3~7일' }
  ],
  certifications: 'ISO 9001, 뿌리기업 확인서, 소재부품장비 전문기업',
  introduction:
    '문래동에서 18년간 정밀가공을 전문으로 운영한 공장입니다. 소량 시제품부터 단위 양산까지 대응 가능하며, 납기 준수와 품질 관리를 가장 중요하게 봅니다.'
})

const portfolioImages = ref<File[]>([
  new File(['mock image data'], 'cnc_working_photo.jpg', { type: 'image/jpeg' }),
  new File(['mock image data'], 'aluminum_housing_sample.png', { type: 'image/png' }),
  new File(['mock image data'], 'inspection_equipment.jpg', { type: 'image/jpeg' })
])
const isDragging = ref(false)
const customProcess = ref('')

const selectedProcessText = computed(() => {
  if (!form.mainProcesses.length) return '선택된 공정이 없습니다.'
  return form.mainProcesses.join(', ')
})

const profileTips = [
  '공정은 예시 6개에 없으면 기타 입력으로 직접 추가하세요.',
  '월 생산 가능량은 품목, 공정, 소재에 따라 달라지므로 제품별로 나누어 적는 것이 좋습니다.',
  '가능한 공정과 설비를 구체적으로 입력하면 매칭 품질이 좋아집니다.',
  '인증 정보와 실제 작업 사진이 있으면 발주처 신뢰도가 올라갑니다.'
]

function handleProcessToggle(process: string) {
  const selectedIndex = form.mainProcesses.indexOf(process)

  if (selectedIndex >= 0) {
    form.mainProcesses.splice(selectedIndex, 1)
    return
  }

  form.mainProcesses.push(process)
}

function addCustomProcess() {
  const process = customProcess.value.trim()
  if (!process || form.mainProcesses.includes(process)) return

  form.mainProcesses.push(process)
  customProcess.value = ''
}

function removeProcess(process: string) {
  const selectedIndex = form.mainProcesses.indexOf(process)
  if (selectedIndex >= 0) {
    form.mainProcesses.splice(selectedIndex, 1)
  }
}

function addProductCapacity() {
  form.productCapacities.push({
    productName: '',
    monthlyCapacity: '',
    note: ''
  })
}

function removeProductCapacity(index: number) {
  if (form.productCapacities.length === 1) {
    form.productCapacities[0] = { productName: '', monthlyCapacity: '', note: '' }
    return
  }

  form.productCapacities.splice(index, 1)
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    addPortfolioImages(event.dataTransfer.files)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement

  if (target.files) {
    addPortfolioImages(target.files)
  }
}

function addPortfolioImages(files: FileList) {
  Array.from(files)
    .filter((file) => file.type.startsWith('image/'))
    .forEach((file) => portfolioImages.value.push(file))
}

function removePortfolioImage(index: number) {
  portfolioImages.value.splice(index, 1)
}

function handleSubmit() {
  console.log('Factory Profile:', {
    ...form,
    productCapacities: form.productCapacities.filter(item => item.productName || item.monthlyCapacity || item.note),
    portfolioImages: portfolioImages.value.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  })

  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8">
        <p class="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <ClipboardCheck class="h-4 w-4" />
          공장 프로필
        </p>
        <h1 class="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">공장 프로필 등록/수정</h1>
        <p class="mt-3 text-lg text-slate-600">제품별 생산 가능량과 실제 가능한 공정을 자세히 입력하면 발주처가 더 정확히 판단할 수 있습니다.</p>
      </header>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="factoryName" class="mb-2 block text-base font-semibold text-slate-900">
                공장명 <span class="text-red-500">*</span>
              </label>
              <input
                id="factoryName"
                v-model="form.factoryName"
                required
                type="text"
                placeholder="예: 대한정밀공업"
                class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label for="ownerName" class="mb-2 block text-base font-semibold text-slate-900">
                담당자명 <span class="text-red-500">*</span>
              </label>
              <input
                id="ownerName"
                v-model="form.ownerName"
                required
                type="text"
                placeholder="예: 김철수"
                class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label for="location" class="mb-2 block text-base font-semibold text-slate-900">
                위치 <span class="text-red-500">*</span>
              </label>
              <input
                id="location"
                v-model="form.location"
                required
                type="text"
                placeholder="예: 경기 시흥시 정왕동"
                class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label for="contact" class="mb-2 block text-base font-semibold text-slate-900">
                연락처 <span class="text-red-500">*</span>
              </label>
              <input
                id="contact"
                v-model="form.contact"
                required
                type="tel"
                placeholder="예: 010-1234-5678"
                class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <section class="mt-8">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 class="text-xl font-bold text-slate-950">주요 공정</h2>
                <p class="mt-1 text-base text-slate-600">기본 공정에 없으면 기타 공정을 직접 입력해 추가하세요.</p>
              </div>
              <p class="text-sm font-semibold text-slate-500">{{ selectedProcessText }}</p>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button
                v-for="process in processOptions"
                :key="process"
                type="button"
                :aria-pressed="form.mainProcesses.includes(process)"
                :class="[
                  'min-h-14 rounded-lg border px-4 text-base font-semibold transition',
                  form.mainProcesses.includes(process)
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50'
                ]"
                @click="handleProcessToggle(process)"
              >
                {{ process }}
              </button>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input
                v-model="customProcess"
                type="text"
                placeholder="기타 공정 입력: 예) CNC 가공, 사출, 도장, 조립"
                class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                @keydown.enter.prevent="addCustomProcess"
              />
              <button
                type="button"
                class="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 text-base font-bold text-blue-700 transition hover:bg-blue-50"
                @click="addCustomProcess"
              >
                <Plus class="h-5 w-5" />
                기타 추가
              </button>
            </div>

            <div v-if="form.mainProcesses.length" class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="process in form.mainProcesses"
                :key="process"
                type="button"
                class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700"
                @click="removeProcess(process)"
              >
                {{ process }} ×
              </button>
            </div>
          </section>

          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="facilities" class="mb-2 block text-base font-semibold text-slate-900">보유 설비</label>
              <textarea
                id="facilities"
                v-model="form.facilities"
                rows="4"
                placeholder="예: CNC 선반 5대, 머시닝센터 3대"
                class="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              ></textarea>
            </div>

            <div>
              <label for="producibleItems" class="mb-2 block text-base font-semibold text-slate-900">생산 가능 품목</label>
              <textarea
                id="producibleItems"
                v-model="form.producibleItems"
                rows="4"
                placeholder="예: 자동차 부품, 산업용 브라켓, 알루미늄 케이스"
                class="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              ></textarea>
            </div>
          </div>

          <section class="mt-8">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 class="text-xl font-bold text-slate-950">제품별 월 생산 가능량</h2>
                <p class="mt-1 text-base text-slate-600">같은 공장이어도 제품, 소재, 공정 난이도에 따라 생산량이 달라질 수 있습니다.</p>
              </div>
              <button
                type="button"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 text-base font-bold text-blue-700 transition hover:bg-blue-50"
                @click="addProductCapacity"
              >
                <Plus class="h-5 w-5" />
                품목 추가
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div
                v-for="(capacity, index) in form.productCapacities"
                :key="index"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)_auto]">
                  <input
                    v-model="capacity.productName"
                    type="text"
                    placeholder="품목명 예: 알루미늄 하우징"
                    class="h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    v-model="capacity.monthlyCapacity"
                    type="text"
                    placeholder="월 생산량 예: 5,000개"
                    class="h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    v-model="capacity.note"
                    type="text"
                    placeholder="조건 예: CNC 기준, 소재 확보 시"
                    class="h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    class="inline-flex h-12 items-center justify-center rounded-lg px-3 text-slate-500 transition hover:bg-white hover:text-red-600"
                    aria-label="생산 가능량 항목 삭제"
                    @click="removeProductCapacity(index)"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div class="mt-8">
            <label for="certifications" class="mb-2 block text-base font-semibold text-slate-900">인증/자격 정보</label>
            <input
              id="certifications"
              v-model="form.certifications"
              type="text"
              placeholder="예: ISO 9001, IATF 16949"
              class="h-14 w-full rounded-lg border border-slate-300 px-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <section class="mt-8">
            <label class="mb-2 block text-base font-semibold text-slate-900">포트폴리오 이미지 업로드</label>
            <div
              :class="[
                'relative rounded-xl border-2 border-dashed p-8 text-center transition',
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              ]"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                @change="handleFileSelect"
              />
              <ImagePlus class="mx-auto h-12 w-12 text-slate-400" />
              <p class="mt-3 text-lg font-semibold text-slate-800">사진을 선택하거나 끌어다 놓으세요</p>
              <p class="mt-1 text-base text-slate-500">작업 현장, 설비, 완성품 사진을 등록할 수 있습니다.</p>
            </div>

            <ul v-if="portfolioImages.length" class="mt-4 space-y-3">
              <li
                v-for="(image, index) in portfolioImages"
                :key="`${image.name}-${index}`"
                class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <Upload class="h-5 w-5 shrink-0 text-blue-600" />
                  <span class="truncate text-base font-medium text-slate-800">{{ image.name }}</span>
                </div>
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
                  aria-label="이미지 삭제"
                  @click="removePortfolioImage(index)"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </li>
            </ul>
          </section>

          <section class="mt-8">
            <label for="introduction" class="mb-2 block text-base font-semibold text-slate-900">소개글</label>
            <textarea
              id="introduction"
              v-model="form.introduction"
              rows="6"
              placeholder="공장의 강점, 납기 대응, 품질 관리 방식 등을 소개해 주세요."
              class="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            ></textarea>
          </section>

          <button
            type="submit"
            class="mt-8 flex min-h-16 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <CheckCircle class="h-6 w-6" />
            공장 프로필 저장하기
          </button>
        </form>

        <aside class="lg:sticky lg:top-8 lg:self-start">
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Lightbulb class="h-6 w-6" />
              </div>
              <h2 class="text-xl font-bold text-slate-950">좋은 프로필 작성 팁</h2>
            </div>

            <ul class="mt-6 space-y-4">
              <li
                v-for="tip in profileTips"
                :key="tip"
                class="flex gap-3 rounded-lg bg-slate-50 p-4 text-base text-slate-700"
              >
                <CheckCircle class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
