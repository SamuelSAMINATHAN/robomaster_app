import os
from pydantic_settings import BaseSettings
from typing import Optional, Dict, Any

class Settings(BaseSettings):
    """Configuration globale de l'application"""
    
    # Paramètres du serveur
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Paramètres du robot
    ROBOT_DEFAULT_IP: str = "192.168.42.2"
    ROBOT_CONNECTION_TIMEOUT: int = 5  # secondes
    
    # Paramètres de stockage
    SCRIPTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts")
    
    # Paramètres de streaming vidéo
    VIDEO_FPS: int = 20
    VIDEO_WIDTH: int = 640

# 👉 C’est cette ligne qu’il te manquait :
settings = Settings()
