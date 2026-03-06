# SKILL: Manage Global State (Pinia)

# CONTEXT
This skill defines how to create and manage global state using Pinia. We exclusively use "Setup Stores" (function syntax) over "Option Stores" (object syntax) for better TypeScript support and code organization.

## 1. Store Structure
When creating a new store file (e.g., `stores/transactionStore.js`), follow this exact pattern:

1.  **Define the Store:** Use `defineStore` with a unique ID.
2.  **State:** Declare state variables using `ref()`.
3.  **Getters:** Declare derived state using `computed()`.
4.  **Actions:** Declare functions to modify state.
5.  **Return:** Explicitly return all public properties and methods.

## 2. Implementation Rules
-   **No "this":** Never use `this` inside the store. Always access refs directly (`count.value`).
-   **Persistence:** If data must survive a page reload (like Auth tokens), initialize the `ref` with a value from `localStorage`.
-   **Reset:** Always provide a `$reset` method or a function to clear the state manually if needed.

## 3. Example Code
Use this template for all new stores:

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTransactionStore = defineStore('transactions', () => {
  // --- STATE ---
  const transactions = ref([]);
  const isLoading = ref(false);

  // --- GETTERS ---
  const totalBalance = computed(() => {
    return transactions.value.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  });

  // --- ACTIONS ---
  async function addTransaction(transaction) {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      transactions.value.push({
        id: Date.now(),
        ...transaction
      });
    } catch (error) {
      console.error('Failed to add transaction', error);
    } finally {
      isLoading.value = false;
    }
  }

  function removeTransaction(id) {
    transactions.value = transactions.value.filter(t => t.id !== id);
  }

  return {
    transactions,
    isLoading,
    totalBalance,
    addTransaction,
    removeTransaction
  };
});