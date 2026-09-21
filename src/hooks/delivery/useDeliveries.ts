import { useEffect } from 'react';
import { useGetAvailableDeliveriesQuery, useAcceptDeliveryMutation } from '@/services/api/deliveryApi';
import { subscribeToNewDelivery } from '@/services/socket/deliverySocket';

export function useDeliveries() {
  const {
    data: deliveries,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAvailableDeliveriesQuery();

  const [acceptDelivery, { isLoading: isAccepting }] = useAcceptDeliveryMutation();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function subscribe() {
      unsubscribe = await subscribeToNewDelivery(() => {
        refetch();
      });
    }

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [refetch]);

  const handleAcceptDelivery = async (deliveryId: string) => {
    const response = await acceptDelivery(deliveryId).unwrap();
    await refetch();
    return response;
  };

  return {
    deliveries: deliveries ?? [],
    loading: isLoading || isFetching,
    isAccepting,
    error: isError ? (error as any)?.data?.message || 'Erreur de connexion' : null,
    refetch,
    acceptDelivery: handleAcceptDelivery,
  };
}
