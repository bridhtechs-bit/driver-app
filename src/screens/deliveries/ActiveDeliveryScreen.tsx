import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActiveDeliveryMap } from '@/components/activeDelivery/ActiveDeliveryMap';
import { StatusPanel } from '@/components/activeDelivery/StatusPanel';
import { DeliveryProofModal } from '@/components/activeDelivery/DeliveryProofModal';
import { useActiveDelivery } from '@/hooks/useActiveDelivery';
import { colors, spacing } from '@/theme';

export function ActiveDeliveryScreen() {
  const { delivery, driverLocation, loading, error, locationError, changeStatus } = useActiveDelivery();

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

  const handleStatusChange = async (status: 'pickedUp' | 'inTransit' | 'delivered') => {
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

  const [showProof, setShowProof] = useState(false);

  const handleProofCompleted = async () => {
    // after proof upload the server returns updated delivery; refetch UI
    await refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      {locationError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      <ActiveDeliveryMap delivery={delivery} driverLocation={driverLocation} />

      <View style={styles.details}>
        <Text style={styles.deliveryTitle}>Course en cours</Text>
        <Text style={styles.address}>{delivery.pickupAddress}</Text>
        <Text style={styles.address}>{delivery.dropOffAddress}</Text>
        <Text style={styles.summary}>{delivery.packageDescription}</Text>
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
});
