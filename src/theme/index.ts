import { Platform } from 'react-native';

export const colors = {
  primary: '#E53935',
  secondary: '#FF6F00',
  dark: '#1A1A1A',
  white: '#FFFFFF',
  background: '#F5F5F5',
  success: '#28A745',
  warning: '#FFC107',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6C6C6C',
  border: '#E0E0E0',
};

export const spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 20,
  five: 24,
  six: 32,
  eight: 40,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 900;

export const AppTheme = {
  colors,
  spacing,
  BottomTabInset,
  MaxContentWidth,
};

export type ThemeColor = keyof typeof colors;
