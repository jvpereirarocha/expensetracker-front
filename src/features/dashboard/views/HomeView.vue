<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore'
import { useTransactions } from '@/features/transactions/composables/useTransactions' // <-- Trocado para o Composable
import TransactionFilter from '@/features/transactions/components/TransactionsFilter.vue' // <-- Importando o Filtro

const dashboardStore = useDashboardStore()

// Trazemos tudo que o composable já tem pronto para nós
const {
  transactions,
  categories,
  filters,
  loadTransactions,
  loadCategories,
  isLoading: isTransactionsLoading, // Renomeado para não conflitar com o loading do dashboard
} = useTransactions()

onMounted(async () => {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  // Carrega as categorias (para o select do filtro), o dashboard atual e as transações atuais
  await Promise.all([
    loadCategories(),
    dashboardStore.fetchDashboardData(currentMonth, currentYear),
    loadTransactions(1),
  ])
})

const recentTransactions = computed(() => {
  return transactions.value.slice(0, 5)
})

const monthNames = [
  '',
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const dynamicMonthlyTitle = computed(() => {
  // Pega do filtro ou usa o mês atual. Converte para número para buscar no array
  const month = filters.value.month ? Number(filters.value.month) : new Date().getMonth() + 1

  // Pega do filtro ou usa o ano atual
  const year = filters.value.year || new Date().getFullYear()

  return `Resumo - ${monthNames[month]} de ${year}`
})

// Função que será chamada quando o botão "Filtrar" for clicado
const handleApplyFilters = async () => {
  // Se o usuário selecionou mês/ano, atualiza os cards do dashboard também!
  // Se não selecionou, usa o mês/ano atual por padrão nos cards.
  const targetMonth = filters.value.month || new Date().getMonth() + 1
  const targetYear = filters.value.year || new Date().getFullYear()

  await Promise.all([
    dashboardStore.fetchDashboardData(targetMonth, targetYear),
    loadTransactions(1),
  ])
}

// Função que será chamada quando o botão "Limpar Filtros" for clicado
const handleClearFilters = async () => {
  // Limpa o objeto de filtros
  filters.value = {
    month: '',
    year: '',
    description: '',
    category: '',
    typeOfTransaction: '',
  }

  // Volta tudo para o mês e ano atual
  const today = new Date()
  await Promise.all([
    dashboardStore.fetchDashboardData(today.getMonth() + 1, today.getFullYear()),
    loadTransactions(1),
  ])
}

const isPositive = (balanceString) => {
  if (!balanceString) return true
  return !balanceString.includes('-')
}

const formatCurrency = (backendString) => {
  if (!backendString) return 'R$ 0,00'
  const cleanString = backendString.replace(/[^\d,-]/g, '').replace(',', '.')
  const numberValue = parseFloat(cleanString)
  if (isNaN(numberValue)) return backendString

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue)
}
</script>

<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold text-slate-900">Visão Geral</h1>

    <div v-if="dashboardStore.isLoading" class="text-slate-500">Carregando dados...</div>

    <template v-else>
      <section>
        <h2 class="text-lg font-semibold text-slate-700 mb-4">{{ dynamicMonthlyTitle }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Total de Receitas</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(dashboardStore.monthlySummary.income) }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Total de Despesas</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(dashboardStore.monthlySummary.expense) }}
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4"
            :class="
              isPositive(dashboardStore.monthlySummary.balance)
                ? 'border-t-emerald-500'
                : 'border-t-red-500'
            "
          >
            <p class="text-sm font-medium text-slate-500">Saldo do Mês</p>
            <p
              class="text-2xl font-bold mt-1"
              :class="
                isPositive(dashboardStore.monthlySummary.balance)
                  ? 'text-emerald-600'
                  : 'text-red-600'
              "
            >
              {{ formatCurrency(dashboardStore.monthlySummary.balance) }}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-slate-700 mb-4 mt-8">Resumo Anual</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Receitas Anuais</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(dashboardStore.yearlySummary.income) }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Despesas Anuais</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(dashboardStore.yearlySummary.expense) }}
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4"
            :class="
              isPositive(dashboardStore.yearlySummary.balance)
                ? 'border-t-emerald-500'
                : 'border-t-red-500'
            "
          >
            <p class="text-sm font-medium text-slate-500">Saldo Anual</p>
            <p
              class="text-2xl font-bold mt-1"
              :class="
                isPositive(dashboardStore.yearlySummary.balance)
                  ? 'text-emerald-600'
                  : 'text-red-600'
              "
            >
              {{ formatCurrency(dashboardStore.yearlySummary.balance) }}
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold text-slate-700 mt-8">Últimas Transações</h2>

        <TransactionFilter
          :filters="filters"
          :categories="categories"
          :isLoading="isTransactionsLoading"
          @apply="handleApplyFilters"
          @clear="handleClearFilters"
        />

        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="bg-slate-50 text-slate-500">
                <tr>
                  <th class="px-6 py-3 font-medium">Data</th>
                  <th class="px-6 py-3 font-medium">Descrição</th>
                  <th class="px-6 py-3 font-medium">Tipo</th>
                  <th class="px-6 py-3 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="isTransactionsLoading">
                  <td colspan="4" class="px-6 py-8 text-center text-slate-400">
                    Buscando transações...
                  </td>
                </tr>
                <tr v-else-if="recentTransactions.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-slate-400">
                    Nenhuma transação registrada.
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="item in recentTransactions"
                  :key="item.id"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <td class="px-6 py-4">{{ item.registrationDate }}</td>
                  <td class="px-6 py-4">{{ item.description }}</td>
                  <td class="px-6 py-4">
                    <span
                      :class="
                        item.typeOfTransaction === 'income'
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-red-600 bg-red-50'
                      "
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ item.typeOfTransaction === 'income' ? 'Receita' : 'Despesa' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-medium">{{ formatCurrency(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
