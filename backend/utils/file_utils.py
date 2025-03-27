import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging

from config import settings

class FileUtils:
    """Utilitaires pour la gestion des fichiers"""
    
    @staticmethod
    def ensure_scripts_dir() -> None:
        """S'assure que le répertoire des scripts existe"""
        os.makedirs(settings.SCRIPTS_DIR, exist_ok=True)
    
    @staticmethod
    def save_script(script_data: Dict[str, Any]) -> Dict[str, Any]:
        """Sauvegarde un script Blockly
        
        Args:
            script_data: Données du script (id, name, blockly_xml, python_code)
            
        Returns:
            Informations sur le script sauvegardé
        """
        # S'ass