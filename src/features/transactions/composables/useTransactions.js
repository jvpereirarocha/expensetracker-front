import { computed, ref } from 'vue'
import { useTransactionStore } from '@/features/transactions/store/transactionsStore'

export function useTransactions() {
  const store = useTransactionStore()

  // Retorna o estado reativo
  const transactions = computed(() => store.transactions)
  const categories = computed(() => store.categories)
  const pagination = computed(() => store.transactionPagination)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  const defaultFilterValues = {
    month: '',
    year: '',
    description: '',
    category: '',
    typeOfTransaction: '',
  }

  const filters = ref({
    ...defaultFilterValues,
  })

  // Ações
  const loadTransactions = async (page = 1) => {
    await store.fetchTransactions(page, filters.value)
  }

  const applyFilters = async () => {
    await loadTransactions(1)
  }

  const clearFilters = async () => {
    filters.value = { ...defaultFilterValues }
    await loadTransactions(1)
  }

  const loadCategories = async () => {
    await store.fetchCategories(true)
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
    const category = store.categories.find((c) => c.categoryId === categoryId)
    return category ? category.name : 'Desconhecida'
  }

  const createTransaction = async (data) => {
    await store.createTransaction(data)
  }

  const getTransactionById = async (id) => {
    return await store.getTransactionById(id)
  }

  const updateTransaction = async (id, data) => {
    await store.updateTransaction(id, data)
  }

  const deleteTransaction = async (id) => {
    await store.deleteTransaction(id)
  }

  return {
    transactions,
    categories,
    pagination,
    isLoading,
    error,
    applyFilters,
    clearFilters,
    filters,
    loadTransactions,
    loadCategories,
    nextPage,
    prevPage,
    getCategoryName,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
  }
}
