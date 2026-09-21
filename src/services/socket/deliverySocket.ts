import { createSocketClient } from './socketClient';
import { Delivery } from '@/types/delivery';
import { ActiveDelivery } from '@/types/activeDelivery';

let isSubscribedNew = false;

export async function subscribeToNewDelivery(onNewDelivery: (delivery: Delivery) => void) {
  const socket = await createSocketClient();

  if (!socket.connected) {
    socket.connect();
  }

  if (!isSubscribedNew) {
    socket.on('newDelivery', onNewDelivery);
    isSubscribedNew = true;
  }

  return () => {
    socket.off('newDelivery', onNewDelivery);
    isSubscribedNew = false;
  };
}

// Subscribe to active delivery events (server-side updates for the driver's current delivery)
export async function subscribeToActiveDelivery(
  onUpdated: (delivery: ActiveDelivery) => void,
  onCancelled: (payload: { id: string; reason?: string }) => void
) {
  const socket = await createSocketClient();

  if (!socket.connected) {
    socket.connect();
  }

  socket.on('deliveryUpdated', onUpdated);
  socket.on('deliveryCancelled', onCancelled);

  return () => {
    socket.off('deliveryUpdated', onUpdated);
    socket.off('deliveryCancelled', onCancelled);
  };
}

/**
 * Écouter quand une livraison disponible est verrouillée par un autre livreur.
 */
export async function subscribeToDeliveryLocked(
  onLocked: (payload: { deliveryId: string; driverId: string }) => void
) {
  const socket = await createSocketClient();

  if (!socket.connected) {
    socket.connect();
  }

  socket.on('deliveryLocked', onLocked);

  return () => {
    socket.off('deliveryLocked', onLocked);
  };
}

/**
 * Rejoindre la room d'une livraison pour recevoir les événements en temps réel.
 */
export async function joinDeliveryRoom(deliveryId: string) {
  if (!deliveryId) return;
  const socket = await createSocketClient();
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('joinDeliveryRoom', deliveryId);
}

/**
 * Quitter la room d'une livraison.
 */
export async function leaveDeliveryRoom(deliveryId: string) {
  if (!deliveryId) return;
  const socket = await createSocketClient();
  if (socket.connected) {
    socket.emit('leaveDeliveryRoom', deliveryId);
  }
}

