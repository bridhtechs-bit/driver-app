# Validation QA — Driver App

## Pré-requis
- Build natif ou Expo Go avec permissions natives si nécessaire
- Backend démarré avec les routes de livraison et les sockets actifs
- Compte test livreur avec profil créé
- Une livraison disponible et une livraison active à tester

## Checklist de validation

### 1. Authentification et démarrage
- [ ] Ouvrir l’application
- [ ] Vérifier la redirection vers onboarding/login si nécessaire
- [ ] Se connecter avec un compte valide
- [ ] Vérifier que l’application arrive bien sur le tableau de bord

### 2. Profil conducteur
- [ ] Vérifier l’affichage du profil sur le dashboard
- [ ] Si le profil est absent, tester la création via le modal
- [ ] Vérifier l’état en ligne / disponible

### 3. Courses disponibles
- [ ] Ouvrir l’onglet Courses
- [ ] Vérifier l’affichage des livraisons disponibles
- [ ] Accepter une course
- [ ] Vérifier la navigation vers l’écran de livraison active

### 4. Livraison active
- [ ] Vérifier l’affichage de la carte et des points de départ/destination
- [ ] Vérifier que le marqueur “Vous” apparaît si la localisation est autorisée
- [ ] Tester les statuts : pris en charge → en route → livré
- [ ] Vérifier les messages de feedback après chaque transition

### 5. Permissions natives
- [ ] Autoriser la localisation en premier plan
- [ ] Autoriser la caméra pour la preuve photo
- [ ] Refuser une permission puis vérifier le message utilisateur
- [ ] Vérifier le comportement si la permission est refusée

### 6. Preuve de livraison
- [ ] Ouvrir la modal de preuve de livraison
- [ ] Prendre une photo
- [ ] Envoyer la preuve
- [ ] Vérifier la mise à jour du statut et la disparition de la livraison active

### 7. Historique
- [ ] Ouvrir l’onglet Historique
- [ ] Vérifier l’apparition des livraisons terminées
- [ ] Vérifier le rafraîchissement manuel

### 8. Synchronisation temps réel
- [ ] Vérifier les mises à jour reçues via socket pendant une livraison active
- [ ] Simuler une annulation ou une mise à jour côté backend si possible
- [ ] Vérifier que l’UI se met à jour sans rechargement manuel

## Résultats attendus
- L’utilisateur peut se connecter, accepter une course, suivre son statut, prendre une preuve photo et terminer la livraison.
- Les permissions natives sont correctement gérées et l’interface affiche des messages clairs.
- Les changements réseau/socket sont reflétés en temps réel.
