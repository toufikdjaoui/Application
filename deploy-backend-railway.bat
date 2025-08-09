@echo off
echo ===========================================
echo   DEPLOIEMENT BACKEND RAILWAY - MODE DZ
echo ===========================================

echo.
echo [1/5] Installation Railway CLI...
npm install -g @railway/cli

echo.
echo [2/5] Connexion Railway (navigateur)...
railway login

echo.
echo [3/5] Initialisation projet Railway...
railway init --name mode-dz-backend

echo.
echo [4/5] Configuration variables d'environnement...
railway variables set MONGODB_URL="mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority"
railway variables set JWT_SECRET_KEY="mode-dz-super-secret-jwt-key-production-2024"
railway variables set ENVIRONMENT="production"
railway variables set CORS_ORIGINS="https://your-netlify-app.netlify.app"

echo.
echo [5/5] Deploiement sur Railway...
railway up

echo.
echo ===========================================
echo   DEPLOIEMENT BACKEND TERMINE !
echo ===========================================
echo   Backend disponible sur Railway
echo   N'oubliez pas de mettre a jour CORS_ORIGINS
echo   avec l'URL Netlify reelle
echo ===========================================

pause
