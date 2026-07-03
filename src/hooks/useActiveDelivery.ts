import { useEffect, useState } from 'react';

import {
  useGetActiveDeliveryQuery,
  useUpdateDeliveryStatusMutation,
} from '@/services/api/activeDeliveryService';

import { subscribeToActiveDelivery } from '@/services/socket/deliverySocket';

import { DeliveryStatus } from '@/types/delivery';

const statusLabels: Record<DeliveryStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  picked_up: 'Pris en charge',
  in_transit: 'En route',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export function useActiveDelivery() {
  const {
    data: delivery,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetActiveDeliveryQuery();

  const [
    updateDeliveryStatus,
    { isLoading: isUpdating },
  ] = useUpdateDeliveryStatusMutation();

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [feedbackVariant, setFeedbackVariant] =
    useState<'success' | 'error' | 'info'>('info');

  /**
   * Écoute les événements Socket concernant la livraison active.
   */
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function subscribe() {
      unsubscribe = await subscribeToActiveDelivery(
        (updated) => {
          setFeedback(
            `Mise à jour reçue : ${statusLabels[updated.status]}`
          );

          setFeedbackVariant('info');

          refetch();
        },

        (payload) => {
          setFeedback(
            payload.reason
              ? `Course annulée : ${payload.reason}`
              : 'La course a été annulée.'
          );

          setFeedbackVariant('error');

          refetch();
        }
      );
    }

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [refetch]);

  /**
   * Change le statut de la livraison.
   */
  const changeStatus = async (
    status: DeliveryStatus
  ) => {
    if (!delivery) {
      throw new Error(
        'Aucune livraison active.'
      );
    }

    setFeedback(
      `Mise à jour du statut vers ${statusLabels[status]}…`
    );

    setFeedbackVariant('info');

    try {
      const updated =
        await updateDeliveryStatus({
          id: delivery._id,
          status,
        }).unwrap();

      setFeedback(
        `Statut mis à jour : ${statusLabels[updated.status]}`
      );

      setFeedbackVariant('success');

      return updated;

    } catch (error: any) {
      const message =
        error?.data?.message ??
        'Impossible de mettre à jour le statut.';

      setFeedback(message);

      setFeedbackVariant('error');

      throw error;
    }
  };

  return {
    delivery,

    loading:
      isLoading || isUpdating,

    error: isError
      ? (error as any)?.data?.message ??
        'Erreur de récupération.'
      : null,

    feedback,

    feedbackVariant,

    refetch,

    changeStatus,
  };
}