/**
 * Types alignés avec le modèle Delivery du backend MongoDB.
 * Champs: status (snake_case), receiverName, receiverPhone, proposedPrice,
 * distanceKm, estimatedMinutes, pickupLocation, dropoffLocation
 */

export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryCoordinates = {
  lat: number;
  lng: number;
};

export type DeliveryCustomer = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type Delivery = {
  _id: string;
  customer: DeliveryCustomer | string;
  driver?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLocation: DeliveryCoordinates;
  dropoffLocation: DeliveryCoordinates;
  receiverName: string;
  receiverPhone: string;
  packageDescription?: string;
  packageType: 'document' | 'parcel' | 'food' | 'other';
  packageWeight?: number;
  proposedPrice: number;
  finalPrice?: number;
  distanceKm?: number;
  estimatedMinutes?: number;
  proofImage?: string;
  status: DeliveryStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
};

export type DeliveryAcceptResponse = {
  message: string;
  delivery: Delivery;
};

/** Helper: nom affiché du destinataire */
export function getDeliveryReceiverLabel(delivery: Delivery): string {
  return delivery.receiverName ?? '';
}

/** Helper: prix affiché */
export function getDeliveryPrice(delivery: Delivery): number {
  return delivery.finalPrice ?? delivery.proposedPrice ?? 0;
}

/** Helper: distance affichée */
export function getDeliveryDistanceLabel(delivery: Delivery): string {
  if (delivery.distanceKm != null) {
    return `${delivery.distanceKm.toFixed(1)} km`;
  }
  return '—';
}

/** Helper: temps estimé affiché */
export function getDeliveryTimeLabel(delivery: Delivery): string {
  if (delivery.estimatedMinutes != null) {
    if (delivery.estimatedMinutes < 60) {
      return `~${delivery.estimatedMinutes} min`;
    }
    const h = Math.floor(delivery.estimatedMinutes / 60);
    const m = delivery.estimatedMinutes % 60;
    return m > 0 ? `~${h}h${m.toString().padStart(2, '0')}` : `~${h}h`;
  }
  return '—';
}
