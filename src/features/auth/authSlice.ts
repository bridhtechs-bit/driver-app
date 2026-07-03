import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  onboardingCompleted: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setOnboardingCompleted(state, action: PayloadAction<boolean>) {
      state.onboardingCompleted = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading, setError, setOnboardingCompleted } = authSlice.actions;
export default authSlice.reducer;
