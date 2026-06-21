# Phase 3 - Dashboard Livreur

## Architecture

### Flow d'état

```
RootLayoutNavigator
  ├─ useAuth() [Phase 2]
  └─ (si connecté)
     └─ DashboardScreen
        ├─ useDriver() [NEW]
        │  ├─ RTK Query: useGetProfileQuery
        │  ├─ Redux: driverSlice
        │  └─ Mutations: goOnline, goOffline, toggleAvailability
        │
        ├─ ProfileHeader (name, email, rating)
        ├─ StatusToggle (en ligne ↔ hors ligne)
        ├─ StatusToggle (disponible ↔ indisponible)
        └─ StatCard (livraisons, revenus)
```

## Fichiers créés

### Types
- `src/services/api/types/driver.ts` - Types TypeScript du driver

### API RTK Query
- `src/services/api/driverApi.ts` - 4 endpoints: getProfile, goOnline, goOffline, toggleAvailability

### Redux Slice
- `src/features/driver/driverSlice.ts` - État du driver + stats

### Hooks
- `src/hooks/useDriver.ts` - Interface unifiée pour le driver

### Components
- `src/components/dashboard/ProfileHeader.tsx` - Affiche nom, email, rating
- `src/components/dashboard/StatusToggle.tsx` - Toggle "En ligne" / "Hors ligne"
- `src/components/dashboard/StatCard.tsx` - Carte statistique

### Screens
- `src/screens/dashboard/DashboardScreen.tsx` - Dashboard complet

## Endpoints backend utilisés

```http
GET /api/drivers/profile
  → DriverProfile { _id, name, email, phone, isOnline, isAvailable, totalDeliveries, completedDeliveries, totalEarnings, rating, totalRatings }

PATCH /api/drivers/go-online
  → DriverProfile { ...isOnline: true }

PATCH /api/drivers/go-offline
  → DriverProfile { ...isOnline: false }

PATCH /api/drivers/toggle-availability
  → DriverProfile { ...isAvailable: !isAvailable }
```

## Types TypeScript

### DriverProfile
```typescript
{
  _id: string
  name: string
  email: string
  phone: string
  isOnline: boolean
  isAvailable: boolean
  totalDeliveries: number
  completedDeliveries: number
  totalEarnings: number
  rating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
}
```

### DriverStats
```typescript
{
  completedDeliveries: number
  totalEarnings: number
  rating: number
  totalRatings: number
}
```

## Hook useDriver()

### Propriétés
```typescript
useDriver() → {
  profile: DriverProfile | null        // Profil actuel
  stats: DriverStats | null           // Statistiques
  loading: boolean                     // Loading state global
  error: string | null               // Erreur API
  goOnline(): Promise<boolean>        // Passer en ligne
  goOffline(): Promise<boolean>       // Passer hors ligne
  toggleAvailability(): Promise<boolean>  // Basculer disponibilité
  refetchProfile(): void              // Rafraîchir le profil
}
```

## Composants réutilisables

### StatusToggle
```tsx
<StatusToggle
  label="En ligne"
  isActive={profile.isOnline}
  onPress={handleToggleOnline}
  loading={loading}
  color={colors.success}
/>
```

### StatCard
```tsx
<StatCard
  label="Livraisons"
  value={stats.completedDeliveries}
  color={colors.primary}
/>
```

### ProfileHeader
```tsx
<ProfileHeader
  name="Jean Dupont"
  email="jean@example.com"
  rating={4.8}
  totalRatings={125}
/>
```

## Fonctionnalités

