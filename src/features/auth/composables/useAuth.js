import { useAuthStore } from '../store/authStore'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  const isLoading = computed(() => store.isLoading)
  const user = computed(() => store.user)

  const errorMessage = ref('')

  const handleLogin = async (payload) => {
    errorMessage.value = ''
    try {
      await store.login(payload)
      router.push({ name: 'Home' })
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleRegister = async (payload) => {
    errorMessage.value = ''
    if (payload.password !== payload.confirmPassword) {
      errorMessage.value = 'As senhas não coincidem. Por favor, verifique.'
      return
    }
    try {
      await store.register(payload)
      router.push({ name: 'Home' })
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      const detail = error.response.data.detail

      if (Array.isArray(detail)) {
        errorMessage.value = detail[0].msg
      } else if (typeof detail === 'string') {
        errorMessage.value = detail
      } else {
        errorMessage.value = 'Erro de validação nos dados enviados.'
      }
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }

  const handleLogout = () => {
    store.logout()
    router.push({ name: 'Login' })
  }

  return {
    user,
    isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
    errorMessage,
  }
}
