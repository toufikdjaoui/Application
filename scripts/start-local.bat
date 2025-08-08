@echo off
echo 🚀 Démarrage Mode DZ (Sans Docker)...

echo.
echo ⚠️  PREREQUIS:
echo   - MongoDB doit être démarré: mongod --dbpath "C:\data\db"
echo   - Redis optionnel: redis-server
echo.

pause

echo 📂 Préparation des dossiers...
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "backend\uploads" mkdir "backend\uploads"

echo.
echo 🔧 Démarrage Backend...
cd backend

if not exist "venv" (
    echo 📦 Création environnement virtuel...
    python -m venv venv
)

echo 📦 Installation des dépendances...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo 🔗 Démarrage serveur FastAPI...
start /b uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

cd ..

echo.
echo ⚛️  Démarrage Frontend...
cd frontend

if not exist "node_modules" (
    echo 📦 Installation des dépendances Node.js...
    npm install
)

echo 🔗 Démarrage serveur React...
start /b npm start

cd ..

echo.
echo ✅ Mode DZ démarré !
echo.
echo 🌐 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo 📋 TODO:
echo   1. Ouvrir http://localhost:3000
echo   2. Créer un compte
echo   3. Explorer l'application !
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
