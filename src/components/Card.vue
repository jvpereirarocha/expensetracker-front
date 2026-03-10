<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-semibold text-gray-800">{{ value }}</p>
      </div>
      <div
        :class="`text-${color}-500`"
        class="flex items-center justify-center w-12 h-12 text-white bg-gray-100 rounded-full"
      >
        <slot></slot>
      </div>
    </div>
    <div class="mt-4">
      <div class="flex items-center">
        <div class="flex items-center">
          <p class="text-sm font-medium text-gray-500">{{ percentage }}%</p>
        </div>
        <div class="ml-2">
          <p class="text-sm font-medium text-gray-500">{{ status }}</p>
        </div>
      </div>
      <div class="w-full h-2 mt-2 bg-gray-200 rounded-full">
        <div :style="`width: ${percentage}%`" class="h-full text-center text-xs text-white bg-indigo-600 rounded-full">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    percentage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'indigo',
    },
  },
}
</script>
