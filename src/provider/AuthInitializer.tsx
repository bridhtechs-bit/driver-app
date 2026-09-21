/**
 * AuthInitializer.tsx
 *
 * Initialise l'authentification au lancement de l'application.
 */

import { PropsWithChildren, useEffect, useState } from "react";

import SplashScreen from "@/components/splash/SplashScreen";

import { useAppDispatch } from "@/store/hooks";

import {
  setCredentials,
  initializeCompleted,
  setOnboardingCompleted,
} from "@/store/slices/authSlice";

import { bootstrapAuth } from "@/services/auth/authBootstrap";

export default function AuthInitializer({
  children,
}: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  /**
   * Bootstrap de la session
   */
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        console.log("[AuthInitializer] Starting bootstrap...");

        const session = await bootstrapAuth();

        if (!mounted) return;

        dispatch(
          setOnboardingCompleted(
            session.onboardingCompleted
          )
        );

        if (session.authenticated && session.token) {
          dispatch(
            setCredentials({
              token: session.token,
              user: session.user,
            })
          );

          console.log(
            "[AuthInitializer] Session restored."
          );
        } else {
          dispatch(initializeCompleted());

          console.log(
            "[AuthInitializer] No stored session."
          );
        }
      } catch (err) {
        console.error(
          "[AuthInitializer] Bootstrap failed:",
          err
        );

        dispatch(initializeCompleted());
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  /**
   * Pendant le bootstrap
   */
  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}