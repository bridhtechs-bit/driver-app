/**
 * Types du profil livreur alignés avec la réponse GET /api/drivers/profile.
 * La réponse backend est : { success, profile: { ...fields, user: { firstName, lastName, email, phone } } }
 */

export type DriverUser = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type DriverProfile = {
  vehicleType: 'moto' | 'voiture' | 'trycicle';
  vehicleBrand: string;
  plateNumber: string;
  isOnline: boolean;
  isAvailable: boolean;
  location?: {
    type: string;
    coordinates: number[];
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  averageRating: number;
  totalDeliveries: number;
  // Stats calculées depuis l'historique (ajoutées par le backend)
  completedDeliveriesCount: number;
  totalEarnings: number;
  user: DriverUser;
};

export type DriverStatusUpdate = {
  isOnline?: boolean;
  isAvailable?: boolean;
};

export type DriverStats = {
  completedDeliveriesCount: number;
  totalEarnings: number;
  averageRating: number;
  totalDeliveries: number;
};

/** Helper: nom complet du livreur */
export function getDriverFullName(profile: DriverProfile): string {
  if (!profile.user) return '';
  return `${profile.user.firstName} ${profile.user.lastName}`.trim();
}
