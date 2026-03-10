<script setup>
import LoginForm from '../components/LoginForm.vue'
import { useAuth } from '../composables/useAuth'

const { isLoading, handleLogin } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Faça seu login</h1>
      <p class="text-slate-500 mt-2">Ou crie sua conta caso não tenha uma</p>
    </div>

    <LoginForm :isLoading="isLoading" @submit="handleLogin" />
  </div>
</template>
