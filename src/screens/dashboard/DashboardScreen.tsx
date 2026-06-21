import { StyleSheet, ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriver } from '@/hooks/useDriver';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { StatusToggle } from '@/components/dashboard/StatusToggle';
import { StatCard } from '@/components/dashboard/StatCard';
import { colors, spacing } from '@/theme';

export function DashboardScreen() {
  const { profile, stats, loading, error, goOnline, goOffline, toggleAvailability, refetchProfile } = useDriver();

  if (!profile && loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>
            Impossible de charger votre profil. Vérifiez votre connexion.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleOnline = async () => {
    try {
      if (profile.isOnline) {
        await goOffline();
      } else {
        await goOnline();
      }
    } catch (err) {
      console.error('Failed to toggle online status', err);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await toggleAvailability();
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refetchProfile()}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de bord</Text>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Profile Header */}
        <ProfileHeader
          name={profile.name}
          email={profile.email}
          rating={profile.rating}
          totalRatings={profile.totalRatings}
        />

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statut</Text>

          <StatusToggle
            label={profile.isOnline ? 'En ligne' : 'Hors ligne'}
            isActive={profile.isOnline}
            onPress={handleToggleOnline}
            loading={loading}
            color={colors.success}
          />

          <StatusToggle
            label={profile.isAvailable ? 'Disponible' : 'Indisponible'}
            isActive={profile.isAvailable}
            onPress={handleToggleAvailability}
            loading={loading}
            color={colors.primary}
          />
        </View>

        {/* Statistics Section */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistiques</Text>

            <View style={styles.statsGrid}>
              <StatCard
                label="Livraisons"
                value={stats.completedDeliveries}
                color={colors.primary}
              />
              <StatCard
                label="Revenus"
                value={`${stats.totalEarnings.toFixed(2)} XOF`}
                color={colors.success}
              />
            </View>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Conseil</Text>
          <Text style={styles.infoText}>
            Assurez-vous d'être en ligne pour recevoir les nouvelles commandes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.eight,
    gap: spacing.five,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.four,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.two,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    gap: spacing.two,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.dark,
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    borderRadius: 8,
  },
  errorBannerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    gap: spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    gap: spacing.three,
  },
  infoBox: {
    backgroundColor: '#E8F5FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.three,
    borderRadius: 8,
    gap: spacing.one,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
  },
  infoText: {
    fontSize: 13,
    color: '#0066CC',
    lineHeight: 20,
  },
});
