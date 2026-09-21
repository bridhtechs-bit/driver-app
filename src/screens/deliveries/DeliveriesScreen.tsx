import { StyleSheet, View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDeliveries } from '@/hooks/delivery/useDeliveries';
import { DeliveryCard } from '@/components/deliveries/DeliveryCard';
import { colors, spacing } from '@/theme';

export function DeliveriesScreen() {
  const router = useRouter();
  const { deliveries, loading, isAccepting, error, refetch, acceptDelivery } = useDeliveries();

  const handleAccept = async (deliveryId: string) => {
    try {
      await acceptDelivery(deliveryId);
      router.push('/deliveries/active');
    } catch (err) {
      console.error('Accept delivery failed', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses disponibles</Text>
        <Text style={styles.subtitle}>Choisissez une course et acceptez-la rapidement.</Text>
      </View>

      {loading && deliveries.length === 0 ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />
          }
        >
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {deliveries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucune course disponible</Text>
              <Text style={styles.emptyText}>Patientez, de nouvelles commandes arrivent bientôt.</Text>
            </View>
          ) : (
            deliveries.map((delivery) => (
              <DeliveryCard
                key={delivery._id}
                delivery={delivery}
                onAccept={() => handleAccept(delivery._id)}
                disabled={isAccepting}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.two,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.one,
  },
  content: {
    paddingHorizontal: spacing.four,
    paddingBottom: spacing.eight,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.four,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.two,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FDE8E8',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.three,
    borderRadius: 12,
    marginBottom: spacing.four,
  },
  errorText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
