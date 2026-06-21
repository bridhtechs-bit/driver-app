export type DriverProfile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isOnline: boolean;
  isAvailable: boolean;
  totalDeliveries: number;
  completedDeliveries: number;
  totalEarnings: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
};

export type DriverStatusUpdate = {
  isOnline?: boolean;
  isAvailable?: boolean;
};

export type DriverStats = {
  completedDeliveries: number;
  totalEarnings: number;
  rating: number;
  totalRatings: number;
};
