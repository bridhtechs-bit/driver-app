import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Validation du formulaire de login.
 * Le backend authentifie par numéro de téléphone (pas email).
 */
const LoginSchema = z.object({
  phone: z.string()
    .min(8, 'Numéro de téléphone requis (8+ chiffres)')
    .regex(/^\d+$/, 'Le numéro doit contenir uniquement des chiffres'),
  password: z.string().min(6, 'Mot de passe requis (6+ caractères)'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  return form;
}
