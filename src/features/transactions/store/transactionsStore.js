import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const isLoading = ref(false)

  // Estado de paginação (Máximo 20 itens)
  const pagination = ref({
    currentPage: 1,
    totalPages: 5,
    perPage: 20,
    totalItems: 95,
  })

  // Estado dos filtros
  const filters = ref({
    startDate: '',
    endDate: '',
    description: '',
    type: '',
  })

  const fetchTransactions = async (page = 1, currentFilters = null) => {
    isLoading.value = true
    try {
      if (currentFilters) {
        filters.value = { ...currentFilters }
      }
      pagination.value.currentPage = page

      // Mock da chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Gerar dados fictícios
      transactions.value = Array.from({ length: 5 }, (_, i) => ({
        id: i + page * 100,
        description: `Transação Exemplo ${i + 1} (Pág ${page})`,
        amount: Math.random() * 1000,
        type: Math.random() > 0.5 ? 'expense' : 'income',
        registered_at: '2026-03-10',
      }))
    } finally {
      isLoading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    isLoading.value = true
    try {
      // Mock da exclusão
      await new Promise((resolve) => setTimeout(resolve, 600))
      transactions.value = transactions.value.filter((t) => t.id !== id)
    } finally {
      isLoading.value = false
    }
  }

  return {
    transactions,
    isLoading,
    pagination,
    filters,
    fetchTransactions,
    deleteTransaction,
  }
})
