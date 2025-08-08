# Déploiement Railway - Mode DZ

## 🚀 Configuration Railway

### Services à déployer sur Railway :

1. **Backend (API FastAPI)** - Service principal
2. **Frontend (React)** - Interface utilisateur  
3. **MongoDB Atlas** - Base de données (gratuit 512MB)

## 📋 Étapes de déploiement

### 1. Installation Railway CLI
```bash
# Windows (avec npm)
npm install -g @railway/cli

# Ou télécharger depuis https://railway.app/cli
```

### 2. Connexion et initialisation
```bash
# Se connecter à Railway
railway login

# Dans le dossier du projet
railway init
```

### 3. Déploiement Backend
```bash
# Déployer le backend (depuis la racine du projet)
railway up

# Ou spécifier le service
railway up --service backend
```

### 4. Configuration des variables d'environnement

Dans le dashboard Railway, ajouter :

#### Backend :
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/mode_dz
REDIS_URL=redis://redis-railway-url:6379
JWT_SECRET_KEY=your-super-secret-jwt-key-production
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.railway.app
```

### 5. Déploiement Frontend
```bash
# Depuis le dossier frontend
cd frontend
railway init
railway up
```

#### Variables Frontend :
```env
REACT_APP_API_URL=https://your-backend-domain.railway.app
REACT_APP_ENVIRONMENT=production
```

### 6. Configuration MongoDB Atlas

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit (M0)
3. Configurer l'accès réseau (0.0.0.0/0 pour Railway)
4. Créer un utilisateur de base de données
5. Récupérer l'URL de connexion

### 7. Configuration Redis

Railway propose Redis comme add-on :
```bash
# Ajouter Redis au projet
railway add redis
```

## 🔧 Scripts de déploiement automatique

### Windows (`deploy-windows.bat`)
```batch
@echo off
echo Déploiement Mode DZ sur Railway...

echo 1. Déploiement du backend...
railway up --service backend

echo 2. Déploiement du frontend...
cd frontend
railway up --service frontend
cd ..

echo Déploiement terminé !
echo Backend: Vérifier dans Railway Dashboard
echo Frontend: Vérifier dans Railway Dashboard
```

### Linux/Mac (`deploy.sh`)
```bash
#!/bin/bash
echo "Déploiement Mode DZ sur Railway..."

echo "1. Déploiement du backend..."
railway up --service backend

echo "2. Déploiement du frontend..."
cd frontend
railway up --service frontend
cd ..

echo "Déploiement terminé !"
echo "Backend: Vérifier dans Railway Dashboard"
echo "Frontend: Vérifier dans Railway Dashboard"
```

## 📊 Monitoring et logs

```bash
# Voir les logs du backend
railway logs --service backend

# Voir les logs du frontend
railway logs --service frontend

# Monitoring en temps réel
railway logs --service backend --follow
```

## 🌐 URLs finales

Après déploiement, vous obtiendrez :
- **Backend :** `https://your-backend-name.railway.app`
- **Frontend :** `https://your-frontend-name.railway.app`

## 💡 Conseils

1. **Domaine personnalisé :** Configurez un domaine custom dans Railway
2. **HTTPS :** Automatique avec Railway
3. **Monitoring :** Utilisez le dashboard Railway pour surveiller les performances
4. **Coûts :** Railway offre $5/mois gratuits, parfait pour commencer

## 🚨 Troubleshooting

### Problème de connexion MongoDB
```bash
# Vérifier les variables d'environnement
railway variables

# Tester la connexion depuis les logs
railway logs --service backend | grep "MongoDB"
```

### Problème CORS
```bash
# Vérifier que CORS_ORIGINS contient l'URL du frontend
railway variables --service backend
```

### Build errors
```bash
# Rebuild le service
railway redeploy --service backend
```
