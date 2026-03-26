<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        id="name"
        label="Nome da Categoria"
        v-model="name"
        required
        placeholder="Ex: Alimentação"
        class="md:col-span-2"
      />

      <BaseInput
        id="description"
        label="Descrição"
        v-model="description"
        required
        placeholder="Descreva a finalidade desta categoria"
        class="md:col-span-2"
      />
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')">Cancelar</BaseButton>
      <BaseButton type="submit" variant="primary" :isLoading="isSaving">
        {{ isEditing ? 'Atualizar' : 'Salvar' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const name = ref(props.initialData.name || '')
const description = ref(props.initialData.description || '')

const isEditing = computed(() => !!props.initialData.categoryId)

const onSubmit = () => {
  emit('submit', {
    ...props.initialData,
    name: name.value,
    description: description.value,
  })
}
</script>
