import { useCallback } from "react";

import { DeliveryStatus } from "@/types/delivery";

import { useActiveDelivery } from "./useActiveDelivery";
import { useDeliveryStatus } from "./useDeliveryStatus";
import { useDeliveryNavigation } from "./useDeliveryNavigation";
import { useDeliveryFeedback } from "./useDeliveryFeedback";

export function useDeliveryLifecycle() {
  /**
   * Données de la livraison active.
   */
  const {
    delivery,
    driverLocation,
    tracking,
    loading,
    error,
    locationError,
    feedback,
    feedbackVariant,
    refetch,
  } = useActiveDelivery();

  /**
   * Gestion des statuts.
   */
  const {
    changeStatus,
    updating,
    error: statusError,
  } = useDeliveryStatus();

  /**
   * Navigation GPS.
   */
  const { navigate } = useDeliveryNavigation();

  /**
   * Feedback utilisateur.
   */
  const {
    showSuccess,
    showError,
  } = useDeliveryFeedback();

  /**
   * Change le statut de la livraison active.
   */
  const handleStatusChange = useCallback(
    async (status: DeliveryStatus) => {
      if (!delivery) {
        showError("Aucune livraison active.");
        return;
      }

      try {
        await changeStatus(delivery._id, status);

        showSuccess(
          `Statut mis à jour : ${status}`
        );

        await refetch();
      } catch {
        showError(
          "Impossible de mettre à jour le statut."
        );
      }
    },
    [delivery, changeStatus, refetch, showSuccess, showError]
  );

  /**
   * Navigation vers le point de départ.
   */
  const navigateToPickup = useCallback(() => {
    if (!delivery?.pickupLocation) return;

    navigate({
      lat: delivery.pickupLocation.lat,
      lng: delivery.pickupLocation.lng,
    });
  }, [delivery, navigate]);

  /**
   * Navigation vers le point d'arrivée.
   */
  const navigateToDropoff = useCallback(() => {
    if (!delivery?.dropoffLocation) return;

    navigate({
      lat: delivery.dropoffLocation.lat,
      lng: delivery.dropoffLocation.lng,
    });
  }, [delivery, navigate]);

  return {
    delivery,
    driverLocation,
    tracking,

    loading: loading || updating,

    error:
      error ||
      statusError ||
      locationError,

    feedback,
    feedbackVariant,

    handleStatusChange,
    navigateToPickup,
    navigateToDropoff,

    refresh: refetch,
  };
}