import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { Delivery } from '@/types/delivery';

export function CompletedDeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Commande #{delivery._id.slice(-6)}</Text>
      <Text style={styles.address}>{delivery.pickupAddress} → {delivery.dropoffAddress}</Text>
      <View style={styles.meta}>
        <Text style={styles.small}>Montant: {delivery.proposedPrice} XOF</Text>
        <Text style={styles.small}>Durée: {delivery.estimatedMinutes} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.four,
    borderRadius: 12,
    marginBottom: spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.one,
  },
  address: {
    color: colors.textSecondary,
    marginBottom: spacing.two,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  small: {
    color: colors.textSecondary,
  },
});
