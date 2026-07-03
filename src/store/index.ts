import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import driverReducer from '@/store/slices/driverSlice';
import deliveryReducer from '@/store/slices/deliverySlice';
import activeDeliveryReducer from '@/store/slices/activeDeliverySlice';
import { rootApi } from '@/services/api/rootApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    delivery: deliveryReducer,
    activeDelivery: activeDeliveryReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(rootApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
