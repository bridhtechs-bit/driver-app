import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";

import { useLoginForm, LoginFormData } from "@/hooks/useLoginForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { colors, spacing } from "@/theme";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useLoginForm();

  const { login, loading, error } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.phone, data.password);
      onSuccess();
    } catch {
      // Les erreurs sont déjà gérées par useLogin
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
          {/* Téléphone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Numéro de téléphone</Text>

            <Controller
              control={form.control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    form.formState.errors.phone && styles.inputError,
                  ]}
                  placeholder="90 12 34 56"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  maxLength={8}
                  returnKeyType="next"
                  textContentType="telephoneNumber"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {form.formState.errors.phone && (
              <Text style={styles.errorText}>
                {form.formState.errors.phone.message}
              </Text>
            )}
          </View>

          {/* Mot de passe */}
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
                  returnKeyType="done"
                  textContentType="password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onSubmitEditing={form.handleSubmit(onSubmit)}
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

          {/* Erreur API */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {/* Bouton */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={form.handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
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
    justifyContent: "space-between",
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.eight,
  },

  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.one,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  form: {
    gap: spacing.four,
  },

  fieldGroup: {
    gap: spacing.two,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
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
    borderColor: "#E53935",
    backgroundColor: "#FDE8E8",
  },

  errorText: {
    fontSize: 12,
    color: "#E53935",
    fontWeight: "500",
  },

  errorBox: {
    backgroundColor: "#FDE8E8",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    borderRadius: 8,
  },

  errorBoxText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.three,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.two,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});