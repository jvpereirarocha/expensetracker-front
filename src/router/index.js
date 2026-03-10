import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../features/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../features/auth/RegisterView.vue'),
    },
  ],
})

export default router
