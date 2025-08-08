# 🚀 Guide de Déploiement Manuel - Mode DZ sur Railway

## 📋 ÉTAPE 1: Connexion à Railway

### 1.1 Ouvrir Railway Dashboard
🔗 **Lien :** https://railway.app/dashboard

### 1.2 Se connecter
- Cliquez sur "Login"
- Utilisez GitHub, Google ou Email

### 1.3 Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Empty Project"
- Nommez-le : `mode-dz`

---

## 📋 ÉTAPE 2: Déploiement Backend

### 2.1 Commandes à exécuter
```bash
# Dans votre terminal PowerShell
railway login
railway link
# Sélectionnez votre projet mode-dz

railway up
```

### 2.2 Configuration des Variables Backend
🔗 **Aller sur :** https://railway.app/dashboard → Votre projet → Settings → Variables

**Ajoutez ces variables :**
```
MONGODB_URL = mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority

JWT_SECRET_KEY = mode-dz-super-secret-jwt-key-production-2024

ENVIRONMENT = production

CORS_ORIGINS = *
```

### 2.3 Obtenir l'URL Backend
- Dans Railway Dashboard → Votre service
- Onglet "Settings" → section "Public Networking"
- Notez l'URL : `https://XXXXXX.railway.app`

---

## 📋 ÉTAPE 3: Déploiement Frontend

### 3.1 Créer un nouveau service
🔗 **Dashboard :** https://railway.app/dashboard → Votre projet → "New Service"

### 3.2 Commandes frontend
```bash
# Nouveau terminal
cd frontend
railway login
railway link
# Sélectionnez le même projet mode-dz

railway up
```

### 3.3 Variables Frontend
**Dans Railway Dashboard → Service Frontend → Variables :**
```
REACT_APP_API_URL = https://VOTRE-BACKEND-URL.railway.app

REACT_APP_ENVIRONMENT = production

NODE_ENV = production
```

### 3.4 Obtenir l'URL Frontend
- Notez l'URL frontend générée

---

## 📋 ÉTAPE 4: Finalisation

### 4.1 Mettre à jour CORS
🔗 **Retour Backend Variables :** https://railway.app/dashboard

**Modifier la variable :**
```
CORS_ORIGINS = https://VOTRE-FRONTEND-URL.railway.app
```

### 4.2 Redéployer
```bash
# Dans le terminal backend
railway redeploy
```

---

## ✅ ÉTAPE 5: Test Final

### 5.1 URLs à tester
- **Application :** `https://VOTRE-FRONTEND-URL.railway.app`
- **API Docs :** `https://VOTRE-BACKEND-URL.railway.app/docs`
- **Health Check :** `https://VOTRE-BACKEND-URL.railway.app/health`

### 5.2 Test fonctionnel
1. Ouvrir l'application
2. Tester l'inscription
3. Tester la connexion
4. Vérifier la navigation

---

## 🔧 Commandes de Dépannage

```bash
# Voir les logs
railway logs

# Voir les variables
railway variables

# Redéployer
railway redeploy

# Statut du service
railway status
```

---

## 📞 Liens Utiles

- **Railway Dashboard :** https://railway.app/dashboard
- **Documentation Railway :** https://docs.railway.app
- **MongoDB Atlas :** https://cloud.mongodb.com
- **Support Railway :** https://railway.app/help

---

## 🎯 Récapitulatif

Après toutes ces étapes, vous aurez :
- ✅ Backend déployé avec API FastAPI
- ✅ Frontend déployé avec React  
- ✅ Base de données MongoDB Atlas connectée
- ✅ Variables d'environnement configurées
- ✅ CORS configuré correctement
- ✅ Application complètement fonctionnelle en ligne

**Coût :** Gratuit avec les $5/mois de Railway + MongoDB Atlas gratuit
