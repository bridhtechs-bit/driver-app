import { useMemo } from "react";
import { Region } from "react-native-maps";

import { ActiveDelivery } from "@/types/activeDelivery";
import { DeliveryMarker } from "@/components/activeDelivery/MapMarker";

type DriverLocation = {
  latitude: number;
  longitude: number;
};

const DEFAULT_LOCATION = {
  latitude: 6.1760,
  longitude: 1.2310,
};

export function useDeliveryMap(
  delivery: ActiveDelivery | null | undefined,
  driverLocation: DriverLocation | null
) {

  const center = useMemo(() => {

    if (driverLocation) {
      return driverLocation;
    }

    if (delivery?.pickupLocation) {
      return {
        latitude: delivery.pickupLocation.lat,
        longitude: delivery.pickupLocation.lng,
      };
    }

    if (delivery?.dropoffLocation) {
      return {
        latitude: delivery.dropoffLocation.lat,
        longitude: delivery.dropoffLocation.lng,
      };
    }

    return DEFAULT_LOCATION;

  }, [delivery, driverLocation]);

  const region: Region = useMemo(() => ({
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  }), [center]);

  const markers = useMemo<DeliveryMarker[]>(() => {

    const list: DeliveryMarker[] = [];

    if (delivery?.pickupLocation) {
      list.push({
        latitude: delivery.pickupLocation.lat,
        longitude: delivery.pickupLocation.lng,
        title: "Point de prise",
        description: delivery.pickupAddress,
        type: "pickup",
      });
    }

    if (delivery?.dropoffLocation) {
      list.push({
        latitude: delivery.dropoffLocation.lat,
        longitude: delivery.dropoffLocation.lng,
        title: "Destination",
        description: delivery.dropoffAddress,
        type: "dropoff",
      });
    }

    if (driverLocation) {
      list.push({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        title: "Vous",
        description: "Position actuelle",
        type: "driver",
      });
    }

    return list;

  }, [delivery, driverLocation]);

  /**
   * Sera alimenté plus tard par Google Directions ou OSRM.
   */
  const polyline = useMemo(
    () => [] as { latitude: number; longitude: number }[],
    []
  );

  return {
    center,
    region,
    markers,
    polyline,
  };
}