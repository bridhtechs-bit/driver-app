# QA Checklist — TogoExpress Driver Phase 6

## Objectif
Vérifier le parcours de livraison active et l'historique sur un appareil réel.

---

## 1. Préparation
- Installer les dépendances : `npm install`
- Vérifier qu'un build natif est utilisé pour les tests background/camera
  - `npx expo start` pour le développement général
  - `eas build --platform android --profile development` / `eas build --platform ios --profile development` pour les tests réels avancés
- Vérifier que les permissions sont bien configurées :
  - `app.json` contient les clés iOS `infoPlist` pour localisation/caméra
  - `app.json` contient les permissions Android `ACCESS_FINE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`, `CAMERA`, etc.

---

## 2. Authentification
- Lancer l'app sur l'appareil
- Se connecter avec un compte test valide
- Vérifier la redirection vers l'application principale après connexion

Résultat attendu : l'utilisateur arrive sur les onglets de l'application et peut accéder aux courses.

---

## 3. Acceptation d'une course
- Aller dans l'onglet `Courses`
- Sélectionner et accepter une livraison disponible
- Vérifier l'affichage de l'écran `ActiveDelivery`

Résultat attendu : l'écran de livraison active s'affiche avec carte et détails de course.

---

## 4. Suivi GPS en premier plan
- Vérifier que la carte affiche :
  - marker de prise en charge
  - marker d'adresse de livraison
  - marker "Vous" représentant la position actuelle
- Se déplacer sur l'appareil ou simuler la localisation
- Vérifier le déplacement du marqueur "Vous"

Résultat attendu : la position s'actualise et le marqueur suit le conducteur.

---

## 5. Suivi GPS en arrière-plan
- Laisser la course active ouverte
- Mettre l'app en arrière-plan
- Attendre 15–60 secondes
- Vérifier côté serveur ou dans les logs que les mises à jour de localisation arrivent

Résultat attendu : la position est envoyée en arrière-plan via le task manager et la socket/API.

---

## 6. Événements socket en temps réel
- Simuler ou déclencher côté serveur un événement de type `deliveryUpdated`
- Simuler ou déclencher côté serveur un événement `deliveryCancelled`
- Vérifier que l'écran `ActiveDelivery` se met à jour automatiquement

Résultat attendu : l'écran reflète les changements sans rafraîchissement manuel.

---

## 7. Navigation vers l'adresse de livraison
- Dans `ActiveDelivery`, appuyer sur "Ouvrir la navigation"
- Vérifier l'ouverture de l'application de cartographie native ou Google Maps

Résultat attendu : l'itinéraire se prépare vers la destination de livraison.

---

## 8. Preuve de livraison / photo
- Appuyer sur le bouton de statut `Livré`
- Vérifier l'ouverture du modal de preuve de livraison
- Prendre une photo
- Envoyer la photo et terminer la livraison
- Vérifier le rafraîchissement de l'interface et la disparition de la livraison active

Résultat attendu : la photo est téléchargée, le statut passe à `delivered`, et la course active est terminée.

---

## 9. Historique des livraisons
- Aller dans l'onglet `Historique`
- Tirer pour rafraîchir
- Vérifier l'apparition des livraisons terminées, y compris la course complétée

Résultat attendu : la liste affiche les livraisons terminées et leurs détails.

---

## 10. Contrôles d'erreur
- Refuser volontairement une permission de localisation/caméra puis réessayer
- Vérifier que l'app affiche des messages d'erreur lisibles ou une demande de permission
- Tester le comportement si le réseau est interrompu pendant l'upload de preuve

Résultat attendu : l'app gère proprement les refus et affiche du feedback utilisateur.

---

## Notes de test spécifiques
- Expo Go ne prend pas en charge le suivi location background ni tous les comportements natifs : utiliser un build EAS
- Sur Android 11+, le fond de localisation peut nécessiter un accord séparé après l'autorisation foreground
- Sur iOS, activer la localisation "Always" et le refresh en arrière-plan dans les réglages de l'app
