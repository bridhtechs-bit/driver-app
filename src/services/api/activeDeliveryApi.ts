import { rootApi } from '@/services/api/rootApi';
import { ActiveDelivery } from '@/services/api/types/activeDelivery';

export const activeDeliveryApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveDelivery: build.query<ActiveDelivery, void>({
      query: () => ({
        url: '/api/deliveries/my',
        method: 'GET',
      }),
      providesTags: ['Delivery'],
    }),
    updateDeliveryStatus: build.mutation<ActiveDelivery, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/deliveries/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Delivery'],
    }),
    completeDelivery: build.mutation<ActiveDelivery, { id: string; proof?: FormData }>({
      query: ({ id, proof }) => {
        const config: any = {
          url: `/api/deliveries/${id}/complete`,
          method: 'POST',
          data: proof ?? {},
        };

        // Let axiosBaseQuery/axiosClient set headers for FormData automatically when FormData is provided
        return config;
      },
      invalidatesTags: ['Delivery'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetActiveDeliveryQuery, useUpdateDeliveryStatusMutation, useCompleteDeliveryMutation } = activeDeliveryApi;
