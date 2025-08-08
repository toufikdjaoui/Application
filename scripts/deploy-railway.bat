@echo off
echo ===========================================
echo  Mode DZ - Deploiement Railway
echo ===========================================

echo Verification de Railway CLI...
railway --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Railway CLI n'est pas installe
    echo Installez avec: npm install -g @railway/cli
    pause
    exit /b 1
)

echo Railway CLI detecte !

echo.
echo Connexion a Railway...
railway login

echo.
echo 1. Deploiement du backend...
echo ===========================================
railway init
railway up

echo.
echo IMPORTANT: Configurez les variables d'environnement dans Railway Dashboard:
echo.
echo Backend Variables:
echo MONGODB_URL=mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true^&w=majority
echo JWT_SECRET_KEY=mode-dz-super-secret-jwt-key-production-2024
echo ENVIRONMENT=production
echo CORS_ORIGINS=https://VOTRE-FRONTEND-URL.railway.app
echo.

echo.
echo 2. Deploiement du frontend (nouveau terminal requis)...
echo ===========================================
echo Ouvrez un nouveau terminal et executez:
echo cd frontend
echo railway init  
echo railway up
echo.
echo Frontend Variables:
echo REACT_APP_API_URL=https://VOTRE-BACKEND-URL.railway.app
echo REACT_APP_ENVIRONMENT=production
echo NODE_ENV=production
echo.

echo.
echo ===========================================
echo  DEPLOIEMENT BACKEND TERMINE !
echo ===========================================
echo.
echo Prochaines etapes:
echo 1. Notez l'URL backend genere
echo 2. Configurez les variables dans Railway Dashboard
echo 3. Deployez le frontend depuis un nouveau terminal
echo 4. Remplacez les URLs dans les variables
echo 5. Redéployez les deux services
echo.
echo Dashboard: https://railway.app/dashboard
echo.
pause
