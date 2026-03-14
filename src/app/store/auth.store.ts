import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    name: 'Jean Dupont',
    email: 'jean@stockpro.com',
    role: 'Admin',
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
