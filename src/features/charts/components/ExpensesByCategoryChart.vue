<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { formatBRL } from '@/features/charts/utils/chartData'

ChartJS.register(ArcElement, Tooltip)

const props = defineProps({
  chartData: { type: Object, required: true },
  slices: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (item) => {
          const slice = props.slices[item.dataIndex]
          return `${slice.category}: ${formatBRL(slice.amount)} (${slice.percentage.toFixed(2)}%)`
        },
      },
    },
  },
}

const formatPercentage = (value) =>
  `${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
</script>

<template>
  <div
    v-if="slices.length === 0"
    class="h-64 flex items-center justify-center text-slate-400 text-sm"
  >
    Sem despesas neste mês.
  </div>

  <div v-else class="flex flex-col md:flex-row items-center gap-6">
    <div class="relative h-64 w-64 shrink-0">
      <Doughnut
        :data="chartData"
        :options="options"
        aria-label="Gráfico de rosca com as despesas do mês por categoria"
        role="img"
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span class="text-xs text-slate-500">Total</span>
        <span class="text-lg font-bold text-slate-900">{{ formatBRL(total) }}</span>
      </div>
    </div>

    <ul class="w-full space-y-2 text-sm">
      <li
        v-for="slice in slices"
        :key="slice.category"
        class="flex items-center justify-between gap-3"
      >
        <span class="flex items-center gap-2 min-w-0 text-slate-700">
          <span
            class="h-3 w-3 rounded-sm shrink-0"
            :style="{ backgroundColor: slice.color }"
            aria-hidden="true"
          ></span>
          <span class="truncate">{{ slice.category }}</span>
        </span>
        <span class="flex items-center gap-3 shrink-0">
          <span class="font-medium text-slate-900">{{ formatBRL(slice.amount) }}</span>
          <span class="w-16 text-right text-slate-500">{{
            formatPercentage(slice.percentage)
          }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
