<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import BaseButton from '@/components/ui/BaseButton.vue'
import TransactionsFilter from '../components/TransactionsFilter.vue'

const router = useRouter()

const {
  transactions,
  categories,
  pagination,
  isLoading,
  error,
  filters,
  loadTransactions,
  applyFilters,
  clearFilters,
  loadCategories,
  nextPage,
  prevPage,
  getCategoryName,
  deleteTransaction,
} = useTransactions()

const handleDelete = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    await deleteTransaction(id)
    await loadTransactions(pagination.value.page)
  }
}

// Busca os dados assim que a tela é montada
onMounted(async () => {
  await Promise.all([loadTransactions(), loadCategories()])
})

const goToNewTransaction = () => {
  router.push({ name: 'TransactionCreate' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Transações</h1>
      <BaseButton variant="primary" @click="goToNewTransaction"> Nova Transação </BaseButton>
    </div>

    <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
      {{ error }}
    </div>

    <TransactionsFilter
      :filters="filters"
      :categories="categories"
      :isLoading="isLoading"
      @apply="applyFilters"
      @clear="clearFilters"
    />

    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Data</th>
              <th scope="col" class="px-6 py-4 font-medium">Descrição</th>
              <th scope="col" class="px-6 py-4 font-medium">Categoria</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">Valor</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-if="isLoading">
              <td colspan="4" class="px-6 py-8 text-center text-slate-400">
                Carregando transações...
              </td>
            </tr>

            <tr v-else-if="transactions.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-slate-400">
                Nenhuma transação registrada.
              </td>
            </tr>

            <tr
              v-else
              v-for="item in transactions"
              :key="item.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4">{{ item.registrationDate }}</td>
              <td class="px-6 py-4 font-medium text-slate-800">{{ item.description }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                >
                  {{ getCategoryName(item.categoryId) }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-right font-medium"
                :class="item.typeOfTransaction === 'income' ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ item.typeOfTransaction === 'income' ? '+' : '-' }}
                {{ item.amount }}
              </td>
              <td class="px-6 py-4 text-right space-x-3">
                <button
                  @click="router.push({ name: 'TransactionEdit', params: { id: item.id } })"
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="transactions.length > 0"
        class="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50"
      >
        <span class="text-sm text-slate-500">
          Página {{ pagination.page }} de {{ pagination.totalOfPages }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="pagination.prev === null || isLoading"
            @click="prevPage"
            class="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <button
            type="button"
            :disabled="pagination.next === null || isLoading"
            @click="nextPage"
            class="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
