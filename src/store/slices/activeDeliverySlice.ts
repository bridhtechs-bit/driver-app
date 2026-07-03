import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveDelivery } from '@/types/activeDelivery';

export type ActiveDeliveryState = {
  activeDelivery: ActiveDelivery | null;
  loading: boolean;
  error: string | null;
};

const initialState: ActiveDeliveryState = {
  activeDelivery: null,
  loading: false,
  error: null,
};

const activeDeliverySlice = createSlice({
  name: 'activeDelivery',
  initialState,
  reducers: {
    setActiveDelivery(state, action: PayloadAction<ActiveDelivery | null>) {
      state.activeDelivery = action.payload;
      state.error = null;
    },
    setActiveDeliveryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setActiveDeliveryError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearActiveDelivery(state) {
      state.activeDelivery = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setActiveDelivery, setActiveDeliveryLoading, setActiveDeliveryError, clearActiveDelivery } = activeDeliverySlice.actions;
export default activeDeliverySlice.reducer;
