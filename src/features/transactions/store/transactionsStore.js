import { defineStore } from 'pinia'
import api from '@/app/api'

const apiTransactions = '/api/v1/transactions'
const apiCategories = '/api/v1/categories'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    categories: [],
    transactionPagination: {
      page: 1,
      totalOfPages: 1,
      itemsPerPage: 10,
      prev: null,
      next: null,
    },
    categoryPagination: {
      page: 1,
      totalOfPages: 1,
      itemsPerPage: 20,
      prev: null,
      next: null,
    },
    isLoading: false,
    error: null,
  }),

  actions: {
    filterParams(page, filters) {
      const params = { page, ...filters }
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })
      return params
    },
    async fetchTransactions(page = 1, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const params = this.filterParams(page, filters)
        const { data } = await api.get(apiTransactions, { params })

        // Atribui os itens e os metadados de paginação recebidos da API
        this.transactions = data.transactions
        this.transactionPagination = {
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

    async fetchCategories(syncWithBackend = false) {
      if (this.categories.length > 0 && !syncWithBackend) return

      try {
        const params = { itemsPerPage: this.categoryPagination.itemsPerPage }
        const { data } = await api.get(apiCategories, { params })
        this.categories = data.results
        this.categoryPagination = {
          page: data.page,
          totalItems: data.totalItems,
          totalOfPages: data.totalOfPages,
          itemsPerPage: data.itemsPerPage,
          prev: data.prev,
          next: data.next,
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    },

    async createCategory(categoryData) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await api.post(apiCategories, categoryData)
        // Force a refresh to ensure the local list includes the new category
        await this.fetchCategories(true)
        return data
      } catch (error) {
        if (error.response?.status === 422) {
          this.error = 'Erro de validação. Verifique os dados da categoria.'
        } else {
          this.error = error.response?.data?.detail || 'Erro ao criar categoria.'
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async upsertCategory(categoryData) {
      if (categoryData.categoryId) {
        const { categoryId, ...data } = categoryData
        return await this.updateCategory(categoryId, data)
      }
      return await this.createCategory(categoryData)
    },

    async updateCategory(id, categoryData) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await api.patch(`${apiCategories}/${id}`, categoryData)
        await this.fetchCategories(true)
        return data
      } catch (error) {
        if (error.response?.status === 422) {
          this.error = 'Erro de validação. Verifique os dados da categoria.'
        } else {
          this.error = error.response?.data?.detail || 'Erro ao atualizar categoria.'
        }
        throw error
      } finally {
        this.isLoading = false
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
