"""
Point d'entrée Vercel pour l'API Mode DZ
"""
import sys
import os

# Ajouter le répertoire backend au Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from backend.app.main import app

# Export pour Vercel
app = app
