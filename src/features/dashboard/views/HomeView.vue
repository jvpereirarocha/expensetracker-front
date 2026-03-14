<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '../store/dashboardStore'
import { useTransactionStore } from '@/features/transactions/store/transactionsStore'

const dashboardStore = useDashboardStore()
const transactionStore = useTransactionStore()

onMounted(async () => {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  await Promise.all([
    dashboardStore.fetchDashboardData(currentMonth, currentYear),
    transactionStore.fetchTransactions(1),
  ])
})

const recentTransactions = computed(() => {
  return transactionStore.transactions.slice(0, 5)
})

// Como o saldo agora é uma string (ex: "-R$ 500,00" ou "R$ -500,00"),
// verificamos se existe um sinal de menos para definir a cor vermelha.
const isPositive = (balanceString) => {
  if (!balanceString) return true
  return !balanceString.includes('-')
}

const formatCurrency = (backendString) => {
  if (!backendString) return 'R$ 0,00'

  // 1. Remove tudo que não for número, vírgula ou sinal de menos
  const cleanString = backendString.replace(/[^\d,-]/g, '').replace(',', '.')

  // 2. Converte para float
  const numberValue = parseFloat(cleanString)

  // Se falhar na conversão por algum motivo, retorna o original
  if (isNaN(numberValue)) return backendString

  // 3. Formata corretamente com o ponto de milhar do padrão pt-BR
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
        <h2 class="text-lg font-semibold text-slate-700 mb-4">Resumo Mensal</h2>
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

      <section class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-lg font-semibold text-slate-700">Últimas Transações</h2>
        </div>
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
              <tr v-if="recentTransactions.length === 0">
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
      </section>
    </template>
  </div>
</template>
