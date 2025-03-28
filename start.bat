@echo off
rem Script de démarrage pour Windows

set BACKEND_PORT=8000
set FRONTEND_PORT=3000

rem Chemins des répertoires
set SCRIPT_DIR=%~dp0
set BACKEND_DIR=%SCRIPT_DIR%backend
set FRONTEND_DIR=%SCRIPT_DIR%frontend

echo Démarrage de l'application RoboMaster...

rem Vérifier si l'environnement virtuel Python existe
if exist "%BACKEND_DIR%\venv" (
    echo Activation de l'environnement virtuel Python...
    call "%BACKEND_DIR%\venv\Scripts\activate.bat"
) else (
    echo Création d'un nouvel environnement virtuel Python...
    cd "%BACKEND_DIR%"
    python -m venv venv
    call "%BACKEND_DIR%\venv\Scripts\activate.bat"
    pip install --upgrade pip
    pip install -r requirements.txt
)

rem Installer les dépendances frontend si nécessaire
cd "%FRONTEND_DIR%"
if not exist "node_modules" (
    echo Installation des dépendances frontend...
    call npm install
)

rem Copier les fichiers média de Blockly
echo Copie des fichiers média de Blockly...
call npm run copy-blockly-media

rem Démarrer le serveur backend
echo Démarrage du serveur backend sur le port %BACKEND_PORT%...
start "Backend" cmd /c "cd %BACKEND_DIR% && python main.py"

rem Attendre que le backend soit prêt
echo Attente du démarrage du backend...
timeout /t 2 > nul

rem Démarrer le serveur frontend
echo Démarrage du serveur frontend sur le port %FRONTEND_PORT%...
start "Frontend" cmd /c "cd %FRONTEND_DIR% && npm run dev"

echo ==========================================================
echo Application lancée!
echo Backend: http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo Les serveurs s'exécutent dans des fenêtres distinctes.
echo Fermez ces fenêtres pour arrêter l'application.
echo ========================================================== 