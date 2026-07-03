/**
 * locationPermissions.ts
 *
 * Gère exclusivement les permissions de localisation.
 *
 * Responsabilités :
 * - Vérifier les permissions existantes
 * - Demander les permissions
 * - Fournir des helpers pour le reste de l'application
 *
 * Ne démarre PAS le tracking GPS.
 * Le tracking est géré par backgroundLocation.ts.
 */

import * as Location from "expo-location";
import { Linking } from "react-native";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type PermissionStatus =
  | "granted"
  | "denied"
  | "definitively_denied"
  | "unavailable";

export type LocationPermissionResult = {
  foreground: PermissionStatus;
  background: PermissionStatus;
  allGranted: boolean;
};

// ─────────────────────────────────────────────────────────────
// Helpers privés
// ─────────────────────────────────────────────────────────────

/**
 * Convertit le statut Expo vers un statut métier.
 */
function toPermissionStatus(
  status: Location.PermissionStatus,
  canAskAgain: boolean
): PermissionStatus {
  if (status === "granted") return "granted";

  if (status === "denied") {
    return canAskAgain ? "denied" : "definitively_denied";
  }

  return "unavailable";
}

// ─────────────────────────────────────────────────────────────
// API Publique
// ─────────────────────────────────────────────────────────────

/**
 * Vérifie les permissions actuelles sans afficher de popup.
 */
export async function checkLocationPermissions(): Promise<LocationPermissionResult> {
  const foregroundResponse =
    await Location.getForegroundPermissionsAsync();

  const backgroundResponse =
    await Location.getBackgroundPermissionsAsync();

  const foreground = toPermissionStatus(
    foregroundResponse.status,
    foregroundResponse.canAskAgain
  );

  const background = toPermissionStatus(
    backgroundResponse.status,
    backgroundResponse.canAskAgain
  );

  return {
    foreground,
    background,
    allGranted:
      foreground === "granted" &&
      background === "granted",
  };
}

/**
 * Demande les permissions à l'utilisateur.
 *
 * Ordre obligatoire :
 * 1. Foreground
 * 2. Background
 */
export async function requestLocationPermissions(): Promise<LocationPermissionResult> {
  console.log("[Permissions] Requesting foreground permission...");

  const foregroundResponse =
    await Location.requestForegroundPermissionsAsync();

  const foreground = toPermissionStatus(
    foregroundResponse.status,
    foregroundResponse.canAskAgain
  );

  console.log(`[Permissions] Foreground = ${foreground}`);

  if (foreground !== "granted") {
    return {
      foreground,
      background: "unavailable",
      allGranted: false,
    };
  }

  console.log("[Permissions] Requesting background permission...");

  const backgroundResponse =
    await Location.requestBackgroundPermissionsAsync();

  const background = toPermissionStatus(
    backgroundResponse.status,
    backgroundResponse.canAskAgain
  );

  console.log(`[Permissions] Background = ${background}`);

  return {
    foreground,
    background,
    allGranted:
      foreground === "granted" &&
      background === "granted",
  };
}

/**
 * Vérifie si toutes les permissions sont accordées.
 */
export async function hasAllPermissions(): Promise<boolean> {
  const result = await checkLocationPermissions();
  return result.allGranted;
}

/**
 * Helper principal.
 *
 * Vérifie les permissions.
 * Si elles n'existent pas, les demande.
 *
 * Retourne true uniquement si tout est accordé.
 */
export async function ensureLocationPermissions(): Promise<boolean> {
  const current = await checkLocationPermissions();

  if (current.allGranted) {
    console.log("[Permissions] Already granted.");
    return true;
  }

  const requested = await requestLocationPermissions();

  if (requested.allGranted) {
    console.log("[Permissions] Permissions granted.");
    return true;
  }

  console.warn("[Permissions] Permissions not granted.");

  return false;
}

/**
 * Ouvre directement les paramètres de l'application.
 *
 * À utiliser lorsqu'un utilisateur a refusé définitivement
 * les permissions (canAskAgain = false).
 */
export async function openLocationSettings(): Promise<void> {
  console.log("[Permissions] Opening device settings...");
  await Linking.openSettings();
}