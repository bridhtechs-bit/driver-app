export const BACKGROUND_LOCATION_TASK = 'TOGOEXPRESS_BACKGROUND_LOCATION_TASK';

export const LOCATION_TRACKING_OPTIONS = {
  accuracy: 4, // Location.Accuracy.Balanced (Balanced is 4 in Expo Location)
  distanceInterval: 20, // Send updates only when moving 20 meters
  timeInterval: 15000, // Update at least every 15 seconds if stationary
  // Android foreground service options
  foregroundService: {
    notificationTitle: 'TogoExpress Chauffeur',
    notificationBody: 'Suivi de localisation activé en arrière-plan',
    notificationColor: '#E84C1A',
  },
  // iOS options
  showsBackgroundLocationIndicator: true,
};
