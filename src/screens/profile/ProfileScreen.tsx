import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useDriver } from '@/hooks/useDriver';
import { getDriverFullName } from '@/types/driver';
import { colors, spacing } from '@/theme';

export function ProfileScreen() {
  const { logout } = useAuth();
  const { profile } = useDriver();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.subtitle}>Chargement du profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {profile.user?.firstName?.charAt(0) || ''}
              {profile.user?.lastName?.charAt(0) || ''}
            </Text>
          </View>
          <Text style={styles.name}>{getDriverFullName(profile)}</Text>
          <Text style={styles.phone}>{profile.user?.phone}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {profile.verificationStatus === 'approved' && 'Vérifié'}
              {profile.verificationStatus === 'pending' && 'En attente de vérification'}
              {profile.verificationStatus === 'rejected' && 'Rejeté'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Véhicule</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{profile.vehicleType}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.label}>Marque</Text>
              <Text style={styles.value}>{profile.vehicleBrand}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.label}>Plaque d'immatriculation</Text>
              <Text style={styles.value}>{profile.plateNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile.user?.email}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.label}>Téléphone</Text>
              <Text style={styles.value}>{profile.user?.phone}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.four,
    paddingBottom: spacing.eight,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.six,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.three,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.one,
  },
  phone: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.two,
  },
  statusBadge: {
    backgroundColor: '#EEF5FF',
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
    borderRadius: 12,
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.five,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.three,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.four,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.two,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  logoutButton: {
    backgroundColor: '#FDE8E8',
    paddingVertical: spacing.three,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.two,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
