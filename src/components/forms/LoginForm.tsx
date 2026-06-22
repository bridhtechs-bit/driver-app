import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginForm, LoginFormData } from '@/hooks/useLoginForm';
import { Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useLoginForm();
  const { login, loading, error } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        form.setError('email', { message: err.message });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>TogoExpress</Text>
          <Text style={styles.subtitle}>Connexion Livreur</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    form.formState.errors.email && styles.inputError,
                  ]}
                  placeholder="votre@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {form.formState.errors.email && (
              <Text style={styles.errorText}>
                {form.formState.errors.email.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <Controller
              control={form.control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    form.formState.errors.password && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  secureTextEntry
                  editable={!loading}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {form.formState.errors.password && (
              <Text style={styles.errorText}>
                {form.formState.errors.password.message}
              </Text>
            )}
          </View>

          {/* API Error */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.five,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.eight,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.one,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  form: {
    gap: spacing.four,
  },
  fieldGroup: {
    gap: spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.three,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: '#E53935',
    backgroundColor: '#FDE8E8',
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FDE8E8',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    borderRadius: 8,
  },
  errorBoxText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.two,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
