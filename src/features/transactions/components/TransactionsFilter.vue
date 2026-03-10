<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  initialFilters: { type: Object, required: true },
})

const emit = defineEmits(['filter', 'clear'])

const localFilters = ref({ ...props.initialFilters })

const applyFilters = () => {
  emit('filter', localFilters.value)
}

const clearFilters = () => {
  localFilters.value = { startDate: '', endDate: '', description: '', type: '' }
  emit('clear')
}
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <BaseInput id="filter_start" label="Data (De)" type="date" v-model="localFilters.startDate" />
      <BaseInput id="filter_end" label="Data (Até)" type="date" v-model="localFilters.endDate" />
      <BaseInput
        id="filter_desc"
        label="Descrição"
        v-model="localFilters.description"
        placeholder="Buscar..."
      />

      <div class="flex flex-col gap-1">
        <label for="filter_type" class="text-sm font-medium text-slate-700">Tipo</label>
        <select
          id="filter_type"
          v-model="localFilters.type"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 bg-white"
        >
          <option value="">Todos</option>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-4">
      <BaseButton variant="outline" @click="clearFilters" class="w-auto text-sm py-1.5"
        >Limpar</BaseButton
      >
      <BaseButton variant="primary" @click="applyFilters" class="w-auto text-sm py-1.5"
        >Filtrar</BaseButton
      >
    </div>
  </div>
</template>
