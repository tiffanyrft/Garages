# Garage Backend

Backend API pour l'application mobile Garage utilisant PostgreSQL.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données PostgreSQL :
   - Créer une base de données nommée `garage`
   - Importer le fichier `../schema_garage_postgres.sql`

3. Configurer les variables d'environnement :
   - Ouvrir le fichier `.env`
   - Modifier `DB_PASSWORD` avec votre mot de passe PostgreSQL

## Démarrage

### Mode développement :
```bash
npm run dev
```

### Mode production :
```bash
npm start
```

Le serveur démarre sur `http://192.168.88.24:8000`

## API Endpoints

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription

### Voitures
- `GET /api/cars` - Lister toutes les voitures
- `GET /api/cars/:id` - Détails d'une voiture
- `POST /api/cars` - Ajouter une voiture
- `PATCH /api/cars/:id/status` - Mettre à jour le statut
- `POST /api/cars/:id/payment` - Traiter le paiement

## Configuration

Le fichier `.env` contient :
- `DB_HOST` : Hôte PostgreSQL (généralement localhost)
- `DB_PORT` : Port PostgreSQL (5432)
- `DB_NAME` : Nom de la base (garage)
- `DB_USER` : Utilisateur PostgreSQL (postgres)
- `DB_PASSWORD` : Mot de passe PostgreSQL
- `PORT` : Port du serveur (8000)

## Test

Pour tester l'API :
```bash
# Test de connexion
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```
