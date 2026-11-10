import { computed, ref, watch } from 'vue'
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore'
import { useTransactionStore } from '@/features/transactions/store/transactionsStore'
import {
  buildMonthlyChartData,
  buildCategoryChartData,
  buildCategoryColorMap,
} from '@/features/charts/utils/chartData'

export function useCharts() {
  const store = useDashboardStore()
  const transactionStore = useTransactionStore()
  const today = new Date()

  const selectedYear = ref(today.getFullYear())
  const selectedMonth = ref(today.getMonth() + 1)

  const monthlyChartData = computed(() => buildMonthlyChartData(store.monthlyChart.months))
  const monthlyRows = computed(() => store.monthlyChart.months)

  // Lista global de categorias define a cor fixa de cada uma
  const categoryColorMap = computed(() => buildCategoryColorMap(transactionStore.categories))
  const categoryChart = computed(() =>
    buildCategoryChartData(store.expensesByCategory.categories, categoryColorMap.value),
  )
  const categoryChartData = computed(() => categoryChart.value.chartData)
  const categorySlices = computed(() => categoryChart.value.slices)
  const categoryTotal = computed(() => store.expensesByCategory.total)

  const isMonthlyLoading = computed(() => store.isMonthlyChartLoading)
  const isCategoryLoading = computed(() => store.isCategoryChartLoading)
  const monthlyError = computed(() => store.monthlyChartError)
  const categoryError = computed(() => store.categoryChartError)

  const loadMonthly = () => store.fetchMonthlyChart(selectedYear.value)
  const loadCategories = () =>
    store.fetchExpensesByCategory(selectedMonth.value, selectedYear.value)

  // fetchCategories() usa cache se a lista já estiver carregada
  const load = () =>
    Promise.all([loadMonthly(), loadCategories(), transactionStore.fetchCategories()])

  // Ano afeta os dois gráficos; mês afeta só a pizza.
  watch(selectedYear, load)
  watch(selectedMonth, loadCategories)

  return {
    selectedYear,
    selectedMonth,
    monthlyChartData,
    monthlyRows,
    categoryChartData,
    categorySlices,
    categoryTotal,
    isMonthlyLoading,
    isCategoryLoading,
    monthlyError,
    categoryError,
    load,
  }
}
