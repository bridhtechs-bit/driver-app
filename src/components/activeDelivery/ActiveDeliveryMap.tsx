import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View, Platform, useWindowDimensions } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { ActiveDelivery } from '@/types/activeDelivery';
import { colors } from '@/theme';

interface ActiveDeliveryMapProps {
  delivery: ActiveDelivery;
  driverLocation: { latitude: number; longitude: number } | null;
}

export function ActiveDeliveryMap({ delivery, driverLocation }: ActiveDeliveryMapProps) {
  const mapRef = useRef<MapView | null>(null);
  const { width } = useWindowDimensions();

  const center = useMemo(() => {
    if (driverLocation) return driverLocation;
    if (delivery.pickupLocation) {
      return { latitude: delivery.pickupLocation.lat, longitude: delivery.pickupLocation.lng };
    }
    if (delivery.dropoffLocation) {
      return { latitude: delivery.dropoffLocation.lat, longitude: delivery.dropoffLocation.lng };
    }
    return { latitude: 6.1760, longitude: 1.2310 };
  }, [delivery, driverLocation]);

  const region: Region = useMemo(() => ({
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  }), [center]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 500);
    }
  }, [region]);

  return (
    <View style={[styles.mapContainer, { width }]}> 
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        region={region}
        loadingEnabled
        showsUserLocation={!!driverLocation}
        showsMyLocationButton={!!driverLocation}
      >
        {delivery.pickupLocation && (
          <Marker
            coordinate={{
              latitude: delivery.pickupLocation.lat,
              longitude: delivery.pickupLocation.lng,
            }}
            title="Point de prise"
            description={delivery.pickupAddress}
            pinColor={colors.primary}
          />
        )}

        {delivery.dropoffLocation && (
          <Marker
            coordinate={{
              latitude: delivery.dropoffLocation.lat,
              longitude: delivery.dropoffLocation.lng,
            }}
            title="Destination"
            description={delivery.dropoffAddress}
            pinColor={colors.secondary}
          />
        )}

        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Vous"
            description="Position actuelle"
            pinColor={colors.dark}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 320,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
