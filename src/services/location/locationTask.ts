/**
 * locationTask.ts
 *
 * Tâche Expo TaskManager exécutée en arrière-plan.
 *
 * Responsabilités :
 *  - Recevoir les mises à jour GPS d'Expo
 *  - Extraire la dernière position
 *  - Déléguer l'envoi de la position à locationSender.ts
 *
 * Cette tâche s'exécute dans un contexte JS isolé :
 *  - Aucun accès à Redux
 *  - Aucun accès aux Hooks React
 *  - Aucun accès aux Context React
 *
 * Toute la logique réseau est centralisée dans locationSender.ts.
 */

import * as TaskManager from 'expo-task-manager';
import {AppState} from 'react-native';

import { BACKGROUND_LOCATION_TASK } from './constants';
import { sendDriverLocation } from './locationSender';
import {BackgroundLocationTaskData} from './location.types';

TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }) => {
    if (error) {
      console.error(
        '[LocationTask] Task error:',
        error.message
      );
      return;
    }

    if (!data) {
      console.warn(
        '[LocationTask] No location data received.'
      );
      return;
    }

    const { locations } = data as BackgroundLocationTaskData;

    if (!locations?.length) {
      return;
    }

    /**
     * On prend toujours la dernière position connue.
     */
    const latestLocation = locations[locations.length - 1];

    const { latitude, longitude } = latestLocation.coords;


    console.log(
      `[LocationTask] Background position: ${latitude}, ${longitude}`
    );

    if(AppState.currentState !== 'active') {
      return;
    }

    try {
      await sendDriverLocation(latitude, longitude);
    } catch (err: any) {
      console.error(
        '[LocationTask] Failed to send driver location:',
        err?.response?.data?.message ??
          err?.message ??
          err
      );
    }
  }
);