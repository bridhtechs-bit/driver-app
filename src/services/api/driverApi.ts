import { rootApi } from '@/services/api/rootApi';
import { DriverProfile } from '../../types/driver';

export type LocationPayload = {
  latitude: number;
  longitude: number;
};

/**
 * API profil livreur.
 * Le backend retourne { success, profile: { ...fields } }
 * On extrait profile via transformResponse.
 */
export const driverApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    // Create driver profile
    createProfile: build.mutation<{ success: boolean; message: string; driverProfile: DriverProfile }, { vehicleType: string; vehicleBrand: string; plateNumber: string }>({
      query: (payload) => ({
        url: '/drivers/createdriverprofile',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Driver'],
    }),

    // Get driver profile
    getDriverProfile: build.query<DriverProfile, void>({
      query: () => ({
        url: '/drivers/profile',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.profile ?? response;
      },
      providesTags: ['Driver'],
    }),

    // Go online
    goOnline: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/drivers/go-online',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),

    // Go offline
    goOffline: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/drivers/go-offline',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),

    // Toggle availability
    toggleAvailability: build.mutation<{ success: boolean; isAvailable: boolean }, void>({
      query: () => ({
        url: '/drivers/toggle-availability',
        method: 'PATCH',
      }),
      invalidatesTags: ['Driver'],
    }),

    // Update driver GPS location
    // Appelé depuis le hook useBackgroundLocation (foreground)
    // La tâche background appelle directement axios pour éviter le cycle React
    updateLocation: build.mutation<{ success: boolean; location: any }, LocationPayload>({
      query: (payload) => ({
        url: '/drivers/location',
        method: 'PATCH',
        data: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProfileMutation,
  useGetDriverProfileQuery,
  useGoOnlineMutation,
  useGoOfflineMutation,
  useToggleAvailabilityMutation,
  useUpdateLocationMutation,
} = driverApi;
