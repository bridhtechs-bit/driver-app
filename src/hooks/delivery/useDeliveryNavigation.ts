import { Alert, Linking, Platform } from "react-native";

export type Coordinates = {
  lat: number;
  lng: number;
};

export function useDeliveryNavigation() {
  /**
   * Ouvre Google Maps.
   */
  const openGoogleMaps = async (
    destination: Coordinates
  ) => {
    const url =
      Platform.OS === "ios"
        ? `comgooglemaps://?daddr=${destination.lat},${destination.lng}&directionsmode=driving`
        : `google.navigation:q=${destination.lat},${destination.lng}`;

    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        return;
      }

      await Linking.openURL(webUrl);
    } catch {
      Alert.alert(
        "Navigation",
        "Impossible d'ouvrir Google Maps."
      );
    }
  };

  /**
   * Ouvre Waze.
   */
  const openWaze = async (
    destination: Coordinates
  ) => {
    const url = `waze://?ll=${destination.lat},${destination.lng}&navigate=yes`;

    const webUrl = `https://waze.com/ul?ll=${destination.lat},${destination.lng}&navigate=yes`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        return;
      }

      await Linking.openURL(webUrl);
    } catch {
      Alert.alert(
        "Navigation",
        "Impossible d'ouvrir Waze."
      );
    }
  };

  /**
   * Ouvre Apple Plans (iOS).
   */
  const openAppleMaps = async (
    destination: Coordinates
  ) => {
    const url = `http://maps.apple.com/?daddr=${destination.lat},${destination.lng}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Navigation",
        "Impossible d'ouvrir Apple Plans."
      );
    }
  };

  /**
   * Navigation intelligente.
   *
   * iOS :
   *  Google Maps si installé
   *  sinon Apple Plans
   *
   * Android :
   *  Google Maps
   *  sinon navigateur
   */
  const navigate = async (
    destination: Coordinates
  ) => {
    if (Platform.OS === "ios") {
      const google =
        await Linking.canOpenURL(
          "comgooglemaps://"
        );

      if (google) {
        return openGoogleMaps(destination);
      }

      return openAppleMaps(destination);
    }

    return openGoogleMaps(destination);
  };

  return {
    navigate,
    openGoogleMaps,
    openAppleMaps,
    openWaze,
  };
}