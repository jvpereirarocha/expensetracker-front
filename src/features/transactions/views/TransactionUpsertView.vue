<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TransactionForm from '../components/TransactionForm.vue'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const isLoading = ref(true)
const isSaving = ref(false)

const initialData = ref({})
const categories = ref([])

onMounted(async () => {
  isLoading.value = true
  try {
    // Mock: Busca as categorias do backend
    categories.value = [
      { id: 1, name: 'Alimentação' },
      { id: 2, name: 'Transporte' },
      { id: 3, name: 'Moradia' },
      { id: 4, name: 'Salário' },
    ]

    // Se tiver ID na URL, busca os dados da transação para edição
    if (isEditing.value) {
      await new Promise((resolve) => setTimeout(resolve, 600)) // Mock delay
      initialData.value = {
        id: route.params.id,
        description: 'Compra Mensal Supermercado',
        amount: 850.5,
        type: 'expense',
        category_id: 1,
        registered_at: '2026-03-10',
        due_date: '2026-03-15',
      }
    }
  } finally {
    isLoading.value = false
  }
})

const handleCancel = () => {
  router.push({ name: 'Transactions' })
}

const handleSubmit = async (payload) => {
  isSaving.value = true
  try {
    // Aqui chamaria o store: await store.saveTransaction(payload, route.params.id)
    await new Promise((resolve) => setTimeout(resolve, 800)) // Mock salvar
    router.push({ name: 'Transactions' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="handleCancel"
        class="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-slate-900">
        {{ isEditing ? 'Editar Transação' : 'Nova Transação' }}
      </h1>
    </div>

    <div
      v-if="isLoading"
      class="p-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100"
    >
      <svg
        class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
      Carregando informações...
    </div>

    <TransactionForm
      v-else
      :initialData="initialData"
      :categories="categories"
      :isSaving="isSaving"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
