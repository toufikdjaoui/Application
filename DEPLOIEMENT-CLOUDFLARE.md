# 🌐 Guide de Déploiement Cloudflare - Mode DZ

## 📋 Vue d'ensemble

- **Frontend :** Cloudflare Pages (React)
- **Backend :** Cloudflare Workers (FastAPI via Pyodide ou service externe)
- **Base de données :** MongoDB Atlas (inchangée)
- **CDN :** Cloudflare automatique

## 🚀 Étapes Rapides

### 1. Installation Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Connexion Cloudflare
```bash
wrangler login
```

### 3. Déploiement Frontend (Pages)
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name mode-dz-frontend
```

### Alternative : Déploiement simplifié
```bash
# Utiliser le script automatique
./scripts/deploy-cloudflare-simple.bat
```

### 4. Déploiement Backend (Workers)
```bash
cd backend
wrangler deploy
```

## 🔧 Configuration Détaillée

### Frontend - Cloudflare Pages

#### 1. Configuration build
Créer `frontend/wrangler.toml` :
```toml
name = "mode-dz-frontend"
compatibility_date = "2024-08-08"

[build]
command = "npm run build"
destination = "dist"

[[env.production.vars]]
REACT_APP_API_URL = "https://mode-dz-backend.your-subdomain.workers.dev"
REACT_APP_ENVIRONMENT = "production"
```

#### 2. Variables d'environnement Pages
Dans le dashboard Cloudflare Pages :
```env
REACT_APP_API_URL=https://mode-dz-backend.your-subdomain.workers.dev
REACT_APP_ENVIRONMENT=production
NODE_VERSION=18
```

### Backend - Cloudflare Workers

#### 1. Configuration Worker
Créer `backend/wrangler.toml` :
```toml
name = "mode-dz-backend"
main = "worker.js"
compatibility_date = "2024-08-08"

[vars]
ENVIRONMENT = "production"
CORS_ORIGINS = "https://mode-dz-frontend.pages.dev"

[[env.production.vars]]
MONGODB_URL = "mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority"
JWT_SECRET_KEY = "mode-dz-super-secret-jwt-key-production-2024"
```

#### 2. Adaptation FastAPI pour Workers
Option A - Proxy vers service externe (recommandé) :
```javascript
// backend/worker.js
export default {
  async fetch(request, env) {
    // Proxy vers votre backend FastAPI hébergé ailleurs (Render, Vercel, etc.)
    const backendUrl = 'https://your-fastapi-backend.onrender.com';
    
    const url = new URL(request.url);
    const proxyUrl = backendUrl + url.pathname + url.search;
    
    const response = await fetch(proxyUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // Ajouter les headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGINS,
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PUT,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
    
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: { ...response.headers, ...corsHeaders },
    });
    
    return modifiedResponse;
  }
};
```

## 🛠 Services Externes pour Backend

### Option 1 : Render (Gratuit)
```bash
# Se connecter à Render
# Connecter votre repo GitHub
# Service Web Python avec : pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Option 2 : Vercel
```bash
npm install -g vercel
cd backend
vercel --prod
```

### Option 3 : Railway (original)
```bash
cd backend
railway login
railway init --name mode-dz-backend
railway up
```

## 📱 Commandes de Déploiement

### Déploiement complet
```bash
# Frontend
cd frontend
npm run build
wrangler pages deploy dist --project-name mode-dz-frontend

# Backend (si Worker proxy)
cd ../backend
wrangler deploy

# Backend (si service externe - exemple Render)
git push origin main  # Auto-deploy sur Render
```

### Déploiement rapide
```bash
# Script automatique
./scripts/deploy-cloudflare.bat
```

## 🌍 URLs Finales

Après déploiement :
- **Frontend :** `https://mode-dz-frontend.pages.dev`
- **Backend Worker :** `https://mode-dz-backend.your-subdomain.workers.dev`
- **Backend Service :** `https://mode-dz-backend.onrender.com` (Render)

## 💰 Coûts Cloudflare

- **Cloudflare Pages :** Gratuit (500 builds/mois)
- **Cloudflare Workers :** Gratuit (100 000 requêtes/jour)
- **MongoDB Atlas :** Gratuit (M0 - 512MB)
- **Render/Vercel :** Gratuit avec limitations

Total : **Gratuit** pour commencer !

## ⚡ Avantages Cloudflare

- ✅ **Performance :** CDN mondial automatique
- ✅ **Sécurité :** Protection DDoS incluse
- ✅ **Simplicité :** Déploiement Git automatique
- ✅ **Rapidité :** Edge computing
- ✅ **Coût :** Gratuit pour la plupart des projets

## 🔍 Configuration DNS

1. **Domaine personnalisé :** Configurer dans Cloudflare Dashboard
2. **SSL :** Automatique avec Cloudflare
3. **Cache :** Configuration automatique optimisée

## 🚨 Troubleshooting

### Build qui échoue
```bash
# Nettoyer et rebuilder
cd frontend
rm -rf dist node_modules
npm install
npm run build
wrangler pages deploy dist
```

### CORS Errors
- Vérifier `CORS_ORIGINS` dans worker
- S'assurer que l'URL frontend est correcte

### Workers timeout
- Workers gratuits : 10ms CPU max
- Utiliser un service externe pour le backend si nécessaire

## 📞 Support

- [Documentation Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentation Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Dashboard Cloudflare](https://dash.cloudflare.com/)
