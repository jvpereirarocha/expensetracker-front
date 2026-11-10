import { defineStore } from 'pinia'
import api from '@/app/api'

const apiTransactions = '/api/v1/dashboards'
const apiMonthly = `${apiTransactions}/monthly`
const apiExpensesByCategory = `${apiTransactions}/expenses-by-category`

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    monthlySummary: { income: 'R$ 0,00', expense: 'R$ 0,00', balance: 'R$ 0,00' },
    yearlySummary: { income: 'R$ 0,00', expense: 'R$ 0,00', balance: 'R$ 0,00' },
    isLoading: false,
    error: null,

    // Gráficos (/charts)
    monthlyChart: { year: null, months: [] },
    expensesByCategory: { month: null, year: null, total: 0, categories: [] },
    isMonthlyChartLoading: false,
    isCategoryChartLoading: false,
    monthlyChartError: null,
    categoryChartError: null,
  }),

  getters: {
    isChartsLoading: (state) => state.isMonthlyChartLoading || state.isCategoryChartLoading,
    chartsError: (state) => state.monthlyChartError || state.categoryChartError,
  },

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

    async fetchMonthlyChart(year) {
      this.isMonthlyChartLoading = true
      this.monthlyChartError = null

      try {
        const { data } = await api.get(apiMonthly, { params: { year } })
        this.monthlyChart = data
      } catch (error) {
        this.monthlyChartError = 'Erro ao carregar os gráficos.'
        console.error(error)
      } finally {
        this.isMonthlyChartLoading = false
      }
    },

    async fetchExpensesByCategory(month, year) {
      this.isCategoryChartLoading = true
      this.categoryChartError = null

      try {
        const { data } = await api.get(apiExpensesByCategory, { params: { month, year } })
        this.expensesByCategory = data
      } catch (error) {
        this.categoryChartError = 'Erro ao carregar os gráficos.'
        console.error(error)
      } finally {
        this.isCategoryChartLoading = false
      }
    },
  },
})
