<script setup>
import { onMounted } from 'vue'
import { useCharts } from '@/features/charts/composables/useCharts'
import { MONTH_LABELS } from '@/features/charts/utils/chartData'
import IncomeExpenseByMonthChart from '@/features/charts/components/IncomeExpenseByMonthChart.vue'
import ExpensesByCategoryChart from '@/features/charts/components/ExpensesByCategoryChart.vue'

const {
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
} = useCharts()

// Ano atual e os 4 anteriores
const currentYear = new Date().getFullYear()
const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i)

const handleSelectMonth = (month) => {
  selectedMonth.value = month
}

onMounted(load)
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900">Gráficos</h1>

      <div class="flex gap-3">
        <label class="flex flex-col text-xs font-medium text-slate-500">
          Ano
          <select
            v-model.number="selectedYear"
            class="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </label>
        <label class="flex flex-col text-xs font-medium text-slate-500">
          Mês (despesas por categoria)
          <select
            v-model.number="selectedMonth"
            class="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option v-for="(label, index) in MONTH_LABELS" :key="label" :value="index + 1">
              {{ label }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 class="text-lg font-semibold text-slate-700">Receitas x Despesas - {{ selectedYear }}</h2>
      <p class="text-sm text-slate-500 mb-4">
        Clique em um mês para ver suas despesas por categoria.
      </p>

      <div v-if="monthlyError" class="h-80 flex items-center justify-center text-red-600 text-sm">
        {{ monthlyError }}
      </div>
      <div
        v-else-if="isMonthlyLoading"
        class="h-80 flex items-center justify-center text-slate-500 text-sm"
      >
        Carregando dados...
      </div>
      <IncomeExpenseByMonthChart
        v-else
        :chart-data="monthlyChartData"
        :rows="monthlyRows"
        :selected-month="selectedMonth"
        @select-month="handleSelectMonth"
      />
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 class="text-lg font-semibold text-slate-700 mb-4">
        Despesas por categoria - {{ MONTH_LABELS[selectedMonth - 1] }} de {{ selectedYear }}
      </h2>

      <div v-if="categoryError" class="h-64 flex items-center justify-center text-red-600 text-sm">
        {{ categoryError }}
      </div>
      <div
        v-else-if="isCategoryLoading"
        class="h-64 flex items-center justify-center text-slate-500 text-sm"
      >
        Carregando dados...
      </div>
      <ExpensesByCategoryChart
        v-else
        :chart-data="categoryChartData"
        :slices="categorySlices"
        :total="categoryTotal"
      />
    </section>
  </div>
</template>
