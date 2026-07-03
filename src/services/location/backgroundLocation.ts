/**
 * backgroundLocation.ts
 *
 * Service responsable du démarrage, de l'arrêt et de la vérification
 * du suivi de localisation en arrière-plan.
 *
 * Ce fichier ne contient AUCUNE logique de traitement de position —
 * c'est le rôle de locationTask.ts.
 * Il ne contient AUCUNE logique de permissions — c'est le rôle de locationPermissions.ts.
 */

import * as Location from 'expo-location';
import { BACKGROUND_LOCATION_TASK, LOCATION_TRACKING_OPTIONS } from './constants';

// Import side-effect : enregistre la tâche auprès de TaskManager
// DOIT être importé une seule fois, avant tout appel à startTracking()
import './locationTask';

/**
 * Démarre le tracking GPS en arrière-plan.
 * À appeler uniquement après avoir obtenu les permissions (foreground + background).
 *
 * Si le tracking est déjà actif, cette fonction ne fait rien.
 */
export async function startTracking(): Promise<void> {

  //verifier si le tracking est déjà actif pour éviter de démarrer plusieurs fois la tâche
  const alreadyTracking = await isTracking();
  if (alreadyTracking) {
    console.log('[BackgroundLocation] Tracking already active. Skipping start.');
    return;
  }

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: LOCATION_TRACKING_OPTIONS.accuracy as any,
    distanceInterval: LOCATION_TRACKING_OPTIONS.distanceInterval,
    timeInterval: LOCATION_TRACKING_OPTIONS.timeInterval,
    foregroundService: LOCATION_TRACKING_OPTIONS.foregroundService,
    showsBackgroundLocationIndicator: LOCATION_TRACKING_OPTIONS.showsBackgroundLocationIndicator,
  });

  console.log('[BackgroundLocation] Tracking started.');
}

/**
 * Arrête le tracking GPS en arrière-plan.
 * Si le tracking n'est pas actif, cette fonction ne fait rien.
 */
export async function stopTracking(): Promise<void> {
  const alreadyTracking = await isTracking();
  if (!alreadyTracking) {
    console.log('[BackgroundLocation] Tracking not active. Skipping stop.');
    return;
  }

  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  console.log('[BackgroundLocation] Tracking stopped.');
}

/**
 * Vérifie si le tracking GPS est actuellement actif.
 * Retourne true si la tâche est enregistrée et en cours d'exécution.
 */
export async function isTracking(): Promise<boolean> {
  return await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
}
