<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Sparkles,
  Clock,
  Star,
  RefreshCw,
  DollarSign,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { useWorkflowStore } from "@/stores/workflow";

const router = useRouter();
const workflowStore = useWorkflowStore();

interface FormData {
  projectName: string;
  processType: string;
  productItem: string;
  estimatedQuantity: string;
  desiredDeadline: string;
  budgetRange: string;
  detailRequirements: string;
}

const form = reactive<FormData>({
  ...workflowStore.currentRequest,
});

const uploadedFiles = ref<File[]>([
  ...workflowStore.requestFiles.map(
    (file) => new File(["mock file data"], file.name, { type: file.type }),
  ),
]);
const isDragging = ref(false);
const isDeadlineCalendarOpen = ref(false);

const quantityCadenceOptions = [
  { value: "월", label: "월" },
  { value: "분기", label: "분기" },
  { value: "연", label: "연" },
  { value: "일회성", label: "일회성" },
];

const customQuantityUnitValue = "custom";
const quantityUnitOptions = ["개", "세트", "EA", "대", "kg"];

const initialQuantity = parseQuantityDetails(form.estimatedQuantity);
const firstRunQuantity = ref(initialQuantity.firstRun);
const productionQuantity = ref(initialQuantity.production);
const quantityCadence = ref(initialQuantity.cadence);
const quantityUnit = ref(initialQuantity.unit);
const customQuantityUnit = ref(initialQuantity.customUnit);
const initialBudgetRange = parseBudgetRange(form.budgetRange);
const budgetMin = ref(initialBudgetRange.min);
const budgetMax = ref(initialBudgetRange.max);

const initialDeadlineDate = parseDateString(form.desiredDeadline) ?? new Date();
const viewedDeadlineYear = ref(initialDeadlineDate.getFullYear());
const viewedDeadlineMonth = ref(initialDeadlineDate.getMonth());

const deadlineWeekHeaders = ["1", "2", "3", "4", "5", "6", "7"];
const deadlineMonthLabel = computed(
  () =>
    `${viewedDeadlineYear.value}.${padDatePart(viewedDeadlineMonth.value + 1)}`,
);
const formattedDesiredDeadline = computed(() =>
  formatDateLabel(form.desiredDeadline),
);
const selectedQuantityUnit = computed(() => {
  if (quantityUnit.value === customQuantityUnitValue) {
    return customQuantityUnit.value.trim();
  }

  return quantityUnit.value;
});
const deadlineCalendarDays = computed(() => {
  const firstDay = new Date(
    viewedDeadlineYear.value,
    viewedDeadlineMonth.value,
    1,
  ).getDay();
  const daysInMonth = new Date(
    viewedDeadlineYear.value,
    viewedDeadlineMonth.value + 1,
    0,
  ).getDate();
  const leadingDays = Array.from({ length: firstDay }, () => null);
  const monthDays = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1,
  );

  return [...leadingDays, ...monthDays];
});

const processTypes = [
  { value: "casting", label: "주조" },
  { value: "mold", label: "금형" },
  { value: "forming", label: "소성가공" },
  { value: "welding", label: "용접" },
  { value: "surface", label: "표면처리" },
  { value: "heat", label: "열처리" },
];

