import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

/**
 * Composable for handling authentication logic.
 * @param {'login' | 'register'} mode - The mode of operation.
 */
export function useAuth(mode = 'login') {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const error = ref(null)
  const email = ref('')
  const password = ref('')

  const handleSubmit = async () => {
    isLoading.value = true
    error.value = null
    try {
      const action = mode === 'login' ? authStore.login : authStore.register
      await action(email.value, password.value)
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    email,
    password,
    handleSubmit,
  }
}
