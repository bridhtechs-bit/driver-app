/**
 * authBootstrap.ts
 *
 * Lit les informations d'authentification
 * stockées dans SecureStore.
 *
 * Ne modifie PAS Redux.
 */

import { User } from "@/types/auth";

import { secureStoreHelper } from "@/services/storage/secureStore";

export type BootstrapSession = {
  authenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  onboardingCompleted: boolean;
};

export async function bootstrapAuth(): Promise<BootstrapSession> {
  try {
    // Read canonical keys from secure storage
    const token = await secureStoreHelper.getItem("token");
    const refreshToken = await secureStoreHelper.getItem("refresh_token");
    const onboardingCompletedValue = await secureStoreHelper.getItem("onBoardingCompleted");
    const onboardingCompleted = onboardingCompletedValue === "true";

    if (!token) {
      return {
        authenticated: false,
        token: null,
        refreshToken: null,
        user: null,
        onboardingCompleted,
      };
    }

    console.log("[AuthBootstrap] Session trouvée.");

    /**
     * Le profil utilisateur sera récupéré
     * automatiquement via RTK Query
     * (useGetDriverProfileQuery).
     */

    return {
      authenticated: true,
      token,
      refreshToken,
      user: null,
      onboardingCompleted,
    };

  } catch (err) {

    console.error(
      "[AuthBootstrap] Impossible de restaurer la session",
      err
    );
    return {
      authenticated: false,
      token: null,
      refreshToken: null,
      user: null,
      onboardingCompleted: false,
    };
  }
}