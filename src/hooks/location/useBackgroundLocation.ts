/**
 * useBackgroundLocation.ts
 *
 * Gestion complète du tracking GPS.
 *
 * Responsabilités :
 *  - vérifier les permissions
 *  - démarrer/arrêter le tracking
 *  - lancer le watcher foreground
 *  - laisser le background à locationTask.ts
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as Location from "expo-location";

import { useAppSelector } from "@/store/hooks";

import {
  useGetDriverProfileQuery,
} from "@/services/api/driverApi";

import {
  startTracking,
  stopTracking,
  isTracking,
} from "@/services/location/backgroundLocation";

import {
  hasAllPermissions,
  requestLocationPermissions,
} from "@/services/location/locationPermissions";

import { LOCATION_TRACKING_OPTIONS } from "@/services/location/constants";

import { sendDriverLocation } from "@/services/location/locationSender";

export type BackgroundLocationState = {
  isActive: boolean;
  permissionStatus: string;
  definitivelyDenied: boolean;
  error: string | null;
};

export function useBackgroundLocation(): BackgroundLocationState {

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const { data: profile } = useGetDriverProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const shouldTrack =
    isAuthenticated &&
    profile?.verificationStatus === "approved";

  const watcherRef =
    useRef<Location.LocationSubscription | null>(null);

  const startingRef = useRef(false);

  const stoppingRef = useRef(false);

  const mountedRef = useRef(true);

  const trackingActiveRef = useRef(false);

  const [trackingActive, setTrackingActive] =
    useState(false);

  const [trackingError, setTrackingError] =
    useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Lance le watcher foreground.
   */

  const startForegroundWatcher = useCallback(async () => {

    if (watcherRef.current) {
      return;
    }

    watcherRef.current =
      await Location.watchPositionAsync(
        {
          accuracy:
            LOCATION_TRACKING_OPTIONS.accuracy,

          distanceInterval:
            LOCATION_TRACKING_OPTIONS.distanceInterval,

          timeInterval:
            LOCATION_TRACKING_OPTIONS.timeInterval,
        },

        async ({ coords }) => {

          const { latitude, longitude } = coords;

          console.log(
            `[Foreground] ${latitude}, ${longitude}`
          );

          try {

            await sendDriverLocation(
              latitude,
              longitude
            );

          } catch (err) {

            console.warn(
              "[Foreground] send failed",
              err
            );

          }

        }
      );

    console.log(
      "[Foreground] Watch started."
    );

  }, []);

  /**
   * Arrête le watcher.
   */

  const stopForegroundWatcher =
    useCallback(() => {

      if (!watcherRef.current) {
        return;
      }

      watcherRef.current.remove();
      watcherRef.current = null;

      console.log(
        "[Foreground] Watch stopped."
      );

    }, []);

      /**
   * Active le tracking GPS.
   */
  const enableTracking = useCallback(async () => {
    if (startingRef.current) return;
    if (trackingActiveRef.current) return;

    startingRef.current = true;

    try {
      setTrackingError(null);

      // Vérifie si toutes les permissions sont déjà accordées
      let granted = await hasAllPermissions();

      // Sinon on les demande
      if (!granted) {
        const permissionResult = await requestLocationPermissions();
        granted = permissionResult.allGranted;
      }

      if (!granted) {
        setTrackingError(
          "Les permissions de localisation sont requises."
        );
        return;
      }

      // Tracking background
      const started = await isTracking();

      if (!started) {
        await startTracking();
      }

      // Tracking foreground
      await startForegroundWatcher();

      if (mountedRef.current) {
        trackingActiveRef.current = true;
        setTrackingActive(true);
      }

      console.log("[Location] Tracking enabled.");
    } catch (err: any) {
      console.error("[Location] enableTracking:", err);

      if (mountedRef.current) {
        setTrackingError(
          err?.message ??
            "Impossible de démarrer le tracking."
        );
      }
    } finally {
      startingRef.current = false;
    }
  }, [startForegroundWatcher]);

  /**
   * Désactive complètement le tracking.
   */
  const disableTracking = useCallback(async () => {
    if (stoppingRef.current) return;

    stoppingRef.current = true;

    try {
      stopForegroundWatcher();

      const started = await isTracking();

      if (started) {
        await stopTracking();
      }

      if (mountedRef.current) {
        trackingActiveRef.current = false;
        setTrackingActive(false);
      }

      console.log("[Location] Tracking disabled.");
    } catch (err) {
      console.error("[Location] disableTracking:", err);
    } finally {
      stoppingRef.current = false;
    }
  }, [stopForegroundWatcher]);

  /**
   * Réagit uniquement aux changements d'authentification
   * ou de validation du profil.
   */
  useEffect(() => {
    if (shouldTrack) {
      enableTracking();
    } else {
      disableTracking();
    }
  }, [shouldTrack, enableTracking, disableTracking]);

  /**
   * Nettoyage au démontage.
   */
  useEffect(() => {
    return () => {
      stopForegroundWatcher();

      isTracking().then((started) => {
        if (started) {
          stopTracking();
        }
      });
    };
  }, []);

  return {
    isActive: trackingActive,

    permissionStatus: trackingActive
      ? "granted"
      : "unknown",

    definitivelyDenied: false,

    error: trackingError,
  };
}