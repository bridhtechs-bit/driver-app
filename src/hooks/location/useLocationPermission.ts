/**
 * useLocationPermission.ts
 *
 * Hook responsable de la vérification et de la demande des permissions
 * de localisation (foreground + background).
 */

import { useState, useCallback, useRef } from 'react';
import {
  checkLocationPermissions,
  requestLocationPermissions,
  type LocationPermissionResult,
  type PermissionStatus,
} from '@/services/location/locationPermissions';

export type PermissionState = {
  allGranted: boolean;
  foreground: PermissionStatus;
  background: PermissionStatus;
  definitivelyDenied: boolean;
  checking: boolean;
  error: string | null;
};

const initialState: PermissionState = {
  allGranted: false,
  foreground: 'unavailable',
  background: 'unavailable',
  definitivelyDenied: false,
  checking: false,
  error: null,
};

function buildState(result: LocationPermissionResult): PermissionState {
  return {
    allGranted: result.allGranted,
    foreground: result.foreground,
    background: result.background,
    definitivelyDenied:
      result.foreground === 'definitively_denied' ||
      result.background === 'definitively_denied',
    checking: false,
    error: null,
  };
}

function areStatesEqual(a: PermissionState, b: PermissionState): boolean {
  return (
    a.allGranted === b.allGranted &&
    a.foreground === b.foreground &&
    a.background === b.background &&
    a.definitivelyDenied === b.definitivelyDenied &&
    a.checking === b.checking &&
    a.error === b.error
  );
}

export function useLocationPermission() {
  const [state, setState] = useState<PermissionState>(initialState);

  // Empêche plusieurs appels concurrents
  const runningRef = useRef(false);
  const stateRef = useRef<PermissionState>(initialState);

  const check = useCallback(async () => {
    if (runningRef.current) return;

    runningRef.current = true;

    setState((prev) =>
      prev.checking
        ? prev
        : {
            ...prev,
            checking: true,
            error: null,
          }
    );

    try {
      const result = await checkLocationPermissions();

      const nextState = buildState(result);

      setState((prev) => {
        if (areStatesEqual(prev, nextState)) {
          return prev;
        }

        stateRef.current = nextState;
        return nextState;
      });
    } catch (err) {
      console.error('[useLocationPermission] check failed:', err);

      setState((prev) => {
        const nextState = {
          ...prev,
          checking: false,
          error: 'Vérification des permissions échouée.',
        };
        stateRef.current = nextState;
        return nextState;
      });
    } finally {
      runningRef.current = false;
    }
  }, []);

  const request = useCallback(async (): Promise<boolean> => {
    if (runningRef.current) {
      return stateRef.current.allGranted;
    }

    runningRef.current = true;

    setState((prev) =>
      prev.checking
        ? prev
        : {
            ...prev,
            checking: true,
            error: null,
          }
    );

    try {
      const result = await requestLocationPermissions();

      const nextState = buildState(result);

      setState((prev) => {
        if (areStatesEqual(prev, nextState)) {
          return prev;
        }

        stateRef.current = nextState;
        return nextState;
      });

      return result.allGranted;
    } catch (err) {
      console.error('[useLocationPermission] request failed:', err);

      setState((prev) => {
        const nextState = {
          ...prev,
          checking: false,
          error: 'Demande des permissions échouée.',
        };
        stateRef.current = nextState;
        return nextState;
      });

      return false;
    } finally {
      runningRef.current = false;
    }
  }, []);

  return {
    ...state,
    check,
    request,
  };
}