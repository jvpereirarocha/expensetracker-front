import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8008',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Validação de erro caso o backend esteja inacessível
    if (!error.response) {
      alert('Erro de Conexão: O servidor do backend está inacessível.')
      return Promise.reject(new Error('Servidor offline'))
    }

    if (error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
