import { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriver } from '@/hooks/driver/useDriver';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { StatusToggle } from '@/components/dashboard/StatusToggle';
import { StatCard } from '@/components/dashboard/StatCard';
import { CreateProfileModal } from '@/components/driver/CreateProfileModal';
import { getDriverFullName } from '@/types/driver';
import { colors, spacing } from '@/theme';

export function DashboardScreen() {
  const { profile, stats, loading, error, createProfile, goOnline, goOffline, toggleAvailability, refetchProfile } = useDriver();
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);

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
    const handleCreate = async (payload: { vehicleType: string; vehicleBrand: string; plateNumber: string }) => {
      setSubmittingProfile(true);
      try {
        await createProfile(payload);
      } finally {
        setSubmittingProfile(false);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Profil livreur requis</Text>
          <Text style={styles.errorMessage}>
            {error || 'Créez votre profil pour recevoir des livraisons et apparaître en ligne.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setShowCreateProfileModal(true)}>
            <Text style={styles.retryButtonText}>Créer mon profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => refetchProfile()}>
            <Text style={styles.secondaryActionText}>Réessayer</Text>
          </TouchableOpacity>
        </View>

        <CreateProfileModal
          visible={showCreateProfileModal}
          onClose={() => setShowCreateProfileModal(false)}
          onSubmit={handleCreate}
          loading={submittingProfile}
        />
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

        {/* Verification Banner */}
        {profile.verificationStatus !== 'approved' && (
          <View style={[styles.errorBanner, { backgroundColor: '#FFF3CD', borderLeftColor: '#FFC107' }]}>
            <Text style={[styles.errorBannerText, { color: '#856404' }]}>
              {profile.verificationStatus === 'pending'
                ? 'Votre compte est en cours de vérification.'
                : 'Votre compte a été rejeté. Veuillez contacter le support.'}
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Profile Header */}
        <ProfileHeader
          name={getDriverFullName(profile)}
          email={profile.user?.email || ''}
          rating={profile.averageRating || 0}
          totalRatings={profile.totalDeliveries || 0}
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
                value={stats.completedDeliveriesCount}
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.four,
    backgroundColor: colors.primary,
    paddingVertical: spacing.three,
    paddingHorizontal: spacing.six,
    borderRadius: 12,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryAction: {
    marginTop: spacing.two,
    paddingVertical: spacing.two,
    paddingHorizontal: spacing.four,
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
