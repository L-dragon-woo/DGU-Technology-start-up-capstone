<script setup lang="ts">
interface ProcessStep {
  title: string
  description?: string
}

defineProps<{
  steps: ProcessStep[]
  currentStep?: number
}>()
</script>

<template>
  <ol class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="relative rounded-xl border bg-white p-5 shadow-sm"
      :class="index + 1 <= (currentStep ?? 1) ? 'border-blue-200' : 'border-slate-200'"
    >
      <div class="flex items-start gap-4">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold"
          :class="index + 1 <= (currentStep ?? 1) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'"
        >
          {{ index + 1 }}
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-950">{{ step.title }}</h3>
          <p v-if="step.description" class="mt-1 text-sm leading-6 text-slate-600">{{ step.description }}</p>
        </div>
      </div>
    </li>
  </ol>
</template>
