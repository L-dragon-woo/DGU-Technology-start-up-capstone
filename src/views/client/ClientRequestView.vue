<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, X, FileText, CheckCircle, Sparkles, Clock, Star, RefreshCw, DollarSign } from 'lucide-vue-next'

const router = useRouter()

interface FormData {
  projectName: string
  processType: string
  productItem: string
  estimatedQuantity: string
  desiredDeadline: string
  budgetRange: string
  detailRequirements: string
}

const form = reactive<FormData>({
  projectName: '알루미늄 하우징 시제품 제작',
  processType: 'mold',
  productItem: '전장 모듈용 알루미늄 케이스',
  estimatedQuantity: '1차 500개, 양산 월 3,000개',
  desiredDeadline: '2026-05-20',
  budgetRange: '3,000만원 ~ 4,500만원',
  detailRequirements: '6061 알루미늄 소재 기준으로 CNC 정밀가공과 표면 아노다이징 처리가 필요합니다. 외관 스크래치 기준이 엄격하며, 초도품 검수 후 양산 전환 예정입니다.'
})

const uploadedFiles = ref<File[]>([
  new File(['mock drawing data'], 'housing_2d_drawing.pdf', { type: 'application/pdf' }),
  new File(['mock step data'], 'housing_3d_model.step', { type: 'model/step' })
])
const isDragging = ref(false)

const processTypes = [
  { value: 'casting', label: '주조' },
  { value: 'mold', label: '금형' },
  { value: 'forming', label: '소성가공' },
  { value: 'welding', label: '용접' },
  { value: 'surface', label: '표면처리' },
  { value: 'heat', label: '열처리' }
]

const aiCriteria = [
  { icon: Sparkles, label: '공정 적합도', description: '요청 공정과 공장 전문성 매칭' },
  { icon: Clock, label: '납기 가능성', description: '희망 납기 내 제작 가능 여부' },
  { icon: Star, label: '품질 리뷰', description: '기존 고객 평가 및 품질 점수' },
  { icon: RefreshCw, label: '재거래율', description: '기존 고객과의 재거래 비율' },
  { icon: DollarSign, label: '견적 경쟁력', description: '예산 범위 내 합리적 견적' }
]

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) {
    addFiles(files)
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    addFiles(target.files)
  }
}

function addFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    uploadedFiles.value.push(files[i])
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleSubmit() {
  console.log('Form Data:', {
    ...form,
    files: uploadedFiles.value.map(f => ({ name: f.name, size: f.size, type: f.type }))
  })
  router.push('/client/matching')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">수주 의뢰 등록</h1>
        <p class="mt-2 text-slate-600">제작 요구사항을 입력하면 AI가 적합한 공장을 추천합니다.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div class="space-y-6">
              <!-- Project Name -->
              <div>
                <label for="projectName" class="block text-sm font-medium text-slate-700 mb-2">
                  프로젝트명 <span class="text-red-500">*</span>
                </label>
                <input
                  id="projectName"
                  v-model="form.projectName"
                  type="text"
                  required
                  placeholder="예: 2024년 신제품 부품 제작"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <!-- Process Type -->
              <div>
                <label for="processType" class="block text-sm font-medium text-slate-700 mb-2">
                  공정 유형 <span class="text-red-500">*</span>
                </label>
                <select
                  id="processType"
                  v-model="form.processType"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="" disabled>공정 유형을 선택하세요</option>
                  <option v-for="type in processTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Product Item -->
              <div>
                <label for="productItem" class="block text-sm font-medium text-slate-700 mb-2">
                  제작 품목 <span class="text-red-500">*</span>
                </label>
                <input
                  id="productItem"
                  v-model="form.productItem"
                  type="text"
                  required
                  placeholder="예: 알루미늄 케이스, 스틸 브라켓"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <!-- Two Column Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Estimated Quantity -->
                <div>
                  <label for="estimatedQuantity" class="block text-sm font-medium text-slate-700 mb-2">
                    예상 수량 <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="estimatedQuantity"
                    v-model="form.estimatedQuantity"
                    type="text"
                    required
                    placeholder="예: 1,000개"
                    class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <!-- Desired Deadline -->
                <div>
                  <label for="desiredDeadline" class="block text-sm font-medium text-slate-700 mb-2">
                    희망 납기 <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="desiredDeadline"
                    v-model="form.desiredDeadline"
                    type="date"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <!-- Budget Range -->
              <div>
                <label for="budgetRange" class="block text-sm font-medium text-slate-700 mb-2">
                  예산 범위
                </label>
                <input
                  id="budgetRange"
                  v-model="form.budgetRange"
                  type="text"
                  placeholder="예: 5,000만원 ~ 1억원"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <!-- File Upload -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  도면/파일 업로드
                </label>
                <div
                  @dragover="handleDragOver"
                  @dragleave="handleDragLeave"
                  @drop="handleDrop"
                  :class="[
                    'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                  ]"
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.jpg,.jpeg,.png"
                    @change="handleFileSelect"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload class="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p class="text-sm text-slate-600">
                    파일을 드래그하거나 <span class="text-blue-600 font-medium">클릭하여 업로드</span>
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    PDF, DWG, DXF, STEP, IGES, JPG, PNG (최대 50MB)
                  </p>
                </div>

                <!-- Uploaded Files List -->
                <ul v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
                  <li
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div class="flex items-center gap-3">
                      <FileText class="w-5 h-5 text-blue-600" />
                      <div>
                        <p class="text-sm font-medium text-slate-700">{{ file.name }}</p>
                        <p class="text-xs text-slate-500">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeFile(index)"
                      class="p-1 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X class="w-4 h-4 text-slate-500" />
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Detail Requirements -->
              <div>
                <label for="detailRequirements" class="block text-sm font-medium text-slate-700 mb-2">
                  상세 요구사항
                </label>
                <textarea
                  id="detailRequirements"
                  v-model="form.detailRequirements"
                  rows="5"
                  placeholder="추가적인 요구사항이나 특이사항을 입력하세요..."
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles class="w-5 h-5" />
                AI 매칭 시작하기
              </button>
            </div>
          </form>
        </div>

        <!-- AI Criteria Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles class="w-5 h-5 text-white" />
              </div>
              <h2 class="text-lg font-bold text-slate-900">AI 추천 기준</h2>
            </div>

            <ul class="space-y-4">
              <li
                v-for="(criteria, index) in aiCriteria"
                :key="index"
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <component :is="criteria.icon" class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 class="font-medium text-slate-900">{{ criteria.label }}</h3>
                  <p class="text-sm text-slate-500 mt-0.5">{{ criteria.description }}</p>
                </div>
              </li>
            </ul>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div class="flex items-start gap-2">
                <CheckCircle class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p class="text-sm text-blue-800">
                  AI가 위 기준을 종합하여 최적의 공장을 추천합니다. 상세한 요구사항을 입력할수록 정확도가 높아집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
