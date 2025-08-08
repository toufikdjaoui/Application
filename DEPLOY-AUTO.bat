@echo off
cls
echo ===============================================
echo    MODE DZ - DEPLOIEMENT AUTOMATIQUE RAILWAY
echo ===============================================
echo.

echo Etape 1: Verification de Railway CLI...
railway --version
if errorlevel 1 (
    echo ERREUR: Railway CLI manquant. Installation...
    npm install -g @railway/cli
    if errorlevel 1 (
        echo ERREUR: Impossible d'installer Railway CLI
        echo Installez manuellement: npm install -g @railway/cli
        pause
        exit /b 1
    )
)
echo ✓ Railway CLI pret

echo.
echo Etape 2: Connexion a Railway (navigateur requis)...
railway login
if errorlevel 1 (
    echo ERREUR: Connexion echouee
    pause
    exit /b 1
)
echo ✓ Connecte a Railway

echo.
echo ===============================================
echo    DEPLOIEMENT BACKEND
echo ===============================================
echo.

echo Initialisation du projet backend...
railway init

echo Deploiement du backend...
railway up
if errorlevel 1 (
    echo ERREUR: Deploiement backend echoue
    pause
    exit /b 1
)

echo.
echo ✓ Backend deploye avec succes !
echo.
echo IMPORTANT: Notez l'URL du backend affichee ci-dessus
echo Elle ressemble a: https://votre-projet-xxx.railway.app
echo.

set /p BACKEND_URL="Entrez l'URL du backend genere: "

echo.
echo Configuration des variables d'environnement backend...
railway variables set MONGODB_URL="mongodb+srv://toufikdjaoui:toufikdjaoui@cluster0.xycidxj.mongodb.net/mode_dz?retryWrites=true&w=majority"
railway variables set JWT_SECRET_KEY="mode-dz-super-secret-jwt-key-production-2024"
railway variables set ENVIRONMENT="production"
railway variables set CORS_ORIGINS="*"

echo ✓ Variables backend configurees

echo.
echo ===============================================
echo    DEPLOIEMENT FRONTEND
echo ===============================================
echo.

echo Passage au dossier frontend...
cd frontend

echo Initialisation du projet frontend...
railway init

echo Configuration des variables frontend...
railway variables set REACT_APP_API_URL="%BACKEND_URL%"
railway variables set REACT_APP_ENVIRONMENT="production"
railway variables set NODE_ENV="production"

echo Deploiement du frontend...
railway up
if errorlevel 1 (
    echo ERREUR: Deploiement frontend echoue
    pause
    exit /b 1
)

echo ✓ Frontend deploye avec succes !

echo.
echo Retour au backend pour finaliser CORS...
cd ..
set /p FRONTEND_URL="Entrez l'URL du frontend genere: "
railway variables set CORS_ORIGINS="%FRONTEND_URL%"

echo.
echo Redemarrage des services...
railway redeploy

echo.
echo ===============================================
echo    DEPLOIEMENT TERMINE !
echo ===============================================
echo.
echo ✓ Backend:  %BACKEND_URL%
echo ✓ Frontend: %FRONTEND_URL%
echo ✓ API Docs: %BACKEND_URL%/docs
echo.
echo Testez votre application maintenant !
echo.
pause
