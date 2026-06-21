import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, clearCredentials, setLoading, setError } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/services/api/authApi';
import { saveAuthToken, deleteAuthToken } from '@/services/secureStore';

export function useAuth() {
  const dispatch = useAppDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = useAppSelector((state) => state.auth.token);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  const handleLogin = async (email: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await login({ email, password }).unwrap();
      await saveAuthToken(response.token);
      dispatch(setCredentials({ token: response.token }));
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

  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      await deleteAuthToken();
      dispatch(clearCredentials());
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    isAuthenticated,
    token,
    loading: loading || loginLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };
}
