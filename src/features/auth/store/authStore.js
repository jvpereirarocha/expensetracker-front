import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)

  const login = async (credentials) => {
    isLoading.value = true
    try {
      // Mock da API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      token.value = 'mock-jwt-token-123'
      user.value = { id: 1, name: 'Usuário Teste', email: credentials.email }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Mock
      token.value = 'mock-jwt-token-123'
      user.value = { id: 1, name: userData.name, email: userData.email }
    } finally {
      isLoading.value = false
    }
  }

  return { user, token, isLoading, login, register }
})
