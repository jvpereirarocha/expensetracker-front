<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  label: { type: String, required: true },
  id: { type: String, required: true },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '0,00' },
})

const emit = defineEmits(['update:modelValue'])
const displayValue = ref('')

const formatCurrency = (value) => {
  if (value === null || value === undefined) return ''

  // Remove tudo que não for dígito
  let numericValue = value.toString().replace(/\D/g, '')
  if (!numericValue) {
    emit('update:modelValue', 0)
    return ''
  }

  // Limita ao valor máximo de 1.000.000,00 (que são 100.000.000 em centavos)
  if (parseInt(numericValue) > 100000000) {
    numericValue = '100000000'
  }

  // Converte para decimal (float)
  const floatValue = parseInt(numericValue) / 100

  // Emite o valor numérico limpo para o pai
  emit('update:modelValue', floatValue)

  // Retorna a string formatada visualmente (pt-BR)
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(floatValue)
}

// Sincroniza caso o valor venha preenchido do backend (modo edição)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== null && newVal !== undefined) {
      // Transforma "2050.5" em "205050" para a função formatar corretamente
      const stringVal = Number(newVal).toFixed(2).replace('.', '')
      const formatted = formatCurrency(stringVal)
      if (displayValue.value !== formatted) {
        displayValue.value = formatted
      }
    }
  },
  { immediate: true },
)

const onInput = (event) => {
  displayValue.value = formatCurrency(event.target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium text-slate-700">{{ label }}</label>
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
      <input
        :id="id"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :required="required"
        class="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow"
        @input="onInput"
      />
    </div>
  </div>
</template>
