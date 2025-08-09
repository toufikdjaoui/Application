# 🌐 Déploiement Cloudflare Pages - Mode DZ (Simple)

## 🎯 Méthode Recommandée : Interface Web

### 1. Préparation du Repository
```bash
# Assurez-vous que votre code est sur GitHub
git add .
git commit -m "Prêt pour déploiement Cloudflare"
git push origin main
```

### 2. Déploiement via Dashboard Cloudflare

#### Étape 1 : Connexion
1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. Connectez-vous à votre compte
3. Cliquez sur **"Pages"** dans le menu

#### Étape 2 : Créer un projet
1. Cliquez **"Create a project"**
2. Sélectionnez **"Connect to Git"**
3. Connectez votre compte GitHub
4. Sélectionnez le repository **"Application"**

#### Étape 3 : Configuration Build

**Framework preset :** `Create React App`

**Build settings :**
```
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: (leave empty)
```

**⚠️ ATTENTION - Settings incorrects à éviter :**
❌ `npx wrangler deploy` (c'est pour Workers, pas React!)
❌ `wrangler pages deploy`
❌ Toute commande avec `wrangler`

**Environment variables :**
```
REACT_APP_API_URL = https://votre-backend.onrender.com
REACT_APP_ENVIRONMENT = production
NODE_VERSION = 18
```

#### Étape 4 : Déployer
1. Cliquez **"Save and Deploy"**
2. Attendez la completion du build (2-5 minutes)
3. Votre site sera disponible sur : `https://application-xyz.pages.dev`

## 🔧 Configuration Backend Séparé

### Option 1 : Render (Gratuit)
1. Allez sur [render.com](https://render.com)
2. **"New" → "Web Service"**
3. Connectez votre repo GitHub
4. **Settings :**
   ```
   Name: mode-dz-backend
   Language: Python
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. **Environment Variables :**
   ```
   MONGODB_URL = mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority
   JWT_SECRET_KEY = mode-dz-super-secret-jwt-key-production-2024
   ENVIRONMENT = production
   CORS_ORIGINS = https://application-xyz.pages.dev
   ```

### Option 2 : Vercel
```bash
cd backend
npm install -g vercel
vercel --prod
```

## 🔄 Mise à jour des URLs

### Après déploiement backend :
1. Notez l'URL de votre backend (ex: `https://mode-dz-backend.onrender.com`)
2. Retournez dans Cloudflare Pages → Settings → Environment variables
3. Mettez à jour `REACT_APP_API_URL` avec la vraie URL
4. Redéployez : Pages → Deployments → "Retry deployment"

## ✅ URLs Finales
- **Frontend :** `https://application-xyz.pages.dev`
- **Backend :** `https://mode-dz-backend.onrender.com`
- **API Docs :** `https://mode-dz-backend.onrender.com/docs`

## 🎉 Domaine Personnalisé (Optionnel)
1. Dans Cloudflare Pages → Custom domains
2. Ajoutez votre domaine (ex: `modedz.com`)
3. Suivez les instructions DNS

## 🚨 Troubleshooting

### Build qui échoue
- Vérifiez que `frontend/package.json` existe
- Assurez-vous que la commande build est correcte
- Vérifiez les logs dans l'onglet "Deployments"

### CORS Errors
- Vérifiez que `CORS_ORIGINS` dans le backend contient l'URL Pages exacte
- Pas de slash final dans l'URL

### Variables d'environnement
- Redéployez après chaque changement de variable
- Utilisez l'onglet "Environment variables" dans Pages

## 💡 Auto-déploiement
Une fois configuré, chaque `git push` sur la branche `main` redéploiera automatiquement votre site !

---

## 📋 Résumé Commandes

```bash
# 1. Push code
git add .
git commit -m "Deploy to Cloudflare"
git push origin main

# 2. Interface web Cloudflare Pages
# 3. Configuration build automatique
# 4. Deploy backend sur Render/Vercel
# 5. Mise à jour variables d'environnement
```

**Total temps :** ~10 minutes  
**Coût :** Gratuit  
**Maintenance :** Auto-déploiement
