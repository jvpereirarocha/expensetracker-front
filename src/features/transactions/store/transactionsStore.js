import { defineStore } from 'pinia'
import api from '@/app/api'

const apiTransactions = '/api/v1/transactions'
const apiCategories = '/api/v1/categories'

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
    async fetchTransactions(page = 1, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const params = { page, ...filters }
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === null) {
            delete params[key]
          }
        })
        const { data } = await api.get(apiTransactions, { params })

        // Atribui os itens e os metadados de paginação recebidos da API
        this.transactions = data.transactions
        this.pagination = {
          page: data.page,
          totalItems: data.totalItems,
          totalOfPages: data.totalOfPages,
          itemsPerPage: data.itemsPerPage,
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
        const { data } = await api.get(apiCategories)
        this.categories = data.results
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    },

    async createTransaction(transactionData) {
      this.isLoading = true
      this.error = null

      try {
        await api.post(apiTransactions, transactionData)
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

    async getTransactionById(id) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get(`${apiTransactions}/${id}`)
        return data
      } catch (error) {
        this.error = 'Erro ao buscar os detalhes da transação.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateTransaction(id, transactionData) {
      this.isLoading = true
      this.error = null
      try {
        await api.put(`${apiTransactions}/${id}`, transactionData)
      } catch (error) {
        if (error.response?.status === 422) {
          this.error = 'Erro de validação. Verifique os dados preenchidos.'
        } else {
          this.error = error.response?.data?.detail || 'Erro ao atualizar transação.'
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteTransaction(id) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`${apiTransactions}/${id}`)
      } catch (error) {
        this.error = error.response?.data?.detail || 'Erro ao excluir transação.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
