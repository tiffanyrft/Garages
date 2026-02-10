# 🚀 Guide de Démarrage - Projet Garage Simulation

## 📋 Vue d'ensemble

Projet complet de simulation de garage avec :
- **API Laravel** (Backend REST)
- **Application Web React** (Backoffice + Frontoffice)
- **Base de données PostgreSQL**
- **Application Mobile** (React Native - à venir)
- **Jeu HTML** (Godot - à venir)

---

## 🛠️ Prérequis

### Logiciels requis
- **Node.js** (v18+) - https://nodejs.org
- **PHP** (v8.1+) - https://www.php.net
- **PostgreSQL** (v15+) - https://www.postgresql.org
- **Composer** - https://getcomposer.org
- **Git** - https://git-scm.com

### Outils recommandés
- **DBeaver** ou **pgAdmin** pour gérer PostgreSQL
- **VS Code** pour le développement
- **Postman** pour tester l'API

---

## 🗄️ Configuration Base de Données

### 1. Installation PostgreSQL
```bash
# Windows : Télécharger et installer depuis postgresql.org
# Mac : brew install postgresql
# Linux : sudo apt-get install postgresql postgresql-contrib
```

### 2. Création de la base de données
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE garage;

# Se connecter à la base garage
\c garage

# Exécuter le schéma SQL
\i 'chemin/vers/Garages-main/base_postgres/schema_garage_postgres.sql'
```

### 3. Vérification
```sql
-- Vérifier les tables
\dt

-- Insérer données de test
INSERT INTO client (nom, prenom, telephone, email, mot_de_passe) 
VALUES ('Admin', 'User', '0600000000', 'admin@garage.com', 'password_hash');

INSERT INTO intervention (nom_intervention, prix, duree_secondes) 
VALUES ('Vidange', 50.00, 1800), ('Freinage', 120.00, 3600), ('Diagnostic', 80.00, 900);

INSERT INTO slot (nom_slot, type_slot) 
VALUES ('Slot 1', 'reparation'), ('Slot 2', 'reparation'), ('Attente', 'attente');
```

---

## 🔧 API Laravel (Backend)

### 1. Installation
```bash
cd laravel-api

# Installer Composer si nécessaire
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Installer les dépendances
php composer.phar install

# Configuration environnement
copy .env.example .env
php artisan key:generate
```

### 2. Configuration Base de Données
Éditer `.env` :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=garage
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_postgres
```

### 3. Démarrage
```bash
# Démarrer le serveur API
php artisan serve --host=0.0.0.0 --port=8000

# Alternative avec le script
.\start-api.bat
```

### 4. Test
```bash
# Tester l'API
curl http://localhost:8000/api/test
```

**L'API sera disponible sur : http://localhost:8000**

---

## 🌐 Application Web React

### 1. Installation
```bash
cd web

# Installer les dépendances
npm install

# Si npm n'est pas installé, utiliser Node.js
```

### 2. Configuration
Le fichier `src/services/api.js` est déjà configuré pour :
```
API_BASE_URL = 'http://localhost:8000/api/v1'
```

### 3. Démarrage
```bash
# Démarrer le serveur de développement
npm start

# Lancement en mode production
npm run build
serve -s build
```

### 4. Accès
**Application Web : http://localhost:3000**

### 5. Identifiants de test
- **Email** : `admin@garage.com`
- **Mot de passe** : `admin123`

---

## 📱 Application Mobile (React Native)

### 1. Installation
```bash
cd mobile

# Installer les dépendances
npm install

# Pour iOS
cd ios && pod install && cd ..

# Pour Android
# Configurer l'émulateur Android Studio
```

### 2. Configuration
Éditer `src/services/api.ts` :
```typescript
baseURL: "http://localhost:8000/api" // Pour développement local
```

### 3. Démarrage
```bash
# Démarrer Metro bundler
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android
```

---

## 🎮 Jeu HTML (Godot)

### 1. Installation Godot
- Télécharger Godot Engine : https://godotengine.org
- Version recommandée : Godot 4.x

### 2. Configuration
```bash
# Ouvrir le projet dans Godot
# Fichier → Ouvrir → chemin/vers/jeu-godot/project.godot
```

