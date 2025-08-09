@echo off
echo 🌐 Deploiement Mode DZ sur Cloudflare (Version Simple)
echo =====================================================

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
echo 🚀 Deploiement frontend sur Cloudflare Pages...
wrangler deploy --assets=./dist

echo.
echo ✅ Frontend deploye !
echo.
echo 🌍 Votre frontend est disponible sur :
echo https://mode-dz-frontend.pages.dev
echo.
echo 📝 Prochaines etapes :
echo 1. Deployer votre backend sur Render/Vercel
echo 2. Mettre a jour l'URL API dans les variables d'environnement
echo 3. Configurer votre domaine personnalise

pause
