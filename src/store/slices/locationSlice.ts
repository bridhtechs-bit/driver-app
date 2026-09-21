import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DriverLocationPoint = {
  latitude: number;
  longitude: number;
};

export type LocationState = {
  current: DriverLocationPoint | null;
  lastUpdate: number | null;
  tracking: boolean;
  error: string | null;
};

const initialState: LocationState = {
  current: null,
  lastUpdate: null,
  tracking: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateDriverLocation(state, action: PayloadAction<DriverLocationPoint>) {
      state.current = action.payload;
      state.lastUpdate = Date.now();
      state.error = null;
    },
    clearDriverLocation(state) {
      state.current = null;
      state.lastUpdate = null;
      state.error = null;
    },
    setTrackingStatus(state, action: PayloadAction<boolean>) {
      state.tracking = action.payload;
    },
    setLocationError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  updateDriverLocation,
  clearDriverLocation,
  setTrackingStatus,
  setLocationError,
} = locationSlice.actions;

export default locationSlice.reducer;
