@echo off
echo 🌐 Deploiement Mode DZ sur Cloudflare
echo =====================================

echo.
echo 📦 Installation des dependances...
npm install -g wrangler

echo.
echo 🔑 Verification de la connexion Cloudflare...
wrangler whoami

echo.
echo 🏗️ Build du frontend...
cd frontend
call npm install
call npm run build

echo.
echo 🚀 Deploiement frontend sur Cloudflare Pages...
wrangler pages deploy dist --project-name mode-dz-frontend

echo.
echo ⚡ Deploiement backend Worker...
cd ..\backend
wrangler deploy

echo.
echo ✅ Deploiement termine !
echo.
echo 🌍 URLs de votre application :
echo Frontend: https://mode-dz-frontend.pages.dev
echo Backend Worker: https://mode-dz-backend.your-subdomain.workers.dev
echo.
echo 📝 N'oubliez pas de :
echo 1. Configurer votre backend externe (Render/Vercel)
echo 2. Mettre a jour l'URL dans worker.js
echo 3. Configurer votre domaine personnalise

pause
