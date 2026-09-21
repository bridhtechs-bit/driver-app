import { useEffect } from "react";
import { usePathname, useRouter } from "expo-router";

import { useAppSelector } from "@/store/hooks";
import { resolveAuthRoute } from "@/navigation/routeResolver";
import { getCurrentGroup, getRouteGroup } from "@/navigation/routeGroup";

export default function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  
  const initialized = useAppSelector((state) => state.auth.initialized);
  const onboardingCompleted = useAppSelector((state) => state.auth.onboardingCompleted);
  const isAuthenticated = useAppSelector((state)=> state.auth.isAuthenticated)

  useEffect(() => {
    const target = resolveAuthRoute({
      initialized,
      isAuthenticated,
      onboardingCompleted,
    });

    if (!target) {
      return;
    }

    const currentGroup = getCurrentGroup(pathname.split("/").filter(Boolean));
    const targetGroup = getRouteGroup(target);

    if (currentGroup === targetGroup) {
      return;
    }

    console.log(`[NavigationGuard] ${pathname} → ${target}`);
    router.replace(target);
  }, [pathname, initialized, isAuthenticated, onboardingCompleted, router]);

  return <>{children}</>;
}