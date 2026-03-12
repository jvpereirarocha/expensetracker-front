import { createRouter, createWebHistory } from 'vue-router'

// Importando as Views
import LoginView from '@/features/auth/views/LoginView.vue'
import RegisterView from '@/features/auth/views/RegisterView.vue'
import HomeView from '@/features/dashboard/views/HomeView.vue'
import TransactionsView from '@/features/transactions/views/TransactionsView.vue'
import TransactionUpsertView from '@/features/transactions/views/TransactionUpsertView.vue'
import { useAuthStore } from '@/features/auth/store/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresLayout: true,
      requiresAuth: true,
    },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionsView,
    meta: {
      requiresLayout: true,
      requiresAuth: true,
    },
  },
  {
    path: '/transactions/new',
    name: 'TransactionCreate',
    component: TransactionUpsertView,
    meta: {
      requiresLayout: true,
      requiresAuth: true,
    },
  },
  {
    path: '/transactions/:id/edit',
    name: 'TransactionEdit',
    component: TransactionUpsertView,
    meta: {
      requiresLayout: true,
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
