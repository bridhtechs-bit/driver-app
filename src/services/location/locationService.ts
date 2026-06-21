import * as Location from 'expo-location';
import axiosClient from '@/services/api/axiosClient';

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition() {
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export async function sendDriverLocationUpdate(latitude: number, longitude: number) {
  await axiosClient.patch('/api/drivers/location', { lat: latitude, lng: longitude });
}
