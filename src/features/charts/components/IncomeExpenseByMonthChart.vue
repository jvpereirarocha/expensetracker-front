<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { formatBRL, MONTH_LABELS } from '@/features/charts/utils/chartData'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  chartData: { type: Object, required: true },
  rows: { type: Array, default: () => [] },
  selectedMonth: { type: Number, default: null },
})

const emit = defineEmits(['select-month'])

const compactBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const styledData = computed(() => ({
  ...props.chartData,
  datasets: props.chartData.datasets.map((dataset) => ({
    ...dataset,
    borderRadius: 4,
    borderSkipped: 'start',
    barPercentage: 0.85,
    categoryPercentage: 0.7,
    maxBarThickness: 24,
  })),
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  onClick: (_event, elements) => {
    if (elements.length > 0) emit('select-month', elements[0].index + 1)
  },
  onHover: (event, elements) => {
    event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: { usePointStyle: true, pointStyle: 'rectRounded', color: '#475569' },
    },
    tooltip: {
      callbacks: {
        title: (items) => MONTH_LABELS[items[0].dataIndex],
        label: (item) => `${item.dataset.label}: ${formatBRL(item.raw)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: (ctx) => (ctx.index + 1 === props.selectedMonth ? '#4338ca' : '#64748b'),
        font: (ctx) => ({ weight: ctx.index + 1 === props.selectedMonth ? 'bold' : 'normal' }),
      },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: '#f1f5f9' },
      ticks: { color: '#64748b', callback: (value) => compactBRL.format(value) },
    },
  },
}))
</script>

<template>
  <div>
    <div class="h-80">
      <Bar
        :data="styledData"
        :options="options"
        aria-label="Gráfico de barras com receitas e despesas de cada mês do ano"
        role="img"
      />
    </div>

    <details class="mt-4 text-sm text-slate-600">
      <summary class="cursor-pointer text-slate-500 hover:text-indigo-600">Ver tabela</summary>
      <table class="w-full mt-2 text-left">
        <thead class="text-slate-500">
          <tr>
            <th class="py-1 font-medium">Mês</th>
            <th class="py-1 font-medium text-right">Receitas</th>
            <th class="py-1 font-medium text-right">Despesas</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="row in rows" :key="row.month">
            <td class="py-1">{{ MONTH_LABELS[row.month - 1] }}</td>
            <td class="py-1 text-right">{{ formatBRL(row.income) }}</td>
            <td class="py-1 text-right">{{ formatBRL(row.expense) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>
