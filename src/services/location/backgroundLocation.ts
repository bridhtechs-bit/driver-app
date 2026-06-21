import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { createSocketClient } from '@/services/socket/socketClient';
import { sendDriverLocationUpdate } from '@/services/location/locationService';

export const BACKGROUND_LOCATION_TASK = 'TOGOEXPRESS_BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  try {
    if (error) {
      console.log('[BG LOCATION] task error', error);
      return;
    }

    if (!data) return;

    // locations array when using startLocationUpdatesAsync
    // @ts-ignore
    const locations = data.locations || (data as any).locations;
    if (!locations || locations.length === 0) return;

    const socket = await createSocketClient();
    if (!socket.connected) {
      socket.connect();
    }

    for (const loc of locations) {
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      try {
        if (socket && socket.connected) {
          socket.emit('updateLocation', { lat, lng });
        } else {
          await sendDriverLocationUpdate(lat, lng);
        }
      } catch (e) {
        console.log('[BG LOCATION] emit failed', e);
      }
    }
  } catch (e) {
    console.log('[BG LOCATION] unexpected error', e);
  }
});

export async function startBackgroundLocationTracking() {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    throw new Error('Foreground location permission denied');
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    throw new Error('Background location permission denied');
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (hasStarted) return;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 5,
    // Android foreground service notification
    foregroundService: {
      notificationTitle: 'TogoExpress — suivi en cours',
      notificationBody: 'Envoi de votre position au serveur',
      notificationColor: '#E84C1A',
    },
    // iOS options
    showsBackgroundLocationIndicator: true,
    timeInterval: 5000,
  });
}

export async function stopBackgroundLocationTracking() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (!hasStarted) return;
  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
}
