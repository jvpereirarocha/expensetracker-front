import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import api from '@/app/api'
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore'

vi.mock('@/app/api', () => ({ default: { get: vi.fn() } }))

describe('dashboardStore - charts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(api.get).mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('fetchMonthlyChart calls /monthly with year and stores the response', async () => {
    const response = {
      year: 2025,
      months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 10, expense: 5 })),
    }
    vi.mocked(api.get).mockResolvedValue({ data: response })
    const store = useDashboardStore()

    await store.fetchMonthlyChart(2025)

    expect(api.get).toHaveBeenCalledWith('/api/v1/dashboards/monthly', {
      params: { year: 2025 },
    })
    expect(store.monthlyChart).toEqual(response)
    expect(store.isChartsLoading).toBe(false)
    expect(store.chartsError).toBeNull()
  })

  it('fetchExpensesByCategory calls /expenses-by-category with month and year', async () => {
    const response = {
      month: 3,
      year: 2025,
      total: 100,
      categories: [{ category: 'Saúde', amount: 100, percentage: 100 }],
    }
    vi.mocked(api.get).mockResolvedValue({ data: response })
    const store = useDashboardStore()

    await store.fetchExpensesByCategory(3, 2025)

    expect(api.get).toHaveBeenCalledWith('/api/v1/dashboards/expenses-by-category', {
      params: { month: 3, year: 2025 },
    })
    expect(store.expensesByCategory).toEqual(response)
  })

  it('sets chartsError when a request fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('boom'))
    const store = useDashboardStore()

    await store.fetchMonthlyChart(2025)

    expect(store.chartsError).toBe('Erro ao carregar os gráficos.')
    expect(store.isChartsLoading).toBe(false)
  })

  it('does not touch the summary-cards loading flag', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { year: 2025, months: [] } })
    const store = useDashboardStore()

    const pending = store.fetchMonthlyChart(2025)
    expect(store.isChartsLoading).toBe(true)
    expect(store.isLoading).toBe(false)
    await pending
  })
})
