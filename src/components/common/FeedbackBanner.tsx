import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export type FeedbackVariant = 'success' | 'error' | 'info';

interface FeedbackBannerProps {
  message?: string | null;
  variant?: FeedbackVariant;
}

export function FeedbackBanner({ message, variant = 'info' }: FeedbackBannerProps) {
  if (!message) return null;

  const palette = {
    success: { background: '#EAF7ED', text: colors.success, border: colors.success },
    error: { background: '#FDECEC', text: colors.primary, border: colors.primary },
    info: { background: '#EAF4FF', text: '#1D4ED8', border: '#1D4ED8' },
  }[variant];

  return (
    <View style={[styles.container, { backgroundColor: palette.background, borderColor: palette.border }]}> 
      <Text style={[styles.text, { color: palette.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    marginBottom: spacing.three,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
