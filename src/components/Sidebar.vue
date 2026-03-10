<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md">
      <div class="p-6">
        <h1 class="text-2xl font-semibold text-gray-800">Life Saver</h1>
      </div>
      <nav class="mt-6">
        <router-link
          to="/"
          class="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
          active-class="bg-gray-200 text-gray-700"
        >
          <span class="mx-3">Dashboard</span>
        </router-link>
        <router-link
          to="/calendar"
          class="flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
          active-class="bg-gray-200 text-gray-700"
        >
          <span class="mx-3">Calendar</span>
        </router-link>
        <router-link
          to="/appointment"
          class="flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
          active-class="bg-gray-200 text-gray-700"
        >
          <span class="mx-3">Appointment</span>
        </router-link>
        <router-link
          to="/doctors"
          class="flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
          active-class="bg-gray-200 text-gray-700"
        >
          <span class="mx-3">Doctors List</span>
        </router-link>
        <router-link
          to="/settings"
          class="flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
          active-class="bg-gray-200 text-gray-700"
        >
          <span class="mx-3">Settings</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
}
</script>
