# API Garage - Laravel

API REST pour l'application mobile de gestion de garage automobile.

## 🚀 Installation

### Prérequis
- PHP 8.1+
- Composer
- PostgreSQL
- Node.js (pour le mobile)

### 1. Cloner le projet
```bash
git clone <repository-url>
cd laravel-api
```

### 2. Installer les dépendances
```bash
composer install
```

### 3. Configuration de l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configurer la base de données
Dans `.env` :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=garage
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

### 5. Exécuter les migrations et seeders
```bash
php artisan migrate
php artisan db:seed
```

### 6. Démarrer le serveur
```bash
php artisan serve
```

L'API sera disponible sur `http://localhost:8000/api`

## 📱 Connexion Mobile

### Configuration de l'URL API
Dans le mobile, modifier `src/services/api.ts` :
```typescript
baseURL: "http://localhost:8000/api" // Pour le développement local
```

### Test de connexion
```bash
curl http://localhost:8000/api/test
```

## 🔐 Authentification

### Inscription
```http
POST /api/register
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean", 
  "telephone": "0612345678",
  "email": "jean@email.com",
  "password": "password123"
}
```

### Connexion
```http
POST /api/login
Content-Type: application/json

{
  "email": "jean@email.com",
  "password": "password123"
}
```

## 🚗 Gestion des voitures

### Lister les voitures du client
```http
GET /api/cars
Authorization: Bearer <token>
```

### Ajouter une voiture
```http
POST /api/cars
Authorization: Bearer <token>
Content-Type: application/json

{
  "brand": "Renault",
  "model": "Clio",
  "license_plate": "AB-123-CD",
  "problem_description": "Frein qui fait du bruit"
}
```

### Détails d'une voiture
```http
GET /api/cars/{id}
Authorization: Bearer <token>
```

### Mettre à jour le statut
```http
PATCH /api/cars/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_repair"
}
```

## 💰 Paiements

### Traiter un paiement
```http
POST /api/cars/{id}/payment
Authorization: Bearer <token>
```

### Voir le statut de paiement
```http
GET /api/cars/{id}/payment
Authorization: Bearer <token>
```

## 📊 Base de données

### Tables principales
- `client` : Informations des clients
- `voiture` : Véhicules des clients
- `intervention` : Types de réparations (8 fixes)
- `reparation` : Réparations effectuées
- `paiement` : Paiements des voitures
- `slot` : Slots de réparation (2) et d'attente (1)

### Statuts des voitures
- `en_attente` → `waiting`
- `en_reparation` → `in_repair`
- `terminee` → `repaired`
- `payee` → `paid`

## 🧪 Données de test

Le seeder crée automatiquement :
- **Client test** : `test@test.com` / `password`
- **4 voitures** avec différents statuts
- **8 interventions** fixes
- **Réparations** et paiements associés

## 🔧 Développement

### Routes API
```php
// Publiques
POST /api/register
POST /api/login

// Protégées (token requis)
GET /api/cars
POST /api/cars
GET /api/cars/{id}
PATCH /api/cars/{id}/status
POST /api/cars/{id}/payment
GET /api/cars/{id}/payment
```

### Modèles Eloquent
- `Client` : Authentifiable avec Sanctum
- `Voiture` : Relations avec réparations et paiements
- `Intervention` : Types de réparations fixes
- `Reparation` : État des réparations
- `Paiement` : Gestion des paiements
- `Slot` : Gestion des places de réparation

## 🚨 Erreurs communes

### 401 Unauthorized
- Vérifiez que le token est valide
- Ajoutez `Authorization: Bearer <token>` aux headers

### 404 Not Found
- Vérifiez que l'URL est correcte
- Assurez-vous que les routes sont enregistrées

### 422 Validation Error
- Vérifiez les champs requis
- Consultez les messages d'erreur dans la réponse

## 📝 Notes

- L'API utilise Laravel Sanctum pour l'authentification
- Les timestamps sont au format ISO 8601
- Les montants sont en euros avec 2 décimales
- Les durées sont en secondes

## 🔄 Prochaines étapes

1. Configurer Firebase pour les notifications
2. Ajouter la gestion des slots de réparation
3. Implémenter les webhooks pour le jeu
4. Ajouter les statistiques pour le backoffice
