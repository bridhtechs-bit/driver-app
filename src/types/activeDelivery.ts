/**
 * Type ActiveDelivery aligné avec le backend.
 * GET /api/deliveries/active retourne { success, deliveries: ActiveDelivery[] }
 * Les livraisons actives du livreur (accepted, picked_up, in_transit)
 */

import { DeliveryStatus, DeliveryCoordinates, DeliveryCustomer } from '@/types/delivery';

export type ActiveDelivery = {
  _id: string;
  customer: DeliveryCustomer;
  driver: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLocation: DeliveryCoordinates;
  dropoffLocation: DeliveryCoordinates;
  receiverName: string;
  receiverPhone: string;
  packageDescription?: string;
  packageType: 'document' | 'parcel' | 'food' | 'other';
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
};
