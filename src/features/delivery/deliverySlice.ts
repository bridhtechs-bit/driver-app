import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeliveryState = {
  selectedDeliveryId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: DeliveryState = {
  selectedDeliveryId: null,
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setSelectedDeliveryId(state, action: PayloadAction<string | null>) {
      state.selectedDeliveryId = action.payload;
      state.error = null;
    },
    setDeliveryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDeliveryError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetDeliveryState(state) {
      state.selectedDeliveryId = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSelectedDeliveryId, setDeliveryLoading, setDeliveryError, resetDeliveryState } = deliverySlice.actions;
export default deliverySlice.reducer;
