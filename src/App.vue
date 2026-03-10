<template>
  <div class="flex h-screen bg-page-bg">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <Header />
      <main class="h-full overflow-y-auto">
        <div class="container px-6 py-8 mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

export default {
  components: {
    Sidebar,
    Header,
  },
}
</script>
