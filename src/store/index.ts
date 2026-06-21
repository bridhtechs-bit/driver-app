import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@/features/auth/authSlice';
import driverReducer from '@/features/driver/driverSlice';
import deliveryReducer from '@/features/delivery/deliverySlice';
import { rootApi } from '@/services/api/rootApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    delivery: deliveryReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
