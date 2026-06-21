import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from '@/store';

export const unstable_settings = {
  initialRouteName: 'login',
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
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="(app)" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}