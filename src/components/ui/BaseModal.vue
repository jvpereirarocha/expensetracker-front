<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4"
  >
    <div class="relative w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fechar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="mb-6 text-slate-600 text-sm">
        <slot />
      </div>

      <div class="flex justify-end gap-3">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
