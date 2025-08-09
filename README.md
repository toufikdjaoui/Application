# Mode DZ - Marketplace de Mode Algérien

## Description
Mode DZ est un marketplace de mode et accessoires qui regroupe des boutiques locales et internationales en une application unique. Conçu pour les jeunes adultes algériens (18-35 ans) à la recherche de mode tendance avec un bon rapport qualité/prix.

## Fonctionnalités

### Essentielles
- Catalogue multi-boutiques (locales & internationales)
- Filtres avancés (taille, couleur, style, prix)
- Paiement à la livraison + paiement en ligne (CIB, EDAHABIA)
- Suivi de commande en temps réel
- Retours faciles via points relais
- Support multilingue (français/arabe)

### Différenciantes & Innovantes
- Essayage virtuel (caméra AR)
- Recommandations IA selon le style et l'historique d'achats
- Wishlist partagée
- Mode "Inspiration" façon Pinterest
- Chat marchand-client

## Architecture Technique

### Backend
- **Framework**: FastAPI
- **Base de données**: MongoDB
- **Authentification**: JWT + OAuth
- **Paiements**: CIB, EDAHABIA
- **Real-time**: WebSocket pour chat

### Frontend
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS (support RTL pour arabe)
- **State Management**: Context API + React Query
- **Internationalisation**: react-i18next
- **AR**: MediaPipe + WebRTC

### Infrastructure
- **Déploiement**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## Structure du Projet

```
mode-dz/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Routes API
│   │   ├── core/           # Configuration, sécurité
│   │   ├── models/         # Modèles MongoDB
│   │   ├── services/       # Logique métier
│   │   └── utils/          # Utilitaires
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # Context providers
│   │   ├── services/       # Services API
│   │   ├── utils/          # Utilitaires
│   │   └── locales/        # Fichiers de traduction
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Orchestration des services
└── README.md
```

## Installation et Démarrage

### Prérequis
- Node.js 18+
- Python 3.11+
- MongoDB 6+
- Docker & Docker Compose

### Démarrage rapide

#### Option 1: Démarrage automatique (Recommandé)

**Windows:**
```bash
scripts\start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

#### Option 2: Docker uniquement
```bash
# Démarrer tous les services avec Docker
docker-compose up -d

# L'application sera disponible sur:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# MongoDB: localhost:27017
```

#### Option 3: Développement manuel

1. **Démarrer MongoDB et Redis:**
```bash
docker-compose up -d mongodb redis
```

2. **Backend (Terminal 1):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. **Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm start
```

### URLs d'accès
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentation API:** http://localhost:8000/docs
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

## API Documentation
Une fois le backend démarré, la documentation interactive est disponible sur:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Roadmap

### Phase 1 (Foundation) ✅
- [x] Structure du projet
- [x] Configuration environnement
- [x] Setup MongoDB
- [x] Authentification de base
- [x] Navigation multilingue

### Phase 2 (Core Features) 🚧
- [x] APIs produits et boutiques
- [x] Catalogue avec filtres
- [ ] Système de commandes
- [ ] Interface utilisateur complète

### Phase 3 (Advanced Features) 📋
- [ ] Paiements CIB/EDAHABIA
- [ ] Chat temps réel
- [ ] Wishlist partagée
- [ ] Mode Inspiration

### Phase 4 (Différenciation) 🔮
- [ ] Recommandations IA
- [ ] Essayage virtuel AR
- [ ] Optimisations performances

## Technologies Utilisées

### Backend
- FastAPI
- MongoDB (Motor)
- Pydantic
- JWT
- WebSocket
- Celery (tâches asynchrones)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Router
- react-i18next
- Framer Motion

### DevOps
- Docker
- MongoDB
- Redis
- Nginx

## Contribution
Les contributions sont les bienvenues ! Veuillez lire le guide de contribution avant de soumettre une PR.

## Licence
MIT License - voir le fichier LICENSE pour plus de détails.
"# Test rebuild"  
