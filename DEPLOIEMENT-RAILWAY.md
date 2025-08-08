# 🚀 Guide de Déploiement Railway - Mode DZ

## 📋 Étapes Rapides

### 1. Installation Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Connexion et déploiement
```bash
# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

## 🔧 Configuration des Variables

### Dans le Dashboard Railway (Settings > Variables) :

#### Backend Service :
```env
MONGODB_URL=mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority
JWT_SECRET_KEY=mode-dz-super-secret-jwt-key-production-2024
ENVIRONMENT=production
CORS_ORIGINS=https://VOTRE-FRONTEND-URL.railway.app
```

#### Frontend Service :
```env
REACT_APP_API_URL=https://VOTRE-BACKEND-URL.railway.app
REACT_APP_ENVIRONMENT=production
NODE_ENV=production
```

## 🎯 Étapes Détaillées

### 1. Préparation
```bash
# Cloner/télécharger le projet
cd mode-dz

# Vérifier Railway CLI
railway --version
```

### 2. Déploiement Backend
```bash
# Depuis la racine du projet
railway login
railway init

# Sélectionner "Create new project"
# Nommer le projet : mode-dz-backend

railway up
```

### 3. Configuration MongoDB
✅ **Votre MongoDB Atlas est déjà configuré !**
- URL : `mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/`
- User : `toufikdjaoui`
- Pass : `toufikdjaoui`

### 4. Déploiement Frontend
```bash
# Nouveau terminal, depuis le dossier frontend
cd frontend
railway init

# Sélectionner "Create new project"  
# Nommer le projet : mode-dz-frontend

railway up
```

### 5. Configuration finale

1. **Backend Railway Dashboard :**
   - Aller dans Settings > Variables
   - Ajouter les variables backend ci-dessus
   - Remplacer `VOTRE-FRONTEND-URL` par l'URL générée

2. **Frontend Railway Dashboard :**
   - Aller dans Settings > Variables  
   - Ajouter les variables frontend ci-dessus
   - Remplacer `VOTRE-BACKEND-URL` par l'URL générée

3. **Redéployer :**
   ```bash
   railway redeploy --service backend
   railway redeploy --service frontend
   ```

## 🌐 URLs Finales

Après déploiement, vous aurez :
- **Backend :** `https://mode-dz-backend-production.railway.app`
- **Frontend :** `https://mode-dz-frontend-production.railway.app`

## ✅ Test de l'Application

1. Ouvrir l'URL frontend
2. Tester l'inscription/connexion
3. Vérifier l'API : `https://backend-url/docs`

## 💰 Coûts Railway

- **Gratuit :** $5/mois de crédit
- **Usage estimé :** ~$2-3/mois pour ce projet
- **MongoDB Atlas :** Gratuit (M0 - 512MB)

## 🚨 Troubleshooting

### Erreur de connexion MongoDB
```bash
# Vérifier les variables
railway variables

# Tester la connexion
railway logs | grep MongoDB
```

### Erreur CORS
- Vérifier que `CORS_ORIGINS` contient l'URL frontend exacte
- Pas de slash final dans l'URL

### Build qui échoue
```bash
# Nettoyer et rebuilder
railway redeploy --service backend
```

## 📞 Support

Si problème, vérifiez :
1. Les logs : `railway logs`
2. Variables d'environnement : `railway variables`
3. Status des services dans le dashboard Railway
