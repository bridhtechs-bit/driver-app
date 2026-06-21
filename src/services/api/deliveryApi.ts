import { rootApi } from '@/services/api/rootApi';
import { Delivery, DeliveryAcceptResponse } from '@/services/api/types/delivery';

export const deliveryApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailableDeliveries: build.query<Delivery[], void>({
      query: () => ({
        url: '/api/deliveries/available',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Delivery' as const, id: _id })), { type: 'Delivery', id: 'LIST' }]
          : [{ type: 'Delivery', id: 'LIST' }],
    }),
    acceptDelivery: build.mutation<DeliveryAcceptResponse, string>({
      query: (deliveryId) => ({
        url: `/api/deliveries/${deliveryId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Delivery', id: 'LIST' }],
    }),
    getCompletedDeliveries: build.query<Delivery[], void>({
      query: () => ({ url: '/api/deliveries/completed', method: 'GET' }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Delivery' as const, id: _id })), { type: 'Delivery', id: 'LIST' }]
          : [{ type: 'Delivery', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAvailableDeliveriesQuery, useAcceptDeliveryMutation, useGetCompletedDeliveriesQuery } = deliveryApi;
