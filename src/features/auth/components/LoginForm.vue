<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const email = ref('')
const password = ref('')

const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md"
  >
    <BaseInput id="email" label="Email" type="email" v-model="email" required />
    <BaseInput id="password" label="Senha" type="password" v-model="password" required />
    <div class="pt-2">
      <BaseButton type="submit" variant="primary" :isLoading="isLoading"> Entrar </BaseButton>
    </div>
  </form>
</template>
