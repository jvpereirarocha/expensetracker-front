import { defineStore } from 'pinia'
import api from '@/app/api'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    categories: [],
    pagination: {
      page: 1,
      totalOfPages: 1,
      prev: null,
      next: null,
    },
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchTransactions(page = 1) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await api.get(`/transactions/?page=${page}`)

        // Atribui os itens e os metadados de paginação recebidos da API
        this.transactions = data.items
        this.pagination = {
          page: data.page,
          totalOfPages: data.totalOfPages,
          prev: data.prev,
          next: data.next,
        }
      } catch (error) {
        this.error = error.response?.data?.detail || 'Erro ao carregar transações.'
        console.error('Erro na listagem:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      if (this.categories.length > 0) return

      try {
        const { data } = await api.get('/categories/')
        this.categories = data.results
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    },

    async createTransaction(transactionData) {
      this.isLoading = true
      this.error = null

      try {
        await api.post('/transactions/', transactionData)
      } catch (error) {
        if (error.response?.status === 422) {
          this.error = 'Erro de validação. Verifique os dados preenchidos.'
          console.error('Detalhes do 422:', error.response.data)
        } else {
          this.error = error.response?.data?.detail || 'Erro ao criar transação.'
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
