import { useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
} from 'react-native';

import MapView, {
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import { ActiveDelivery } from '@/types/activeDelivery';

import { useDeliveryMap } from '@/hooks/delivery/useDeliveryMap';
import { useDriverLocation } from '../../hooks/location/useDriverLocation';

import { MapCamera } from './MapCamera';
import { MapMarker } from './MapMarker';
import { MapPolyline } from './MapPolyline';

interface ActiveDeliveryMapProps {
  delivery: ActiveDelivery;

  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export function ActiveDeliveryMap({
  delivery,
  driverLocation: incomingDriverLocation,
}: ActiveDeliveryMapProps) {

  const { driverLocation: reduxDriverLocation } = useDriverLocation();

  const driverLocation = incomingDriverLocation ?? reduxDriverLocation;

  const mapRef = useRef<MapView>(null);

  const { width } = useWindowDimensions();

  /**
   * Toute la logique cartographique
   * est centralisée dans le hook.
   */
  const {
    region,
    markers,
    polyline,
  } = useDeliveryMap(
    delivery,
    driverLocation
  );

  return (
    <View
      style={[
        styles.mapContainer,
        { width },
      ]}
    >
      <MapView
        ref={mapRef}

        style={styles.map}

        provider={
          Platform.OS === 'android'
            ? PROVIDER_GOOGLE
            : undefined
        }

        initialRegion={region}

        region={region}

        loadingEnabled

        showsUserLocation={!!driverLocation}

        showsMyLocationButton={!!driverLocation}
      >
        {/* Gestion automatique de la caméra */}
        <MapCamera
          mapRef={mapRef}
          region={region}
        />

        {/* Marqueurs */}
        <MapMarker
          markers={markers}
        />

        {/* Itinéraire */}
        <MapPolyline
          coordinates={polyline}
        />

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({

  mapContainer: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  map: {
    flex: 1,
  },

});