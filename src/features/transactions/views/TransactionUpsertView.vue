<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import TransactionForm from '../components/TransactionForm.vue'

const route = useRoute()
const router = useRouter()

const { categories, loadCategories, createTransaction, error: apiError } = useTransactions()

const isEditing = computed(() => !!route.params.id)
const isLoading = ref(true)
const isSaving = ref(false)

const initialData = ref({})

onMounted(async () => {
  isLoading.value = true
  try {
    // 1. Busca as categorias reais do backend
    await loadCategories()

    // 2. Lógica de edição (Mock mantido por enquanto até fazermos o GET por ID)
    if (isEditing.value) {
      // TODO: Substituir por um 'await getTransactionById(route.params.id)' futuramente
      await new Promise((resolve) => setTimeout(resolve, 600))
      initialData.value = {
        id: route.params.id,
        description: 'Compra Mensal Supermercado',
        amount: 850.5,
        typeOfTransaction: 'expense',
        category: 'Alimentação', // Lembre-se que o backend pede o NOME da categoria no POST
        registrationDate: '2026-03-10',
        dueDate: '2026-03-15',
      }
    }
  } finally {
    isLoading.value = false
  }
})

const handleCancel = () => {
  router.push('/transactions')
}

// Função para formatar a data do input HTML (YYYY-MM-DD) para a API (DD/MM/YYYY)
const formatToApiDate = (isoDate) => {
  if (!isoDate) return ''
  if (isoDate.includes('/')) return isoDate // Se já estiver formatado, ignora
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
const formatToApiCurrency = (value) => {
  if (!value) return 'R$ 0,00'
  // Converte para float substituindo vírgula por ponto (caso o usuário digite 221,50)
  const number = parseFloat(String(value).replace(',', '.'))
  if (isNaN(number)) return 'R$ 0,00'

  const formattedNumber = number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `R$ ${formattedNumber}`
}

const handleSubmit = async (payload) => {
  isSaving.value = true
  try {
    // Formata o payload exatamente para o contrato PersistTransaction do Swagger
    const apiPayload = {
      description: payload.description,
      amount: formatToApiCurrency(payload.amount), // Garante que é string
      typeOfTransaction: payload.typeOfTransaction || 'expense',
      category: payload.category, // O formulário deve emitir o nome da categoria
      // registrationDate: formatToApiDate(payload.registrationDate),
      registrationDate: payload.registrationDate
        ? formatToApiDate(payload.registrationDate)
        : formatToApiDate(new Date().toISOString().split('T')[0]),
      dueDate: payload.dueDate ? formatToApiDate(payload.dueDate) : '',
    }

    console.log('Enviando para a API do backend => ', apiPayload)

    if (isEditing.value) {
      // Lógica de Atualização (PUT/PATCH) irá aqui futuramente
      console.log('Atualizando transação...', apiPayload)
    } else {
      // Chama a action real de criação enviando para a API
      await createTransaction(apiPayload)
    }

    // Se der sucesso, volta para a lista
    router.push('/transactions')
  } catch (err) {
    // O erro já é guardado no estado global, mas logamos aqui para debug
    console.error('Falha ao salvar transação:', err)
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
      v-if="apiError"
      class="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100"
    >
      {{ apiError }}
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
