import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.store';
import { apiSlice } from './apiSlice';

/**
 * The **central Redux store** for the entire application.
 *
 * **Registered reducers:**
 * - `auth` → manages the logged-in user state (see `auth.store.ts`).
 * - `[api]` → RTK Query cache reducer. Automatically stores
 *   fetched data, loading states, and error info for all API calls.
 *
 * **Middleware:**
 * The `apiSlice.middleware` is appended to handle automatic
 * refetching, polling, and cache lifecycle management.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

/** Inferred type of the entire Redux root state. Use in `useSelector<RootState>()`. */
export type RootState = ReturnType<typeof store.getState>;

/** Inferred dispatch type. Use with `useDispatch<AppDispatch>()` for thunk support. */
export type AppDispatch = typeof store.dispatch;
