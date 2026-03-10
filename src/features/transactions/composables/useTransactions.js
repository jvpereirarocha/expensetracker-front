import { useTransactionsStore } from '../store/transactionsStore'
import { computed } from 'vue'

export function useTransactions() {
  const store = useTransactionsStore()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const loadTransactions = (page = 1, filters = null) => {
    return store.fetchTransactions(page, filters)
  }

  const removeTransaction = async (id) => {
    await store.deleteTransaction(id)
  }

  return {
    transactions: computed(() => store.transactions),
    isLoading: computed(() => store.isLoading),
    pagination: computed(() => store.pagination),
    filters: computed(() => store.filters),
    formatCurrency,
    loadTransactions,
    removeTransaction,
  }
}
