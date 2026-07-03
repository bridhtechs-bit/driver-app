/**
 * location.types.ts
 *
 * Types partagés par tout le module de géolocalisation.
 *
 * Ces types sont volontairement indépendants d'Expo afin de ne pas
 * coupler le reste de l'application aux types internes de la librairie.
 */

/**
 * Coordonnées GPS d'un livreur.
 */
export interface DriverCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Une position GPS reçue par Expo.
 * On ne conserve que les informations utiles.
 */
export interface DriverLocation {
  coords: DriverCoordinates;
  timestamp?: number;
}

/**
 * Données reçues par la tâche Expo TaskManager.
 */
export interface BackgroundLocationTaskData {
  locations: DriverLocation[];
}

/**
 * Statut du moteur de localisation.
 */
export type TrackingStatus =
  | 'stopped'
  | 'starting'
  | 'running'
  | 'stopping'
  | 'error';

/**
 * Options de tracking utilisées dans toute l'application.
 */
export interface TrackingOptions {
  accuracy: number;
  distanceInterval: number;
  timeInterval: number;
  foregroundService?: any;
  showsBackgroundLocationIndicator?: boolean;
}