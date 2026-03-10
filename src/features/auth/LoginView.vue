<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-page-bg sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-center text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-indigo-500">
            create a new account
          </router-link>
        </p>
      </div>
      <form @submit.prevent="loginUser" class="p-8 mt-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div class="space-y-4 rounded-md">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg group bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from '@/features/auth/useAuth'
export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const error = ref('')

    const { login } = useAuth()

    const loginUser = async () => {
      isLoading.value = true
      try {
        await login(email.value, password.value)
      } catch (error) {
        error.value = error.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      isLoading,
      error,
      loginUser,
    }
  },
}
</script>
