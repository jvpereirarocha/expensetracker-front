import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    port: 3000,
    '/users': {
      target: 'http://localhost:8008',
      changeOrigin: true,
    },
    '/transactions': {
      target: 'http://localhost:8008',
      changeOrigin: true,
    },
    '/dashboard': {
      target: 'http://localhost:8008',
      changeOrigin: true,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
