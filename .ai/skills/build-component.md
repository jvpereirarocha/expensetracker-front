# SKILL: Build UI Component

# INSTRUCTIONS

When asked to create a UI component (e.g., Button, Input, Modal):

1. **Props Definition:**

   - Use `defineProps` with strict type validation.
   - Example: `defineProps({ label: { type: String, required: true } })`
2. **Slots:**

   - Use `<slot>` for content flexibility.
   - Use Named Slots for headers/footers in cards or modals.
3. **Template Structure:**

   - The root element should be clean.
   - Use Tailwind classes defined in the `style-guide.md`.
   - Ensure specific `aria-labels` are dynamic if needed.

# EXAMPLE: BaseButton.vue

```vue
<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, danger, outline
  isLoading: { type: Boolean, default: false }
})
</script>

<template>
  <button 
    class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
    :class="{
      'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
      'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50': variant === 'outline',
      'opacity-75 cursor-not-allowed': isLoading
    }"
    :disabled="isLoading"
  >
    <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">...</svg>
    <slot />
  </button>
</template>
```
