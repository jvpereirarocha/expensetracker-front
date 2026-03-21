<script setup>
import { ref, computed, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCurrencyInput from '@/components/ui/BaseCurrencyInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  categories: { type: Array, default: () => [] },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const description = ref(props.initialData.description || '')
const amount = ref(props.initialData.amount || '')
const typeOfTransaction = ref(props.initialData.typeOfTransaction || 'expense')
const category = ref(props.initialData.category || '')
const registrationDate = ref(
  props.initialData.registrationDate || new Date().toISOString().split('T')[0],
)
const dueDate = ref(props.initialData.dueDate || '')

watch(typeOfTransaction, (newType) => {
  if (newType === 'income') {
    dueDate.value = ''
  }
})

const isIncome = computed(() => typeOfTransaction.value === 'income')

const onSubmit = () => {
  const numericAmount =
    typeof amount.value === 'string'
      ? parseFloat(amount.value.replace(/\./g, '').replace(',', '.'))
      : amount.value

  emit('submit', {
    description: description.value,
    amount: numericAmount,
    typeOfTransaction: typeOfTransaction.value,
    category: category.value,
    registrationDate: registrationDate.value,
    dueDate: isIncome.value ? '' : dueDate.value,
  })
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput id="desc" label="Descrição" v-model="description" required class="md:col-span-2" />

      <BaseCurrencyInput
        id="amount"
        label="Valor (R$)"
        v-model="amount"
        placeholder="0,00"
        required
      />

      <div class="flex flex-col gap-1">
        <label for="type" class="text-sm font-medium text-slate-700">Tipo de Transação</label>
        <select
          id="type"
          v-model="typeOfTransaction"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white"
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label for="category" class="text-sm font-medium text-slate-700">Categoria</label>
        <select
          id="category"
          v-model="category"
          required
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white"
        >
          <option value="" disabled>Selecione...</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <BaseInput
        id="reg_date"
        label="Data de Registro"
        type="date"
        v-model="registrationDate"
        required
      />

      <BaseInput
        v-if="!isIncome"
        id="due_date"
        label="Data de Vencimento"
        type="date"
        v-model="dueDate"
        required
      />
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')">Cancelar</BaseButton>
      <BaseButton type="submit" variant="primary" :isLoading="isSaving">Salvar</BaseButton>
    </div>
  </form>
</template>
