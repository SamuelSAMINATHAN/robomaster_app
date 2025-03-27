#!/bin/bash

# Script de démarrage pour l'application RoboMaster
# Ce script lance le backend et le frontend en parallèle

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "Python 3 n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Fonction pour arrêter tous les processus à la sortie
cleanup() {
    echo "Arrêt des processus..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Intercepter les signaux d'arrêt
trap cleanup SIGINT SIGTERM

echo "Démarrage de l'application RoboMaster en mode hors ligne..."

# Démarrer le backend
echo "Démarrage du backend..."
cd "$(dirname "$0")/backend"

# Activer l'environnement virtuel si présent
if [ -d "venv" ]; then
    source venv/bin/activate || source venv/Scripts/activate
fi

# Démarrer le serveur backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 2

# Démarrer le frontend
echo "Démarrage du frontend..."
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!

echo "Application démarrée !"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Appuyez sur Ctrl+C pour arrêter l'application"

# Attendre que les processus se terminent
wait $BACKEND_PID $FRONTEND_PID