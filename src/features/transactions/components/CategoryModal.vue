<script setup>
import { useTransactionStore } from '@/features/transactions/store/transactionsStore'
import CategoryForm from '@/features/transactions/components/CategoryForm.vue'

defineProps({
  isOpen: { type: Boolean, required: true },
  initialData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'success'])
const store = useTransactionStore()

const handleSave = async (formData) => {
  try {
    const result = await store.upsertCategory(formData)
    emit('success', result)
    emit('close')
  } catch (error) {
    console.error(`Erro no modal de nova categoria: ${error}`)
  }
}

const handleClose = () => {
  store.error = null
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div
        class="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="text-lg font-bold text-slate-800">
            {{ initialData.categoryId ? 'Editar Categoria' : 'Nova Categoria' }}
          </h3>
          <button
            @click="handleClose"
            class="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-4 space-y-4">
          <div
            v-if="store.error"
            class="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1"
          >
            {{ store.error }}
          </div>

          <CategoryForm
            :initialData="initialData"
            :isSaving="store.isLoading"
            @submit="handleSave"
            @cancel="handleClose"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
