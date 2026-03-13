import { computed } from 'vue'
import { useTransactionStore } from '@/features/transactions/store/transactionsStore'

export function useTransactions() {
  const store = useTransactionStore()

  // Retorna o estado reativo
  const transactions = computed(() => store.transactions)
  const categories = computed(() => store.categories)
  const pagination = computed(() => store.pagination)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  // Ações
  const loadTransactions = async (page = 1) => {
    await store.fetchTransactions(page)
  }

  const loadCategories = async () => {
    await store.fetchCategories()
  }

  const nextPage = async () => {
    if (store.pagination.next !== null) {
      await loadTransactions(store.pagination.next)
    }
  }

  const prevPage = async () => {
    if (store.pagination.prev !== null) {
      await loadTransactions(store.pagination.prev)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = store.categories.find((c) => c.category_id === categoryId)
    return category ? category.name : 'Desconhecida'
  }

  return {
    transactions,
    categories,
    pagination,
    isLoading,
    error,
    loadTransactions,
    loadCategories,
    nextPage,
    prevPage,
    getCategoryName,
  }
}
