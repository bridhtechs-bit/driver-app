import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing } from '@/theme';

interface StatusToggleProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  loading?: boolean;
  color?: string;
}

export function StatusToggle({
  label,
  isActive,
  onPress,
  loading = false,
  color = colors.primary,
}: StatusToggleProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && [styles.active, { borderColor: color }],
        loading && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.toggle,
          isActive && [styles.toggleActive, { backgroundColor: color }],
        ]}
      >
        <View style={[styles.dot, isActive && styles.dotActive]} />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.three,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.three,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  active: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5F5',
  },
  disabled: {
    opacity: 0.6,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toggleActive: {
    backgroundColor: colors.primary,
    alignItems: 'flex-end',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  labelActive: {
    color: colors.dark,
    fontWeight: '700',
  },
});
