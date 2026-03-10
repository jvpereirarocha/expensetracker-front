<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const onSubmit = () => {
  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  })
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md"
  >
    <BaseInput id="name" label="Nome Completo" type="text" v-model="name" required />
    <BaseInput id="email" label="Email" type="email" v-model="email" required />
    <BaseInput id="password" label="Senha" type="password" v-model="password" required />
    <BaseInput
      id="password_confirmation"
      label="Confirme sua Senha"
      type="password"
      v-model="password_confirmation"
      required
    />
    <div class="pt-4">
      <BaseButton type="submit" variant="primary" :isLoading="isLoading"> Criar conta </BaseButton>
    </div>
  </form>
</template>
