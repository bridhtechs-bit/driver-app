import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverProfile, DriverStats } from '@/types/driver';

export type DriverState = {
  profile: DriverProfile | null;
  stats: DriverStats | null;
  loading: boolean;
  error: string | null;
};

const initialState: DriverState = {
  profile: null,
  stats: null,
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<DriverProfile>) {
      state.profile = action.payload;
      state.stats = {
        completedDeliveriesCount: action.payload.completedDeliveriesCount ?? 0,
        totalEarnings: action.payload.totalEarnings ?? 0,
        averageRating: action.payload.averageRating ?? 0,
        totalDeliveries: action.payload.totalDeliveries ?? 0,
      };
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearDriver(state) {
      state.profile = null;
      state.stats = null;
      state.error = null;
    },
  },
});

export const { setProfile, setLoading, setError, clearDriver } = driverSlice.actions;
export default driverSlice.reducer;
