<script setup>
import RegisterForm from '../components/RegisterForm.vue'
import { useAuth } from '../composables/useAuth'

const { isLoading, handleRegister } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Crie sua conta</h1>
      <p class="text-slate-500 mt-2">Comece a controlar seus gastos hoje mesmo</p>
    </div>

    <RegisterForm :isLoading="isLoading" @submit="handleRegister" />

    <p class="mt-6 text-sm text-slate-600">
      Já tem uma conta?
      <router-link
        to="/login"
        class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
      >
        Faça login
      </router-link>
    </p>
  </div>
</template>
