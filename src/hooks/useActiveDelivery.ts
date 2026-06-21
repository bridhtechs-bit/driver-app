import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useGetActiveDeliveryQuery, useUpdateDeliveryStatusMutation } from '@/services/api/activeDeliveryApi';
import { createSocketClient } from '@/services/socket/socketClient';
import { subscribeToActiveDelivery } from '@/services/socket/deliverySocket';
import { ActiveDelivery } from '@/services/api/types/activeDelivery';
import { DeliveryStatus } from '@/services/api/types/delivery';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking } from '@/services/location/backgroundLocation';

export function useActiveDelivery() {
  const { data: delivery, isLoading, isError, error, refetch } = useGetActiveDeliveryQuery();
  const [updateDeliveryStatus, { isLoading: isUpdating }] = useUpdateDeliveryStatusMutation();
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function initializeLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setLocationError('Autorisation de localisation refusée');
          return;
        }

        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setDriverLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          async (location) => {
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setDriverLocation(newLocation);

            const socket = await createSocketClient();
            if (!socket.connected) {
              socket.connect();
            }
            socket.emit('updateLocation', {
              lat: newLocation.latitude,
              lng: newLocation.longitude,
            });
          }
        );
      } catch (err) {
        setLocationError('Impossible de récupérer la localisation');
      }
    }

    initializeLocation();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function subscribe() {
      unsubscribe = await subscribeToActiveDelivery(
        (updated) => {
          // server sent an update for the active delivery, refresh
          refetch();
        },
        (payload) => {
          // delivery cancelled on server, refresh to clear UI
          refetch();
        }
      );
    }

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [refetch]);

  // start/stop background tracking when an active delivery appears/disappears
  useEffect(() => {
    let stopped = false;

    async function manageBackground() {
      if (delivery) {
        try {
          await startBackgroundLocationTracking();
        } catch (err) {
          console.warn('Failed to start background tracking', err);
        }
      } else {
        try {
          await stopBackgroundLocationTracking();
        } catch (err) {
          console.warn('Failed to stop background tracking', err);
        }
      }
    }

    manageBackground();

    return () => {
      if (!stopped) {
        stopBackgroundLocationTracking().catch(() => {});
        stopped = true;
      }
    };
  }, [delivery]);

  const changeStatus = async (status: DeliveryStatus) => {
    if (!delivery) {
      throw new Error('Aucune livraison active');
    }
    const updated = await updateDeliveryStatus({ id: delivery._id, status }).unwrap();
    return updated;
  };

  return {
    delivery,
    driverLocation,
    loading: isLoading || isUpdating,
    error: isError ? (error as any)?.data?.message || 'Erreur de récupération' : null,
    locationError,
    refetch,
    changeStatus,
  };
}
