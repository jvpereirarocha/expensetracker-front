<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '../store/dashboardStore'

const store = useDashboardStore()

onMounted(async () => {
  await store.fetchDashboardData()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
</script>

<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold text-slate-900">Visão Geral</h1>

    <div v-if="store.isLoading" class="text-slate-500">Carregando dados...</div>

    <template v-else>
      <section>
        <h2 class="text-lg font-semibold text-slate-700 mb-4">Resumo Mensal</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Total de Receitas</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(store.monthlySummary.income) }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Total de Despesas</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(store.monthlySummary.expense) }}
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4"
            :class="store.monthlySummary.balance >= 0 ? 'border-t-blue-500' : 'border-t-red-500'"
          >
            <p class="text-sm font-medium text-slate-500">Saldo do Mês</p>
            <p
              class="text-2xl font-bold mt-1"
              :class="store.monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-red-600'"
            >
              {{ formatCurrency(store.monthlySummary.balance) }}
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
              {{ formatCurrency(store.yearlySummary.income) }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p class="text-sm font-medium text-slate-500">Despesas Anuais</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ formatCurrency(store.yearlySummary.expense) }}
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4"
            :class="store.yearlySummary.balance >= 0 ? 'border-t-blue-500' : 'border-t-red-500'"
          >
            <p class="text-sm font-medium text-slate-500">Saldo Anual</p>
            <p
              class="text-2xl font-bold mt-1"
              :class="store.yearlySummary.balance >= 0 ? 'text-blue-600' : 'text-red-600'"
            >
              {{ formatCurrency(store.yearlySummary.balance) }}
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
              <tr
                v-for="item in store.recentTransactions"
                :key="item.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4">{{ item.date }}</td>
                <td class="px-6 py-4">{{ item.description }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      item.type === 'income' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'
                    "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ item.type === 'income' ? 'Receita' : 'Despesa' }}
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
