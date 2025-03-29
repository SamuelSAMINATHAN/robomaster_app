import os
from pydantic_settings import BaseSettings
from typing import Optional, Dict, Any

class Settings(BaseSettings):
    """Configuration globale de l'application"""
    
    # Paramètres du serveur
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = True
    
    # Paramètres du robot
    ROBOT_IP: str = "192.168.42.2"
    ROBOT_RETRY_COUNT: int = 3
    ROBOT_RETRY_INTERVAL: float = 2.0  # en secondes
    
    # Paramètres de stockage
    SCRIPTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts")
    
    # Paramètres de streaming vidéo
    VIDEO_FPS: int = 10
    VIDEO_WIDTH: int = 640
    VIDEO_HEIGHT: int = 360
    
    # Exécution
    EXECUTION_TIMEOUT: int = 60  # en secondes
    
    # Logs
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_prefix = "ROBOMASTER_"

# 👉 C'est cette ligne qu'il te manquait :
settings = Settings()