### 3. Lancement
- Dans Godot : F5 pour lancer le jeu
- Exporter en HTML : Projet → Exporter → Web

---

## 🚀 Démarrage Rapide (Tout lancer)

### Script Windows
```batch
@echo off
echo Démarrage complet du projet Garage...

echo 1. Démarrage de l'API Laravel...
cd laravel-api
start cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo 2. Démarrage de l'application Web...
cd ../web
start cmd /k "npm start"

echo 3. Démarrage de l'application Mobile...
cd ../mobile
start cmd /k "npm start"

echo 4. Ouverture du navigateur...
start http://localhost:3000

echo Projet démarré !
echo - API : http://localhost:8000
echo - Web : http://localhost:3000
echo - Mobile : npx react-native run
pause
```

### Script Linux/Mac
```bash
#!/bin/bash
echo "Démarrage complet du projet Garage..."

# API Laravel
cd laravel-api
php artisan serve --host=0.0.0.0 --port=8000 &
API_PID=$!

# Application Web
cd ../web
npm start &
WEB_PID=$!

# Application Mobile
cd ../mobile
npm start &
MOBILE_PID=$!

echo "Projet démarré !"
echo "- API : http://localhost:8000"
echo "- Web : http://localhost:3000"
echo "- Mobile : npx react-native run"

# Attendre
wait $API_PID $WEB_PID $MOBILE_PID
```

---

## 🔍 Dépannage

### Problèmes courants

**1. Port déjà utilisé**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**2. Erreur de connexion PostgreSQL**
- Vérifier que PostgreSQL est démarré
- Vérifier les identifiants dans `.env`
- Vérifier que la base `garage` existe

**3. Erreur Node.js**
```bash
# Nettoyer et réinstaller
cd web
rm -rf node_modules package-lock.json
npm install
```

**4. Erreur Laravel**
```bash
# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## 📚 Documentation Technique

### Structure du projet
```
Garages-main/
├── laravel-api/          # API REST Laravel
├── web/                  # Application React
├── mobile/               # React Native (à venir)
├── jeu-godot/           # Jeu HTML (à venir)
├── base_postgres/        # Schéma SQL
└── documentation/       # Docs techniques
```

### MCD (Modèle Conceptuel de Données)
- **Client** : Informations des clients
- **Voiture** : Véhicules des clients
- **Intervention** : Types de réparations (8 fixes)
- **Réparation** : Réparations effectuées
- **Paiement** : Paiements des voitures
- **Slot** : Places de réparation (2) et d'attente (1)

### API Routes principales
```
GET    /api/test              # Test connexion
POST   /api/v1/auth/login     # Authentification
GET    /api/v1/clients        # Lister clients
GET    /api/v1/interventions  # Lister interventions
GET    /api/v1/reparations    # Lister réparations
GET    /api/v1/slots          # Lister slots
```

---

## 👥 Équipe de Développement

**Membres du groupe :**
- [Nom Prénom 1] - NumETU
- [Nom Prénom 2] - NumETU  
- [Nom Prénom 3] - NumETU
- [Nom Prénom 4] - NumETU

**Répartitions :**
- Backend Laravel : [Membre 1]
- Frontend Web : [Membre 2]
- Application Mobile : [Membre 3]
- Jeu HTML : [Membre 4]

---

## 📅 Délais et Livraison

**Date limite :** 16 février

**Checklist de livraison :**
- [ ] API Laravel fonctionnelle
- [ ] Application Web complète
- [ ] Base de données avec données
- [ ] Documentation technique
- [ ] Code sur GitHub/GitLab public
- [ ] Démo vidéo des fonctionnalités

---

## 🆘 Support

En cas de problème :
1. Vérifier les logs dans chaque application
2. Consulter la section dépannage
3. Vérifier la documentation technique
4. Contacter les membres du groupe

---

## 📝 Notes

- **Firebase** : À configurer pour la synchronisation
- **Notifications** : Système à implémenter
- **Tests** : Ajouter tests unitaires si temps
- **Sécurité** : Valider tous les inputs
- **Performance** : Optimiser les requêtes SQL

---

**Bon développement ! 🚀**
