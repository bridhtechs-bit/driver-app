import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@/theme';
import { ActiveDelivery } from '@/services/api/types/activeDelivery';

interface StatusPanelProps {
  delivery: ActiveDelivery;
  currentStatus: ActiveDelivery['status'];
  onStatusChange: (status: 'pickedUp' | 'inTransit' | 'delivered') => void;
  loading: boolean;
}

export function StatusPanel({ delivery, currentStatus, onStatusChange, loading }: StatusPanelProps) {
  const actions = [
    { status: 'pickedUp', label: 'Pris en charge' },
    { status: 'inTransit', label: 'En route' },
    { status: 'delivered', label: 'Livré' },
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Statut de livraison</Text>
      <Text style={styles.subheading}>Commande #{delivery._id.slice(-6)}</Text>

      <View style={styles.buttonGroup}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.status}
            style={[
              styles.button,
              currentStatus === action.status && styles.buttonActive,
              loading && styles.buttonDisabled,
            ]}
            disabled={loading || currentStatus === action.status}
            onPress={() => onStatusChange(action.status)}
          >
            <Text style={[styles.buttonText, currentStatus === action.status && styles.buttonTextActive]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navigationGroup}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => {
            // open navigation to dropoff by default
            import('@/services/navigation/navigation').then((m) => m.openNavigationToLocation(delivery.dropOffLocation));
          }}
        >
          <Text style={styles.navigationText}>Ouvrir la navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.four,
    padding: spacing.four,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.one,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.three,
  },
  buttonGroup: {
    gap: spacing.three,
  },
  button: {
    backgroundColor: '#F5F5F5',
    paddingVertical: spacing.three,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.dark,
    fontWeight: '700',
  },
  buttonTextActive: {
    color: colors.white,
  },
  navigationGroup: {
    marginTop: spacing.three,
    alignItems: 'center',
  },
  navigationButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.three,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },
  navigationText: {
    color: colors.white,
    fontWeight: '700',
  },
});
