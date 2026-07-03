import { rootApi } from '@/services/api/rootApi';
import { ActiveDelivery } from '@/types/activeDelivery';

/**
 * API pour la livraison active du livreur.
 * - GET /api/deliveries/active → livraisons actives (accepted/picked_up/in_transit)
 * - PATCH /api/deliveries/:id/status → mise à jour statut
 * - PATCH /api/deliveries/:id/complete → terminer avec preuve photo
 */
export const activeDeliveryApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveDelivery: build.query<ActiveDelivery | null, void>({
      query: () => ({
        url: '/deliveries/active',
        method: 'GET',
      }),
      // Le backend retourne { success, deliveries: [...] }
      // On prend la première livraison active (le livreur n'en a qu'une à la fois)
      transformResponse: (response: any) => {
        const deliveries = response?.deliveries ?? response ?? [];
        return Array.isArray(deliveries) && deliveries.length > 0
          ? deliveries[0]
          : null;
      },
      providesTags: ['Delivery'],
    }),

    updateDeliveryStatus: build.mutation<ActiveDelivery, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/deliveries/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Delivery'],
    }),

    completeDelivery: build.mutation<ActiveDelivery, { id: string; proof?: FormData }>({
      query: ({ id, proof }) => {
        const config: any = {
          url: `/deliveries/${id}/complete`,
          method: 'PATCH',
          data: proof ?? {},
        };

        // Axios gère automatiquement les headers multipart pour FormData
        return config;
      },
      invalidatesTags: ['Delivery'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActiveDeliveryQuery,
  useUpdateDeliveryStatusMutation,
  useCompleteDeliveryMutation,
} = activeDeliveryApi;
