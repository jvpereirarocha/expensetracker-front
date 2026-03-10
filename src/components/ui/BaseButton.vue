<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  isLoading: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 w-full"
    :class="{
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600':
        variant === 'primary',
      'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500':
        variant === 'outline',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-600':
        variant === 'danger',
      'opacity-75 cursor-not-allowed': isLoading,
    }"
    :disabled="isLoading"
  >
    <svg
      v-if="isLoading"
      class="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot />
  </button>
</template>
