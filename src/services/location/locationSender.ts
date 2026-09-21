/**
 * locationSender.ts
 *
 * Service unique chargé d'envoyer la position du livreur.
 *
 * Toute l'application doit utiliser cette fonction.
 *
 * Sources possibles :
 *
 *   • useBackgroundLocation (foreground)
 *   • locationTask (background)
 *   • Future navigation GPS
 *   • Future bouton "Partager ma position"
 *
 * Architecture :
 *
 * GPS
 *   ↓
 * sendDriverLocation()
 *   ├── PATCH /drivers/location
 *   └── socket.emit(driverLocation)
 */

import axios from 'axios';

import Config from '@/constants/config';

import secureStoreHelper from '@/services/storage/secureStore';

import { createSocketClient } from '@/services/socket/socketClient';

/**
 * Envoie la position du livreur
 * au backend et au serveur Socket.
 */
export async function sendDriverLocation(
  latitude: number,
  longitude: number
): Promise<void> {

  const token = await secureStoreHelper.getItem('token');

  if (!token) {
    console.warn('[LocationSender] No token found.');
    return;
  }

  console.log(
  "[LocationSender] Sending",
  latitude,
  longitude
  );

  /**
   * REST
   */
  const restPromise = axios.patch(
    `${Config.API_URL}/drivers/location`,
    {
      latitude,
      longitude,
    },
    {
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log(
  "[LocationSender] REST OK"
  );

  /**
   * Socket
   */
  const socketPromise = (async () => {

    const socket = await createSocketClient();

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('updateLocation', {
      latitude,
      longitude,
    });
    socket.emit('driverLocation', {
      latitude,
      longitude,
    });

  })();

  console.log(
  "[LocationSender] SOCKET OK"
  );

  const [restResult] = await Promise.allSettled([
    restPromise,
    socketPromise,
  ]);

  if (restResult.status === 'rejected') {
    throw restResult.reason;
  }
}