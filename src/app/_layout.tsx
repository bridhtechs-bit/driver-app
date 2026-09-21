import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from '@/store';
import AuthInitializer from '../provider/AuthInitializer';
import NavigationGuard from "@/navigation/NavigationGuard";
import { LocationEngine } from '@/engines/LocationEngine';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider
          value={
            colorScheme === 'dark'
              ? DarkTheme
              : DefaultTheme
          }
        >
          {/*
           * LocationEngine monte useBackgroundLocation une seule fois
           * pour toute la durée de vie de l'app.
           * Il démarre/arrête automatiquement le tracking à la connexion/déconnexion.
           */}
          <AuthInitializer>
            {/* NavigationGuard est responsable de la navigation initiale de l'application. */}
            <NavigationGuard>
              <LocationEngine />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(app)" />
              </Stack>
            </NavigationGuard>
          </AuthInitializer>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}