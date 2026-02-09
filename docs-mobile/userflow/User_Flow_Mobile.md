# USER FLOW MOBILE – PROJET GARAGE

## 1. Objectif du document

Ce document décrit le parcours utilisateur (User Flow) de l’application mobile du projet Garage.
Il présente les écrans et les actions possibles pour un client, du lancement de l’application jusqu’au paiement.

---

## 2. Lancement de l’application

### Écran : Splash / Démarrage
- Affichage du logo
- Vérification de l’état de connexion

Décision :
- Utilisateur connecté → Accueil
- Utilisateur non connecté → Connexion

---

## 3. Authentification

### Écran : Connexion
Actions disponibles :
- Saisir email
- Saisir mot de passe
- Bouton « Se connecter »
- Lien « Créer un compte »

Résultat :
- Connexion réussie → Accueil

---

### Écran : Inscription
Champs :
- Nom
- Prénom
- Téléphone
- Email
- Mot de passe
- Bouton « S’inscrire »

Résultat :
- Compte créé
- Redirection vers l’accueil

---

## 4. Accueil (Écran principal)

Contenu :
- Liste des voitures du client
- Statut de chaque voiture :
  - en attente
  - en cours
  - terminée
- Bouton « Ajouter une voiture »

Actions possibles :
- Consulter une voiture
- Ajouter une nouvelle voiture

---

## 5. Ajouter une voiture

### Écran : Ajout de voiture
Champs :
- Marque
- Modèle
- Immatriculation
- Bouton « Ajouter »

Résultat :
- Voiture enregistrée
- Retour à l’écran d’accueil

---

## 6. Détails d’une réparation

### Écran : Détails
Informations affichées :
- Informations de la voiture
- Statut de la réparation
- Type d’intervention
- Montant (si réparation terminée)

Actions possibles :
- Attendre (si en cours)
- Accéder au paiement (si terminée)

---

## 7. Paiement

### Écran : Paiement
Contenu :
- Montant à payer
- Bouton « Payer »

Résultat :
- Paiement validé
- Confirmation affichée
- Retour à l’accueil

---

## 8. Notifications

### Fonctionnement
- Notification envoyée lorsque la réparation est terminée
- Clic sur la notification → Écran Détails de la réparation

---

## 9. Résumé du parcours utilisateur

Lancement  
↓  
Connexion / Inscription  
↓  
Accueil (liste des voitures)  
↓  
Ajouter voiture → Accueil  
↓  
Détails réparation  
↓  
Paiement  
↓  
Accueil  

---

## 10. Conclusion

Ce user flow sert de base pour le développement de l’application mobile.
Il permet de développer les écrans indépendamment de l’API, qui sera intégrée ultérieurement.
