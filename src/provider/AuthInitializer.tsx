/**
 * AuthInitializer.tsx
 *
 * Initialise l'authentification au lancement de l'application.
 *
 * Responsabilités
 * ----------------
 * • Restaurer la session depuis SecureStore
 * • Alimenter Redux
 * • Bloquer le rendu tant que le bootstrap n'est pas terminé
 */

import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAppDispatch } from "@/store/hooks";

import {
  setCredentials,
  initializeCompleted,
} from "@/store/slices/authSlice";

import { bootstrapAuth } from "@/services/auth/authBootstrap";

export default function AuthInitializer({
  children,
}: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        console.log("[AuthInitializer] Starting bootstrap...");

        const session = await bootstrapAuth();

        if (!mounted) return;

        if (session.authenticated) {
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}