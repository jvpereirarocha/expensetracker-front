<script setup>
import LoginForm from '@/features/auth/components/LoginForm.vue'
import { useAuth } from '@/features/auth/composables/useAuth'

const { isLoading, handleLogin, errorMessage } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Faça seu login</h1>
      <p class="text-slate-500 mt-2">Bem-vindo de volta ao Controle de Gastos</p>
    </div>

    <LoginForm :isLoading="isLoading" :errorMessage="errorMessage" @submit="handleLogin" />

    <p class="mt-6 text-sm text-slate-600">
      Não tem uma conta?
      <router-link
        :to="{ name: 'Register' }"
        class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
      >
        Crie uma agora
      </router-link>
    </p>
  </div>
</template>
