import { createRouter, createWebHistory } from 'vue-router'

// Importando as Views
import LoginView from '@/features/auth/views/LoginView.vue'
import RegisterView from '@/features/auth/views/RegisterView.vue'
import HomeView from '@/features/dashboard/views/HomeView.vue'
import TransactionsView from '@/features/transactions/views/TransactionsView.vue'
import TransactionUpsertView from '@/features/transactions/views/TransactionUpsertView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    // Não tem requiresLayout, então vai renderizar sozinho na tela
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    // Não tem requiresLayout
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresLayout: true, // Vai renderizar DENTRO do AppLayout.vue
    },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionsView,
    meta: {
      requiresLayout: true, // Vai renderizar DENTRO do AppLayout.vue
    },
  },
  {
    path: '/transactions/new',
    name: 'TransactionCreate',
    component: TransactionUpsertView,
    meta: { requiresLayout: true },
  },
  {
    path: '/transactions/:id/edit',
    name: 'TransactionEdit',
    component: TransactionUpsertView,
    meta: { requiresLayout: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
