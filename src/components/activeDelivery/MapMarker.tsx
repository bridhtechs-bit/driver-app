import { Marker } from "react-native-maps";

import { colors } from "@/theme";

export interface DeliveryMarker {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type: "driver" | "pickup" | "dropoff";
}

interface Props {
  markers: DeliveryMarker[];
}

export function MapMarker({
  markers,
}: Props) {

  return (
    <>

      {markers.map((marker) => (

        <Marker
          key={marker.type}

          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}

          title={marker.title}

          description={marker.description}

          pinColor={
            marker.type === "pickup"
              ? colors.primary
              : marker.type === "dropoff"
              ? colors.secondary
              : colors.dark
          }
        />

      ))}

    </>
  );
}