import api from '@/app/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = JSON.parse(localStorage.getItem('user')) || null
  const token = localStorage.getItem('token') || null
  const isLoading = ref(false)

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const { data } = await api.post('/users/login', credentials)
      token.value = data.accessToken
      localStorage.setItem('token', data.accessToken)
      user.value = { name: credentials.username }
      localStorage.setItem('user', JSON.stringify(user.value))
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      await api.post('/users/register', userData)
      await login({ username: userData.username, password: userData.password })
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return { user, token, isLoading, login, register, logout }
})
