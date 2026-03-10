<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  transactions: { type: Array, required: true },
  pagination: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  formatCurrency: { type: Function, required: true },
})

defineEmits(['edit', 'delete', 'page-change'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
    <div v-if="isLoading" class="p-8 text-center text-slate-500">A carregar transações...</div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">Data</th>
            <th class="px-6 py-4 font-medium">Descrição</th>
            <th class="px-6 py-4 font-medium">Tipo</th>
            <th class="px-6 py-4 font-medium">Valor</th>
            <th class="px-6 py-4 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Nenhuma transação encontrada.
            </td>
          </tr>
          <tr
            v-for="item in transactions"
            :key="item.id"
            class="hover:bg-slate-50 transition-colors"
          >
            <td class="px-6 py-4">{{ item.registered_at }}</td>
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
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="$emit('edit', item.id)"
                class="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Editar
              </button>
              <button
                @click="$emit('delete', item)"
                class="text-red-600 hover:text-red-800 font-medium"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!isLoading && pagination.totalPages > 1"
      class="px-6 py-4 border-t border-slate-100 flex items-center justify-between"
    >
      <span class="text-sm text-slate-500">
        Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
      </span>
      <div class="flex gap-2">
        <BaseButton
          variant="outline"
          class="w-auto py-1 px-3 text-sm"
          :disabled="pagination.currentPage === 1"
          @click="$emit('page-change', pagination.currentPage - 1)"
          >Anterior</BaseButton
        >
        <BaseButton
          variant="outline"
          class="w-auto py-1 px-3 text-sm"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="$emit('page-change', pagination.currentPage + 1)"
          >Próxima</BaseButton
        >
      </div>
    </div>
  </div>
</template>
