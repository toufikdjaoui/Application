# Mode DZ - Agent Documentation

Ce fichier contient les informations importantes pour le développement de Mode DZ.

## Commandes Fréquentes

### Démarrage de l'application
```bash
# Windows
scripts\start-dev.bat

# Linux/Mac
./scripts/start-dev.sh

# Docker uniquement
docker-compose up -d
```

### Backend
```bash
cd backend
# Activer l'environnement virtuel
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur de développement
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Tests
pytest

# Linting
flake8 app/
```

### Frontend
```bash
cd frontend
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Build de production
npm run build

# Tests
npm test

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

### Base de données
```bash
# Démarrer MongoDB seul
docker-compose up -d mongodb

# Se connecter à MongoDB
docker exec -it mode_dz_mongodb mongosh -u admin -p password123

# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d mongodb
```

## Structure du Projet

```
mode-dz/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/v1/         # Routes API
│   │   ├── core/           # Configuration, sécurité
│   │   ├── models/         # Modèles MongoDB (Beanie)
│   │   ├── schemas/        # Schémas Pydantic
│   │   ├── services/       # Logique métier
│   │   └── utils/          # Utilitaires
│   ├── scripts/            # Scripts d'initialisation
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Context providers
│   │   ├── services/       # Services API
│   │   ├── utils/          # Utilitaires
│   │   └── locales/        # Fichiers de traduction
│   ├── package.json
│   └── Dockerfile
├── scripts/                # Scripts de démarrage
└── docker-compose.yml      # Orchestration des services
```

## Technologies Utilisées

### Backend
- **FastAPI** - Framework web moderne pour Python
- **MongoDB** - Base de données NoSQL
- **Beanie** - ODM pour MongoDB
- **Pydantic** - Validation des données
- **JWT** - Authentification
- **Redis** - Cache et sessions

### Frontend
- **React 18** - Library UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Query** - Gestion d'état serveur
- **React Router** - Routage
- **react-i18next** - Internationalisation
- **React Hook Form** - Gestion des formulaires

## Conventions de Code

### Python (Backend)
- Suivre PEP 8
- Utiliser des type hints
- Docstrings pour les fonctions publiques
- Noms de fichiers en snake_case
- Noms de classes en PascalCase
- Noms de fonctions en snake_case

### TypeScript/React (Frontend)
- Utiliser TypeScript strict
- Composants en PascalCase
- Fichiers en camelCase
- Hooks personnalisés préfixés par "use"
- Props interfaces suffixées par "Props"

### Git
- Branches nommées: feature/nom-fonctionnalite
- Commits en français, descriptifs
- Utiliser des Pull Requests

## Variables d'Environnement

### Backend (.env)
```env
MONGODB_URL=mongodb://admin:password123@localhost:27017/mode_dz?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-super-secret-jwt-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## APIs Principales

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Rafraîchir le token
- `GET /api/v1/auth/me` - Profil utilisateur

### Produits
- `GET /api/v1/products` - Liste des produits
- `GET /api/v1/products/{id}` - Détails d'un produit
- `GET /api/v1/products/categories` - Catégories
- `GET /api/v1/products/featured` - Produits mis en avant

### Boutiques
- `GET /api/v1/boutiques` - Liste des boutiques
- `GET /api/v1/boutiques/{id}` - Détails d'une boutique

## Modèles de Données Principaux

### User
- Authentification et profil utilisateur
- Rôles: customer, merchant, admin
- Support multilingue (FR/AR)

### Product
- Informations produit complètes
- Variants (couleur, taille)
- SEO et métadonnées
- Statut et stock

### Boutique
- Informations de la boutique
- Heures d'ouverture
- Méthodes de livraison
- Vérification et statut

### Order
- Commandes avec statut
- Paiement et livraison
- Historique des changements

## Fonctionnalités Implémentées

✅ **Terminé:**
- Structure du projet complète
- Authentification JWT multilingue
- Modèles de données MongoDB
- APIs produits avec filtres avancés
- Frontend React avec i18n
- Interface d'authentification

🚧 **En cours:**
- Interface produits avec filtres
- Système de commandes

📋 **À faire:**
- Paiements CIB/EDAHABIA
- Chat temps réel
- Mode Inspiration
- Essayage virtuel AR
- Recommandations IA

## Debugging

### Logs Backend
```bash
# Voir les logs du container backend
docker-compose logs -f backend

# Logs MongoDB
docker-compose logs -f mongodb
```

### Frontend
- Utiliser React Developer Tools
- Console du navigateur pour les erreurs
- Network tab pour les requêtes API

## Déploiement

### Production
```bash
# Build des images
docker-compose -f docker-compose.prod.yml build

# Démarrage production
docker-compose -f docker-compose.prod.yml up -d
```

### Environnements
- **Développement:** localhost:3000
- **Staging:** À définir
- **Production:** À définir

## Support Multilingue

### Ajout d'une traduction
1. Ajouter la clé dans `frontend/src/locales/fr.json`
2. Ajouter la traduction en arabe dans `frontend/src/locales/ar.json`
3. Utiliser `t('cle.traduction')` dans les composants

### Direction RTL
- Supporté automatiquement pour l'arabe
- Utiliser les classes Tailwind `rtl:`
- Icônes et layouts s'adaptent automatiquement
