# Phase 2 - Authentification

## Architecture

### Flow d'authentification

```
┌─────────────────────┐
│  RootLayout (_layout.tsx)
│  - Redux Provider
│  - SafeAreaProvider
│  - RootLayoutNavigator
└──────────┬──────────┘
           │
           ├─── RootLayoutNavigator
           │    └─ Vérifie isAuthenticated
           │       ├─ true  → redirection (app)
           │       └─ false → redirection /login
           │
           ├─── /login
           │    └─ LoginScreen
           │       └─ LoginForm
           │          ├─ React Hook Form
           │          ├─ Zod Validation
           │          └─ useAuth Hook
           │
           └─── /(app) [PROTECTED]
                ├─ _layout.tsx (NativeTabs)
                ├─ index.tsx (Dashboard)
                ├─ deliveries.tsx (Courses)
                ├─ history.tsx (Historique)
                └─ profile.tsx (Profil)
```

### Hooks disponibles

- `useAuth()` - gère l'authentification, logout, token
- `useLoginForm()` - gère le formulaire de login avec validation

### Stockage sécurisé

- Token JWT sauvegardé avec `expo-secure-store`
- Redux maintient l'état de l'authentification
- Axios ajoute automatiquement le JWT dans les headers

## Fichiers créés

### Hooks
- `src/hooks/useAuth.ts` - hook d'authentification
- `src/hooks/useLoginForm.ts` - formulaire de login avec Zod

### Components
- `src/components/forms/LoginForm.tsx` - formulaire UI

### Navigation
- `src/navigation/RootLayoutNavigator.tsx` - redirection conditionnelle

### Screens
- `src/screens/auth/LoginScreen.tsx` - écran de login

### App Router (Expo)
- `src/app/_layout.tsx` - layout racine (Stack + condition)
- `src/app/login.tsx` - route login
- `src/app/(app)/_layout.tsx` - layout protégé (NativeTabs)
- `src/app/(app)/index.tsx` - dashboard protégé
- `src/app/(app)/deliveries.tsx` - courses protégé
- `src/app/(app)/history.tsx` - historique protégé
- `src/app/(app)/profile.tsx` - profil protégé

## Comment ça marche

### 1. Au lancement
L'app affiche un écran de chargement pendant que Redux récupère l'état d'authentification (depuis `SecureStore` si le token existe).

### 2. Si non authentifié
L'utilisateur voit `LoginScreen` avec un formulaire:
- Email (validation zod)
- Mot de passe (6+ caractères)
- Gestion des erreurs
- Loading state

### 3. Si authentifié
L'utilisateur voit la navigation tabbed avec les 4 onglets protégés.

### 4. Logout
À implémenter dans le ProfileScreen (Phase 7).

## Comment tester

### Test 1: Navigation conditionnelle

1. Lancer l'app: `npm start`
2. La première fois → affiche `/login`
3. Remplir le formulaire (credentials valides du backend)
4. Après login réussi → redirection automatique vers `/(app)`
5. Les onglets s'affichent

### Test 2: Validation du formulaire

1. Laisser email vide → erreur "Email requis"
2. Email invalide → erreur "Email invalide"
3. Password < 6 chars → erreur "Mot de passe requis (6+ caractères)"
4. Les erreurs disparaissent en tapant un texte valide

### Test 3: Erreur d'authentification

1. Entrer email/password invalides
2. Le formulaire affiche le message d'erreur API
3. Le bouton de login reste cliquable

### Test 4: Sécurité

1. Fermer l'app après login
2. Relancer → go directly to /(app) (token récupéré depuis SecureStore)
3. Vérifier que le Redux dispatch ne récupère qu'une fois

### Test 5: Persistence

- Le token persiste dans SecureStore (pas dans Redux)
- Redux reconstruit l'état depuis le SecureStore au démarrage

## Variables d'environnement

Dans `src/constants/config.ts`:
- `API_BASE_URL`: URL du backend (défaut: http://10.0.2.2:3000 pour Android)
- `SECURE_STORE_TOKEN_KEY`: clé du token (défaut: togoexpress_driver_token)

## Types

### LoginFormData (zod schema)
```typescript
{
  email: string (email format)
  password: string (min 6)
}
```

### AuthState (Redux)
```typescript
{
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  error: string | null
}
```

## Erreurs courantes

### "Cannot resolve 'expo-secure-store'"
→ Vérifier que `npm install` a été exécuté et que le package.json include `expo-secure-store`

### Login échoue avec 500
→ Vérifier l'URL du backend dans `src/constants/config.ts`

### Validation zod toujours en erreur
→ Vérifier que les imports de `@hookform/resolvers` et `zod` sont corrects

## Prochaines phases

- Phase 3: Dashboard avec statut en ligne
- Phase 4: Liste de courses
- Phase 5: Carte GPS
- Phase 6: Historique
- Phase 7: Profil et logout
- Phase 8: Notifications push
