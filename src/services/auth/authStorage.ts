/**
 * authStorage.ts
 *
 * Persistance de la session utilisateur.
 *
 * Utilise SecureStore afin que le chauffeur
 * reste connecté même après fermeture de l'application.
 */

import { secureStoreHelper } from "@/services/api/secureStore";

const ACCESS_TOKEN_KEY = "token";
const USER_KEY = "user";

export type StoredDriver = {
  id: string;
  role: string;
  phone?: string;
  fullName?: string;
};

export async function saveAccessToken(token: string): Promise<void> {
  await secureStoreHelper.setItem(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  return secureStoreHelper.getItem(ACCESS_TOKEN_KEY);
}

export async function removeAccessToken(): Promise<void> {
  await secureStoreHelper.deleteItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return secureStoreHelper.getItem("refresh_token");
}

export async function removeRefreshToken(): Promise<void> {
  await secureStoreHelper.deleteItem("refresh_token");
}

export async function clearTokens(): Promise<void> {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
}



export async function saveDriver(driver: StoredDriver): Promise<void> {
  await secureStoreHelper.setItem(USER_KEY, JSON.stringify(driver));
}

export async function getDriver(): Promise<StoredDriver | null> {
  const json = await secureStoreHelper.getItem(USER_KEY);

  if (!json) return null;

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([removeAccessToken(), secureStoreHelper.deleteItem(USER_KEY)]);
}