const aiCriteria = [
  {
    icon: Sparkles,
    label: "공정 적합도",
    description: "요청 공정과 공장 전문성 매칭",
  },
  {
    icon: Clock,
    label: "납기 가능성",
    description: "희망 납기 내 제작 가능 여부",
  },
  {
    icon: Star,
    label: "품질 리뷰",
    description: "기존 고객 평가 및 품질 점수",
  },
  {
    icon: RefreshCw,
    label: "재거래율",
    description: "기존 고객과의 재거래 비율",
  },
  {
    icon: DollarSign,
    label: "견적 경쟁력",
    description: "예산 범위 내 합리적 견적",
  },
];

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function parseDateString(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDateLabel(value: string): string {
  const date = parseDateString(value);

  if (!date) {
    return "";
  }

  return `${date.getFullYear()}.${padDatePart(date.getMonth() + 1)}.${padDatePart(date.getDate())}`;
}

function parseQuantityDetails(value: string): {
  firstRun: string;
  production: string;
  cadence: string;
  unit: string;
  customUnit: string;
} {
  const numbers = value.match(/\d[\d,]*/g) ?? [];
  const cadence =
    quantityCadenceOptions.find((option) => value.includes(option.value))
      ?.value ?? "월";
  const unitMatches = [...value.matchAll(/\d[\d,]*\s*([^\s,]+)/g)];
  const parsedUnit = unitMatches[unitMatches.length - 1]?.[1] ?? "";
  const unit = quantityUnitOptions.find(
    (nextUnit) => nextUnit === parsedUnit || value.includes(nextUnit),
  );
  const customUnit = unit ? "" : parsedUnit;

  return {
    firstRun: numbers[0] ?? "",
    production: numbers[1] ?? "",
    cadence,
    unit: unit ?? (customUnit ? customQuantityUnitValue : "개"),
    customUnit,
  };
}

function formatQuantityValue(value: string, unit: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return `${trimmedValue}${unit}`;
}

function buildEstimatedQuantity(): string {
  const firstRun = formatQuantityValue(
    firstRunQuantity.value,
    selectedQuantityUnit.value,
  );
  const production = formatQuantityValue(
    productionQuantity.value,
    selectedQuantityUnit.value,
  );

  if (firstRun && production && quantityCadence.value !== "일회성") {
    return `초도 ${firstRun}, 양산 ${quantityCadence.value} ${production}`;
  }

  if (firstRun && production) {
    return `초도 ${firstRun}, 추가 ${production}`;
  }

  if (firstRun) {
    return `초도 ${firstRun}`;
  }

  if (production && quantityCadence.value !== "일회성") {
    return `양산 ${quantityCadence.value} ${production}`;
  }

  return production;
}

function parseBudgetRange(value: string): { min: string; max: string } {
  const values = value.match(/\d[\d,]*/g) ?? [];

  return {
    min: values[0] ?? "",
    max: values[1] ?? "",
  };
}

function formatBudgetValue(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return /원$/.test(trimmedValue) ? trimmedValue : `${trimmedValue}만원`;
}

function buildBudgetRange(): string {
  const min = formatBudgetValue(budgetMin.value);
  const max = formatBudgetValue(budgetMax.value);

  if (min && max) {
    return `${min} ~ ${max}`;
  }

  if (min) {
    return `${min} 이상`;
  }

  if (max) {
    return `${max} 이하`;
  }

  return "";
}

function changeDeadlineMonth(offset: number) {
  const nextMonth = new Date(
    viewedDeadlineYear.value,
    viewedDeadlineMonth.value + offset,
    1,
  );
  viewedDeadlineYear.value = nextMonth.getFullYear();
  viewedDeadlineMonth.value = nextMonth.getMonth();
}

function selectDeadlineDay(day: number | null) {
  if (!day) {
    return;
  }

  form.desiredDeadline = `${viewedDeadlineYear.value}-${padDatePart(viewedDeadlineMonth.value + 1)}-${padDatePart(day)}`;
  isDeadlineCalendarOpen.value = false;
}

function isSelectedDeadlineDay(day: number | null): boolean {
  const selectedDate = parseDateString(form.desiredDeadline);

  if (!day || !selectedDate) {
    return false;
  }

  return (
    selectedDate.getFullYear() === viewedDeadlineYear.value &&
    selectedDate.getMonth() === viewedDeadlineMonth.value &&
    selectedDate.getDate() === day
  );
}

function handleDeadlineFocus() {
  const selectedDate = parseDateString(form.desiredDeadline);

  if (selectedDate) {
    viewedDeadlineYear.value = selectedDate.getFullYear();
    viewedDeadlineMonth.value = selectedDate.getMonth();
  }

  isDeadlineCalendarOpen.value = true;
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files) {
    addFiles(files);
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    addFiles(target.files);
  }
}

function addFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    uploadedFiles.value.push(files[i]);
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function handleSubmit() {
  if (!form.desiredDeadline) {
    isDeadlineCalendarOpen.value = true;
    return;
  }

  form.estimatedQuantity = buildEstimatedQuantity();
  form.budgetRange = buildBudgetRange();

  workflowStore.submitRequest(
    { ...form },
    uploadedFiles.value.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  );
  await workflowStore.runAIMatching();
  router.push("/client/matching");
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
          수주 의뢰 등록
        </h1>
        <p class="mt-2 text-slate-600">
          제작 요구사항을 입력하면 AI가 적합한 공장을 추천합니다.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <form
            @submit.prevent="handleSubmit"
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8"
          >
            <div class="space-y-6">
              <!-- Project Name -->
              <div>
                <label
                  for="projectName"
                  class="block text-sm font-medium text-slate-700 mb-2"
                >
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
                <label
                  for="processType"
                  class="block text-sm font-medium text-slate-700 mb-2"
                >
                  공정 유형 <span class="text-red-500">*</span>
                </label>
                <select
                  id="processType"
                  v-model="form.processType"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="" disabled>공정 유형을 선택하세요</option>
                  <option
                    v-for="type in processTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Product Item -->
              <div>
                <label
                  for="productItem"
                  class="block text-sm font-medium text-slate-700 mb-2"
                >
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

              <!-- Estimated Quantity -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  예상 수량 <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <input
                    id="firstRunQuantity"
                    v-model="firstRunQuantity"
                    type="text"
                    inputmode="numeric"
                    required
                    placeholder="초도 수량"
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    id="productionQuantity"
                    v-model="productionQuantity"
                    type="text"
                    inputmode="numeric"
                    placeholder="양산 수량"
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    id="quantityCadence"
                    v-model="quantityCadence"
                    class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    aria-label="양산 주기"
                  >
                    <option
                      v-for="option in quantityCadenceOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <div class="grid gap-2">
                    <select
                      id="quantityUnit"
                      v-model="quantityUnit"
                      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      aria-label="단위"
                    >
                      <option
                        v-for="unit in quantityUnitOptions"
                        :key="unit"
                        :value="unit"
                      >
                        {{ unit }}
                      </option>
                      <option :value="customQuantityUnitValue">
                        직접 입력
                      </option>
                    </select>
                    <input
                      v-if="quantityUnit === customQuantityUnitValue"
                      v-model="customQuantityUnit"
                      type="text"
                      placeholder="단위 입력"
                      class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      aria-label="사용자 지정 단위"
                    />
                  </div>
                </div>
              </div>

              <!-- Desired Deadline -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    for="desiredDeadline"
                    class="block text-sm font-medium text-slate-700 mb-2"
                  >
                    희망 납기 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <button
                      id="desiredDeadline"
                      type="button"
                      @click="handleDeadlineFocus"
                      class="flex w-full items-center justify-between rounded-lg border border-slate-300 px-4 py-3 text-left transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="
                        formattedDesiredDeadline
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      "
                    >
                      <span>{{
                        formattedDesiredDeadline || "YYYY.MM.DD"
                      }}</span>
                      <CalendarDays class="h-5 w-5 text-slate-400" />
                    </button>

                    <div
                      v-if="isDeadlineCalendarOpen"
                      class="absolute z-20 mt-2 w-full min-w-[18rem] rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                    >
                      <div class="mb-3 flex items-center justify-between">
                        <button
                          type="button"
                          @click="changeDeadlineMonth(-1)"
                          class="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          aria-label="previous month"
                        >
                          <ChevronLeft class="h-4 w-4" />
                        </button>
                        <span
                          class="text-sm font-semibold tabular-nums text-slate-900"
                          >{{ deadlineMonthLabel }}</span
                        >
                        <button
                          type="button"
                          @click="changeDeadlineMonth(1)"
                          class="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          aria-label="next month"
                        >
                          <ChevronRight class="h-4 w-4" />
                        </button>
                      </div>

                      <div
                        class="grid grid-cols-7 gap-1 text-center text-xs font-semibold tabular-nums text-slate-500"
                      >
                        <span
                          v-for="header in deadlineWeekHeaders"
                          :key="header"
                          class="py-1"
                        >
                          {{ header }}
                        </span>
                      </div>

                      <div class="mt-1 grid grid-cols-7 gap-1">
                        <button
                          v-for="(day, index) in deadlineCalendarDays"
                          :key="`${deadlineMonthLabel}-${index}`"
                          type="button"
                          :disabled="!day"
                          @click="selectDeadlineDay(day)"
                          class="aspect-square rounded-md text-sm font-medium tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-0"
                          :class="
                            isSelectedDeadlineDay(day)
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                          "
                        >
                          {{ day }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Budget Range -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  예산 범위
                </label>
                <div
                  class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
                >
                  <div class="relative">
                    <input
                      id="budgetMin"
                      v-model="budgetMin"
                      type="text"
                      inputmode="numeric"
                      placeholder="하한"
                      class="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500"
                      >만원</span
                    >
                  </div>
                  <span class="hidden text-center text-slate-400 sm:block"
                    >~</span
                  >
                  <div class="relative">
                    <input
                      id="budgetMax"
                      v-model="budgetMax"
                      type="text"
                      inputmode="numeric"
                      placeholder="상한"
                      class="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500"
                      >만원</span
                    >
                  </div>
                </div>
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
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50',
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
                    파일을 드래그하거나
                    <span class="text-blue-600 font-medium"
                      >클릭하여 업로드</span
                    >
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
                        <p class="text-sm font-medium text-slate-700">
                          {{ file.name }}
                        </p>
                        <p class="text-xs text-slate-500">
                          {{ formatFileSize(file.size) }}
                        </p>
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
                <label
                  for="detailRequirements"
                  class="block text-sm font-medium text-slate-700 mb-2"
                >
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
                :disabled="workflowStore.isMatching"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles
                  class="w-5 h-5"
                  :class="workflowStore.isMatching ? 'animate-spin' : ''"
                />
                {{
                  workflowStore.isMatching
                    ? "AI가 공장을 분석하는 중..."
                    : "AI 매칭 시작하기"
                }}
              </button>
            </div>
          </form>
        </div>

        <!-- AI Criteria Panel -->
        <div class="lg:col-span-1">
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
              >
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
                <div
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <component
                    :is="criteria.icon"
                    class="w-4 h-4 text-blue-600"
                  />
                </div>
                <div>
                  <h3 class="font-medium text-slate-900">
                    {{ criteria.label }}
                  </h3>
                  <p class="text-sm text-slate-500 mt-0.5">
                    {{ criteria.description }}
                  </p>
                </div>
              </li>
            </ul>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div class="flex items-start gap-2">
                <CheckCircle
                  class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                />
                <p class="text-sm text-blue-800">
                  AI가 위 기준을 종합하여 최적의 공장을 추천합니다. 상세한
                  요구사항을 입력할수록 정확도가 높아집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
