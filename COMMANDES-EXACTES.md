# 📝 Commandes Exactes à Copier-Coller

## 🎯 ÉTAPE 1: Connexion Railway

### Lien direct : https://railway.app/dashboard

```bash
railway login
```

---

## 🎯 ÉTAPE 2: Backend

### Commandes à exécuter dans PowerShell :
```bash
railway link
railway up
```

### Variables à ajouter dans Railway Dashboard :
```
MONGODB_URL
mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority

JWT_SECRET_KEY
mode-dz-super-secret-jwt-key-production-2024

ENVIRONMENT
production

CORS_ORIGINS
*
```

---

## 🎯 ÉTAPE 3: Frontend

### Nouveau terminal :
```bash
cd frontend
railway link
railway up
```

### Variables Frontend :
```
REACT_APP_API_URL
https://VOTRE-BACKEND-URL.railway.app

REACT_APP_ENVIRONMENT
production

NODE_ENV
production
```

---

## 🎯 ÉTAPE 4: Finalisation

### Mettre à jour CORS avec l'URL frontend :
```
CORS_ORIGINS
https://VOTRE-FRONTEND-URL.railway.app
```

### Redéployer :
```bash
railway redeploy
```

---

## 🔗 Liens Importants

1. **Railway Dashboard :** https://railway.app/dashboard
2. **Créer projet :** Dashboard → "New Project" → "Empty Project"
3. **Variables :** Dashboard → Projet → Service → "Variables"
4. **Logs :** Dashboard → Projet → Service → "Logs"

---

## ⚡ Ordre d'Exécution

1. Se connecter : https://railway.app/dashboard
2. Créer projet vide
3. Exécuter commandes backend
4. Configurer variables backend
5. Noter URL backend  
6. Exécuter commandes frontend
7. Configurer variables frontend avec URL backend
8. Noter URL frontend
9. Mettre à jour CORS avec URL frontend
10. Redéployer
11. Tester l'application

**IMPORTANT :** Remplacez `VOTRE-BACKEND-URL` et `VOTRE-FRONTEND-URL` par les vraies URLs générées !
