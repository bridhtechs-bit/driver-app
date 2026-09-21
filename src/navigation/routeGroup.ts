export type RouteGroup = "(app)" | "login" | "onboarding";

export function getRouteGroup(route: string | null | undefined): RouteGroup | null {
  if (!route) {
    return null;
  }

  if (route === "/(app)" || route === "/(app)/") {
    return "(app)";
  }

  if (route === "/login" || route === "/login/") {
    return "login";
  }

  if (route === "/onboarding" || route === "/onboarding/") {
    return "onboarding";
  }

  return null;
}

export function getCurrentGroup(segments: string[]): RouteGroup | null {
  const [firstSegment, secondSegment] = segments;

  if (!firstSegment) {
    return null;
  }

  if (firstSegment === "(app)") {
    return "(app)";
  }

  if (firstSegment === "login") {
    return "login";
  }

  if (firstSegment === "onboarding") {
    return "onboarding";
  }

  if (secondSegment === "(app)") {
    return "(app)";
  }

  return null;
}
