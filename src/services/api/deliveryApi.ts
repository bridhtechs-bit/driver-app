import { rootApi } from '@/services/api/rootApi';
import { Delivery, DeliveryAcceptResponse } from '@/types/delivery';

/**
 * API livraisons pour le livreur.
 * - GET /api/deliveries/available → courses disponibles (status: pending)
 * - PATCH /api/deliveries/:id/accept → accepter une course
 * - GET /api/drivers/history → historique (completed, cancelled, active)
 */
export const deliveryApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailableDeliveries: build.query<Delivery[], void>({
      query: () => ({
        url: '/deliveries/available',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.deliveries ?? response ?? [];
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Delivery' as const, id: _id })), { type: 'Delivery', id: 'LIST' }]
          : [{ type: 'Delivery', id: 'LIST' }],
    }),

    acceptDelivery: build.mutation<DeliveryAcceptResponse, string>({
      query: (deliveryId) => ({
        url: `/deliveries/${deliveryId}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Delivery', id: 'LIST' }],
    }),

    getDriverHistory: build.query<{ active: Delivery[]; completed: Delivery[]; cancelled: Delivery[] }, void>({
      query: () => ({ url: '/drivers/history', method: 'GET' }),
      transformResponse: (response: any) => {
        return response?.history ?? { active: [], completed: [], cancelled: [] };
      },
      providesTags: [{ type: 'Delivery', id: 'HISTORY' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAvailableDeliveriesQuery,
  useAcceptDeliveryMutation,
  useGetDriverHistoryQuery,
} = deliveryApi;

export const useGetCompletedDeliveriesQuery = () => {
  const result = useGetDriverHistoryQuery();
  return {
    ...result,
    data: result.data?.completed ?? [],
  };
};
