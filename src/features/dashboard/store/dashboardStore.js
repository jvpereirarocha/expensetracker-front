import { defineStore } from 'pinia'
import api from '@/app/api'

const apiTransactions = '/api/v1/dashboards'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    monthlySummary: { income: 'R$ 0,00', expense: 'R$ 0,00', balance: 'R$ 0,00' },
    yearlySummary: { income: 'R$ 0,00', expense: 'R$ 0,00', balance: 'R$ 0,00' },
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardData(month, year) {
      this.isLoading = true
      this.error = null

      try {
        const params = { month, year }
        const { data } = await api.get(apiTransactions, { params })

        this.monthlySummary = {
          income: data.monthlyRevenues,
          expense: data.monthlyExpenses,
          balance: data.monthlyBalance,
        }

        this.yearlySummary = {
          income: data.yearlyRevenues,
          expense: data.yearlyExpenses,
          balance: data.yearlyBalance,
        }
      } catch (error) {
        this.error = 'Erro ao carregar o resumo.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
