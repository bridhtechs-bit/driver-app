import { rootApi } from '@/services/api/rootApi';
import { DriverProfile, DriverStatusUpdate } from './types/driver';

export const driverApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    // Get driver profile
    getProfile: build.query<DriverProfile, void>({
      query: () => ({
        url: '/api/drivers/profile',
        method: 'GET',
      }),
      providesTags: ['Driver'],
    }),

    // Go online
    goOnline: build.mutation<DriverProfile, void>({
      query: () => ({
        url: '/api/drivers/go-online',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),

    // Go offline
    goOffline: build.mutation<DriverProfile, void>({
      query: () => ({
        url: '/api/drivers/go-offline',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),

    // Toggle availability
    toggleAvailability: build.mutation<DriverProfile, void>({
      query: () => ({
        url: '/api/drivers/toggle-availability',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useGoOnlineMutation,
  useGoOfflineMutation,
  useToggleAvailabilityMutation,
} = driverApi;
