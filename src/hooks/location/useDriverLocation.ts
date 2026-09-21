import { useAppSelector } from "@/store/hooks";

export function useDriverLocation() {
  const currentLocation = useAppSelector((state) => state.location.current);
  const tracking = useAppSelector((state) => state.location.tracking);
  const locationError = useAppSelector((state) => state.location.error);

  return {
    driverLocation: currentLocation,
    tracking,
    locationError,
  };
}
