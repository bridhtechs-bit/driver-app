import { View, Text, StyleSheet } from 'react-native';
import { ActiveDelivery } from '@/types/activeDelivery';
import { colors } from '@/theme';

interface ActiveDeliveryMapProps {
  delivery: ActiveDelivery;
  driverLocation: { latitude: number; longitude: number } | null;
}

export function ActiveDeliveryMap({ delivery, driverLocation }: ActiveDeliveryMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carte non disponible sur web.</Text>
      <Text style={styles.text}>Pickup: {delivery.pickupAddress}</Text>
      <Text style={styles.text}>Dropoff: {delivery.dropoffAddress}</Text>
      {driverLocation && <Text style={styles.text}>Vous: {driverLocation.latitude}, {driverLocation.longitude}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  text: {
    color: colors.dark,
    marginBottom: 8,
  },
});
