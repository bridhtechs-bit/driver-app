import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/navigation/routes';
import { LoginForm } from '@/components/forms/LoginForm';

export function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace(ROUTES.APP);
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
