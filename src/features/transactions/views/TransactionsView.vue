<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactions } from '../composables/useTransactions'
import TransactionsFilter from '../components/TransactionsFilter.vue'
import TransactionsTable from '../components/TransactionsTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const {
  transactions,
  isLoading,
  pagination,
  filters,
  formatCurrency,
  loadTransactions,
  removeTransaction,
} = useTransactions()

// Estado para o Modal de Exclusão
const isDeleteModalOpen = ref(false)
const transactionToDelete = ref(null)

onMounted(() => {
  loadTransactions(1)
})

const onFilter = (newFilters) => {
  loadTransactions(1, newFilters)
}

const onClearFilters = () => {
  loadTransactions(1, { startDate: '', endDate: '', description: '', type: '' })
}

const onPageChange = (newPage) => {
  loadTransactions(newPage, filters.value)
}

const onEdit = (id) => {
  // Redireciona para a tela de edição (ainda a ser ligada nas rotas)
  console.log(`Navegar para editar a transação ${id}`)
  router.push({ name: 'TransactionEdit', params: { id } })
}

const confirmDelete = (transaction) => {
  transactionToDelete.value = transaction
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (transactionToDelete.value) {
    await removeTransaction(transactionToDelete.value.id)
    isDeleteModalOpen.value = false
    transactionToDelete.value = null
    // Recarrega a página atual para garantir a consistência
    loadTransactions(pagination.value.currentPage, filters.value)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Transações</h1>
      <BaseButton variant="primary" class="w-auto" @click="router.push('/transactions/new')">
        + Nova Transação
      </BaseButton>
    </div>

    <TransactionsFilter :initialFilters="filters" @filter="onFilter" @clear="onClearFilters" />

    <TransactionsTable
      :transactions="transactions"
      :isLoading="isLoading"
      :pagination="pagination"
      :formatCurrency="formatCurrency"
      @edit="onEdit"
      @delete="confirmDelete"
      @page-change="onPageChange"
    />

    <BaseModal
      :isOpen="isDeleteModalOpen"
      title="Excluir Transação"
      @close="isDeleteModalOpen = false"
    >
      <p>
        Tem a certeza que deseja excluir a transação
        <strong>{{ transactionToDelete?.description }}</strong
        >?
      </p>
      <p class="mt-2 text-red-600 text-xs">Esta ação não pode ser desfeita.</p>

      <template #footer>
        <BaseButton variant="outline" class="w-auto" @click="isDeleteModalOpen = false"
          >Cancelar</BaseButton
        >
        <BaseButton variant="danger" class="w-auto" :isLoading="isLoading" @click="handleDelete"
          >Sim, excluir</BaseButton
        >
      </template>
    </BaseModal>
  </div>
</template>
