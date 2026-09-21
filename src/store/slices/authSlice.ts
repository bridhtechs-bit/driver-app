import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/auth";

export interface AuthState {
  isAuthenticated: boolean;

  initialized: boolean;

  token: string | null;

  user: User | null;

  loading: boolean;

  error: string | null;

  onboardingCompleted: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,

  initialized: false,

  token: null,

  user: null,

  loading: false,

  error: null,

  onboardingCompleted: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    /**
     * Login ou restauration automatique.
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user?: User | null;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;

      state.isAuthenticated = true;
      state.initialized = true;

      state.loading = false;
      state.error = null;
    },

    /**
     * Bootstrap terminé mais aucun utilisateur.
     */
    initializeCompleted(state) {
      state.initialized = true;
    },

    clearCredentials(state) {
      state.token = null;
      state.user = null;

      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;
    },

    logout(state) {
      state.token = null;
      state.user = null;

      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;

      // onboarding volontairement conservé
      state.initialized = true;
    },

    setLoading(
      state,
      action: PayloadAction<boolean>
    ) {
      state.loading = action.payload;
    },

    setError(
      state,
      action: PayloadAction<string | null>
    ) {
      state.error = action.payload;
    },

    setOnboardingCompleted(
      state,
      action: PayloadAction<boolean>
    ) {
      state.onboardingCompleted =
        action.payload;
    },

    updateUser(
      state,
      action: PayloadAction<Partial<User>>
    ) {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  initializeCompleted,
  logout,
  setLoading,
  setError,
  setOnboardingCompleted,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;