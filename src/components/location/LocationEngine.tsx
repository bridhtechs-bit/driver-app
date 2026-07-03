/**
 * LocationEngine.tsx
 *
 * Composant invisible (ne rend rien) dont le seul rôle est de monter
 * useBackgroundLocation une seule fois dans l'arbre React.
 *
 * En le plaçant dans le layout racine, le tracking démarre automatiquement
 * dès que le livreur est connecté et que son profil est approuvé,
 * quelle que soit la page affichée.
 *
 * Pattern : "Headless component" — aucun UI, uniquement des effets.
 */

import { useBackgroundLocation } from '@/hooks/location/useBackgroundLocation';

export function LocationEngine() {
  useBackgroundLocation();
  // Ce composant ne rend intentionnellement rien.
  return null;
}
