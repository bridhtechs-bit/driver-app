import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@/theme';
import { Delivery } from '@/types/delivery';

interface DeliveryCardProps {
  delivery: Delivery;
  onAccept: () => void;
  disabled?: boolean;
}

export function DeliveryCard({ delivery, onAccept, disabled = false }: DeliveryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{delivery.receiverName}</Text>
        <Text style={styles.amount}>{delivery.proposedPrice.toFixed(0)} XOF</Text>
      </View>

      <Text style={styles.address}>Départ : {delivery.pickupAddress}</Text>
      <Text style={styles.address}>Arrivée : {delivery.dropoffAddress}</Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{delivery.distanceKm?.toFixed(1) || '0'} km</Text>
        </View>
        <View style={[styles.badge, styles.badgeLight]}>
          <Text style={[styles.badgeText, styles.badgeTextSecondary]}>{delivery.estimatedMinutes || '0'} min</Text>
        </View>
      </View>

      <Text style={styles.package}>{delivery.packageDescription || 'Aucune description'}</Text>

      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onAccept}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{disabled ? 'Traitement...' : 'Accepter la course'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.four,
    marginBottom: spacing.four,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.two,
    marginBottom: spacing.two,
  },
  badge: {
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
  },
  badgeLight: {
    backgroundColor: '#EEF5FF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  badgeTextSecondary: {
    color: colors.textSecondary,
  },
  package: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.three,
  },
  button: {
    paddingVertical: spacing.three,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
