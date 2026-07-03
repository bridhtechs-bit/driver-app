import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ActiveDelivery } from '@/types/activeDelivery';
import { colors, spacing } from '@/theme';

interface StatusPanelProps {
  delivery: ActiveDelivery;
  currentStatus: ActiveDelivery['status'];
  onStatusChange: (status: 'picked_up' | 'in_transit' | 'delivered') => void;
  loading?: boolean;
}

export function StatusPanel({ delivery, currentStatus, onStatusChange, loading }: StatusPanelProps) {
  const actions: { status: 'picked_up' | 'in_transit' | 'delivered'; label: string }[] = [
    { status: 'picked_up', label: 'Pris en charge' },
    { status: 'in_transit', label: 'En route' },
    { status: 'delivered', label: 'Livré' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statut de la course</Text>
      <View style={styles.buttonsRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.status}
            style={[
              styles.button,
              currentStatus === action.status && styles.buttonActive,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.four,
    gap: spacing.three,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.two,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.three,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontWeight: '700',
    color: colors.dark,
    fontSize: 12,
  },
  buttonTextActive: {
    color: colors.white,
  },
});
