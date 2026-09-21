import { useEffect } from "react";
import MapView, { Region } from "react-native-maps";

interface Props {
  mapRef: React.RefObject<MapView | null>;
  region: Region;
}

export function MapCamera({
  mapRef,
  region,
}: Props) {

  useEffect(() => {

    if (!mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(region, 500);

  }, [mapRef, region]);

  return null;
}