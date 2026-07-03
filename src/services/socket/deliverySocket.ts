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
