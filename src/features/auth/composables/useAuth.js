import { useAuthStore } from '../store/authStore'
import { computed } from 'vue'
// import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useAuthStore()
  // const router = useRouter()

  const isLoading = computed(() => store.isLoading)

  const handleLogin = async (payload) => {
    await store.login(payload)
    // router.push({ name: 'Home' })
  }

  const handleRegister = async (payload) => {
    if (payload.password !== payload.password_confirmation) {
      alert('As senhas não coincidem. Por favor, verifique.')
      return
    }

    await store.register(payload)
    // router.push({ name: 'Home' })
  }

  return {
    isLoading,
    handleLogin,
    handleRegister,
  }
}
