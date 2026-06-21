import { DeliveryStatus } from '@/services/api/types/delivery';

export type ActiveDelivery = {
  _id: string;
  pickupAddress: string;
  dropOffAddress: string;
  customerName: string;
  customerPhone: string;
  packageDescription: string;
  amount: number;
  distance: string;
  estimatedTime: string;
  status: DeliveryStatus;
  pickupLocation: { lat: number; lng: number };
  dropOffLocation: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
};
