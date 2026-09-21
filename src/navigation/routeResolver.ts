/**
 * routeResolver.ts
 *
 * Détermine la route à afficher
 * en fonction de l'état d'authentification.
 */

import { ROUTES } from "@/navigation/routes";

export type AuthRoute =
  | typeof ROUTES.ONBOARDING
  | typeof ROUTES.LOGIN
  | typeof ROUTES.APP;

type ResolveAuthRouteParams = {
  initialized: boolean;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
};

export function resolveAuthRoute({
  initialized,
  isAuthenticated,
  onboardingCompleted,
}: ResolveAuthRouteParams): AuthRoute | null {

  // AuthInitializer n'a pas terminé
  if (!initialized) {
    return null;
  }

  // Premier lancement
  if (!onboardingCompleted) {
    return ROUTES.ONBOARDING;
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return ROUTES.LOGIN;
  }

  // Utilisateur connecté
  return ROUTES.APP;
}