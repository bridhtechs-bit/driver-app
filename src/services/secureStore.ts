import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_TOKEN_KEY } from '@/constants/config';

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
}

export async function deleteAuthToken() {
  await SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY);
}
