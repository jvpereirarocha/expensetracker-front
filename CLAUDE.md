# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run test:unit    # Run unit tests with Vitest (jsdom environment)
npm run lint         # Run oxlint then eslint, both with --fix
npm run format       # Format src/ with Prettier
```

To run a single test file: `npx vitest run src/path/to/file.test.js`

## Environment

The app expects `VITE_API_BASE_URL` to point to the backend. Development default is `http://localhost:8008` (see `.env.development`). The backend must be running for any authenticated feature to work.

## Architecture

**Feature-based structure** under `src/features/`. Each feature owns its views, components, composables, and Pinia stores:

- `auth` — login/register, JWT token stored in `localStorage`, auth guard in router
- `transactions` — full CRUD for transactions and categories, with pagination and filters
- `dashboard` — monthly/yearly income/expense summary from `/api/v1/dashboards`
- `charts` — bar chart (monthly expenses) and doughnut chart (by category); currently uses **mocked data** in `useCharts.js`, not wired to the API yet

**Layout pattern**: `App.vue` dynamically wraps routes in `AppLayout` when `route.meta.requiresLayout` is true, otherwise renders a plain `<div>`. Auth routes (login/register) have no layout.

**API layer**: A single Axios instance at `src/app/api.js` handles base URL, auth header injection, 401 auto-logout, and offline detection. All stores import from this file — never use raw `axios` elsewhere.

**State management**: Pinia stores live inside each feature folder. Two style conventions exist — `auth` store uses the Composition API style (`defineStore` with `() => {}`), while `transactions` and `dashboard` stores use the Options API style (`state/actions`). Follow the existing style within each store when editing.

**Composables over direct store access**: Views use composables (e.g. `useTransactions`, `useAuth`) which wrap the stores and expose only what's needed. Add new composables rather than having views import stores directly.

**Path alias**: `@` maps to `src/`. Use it for all imports.

## API conventions

Backend endpoints follow `/api/v1/<resource>`. Paginated list responses return `{ results/transactions, page, totalItems, totalOfPages, itemsPerPage, prev, next }`. The `prev`/`next` fields contain page numbers (not URLs), or `null` when at the boundary.

Transaction status values: `not_paid`, `paying`, `already_paid`, `received` — display labels and badge classes are in `src/features/transactions/constants/statusLabels.js`.
