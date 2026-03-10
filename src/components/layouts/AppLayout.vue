<script setup>
import { ref } from 'vue'

// Array dinâmico com a configuração do menu
const navigation = ref([
  {
    label: 'Visão Geral',
    routeName: 'Home', // Este nome deve ser exatamente o mesmo definido no router.js
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>`,
  },
  {
    label: 'Transações',
    routeName: 'Transactions',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>`,
  },
])
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 font-sans text-slate-900">
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">Controle Gasto</h1>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50 hover:text-indigo-600"
          active-class="bg-indigo-50 text-indigo-700"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            v-html="item.icon"
          ></svg>
          {{ item.label }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-200">
        <button
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Sair da conta
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
