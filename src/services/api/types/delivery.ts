export type DeliveryStatus = 'available' | 'accepted' | 'pickedUp' | 'inTransit' | 'delivered';

export type Delivery = {
  _id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropOffAddress: string;
  packageDescription: string;
  amount: number;
  distance: string;
  estimatedTime: string;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryAcceptResponse = {
  message: string;
  delivery: Delivery;
};
