<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'

const route = useRoute()

// Verifica se a rota atual pediu para usar o AppLayout.
// Se não pediu (ex: Login), usa uma "div" comum como envelope.
const layoutComponent = computed(() => {
  return route.meta.requiresLayout ? AppLayout : 'div'
})
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
