import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value)

  // --- ACTIONS ---
  async function login(email, password) {
    // In a real app, you'd make an API call here.
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockToken = `mock-token-for-${email}`
      token.value = mockToken
      localStorage.setItem('token', mockToken)
      user.value = { email }
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Authentication failed. Please check your credentials.')
    }
  }

  async function register(email, password) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration & login
      const mockToken = `mock-token-for-${email}`
      token.value = mockToken
      localStorage.setItem('token', mockToken)
      user.value = { email }
    } catch (error) {
      console.error('Registration failed:', error)
      throw new Error('Registration failed. Please try again.')
    }
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
