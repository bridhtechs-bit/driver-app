import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '@/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export function StatCard({ label, value, icon, color = colors.primary }: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.icon, { color }]}>📊</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.three,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.three,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    gap: spacing.half,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
});
