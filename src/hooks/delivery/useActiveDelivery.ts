import { useEffect } from "react";

import {
  useGetActiveDeliveryQuery,
} from "@/services/api/activeDeliveryService";

import { useDriverLocation } from "../location/useDriverLocation";

import { useDeliveryFeedback } from "./useDeliveryFeedback";

import { useDeliverySocket } from "./useDeliverySocket";
import { useDeliveryStatus } from "./useDeliveryStatus";

export function useActiveDelivery() {

  /**
   * Livraison active.
   */

  const {

    data: delivery,

    isLoading,

    isFetching,

    isError,

    error,

    refetch,

  } = useGetActiveDeliveryQuery();

  /**
   * Position actuelle du chauffeur.
   */

  const {

    driverLocation,

    tracking,

    locationError,

  } = useDriverLocation();

  /**
   * Messages utilisateur.
   */

  const {

    feedback,

    feedbackVariant,

    showInfo,

    showError,

    clearFeedback,

  } = useDeliveryFeedback();

  /**
   * Mise à jour du statut de livraison.
   */

  const {

    changeStatus: updateStatus,

    updating,

  } = useDeliveryStatus();

  /**
   * Socket temps réel.
   */

  useDeliverySocket({

    onDeliveryUpdated(updated) {

      showInfo("La livraison a été mise à jour.");

      refetch();

    },

    onDeliveryCancelled(payload) {

      showError(

        payload.reason ??

        "La livraison a été annulée."

      );

      refetch();

    },

  });

  /**
   * Nettoyage automatique du feedback.
   */

  useEffect(() => {

    if (!feedback) return;

    const timer = setTimeout(() => {

      clearFeedback();

    }, 4000);

    return () => clearTimeout(timer);

  }, [feedback, clearFeedback]);

  return {

    delivery,

    driverLocation,

    tracking,

    loading:

      isLoading ||

      isFetching ||

      updating,

    error:

      isError

        ? (error as any)?.data?.message ??

          "Erreur."

        : null,

    locationError,

    feedback,

    feedbackVariant,

    changeStatus: async (status: string) => {
      if (!delivery?._id) {
        throw new Error("Aucune livraison active.");
      }

      return updateStatus(delivery._id, status as any);
    },

    refetch,

  };

}