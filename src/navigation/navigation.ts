import { Linking, Platform } from 'react-native';

export async function openNavigationTo(lat: number, lng: number, label?: string) {
  const dest = `${lat},${lng}`;

  // Prefer native maps on iOS
  if (Platform.OS === 'ios') {
    const appleUrl = `maps://?daddr=${dest}`;
    const webUrl = `https://maps.apple.com/?daddr=${dest}`;
    try {
      const supported = await Linking.canOpenURL(appleUrl);
      const url = supported ? appleUrl : webUrl;
      await Linking.openURL(url);
      return;
    } catch (e) {
      // fallthrough to google maps
    }
  }

  // Fallback to Google Maps universal link (works on Android and web)
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
  try {
    await Linking.openURL(googleUrl);
  } catch (e) {
    console.warn('Unable to open maps', e);
  }
}

export async function openNavigationToLocation(loc: { lat: number; lng: number } | null | undefined) {
  if (!loc) return;
  return openNavigationTo(loc.lat, loc.lng);
}
