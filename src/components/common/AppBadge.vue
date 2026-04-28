<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'blue' | 'green' | 'amber' | 'slate'
}>(), {
  variant: 'blue'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
      variant === 'blue' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : '',
      variant === 'green' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : '',
      variant === 'amber' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : '',
      variant === 'slate' ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' : ''
    ]"
  >
    <slot />
  </span>
</template>
