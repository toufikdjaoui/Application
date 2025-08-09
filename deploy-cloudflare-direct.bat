@echo off
echo ===========================================
echo   DEPLOIEMENT CLOUDFLARE PAGES DIRECT
echo ===========================================

echo.
echo [1/4] Installation de Wrangler...
npm install -g wrangler

echo.
echo [2/4] Connexion Cloudflare (ouvrir navigateur)...
wrangler login

echo.
echo [3/4] Build du frontend...
cd frontend
npm install
npm run build

echo.
echo [4/4] Deploiement sur Cloudflare Pages...
wrangler pages deploy build --project-name mode-dz-frontend --compatibility-date 2024-08-09

echo.
echo ===========================================
echo   DEPLOIEMENT TERMINE !
echo ===========================================
echo   Votre site sera disponible sur:
echo   https://mode-dz-frontend.pages.dev
echo ===========================================

pause
