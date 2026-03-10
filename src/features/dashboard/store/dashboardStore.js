import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const monthlySummary = ref({ income: 0, expense: 0, balance: 0 })
  const yearlySummary = ref({ income: 0, expense: 0, balance: 0 })
  const recentTransactions = ref([])
  const isLoading = ref(false)

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      // Mock da API
      await new Promise((resolve) => setTimeout(resolve, 800))
      monthlySummary.value = { income: 5000, expense: 3200, balance: 1800 }
      yearlySummary.value = { income: 60000, expense: 45000, balance: 15000 }
      recentTransactions.value = [
        { id: 1, description: 'Mercado', amount: 450.5, type: 'expense', date: '2026-03-10' },
        { id: 2, description: 'Salário', amount: 5000.0, type: 'income', date: '2026-03-05' },
      ]
    } finally {
      isLoading.value = false
    }
  }

  return { monthlySummary, yearlySummary, recentTransactions, isLoading, fetchDashboardData }
})
