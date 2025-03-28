#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Afficher ce qui est exécuté
set -x

# Configuration
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Chemins des répertoires
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Activer l'environnement virtuel Python
if [ -d "$BACKEND_DIR/venv" ]; then
    echo "Activation de l'environnement virtuel Python..."
    source "$BACKEND_DIR/venv/bin/activate"
else
    echo "Création d'un nouvel environnement virtuel Python..."
    cd "$BACKEND_DIR"
    python3 -m venv venv
    source "$BACKEND_DIR/venv/bin/activate"
    pip install --upgrade pip
    pip install -r requirements.txt
fi

# Installer les dépendances frontend si nécessaire
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances frontend..."
    npm install
fi

# Copier les fichiers média de Blockly
echo "Copie des fichiers média de Blockly..."
npm run copy-blockly-media

# Démarrer le serveur backend en arrière-plan
echo "Démarrage du serveur backend sur le port $BACKEND_PORT..."
cd "$BACKEND_DIR"
python main.py &
BACKEND_PID=$!

# Attendre que le backend soit prêt
echo "Attente du démarrage du backend..."
sleep 2

# Démarrer le serveur frontend
echo "Démarrage du serveur frontend sur le port $FRONTEND_PORT..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Fonction pour nettoyer à la sortie
cleanup() {
    echo "Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Attraper les signaux pour nettoyer proprement
trap cleanup SIGINT SIGTERM

# Attendre que l'utilisateur appuie sur Ctrl+C
echo "=========================================================="
echo "Application lancée!"
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Appuyez sur Ctrl+C pour arrêter les serveurs."
echo "=========================================================="

wait