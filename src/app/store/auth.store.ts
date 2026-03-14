import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Shape of the authentication state in the Redux store.
 * Currently uses a hardcoded mock user (no real login flow yet).
 */
interface AuthState {
  /** The currently logged-in user, or `null` if logged out. */
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  /** Whether a user session is active. */
  isAuthenticated: boolean;
}

/**
 * Default state — starts with a **mock user** for development.
 * Replace this with real authentication logic when you add a login page.
 */
const initialState: AuthState = {
  user: {
    name: 'Jean Dupont',
    email: 'jean@stockpro.com',
    role: 'Admin',
  },
  isAuthenticated: true,
};

/**
 * Redux slice for authentication (login/logout).
 *
 * **Actions:**
 * - `login(user)` → sets the user object and marks authenticated.
 * - `logout()` → clears the user and marks unauthenticated.
 *
 * **Usage:** The user's name is referenced by `useVentes` to tag audit entries.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Set the authenticated user. Payload must match `AuthState['user']`. */
    login: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    /** Clear the user session. */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
