import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Linking, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ActiveDeliveryMap } from '@/components/activeDelivery/ActiveDeliveryMap';
import { StatusPanel } from '@/components/activeDelivery/StatusPanel';
import { DeliveryProofModal } from '@/components/activeDelivery/DeliveryProofModal';
import { FeedbackBanner } from '@/components/common/FeedbackBanner';
import { useActiveDelivery } from '@/hooks/delivery/useActiveDelivery';
import { colors, spacing } from '@/theme';

export function ActiveDeliveryScreen() {
  const { delivery, driverLocation, tracking, loading, error, locationError, feedback, feedbackVariant, changeStatus, refetch } = useActiveDelivery();
  const [showProof, setShowProof] = useState(false);

  if (loading && !delivery) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}> 
          <Text style={styles.title}>Aucune livraison active</Text>
          <Text style={styles.subtitle}>Acceptez une course pour démarrer la navigation GPS.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusChange = async (status: 'picked_up' | 'in_transit' | 'delivered') => {
    try {
      if (status === 'delivered') {
        // open proof modal instead of directly setting delivered
        setShowProof(true);
        return;
      }

      await changeStatus(status);
    } catch (err) {
      console.error('Status change failed', err);
    }
  };

  const handleProofCompleted = async () => {
    await refetch();
  };

  const getDestinationCoords = () => {
    if (delivery.status === 'accepted' && delivery.pickupLocation) {
      return delivery.pickupLocation;
    } else if (delivery.dropoffLocation) {
      return delivery.dropoffLocation;
    }
    return null;
  };

  const handleNavigation = () => {
    const coords = getDestinationCoords();
    if (!coords) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    Linking.openURL(url).catch(() => {
      console.error('Failed to open Maps');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {locationError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      <FeedbackBanner message={feedback} variant={feedbackVariant} />

      <ActiveDeliveryMap delivery={delivery} driverLocation={driverLocation} />

      <View style={styles.details}>
        <Text style={styles.deliveryTitle}>Course en cours</Text>

        <View style={[styles.statusBadge, tracking ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
          <View style={[styles.statusDot, tracking ? styles.statusDotActive : styles.statusDotInactive]} />
          <Text style={[styles.statusText, tracking ? styles.statusTextActive : styles.statusTextInactive]}>
            {tracking ? 'Suivi actif' : 'Suivi en pause'}
          </Text>
        </View>

        <Text style={styles.address}>Départ : {delivery.pickupAddress}</Text>
        <Text style={styles.address}>Arrivée : {delivery.dropoffAddress}</Text>
        <Text style={styles.summary}>Colis : {delivery.packageDescription || 'Non décrit'}</Text>

        <TouchableOpacity 
          style={styles.navigateBtn} 
          onPress={handleNavigation}
        >
          <Ionicons name="navigate" size={20} color={colors.white} />
          <Text style={styles.navigateBtnText}>
            {delivery.status === 'accepted' ? 'Naviguer vers le départ' : 'Naviguer vers la destination'}
          </Text>
        </TouchableOpacity>
      </View>

      <StatusPanel
        delivery={delivery}
        currentStatus={delivery.status}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      <DeliveryProofModal
        visible={showProof}
        onClose={() => setShowProof(false)}
        deliveryId={delivery._id}
        onCompleted={handleProofCompleted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.four,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.two,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  details: {
    marginTop: spacing.four,
    gap: spacing.two,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.two,
    paddingVertical: spacing.half,
    borderRadius: 999,
    gap: spacing.half,
  },
  statusBadgeActive: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeInactive: {
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusDotActive: {
    backgroundColor: colors.success,
  },
  statusDotInactive: {
    backgroundColor: colors.textSecondary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextInactive: {
    color: colors.textSecondary,
  },
  deliveryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summary: {
    fontSize: 14,
    color: colors.dark,
    marginTop: spacing.two,
  },
  errorBox: {
    padding: spacing.three,
    backgroundColor: '#FDE8E8',
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.four,
  },
  errorText: {
    color: colors.primary,
    fontWeight: '700',
  },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark,
    paddingVertical: spacing.three,
    borderRadius: 12,
    marginTop: spacing.three,
    gap: spacing.two,
  },
  navigateBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