✅ **Profil du livreur**
- Avatar avec initiales
- Nom et email
- Rating (nombre d'avis)

✅ **Statut en ligne**
- Toggle élégant (switch style)
- Change la couleur selon l'état
- Appel API PATCH /api/drivers/go-online ou go-offline

✅ **Disponibilité**
- Toggle séparé
- Permet de recevoir les commandes
- Appel API PATCH /api/drivers/toggle-availability

✅ **Statistiques**
- Livraisons complétées
- Revenus totaux en XOF
- Affichage dans des cartes colorées

✅ **Gestion d'erreurs**
- Banneau d'erreur si API échoue
- Messages clairs
- Retry possible via RefreshControl

✅ **Loading states**
- Spinner au démarrage
- Désactivation des toggles pendant mutation
- RefreshControl avec pull-to-refresh

## Style & Design

- Palette KSDALL (couleur primaire #E53935, success #28A745)
- Ombre subtile sur les cartes
- Spacing cohérent (theme/index.ts)
- Responsive mobile-first
- Toggles inspirés Uber/Bolt

## Comment ça marche

### 1. Au chargement de DashboardScreen
```
1. useDriver() appelle useGetProfileQuery
2. RTK Query fetch GET /api/drivers/profile
3. Résultat stocké dans Redux (driverSlice.setProfile)
4. UI re-render avec le profil
```

### 2. Toggle "En ligne"
```
1. User appuie sur StatusToggle
2. Appelle handleGoOnline ou handleGoOffline
3. PATCH /api/drivers/go-online ou go-offline
4. Succès → RTK Query invalide tag 'Driver'
5. useGetProfileQuery refetch auto
6. Redux mis à jour → isOnline change
7. UI re-render
```

### 3. Gestion des erreurs
```
1. API échoue → throw Error
2. useDriver catch → dispatch(setError(message))
3. ErrorBanner affiche le message
4. User peut retry (pull-to-refresh)
```

## Comment tester

### Test 1: Affichage du profil
```
1. Se connecter (Phase 2)
2. Aller au Dashboard
3. Vérifier:
   - ✅ Nom du livreur s'affiche
   - ✅ Email visible
   - ✅ Rating + nombre d'avis
   - ✅ Statistiques (livraisons, revenus)
```

### Test 2: Toggle "En ligne"
```
1. Dashboard chargé
2. Cliquer sur StatusToggle "En ligne"
3. Vérifier:
   - ✅ Toggle passe de gris à vert
   - ✅ Spinner apparaît
   - ✅ API PATCH /api/drivers/go-online appelée
   - ✅ Succès → toggle reste activé
   - ✅ Backend mise à jour isOnline
```

### Test 3: Toggle "Disponible"
```
1. Dashboard chargé
2. Cliquer sur StatusToggle "Disponible"
3. Vérifier:
   - ✅ Toggle change
   - ✅ API PATCH /api/drivers/toggle-availability
   - ✅ État persiste après refresh
```

### Test 4: Erreur API
```
1. Éteindre le backend
2. Cliquer sur un toggle
3. Vérifier:
   - ✅ Banneau d'erreur rouge apparaît
   - ✅ Message explicite (ex: "Erreur de connexion")
   - ✅ Toggle ne change pas
   - ✅ User peut retry via pull-to-refresh
```

### Test 5: Pull-to-refresh
```
1. Dashboard ouvert
2. Scroller vers le haut
3. Tirer vers le bas → RefreshControl
4. Vérifier:
   - ✅ Spinner RefreshControl s'affiche
   - ✅ useGetProfileQuery refetch
   - ✅ Profil mis à jour
```

### Test 6: Redux Persistence
```
1. Dashboard ouvert
2. Vérifier Redux DevTools (F12):
   - ✅ state.driver.profile peuplé
   - ✅ state.driver.stats peuplé
   - ✅ Actions: setProfile, setLoading, setError
```

## Redux Slices utilisés

```typescript
// state.driver
{
  profile: DriverProfile | null
  stats: DriverStats | null
  loading: boolean
  error: string | null
}

// Actions
setProfile(driver)
setLoading(bool)
setError(message)
clearDriver()
```

## RTK Query tags

Les endpoints utilisent le tag `'Driver'` pour l'invalidation automatique:

```typescript
// Quand une mutation réussit:
goOnline()      // invalide 'Driver' → refetch getProfile
goOffline()     // invalide 'Driver' → refetch getProfile
toggleAvailability() // invalide 'Driver' → refetch getProfile
```

## Optimisations

✅ **RTK Query polling**: Getprofile peut être renouvelé toutes les N secondes
✅ **Redux caching**: Profile ne refetch que si invalidé
✅ **Loading states**: Désactivation des toggles pendant mutation
✅ **Error handling**: Messages clairs utilisateur
✅ **SafeAreaView**: Respects notches/safe areas

## Prochaines phases

- Phase 4: Liste de courses disponibles
- Phase 5: Carte GPS temps réel + Socket.io
- Phase 6: Historique des livraisons
- Phase 7: Profil + Logout
- Phase 8: Notifications push
