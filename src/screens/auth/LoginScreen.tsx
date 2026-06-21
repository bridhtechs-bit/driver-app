import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LoginForm } from '@/components/forms/LoginForm';

export function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/(app)');
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
