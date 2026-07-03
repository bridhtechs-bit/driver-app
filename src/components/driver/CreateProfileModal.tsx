import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

interface CreateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { vehicleType: string; vehicleBrand: string; plateNumber: string }) => Promise<void>;
  loading?: boolean;
}

export function CreateProfileModal({ visible, onClose, onSubmit, loading = false }: CreateProfileModalProps) {
  const [vehicleType, setVehicleType] = useState('moto');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const handleSubmit = async () => {
    if (!vehicleType.trim() || !vehicleBrand.trim() || !plateNumber.trim()) return;
    await onSubmit({ vehicleType: vehicleType.trim(), vehicleBrand: vehicleBrand.trim(), plateNumber: plateNumber.trim() });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Créer votre profil livreur</Text>
          <Text style={styles.subtitle}>Renseignez votre véhicule pour recevoir des courses.</Text>

          <Text style={styles.label}>Type de véhicule</Text>
          <TextInput
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="moto"
            style={styles.input}
          />

          <Text style={styles.label}>Marque</Text>
          <TextInput
            value={vehicleBrand}
            onChangeText={setVehicleBrand}
            placeholder="Honda"
            style={styles.input}
          />

          <Text style={styles.label}>Plaque d'immatriculation</Text>
          <TextInput
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="TG-001-AB"
            style={styles.input}
            autoCapitalize="characters"
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose} disabled={loading}>
              <Text style={styles.secondaryText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'En cours...' : 'Créer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: spacing.four,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.four,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.one,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.three,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.one,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    marginBottom: spacing.two,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.two,
    marginTop: spacing.two,
  },
  secondaryButton: {
    paddingVertical: spacing.two,
    paddingHorizontal: spacing.three,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  secondaryText: {
    color: colors.dark,
    fontWeight: '600',
  },
  primaryButton: {
    paddingVertical: spacing.two,
    paddingHorizontal: spacing.three,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '600',
  },
});
