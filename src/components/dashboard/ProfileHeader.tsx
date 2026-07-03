import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '@/theme';

interface ProfileHeaderProps {
  name: string;
  email: string;
  rating: number;
  totalRatings: number;
}

export function ProfileHeader({
  name,
  email,
  rating,
  totalRatings,
}: ProfileHeaderProps) {
  const ratingPercentage = rating ? (rating * 100) / 5 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({totalRatings} avis)</Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingTrack}>
          <View style={[styles.ratingBar, { width: `${Math.max(ratingPercentage, 8)}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.four,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.three,
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  info: {
    gap: spacing.one,
    marginBottom: spacing.three,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  rating: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ratingRow: {
    marginTop: spacing.one,
  },
  ratingTrack: {
    height: 6,
    backgroundColor: '#F1F1F1',
    borderRadius: 999,
    overflow: 'hidden',
  },
  ratingBar: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
});
