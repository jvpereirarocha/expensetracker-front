<script setup>
import { watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// O componente recebe o objeto de filtros, a lista de categorias e o status de loading
const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

// Define os eventos que este componente pode disparar para o "pai"
const emit = defineEmits(['apply', 'clear'])

// Lógica dos anos dinâmicos (Ano atual e os dois anteriores)
const currentYear = new Date().getFullYear()
const availableYears = [currentYear, currentYear - 1, currentYear - 2]

// Lógica dos meses fixos
const availableMonths = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]
let typingTimer

watch(
  () => props.filters,
  () => {
    // Limpa o cronômetro anterior se o usuário ainda estiver digitando/clicando
    clearTimeout(typingTimer)

    // Inicia um novo cronômetro de 500 milissegundos
    typingTimer = setTimeout(() => {
      // Após 500ms sem novas alterações, emite o evento para as telas buscarem os dados
      emit('apply')
    }, 500)
  },
  { deep: true },
)
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Mês</label>
        <select
          v-model="filters.month"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        >
          <option value="">Selecione...</option>
          <option v-for="month in availableMonths" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Ano</label>
        <select
          v-model="filters.year"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        >
          <option value="">Selecione...</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Descrição</label>
        <input
          type="text"
          v-model="filters.description"
          placeholder="Ex: supermercado"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Categoria</label>
        <select
          v-model="filters.category"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        >
          <option value="">Selecione...</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Tipo</label>
        <select
          v-model="filters.typeOfTransaction"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        >
          <option value="">Selecione...</option>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-700">Status</label>
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
        >
          <option value="">Selecione...</option>
          <option value="NOT_PAID">Não Pago</option>
          <option value="PAYING">Pagando</option>
          <option value="ALREADY_PAID">Pago</option>
          <option value="RECEIVED">Recebido</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
      <BaseButton variant="outline" @click="$emit('clear')" :disabled="isLoading">
        Limpar Filtros
      </BaseButton>
    </div>
  </div>
</template>
