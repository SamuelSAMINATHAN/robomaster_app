import logging
import sys
import time
from typing import List, Dict, Any, Optional, Callable
from datetime import datetime

class LogCapture:
    """Capture les logs de l'application et les redirige vers le frontend"""
    
    def __init__(self):
        self.logs: List[Dict[str, Any]] = []
        self.log_callback: Optional[Callable[[Dict[str, Any]], None]] = None
        
        # Configuration du logger
        self.logger = logging.getLogger("robomaster_app")
        self.logger.setLevel(logging.DEBUG)
        
        # Handler pour capturer les logs
        self.handler = LogCaptureHandler(self)
        self.logger.addHandler(self.handler)
        
        # Ajouter également un handler pour la console
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
    
    def set_callback(self, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Définit un callback pour les nouveaux logs"""
        self.log_callback = callback
    
    def add_log(self, level: str, message: str) -> None:
        """Ajoute un log à la liste
        
        Args:
            level: Niveau de log (info, warning, error)
            message: Message de log
        """
        log_entry = {
            "level": level,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        self.logs.append(log_entry)
        
        # Appeler le callback si défini
        if self.log_callback:
            self.log_callback(log_entry)
    
    def get_logs(self) -> List[Dict[str, Any]]:
        """Récupère tous les logs"""
        return self.logs
    
    def clear_logs(self) -> None:
        """Efface tous les logs"""
        self.logs = []


class LogCaptureHandler(logging.Handler):
    """Handler de logging personnalisé pour capturer les logs"""
    
    def __init__(self, log_capture: LogCapture):
        super().__init__()
        self.log_capture = log_capture
    
    def emit(self, record: logging.LogRecord) -> None:
        """Émet un log
        
        Args:
            record: Enregistrement de log
        """
        # Convertir le niveau de log
        level = record.levelname.lower()
        
        # Formater le message
        message = self.format(record)
        
        # Ajouter à la capture de logs
        self.log_capture.add_log(level, message)