import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  useGetProfileQuery,
  useGoOnlineMutation,
  useGoOfflineMutation,
  useToggleAvailabilityMutation,
} from '@/services/api/driverApi';
import { setProfile, setLoading, setError } from '@/features/driver/driverSlice';

export function useDriver() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.driver.profile);
  const stats = useAppSelector((state) => state.driver.stats);
  const loading = useAppSelector((state) => state.driver.loading);
  const error = useAppSelector((state) => state.driver.error);

  const {
    data: fetchedProfile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const [goOnline, { isLoading: goingOnline }] = useGoOnlineMutation();
  const [goOffline, { isLoading: goingOffline }] = useGoOfflineMutation();
  const [toggleAvailability, { isLoading: togglingAvailability }] =
    useToggleAvailabilityMutation();

  // Sync fetched profile to Redux
  if (fetchedProfile && !profile) {
    dispatch(setProfile(fetchedProfile));
  }

  const handleGoOnline = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await goOnline().unwrap();
      dispatch(setProfile(result));
      return true;
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as any)?.message || 'Erreur de connexion'
          : 'Erreur de connexion';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoOffline = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await goOffline().unwrap();
      dispatch(setProfile(result));
      return true;
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as any)?.message || 'Erreur de déconnexion'
          : 'Erreur de déconnexion';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleToggleAvailability = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await toggleAvailability().unwrap();
      dispatch(setProfile(result));
      return true;
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as any)?.message || 'Erreur de mise à jour'
          : 'Erreur de mise à jour';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    profile,
    stats,
    loading: loading || profileLoading || goingOnline || goingOffline || togglingAvailability,
    error,
    goOnline: handleGoOnline,
    goOffline: handleGoOffline,
    toggleAvailability: handleToggleAvailability,
    refetchProfile,
  };
}
