@echo off
echo 🌐 Deploiement Mode DZ sur Cloudflare Pages
echo ===========================================

echo.
echo 📦 Installation Wrangler...
npm install -g wrangler

echo.
echo 🔑 Connexion Cloudflare...
wrangler login

echo.
echo 🏗️ Build du frontend...
cd frontend
call npm install
call npm run build

echo.
echo 🚀 Deploiement via Cloudflare Pages...
echo Deux options disponibles :
echo.
echo Option 1 - Via Pages (recommande) :
wrangler pages deploy dist --project-name mode-dz-frontend

echo.
echo Option 2 - Via Worker avec assets :
REM wrangler deploy

echo.
echo ✅ Deploiement termine !
echo Votre site sera disponible sur : https://mode-dz-frontend.pages.dev

pause
