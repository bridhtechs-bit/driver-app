import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { ActiveDelivery } from '@/services/api/types/activeDelivery';
import { colors } from '@/theme';

interface ActiveDeliveryMapProps {
  delivery: ActiveDelivery;
  driverLocation: { latitude: number; longitude: number } | null;
}

export function ActiveDeliveryMap({ delivery, driverLocation }: ActiveDeliveryMapProps) {
  const center =
    driverLocation ??
    (delivery.pickupLocation ? { latitude: delivery.pickupLocation.lat, longitude: delivery.pickupLocation.lng } : null) ??
    (delivery.dropOffLocation ? { latitude: delivery.dropOffLocation.lat, longitude: delivery.dropOffLocation.lng } : null) ??
    { latitude: 6.1760, longitude: 1.2310 };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
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

        {delivery.dropOffLocation && (
          <Marker
            coordinate={{
              latitude: delivery.dropOffLocation.lat,
              longitude: delivery.dropOffLocation.lng,
            }}
            title="Destination"
            description={delivery.dropOffAddress}
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
