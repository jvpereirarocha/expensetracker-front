<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const emit = defineEmits(['submit'])

const username = ref('')
const password = ref('')

const onSubmit = () => {
  emit('submit', { username: username.value, password: password.value })
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md"
  >
    <BaseInput id="username" label="Nome de Usuário" type="text" v-model="username" required />
    <BaseInput id="password" label="Senha" type="password" v-model="password" required />
    <div
      v-if="errorMessage"
      class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
    >
      <svg
        class="w-5 h-5 text-red-600 shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p class="text-sm text-red-600 font-medium leading-relaxed">
        {{ errorMessage }}
      </p>
    </div>
    <div class="pt-2">
      <BaseButton type="submit" variant="primary" :isLoading="isLoading"> Entrar </BaseButton>
    </div>
  </form>
</template>
