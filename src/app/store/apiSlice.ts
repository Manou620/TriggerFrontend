import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base RTK Query API slice — the single source of truth for ALL API calls.
 *
 * **How it works:**
 * - `baseUrl: '/api'` → all requests go through the Express proxy in `server.ts`,
 *   which forwards them to `json-server` running on port 5000.
 * - `tagTypes` define the cache invalidation groups. When a mutation
 *   "invalidates" a tag (e.g. `{ type: 'Product', id: 'LIST' }`), RTK Query
 *   automatically re-fetches any query that "provides" that same tag.
 *
 * **Why `endpoints` is empty here:**
 * Each feature injects its own endpoints via `apiSlice.injectEndpoints()`
 * in separate files (e.g. `clientsApiSlice.ts`, `productsApiSlice.ts`).
 * This keeps the base slice lightweight and avoids circular imports.
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'Client', 'Sale', 'Audit'],
  endpoints: (builder) => ({}),
});
