<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'md' | 'lg'
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  type: 'button'
})
</script>

<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
      size === 'lg' ? 'min-h-14 px-6 py-4 text-lg' : 'min-h-11 px-4 py-2.5 text-sm',
      fullWidth ? 'w-full' : '',
      variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200' : '',
      variant === 'secondary' ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-200' : '',
      variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200' : ''
    ]"
  >
    <slot />
  </button>
</template>
