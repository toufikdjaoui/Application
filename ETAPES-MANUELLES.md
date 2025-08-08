# 🚀 Déploiement Mode DZ - Étapes Manuelles

## ⚡ Option 1: Script Automatique (Recommandé)

```bash
# Exécutez simplement ce script
DEPLOY-AUTO.bat
```

Le script fera TOUT automatiquement :
- Connexion Railway
- Déploiement backend + frontend
- Configuration des variables
- Test final

## 📋 Option 2: Étapes Manuelles

### 1. Connexion Railway
```bash
railway login
```

### 2. Déploiement Backend
```bash
# Depuis la racine du projet
railway init
# Sélectionner: "Create new project"
# Nom: mode-dz-backend

railway up
# Noter l'URL générée: https://BACKEND-URL.railway.app
```

### 3. Variables Backend
```bash
railway variables set MONGODB_URL="mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority"
railway variables set JWT_SECRET_KEY="mode-dz-super-secret-jwt-key-production-2024"
railway variables set ENVIRONMENT="production"
railway variables set CORS_ORIGINS="*"
```

### 4. Déploiement Frontend
```bash
cd frontend
railway init
# Sélectionner: "Create new project"  
# Nom: mode-dz-frontend

# Configurer les variables AVANT le déploiement
railway variables set REACT_APP_API_URL="https://VOTRE-BACKEND-URL.railway.app"
railway variables set REACT_APP_ENVIRONMENT="production"
railway variables set NODE_ENV="production"

railway up
# Noter l'URL: https://FRONTEND-URL.railway.app
```

### 5. Finalisation CORS
```bash
cd ..
railway variables set CORS_ORIGINS="https://VOTRE-FRONTEND-URL.railway.app"
railway redeploy
```

## ✅ Test Final

1. **Backend API :** `https://BACKEND-URL.railway.app/docs`
2. **Application :** `https://FRONTEND-URL.railway.app`
3. **Test inscription/connexion**

## 🎯 URLs de Test

Après déploiement, vous aurez :
- **API Documentation :** `https://backend-url/docs`
- **Application :** `https://frontend-url`
- **Health Check :** `https://backend-url/health`

## 💡 Conseils

- Le déploiement prend 2-5 minutes par service
- Surveillez les logs dans le dashboard Railway
- En cas d'erreur, utilisez `railway logs`
- MongoDB Atlas est déjà configuré avec vos credentials

## 🚨 Si Problème

```bash
# Voir les logs
railway logs

# Redéployer
railway redeploy

# Vérifier les variables
railway variables
```

**Support :** Railway Dashboard → Settings → Logs
