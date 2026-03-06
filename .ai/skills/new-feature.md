# SKILL: Create New Feature Module

# CONTEXT
We follow a **Feature-Based Architecture**. When asked to create a new feature (e.g., "Transactions"), you must generate the following 3 distinct parts in this specific order:

## 1. The "Brain" (Composable)
- **File:** `features/[feature]/use[Feature].js`
- **Responsibility:** Holds the business logic (filtering, calculating, API calls).
- **Rules:** - Must return reactive state (`refs`) and functions.
  - DO NOT import UI libraries here.
  - Use `async/await` for data fetching.

## 2. The "State" (Pinia Store)
- **File:** `stores/[feature]Store.js` (Optional, only if global state is needed).
- **Rules:**
  - Define `state`, `getters`, and `actions`.
  - Ensure actions handle the async logic.

## 3. The "Face" (Components)
- **File:** `features/[feature]/[Feature]View.vue` (The main page).
- **File:** `features/[feature]/[Feature]List.vue` or `[Feature]Form.vue` (Sub-components).
- **Rules:**
  - The component must IMPORT the Composable to get data.
  - It should contain very little logic itself, mostly template and bindings.

# OUTPUT EXAMPLE
User: "Create a transaction form."
You: Generate `useTransactionForm.js` first, then `TransactionForm.vue` consuming it.