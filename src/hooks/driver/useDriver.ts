import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  useCreateProfileMutation,
  useGetDriverProfileQuery,
  useGoOnlineMutation,
  useGoOfflineMutation,
  useToggleAvailabilityMutation,
} from '@/services/api/driverApi';
import { setProfile, setLoading, setError } from '@/store/slices/driverSlice';

export function useDriver() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.driver.profile);
  const stats = useAppSelector((state) => state.driver.stats);
  const loading = useAppSelector((state) => state.driver.loading);
  const error = useAppSelector((state) => state.driver.error);

  const {
    data: fetchedProfile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetDriverProfileQuery();

  const [createProfile, { isLoading: creatingProfile }] = useCreateProfileMutation();
  const [goOnline, { isLoading: goingOnline }] = useGoOnlineMutation();
  const [goOffline, { isLoading: goingOffline }] = useGoOfflineMutation();
  const [toggleAvailability, { isLoading: togglingAvailability }] =
    useToggleAvailabilityMutation();

  // Sync fetched profile to Redux and track query errors
  useEffect(() => {
    if (fetchedProfile) {
      dispatch(setProfile(fetchedProfile));
      dispatch(setError(null));
    }

    if (profileError) {
      const errorMessage =
        typeof profileError === 'object' && profileError !== null && 'data' in profileError
          ? (profileError.data as any)?.message || 'Impossible de charger votre profil.'
          : 'Impossible de charger votre profil.';
      dispatch(setError(errorMessage));
    }
  }, [dispatch, fetchedProfile, profileError]);

  const handleCreateProfile = async (payload: { vehicleType: string; vehicleBrand: string; plateNumber: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await createProfile(payload).unwrap();
      await refetchProfile();
      return true;
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as any)?.message || 'Impossible de créer votre profil.'
          : 'Impossible de créer votre profil.';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoOnline = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await goOnline().unwrap();
      // Refetch le profil complet pour mettre à jour Redux
      await refetchProfile();
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
      await goOffline().unwrap();
      await refetchProfile();
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
      await toggleAvailability().unwrap();
      await refetchProfile();
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
    loading: loading || profileLoading || creatingProfile || goingOnline || goingOffline || togglingAvailability,
    error,
    createProfile: handleCreateProfile,
    goOnline: handleGoOnline,
    goOffline: handleGoOffline,
    toggleAvailability: handleToggleAvailability,
    refetchProfile,
  };
}
