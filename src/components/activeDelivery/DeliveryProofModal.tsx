import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { spacing, colors } from '@/theme';
import { useCompleteDeliveryMutation } from '@/services/api/activeDeliveryApi';

interface Props {
  visible: boolean;
  onClose: () => void;
  deliveryId: string;
  onCompleted: () => void;
}

export function DeliveryProofModal({ visible, onClose, deliveryId, onCompleted }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [completeDelivery, { isLoading }] = useCompleteDeliveryMutation();

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: false });
    if (!result.cancelled) {
      setImageUri(result.assets?.[0]?.uri ?? (result as any).uri);
    }
  }

  async function submitProof() {
    if (!imageUri) return;

    const form = new FormData();
    // @ts-ignore
    const filename = imageUri.split('/').pop();
    const match = filename?.match(/\.(\w+)$/);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // @ts-ignore
    form.append('proof', {
      uri: imageUri,
      name: filename,
      type,
    });

    try {
      await completeDelivery({ id: deliveryId, proof: form }).unwrap();
      onCompleted();
      onClose();
    } catch (e) {
      console.error('Upload proof failed', e);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Preuve de livraison</Text>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text>Aucune photo</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={isLoading}>
              <Text style={styles.buttonText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={submitProof} disabled={!imageUri || isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Envoyer et terminer</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={onClose} disabled={isLoading}>
              <Text style={styles.linkText}>Annuler</Text>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.three,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: spacing.three,
  },
  placeholder: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.three,
  },
  actions: {
    gap: spacing.two,
  },
  button: {
    backgroundColor: '#F5F5F5',
    paddingVertical: spacing.three,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirm: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontWeight: '700',
    color: colors.dark,
  },
  link: {
    marginTop: spacing.two,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
