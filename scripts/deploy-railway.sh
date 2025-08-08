#!/bin/bash

echo "==========================================="
echo " Mode DZ - Déploiement Railway"
echo "==========================================="

# Vérification Railway CLI
if ! command -v railway &> /dev/null; then
    echo "ERREUR: Railway CLI n'est pas installé"
    echo "Installez avec: npm install -g @railway/cli"
    exit 1
fi

echo "Railway CLI détecté !"

echo ""
echo "1. Déploiement du backend..."
echo "==========================================="
railway up --service backend

if [ $? -ne 0 ]; then
    echo "ERREUR: Échec du déploiement backend"
    exit 1
fi

echo ""
echo "2. Déploiement du frontend..."
echo "==========================================="
cd frontend
railway up --service frontend
cd ..

if [ $? -ne 0 ]; then
    echo "ERREUR: Échec du déploiement frontend"
    exit 1
fi

echo ""
echo "==========================================="
echo " DÉPLOIEMENT TERMINÉ !"
echo "==========================================="
echo ""
echo "Vérifiez vos services dans le Railway Dashboard:"
echo "https://railway.app/dashboard"
echo ""
echo "URLs de vos services seront disponibles dans le dashboard"
echo ""
