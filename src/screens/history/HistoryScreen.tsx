import React from 'react';
import { SafeAreaView, View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useGetCompletedDeliveriesQuery } from '@/services/api/deliveryApi';
import { colors, spacing } from '@/theme';
import { CompletedDeliveryCard } from '@/components/history/CompletedDeliveryCard';

export function HistoryScreen() {
  const { data: deliveries, isLoading, refetch, isFetching } = useGetCompletedDeliveriesQuery();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: spacing.four, paddingTop: spacing.four }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.dark }}>Historique</Text>
        <Text style={{ color: colors.textSecondary, marginTop: spacing.one }}>Vos livraisons terminées</Text>
      </View>

      {isLoading && (!deliveries || deliveries.length === 0) ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.four, paddingBottom: spacing.eight }}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />}
        >
          {deliveries && deliveries.length > 0 ? (
            deliveries.map((d) => <CompletedDeliveryCard key={d._id} delivery={d} />)
          ) : (
            <View style={{ padding: spacing.four }}>
              <Text style={{ color: colors.textSecondary }}>Aucune livraison terminée récemment.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
