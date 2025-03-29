import time
import threading
import random
from typing import Optional, Dict, Any, Callable
import logging

# Configurer le logger
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class RobotClient:
    """Version de simulation du client RoboMaster"""
    
    def __init__(self):
        self.robot = None
        self.connected = False
        self.battery_level = 100
        self.status_thread = None
        self.running = False
        self.status_callback = None
        self.logger = logging.getLogger("robot_client")
        self.logger.info("Mode simulation activé - Pas besoin du SDK RoboMaster")
    
    async def connect(self, ip: str = "192.168.42.2") -> bool:
        """Connecte au robot RoboMaster EP (simulation)"""
        if self.connected:
            return True
            
        try:
            self.logger.info(f"Tentative de connexion au robot simulé à l'adresse {ip}...")
            # Simule un délai de connexion
            await self._async_sleep(1.5)
            self.connected = True
            self.battery_level = 85
            self.logger.info("Connexion au robot simulé réussie")
            
            # Démarrer le thread de surveillance du statut
            self.start_status_monitoring()
            
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la connexion au robot: {str(e)}")
            self.connected = False
            return False
    
    async def disconnect(self) -> None:
        """Déconnecte du robot (simulation)"""
        if not self.connected:
            return
            
        try:
            # Arrêter le thread de surveillance
            self.stop_status_monitoring()
            
            # Simule un délai de déconnexion
            await self._async_sleep(0.5)
            
            # Déconnexion du robot
            self.connected = False
            self.battery_level = 0
            self.logger.info("Déconnexion du robot simulé réussie")
        except Exception as e:
            self.logger.error(f"Erreur lors de la déconnexion du robot: {str(e)}")
    
    def start_status_monitoring(self) -> None:
        """Démarre un thread pour surveiller l'état du robot (simulation)"""
        if self.status_thread and self.status_thread.is_alive():
            return
            
        self.running = True
        self.status_thread = threading.Thread(target=self._status_monitor_task)
        self.status_thread.daemon = True
        self.status_thread.start()
    
    def stop_status_monitoring(self) -> None:
        """Arrête le thread de surveillance"""
        self.running = False
        if self.status_thread:
            try:
                self.status_thread.join(timeout=1.0)
            except Exception:
                pass
    
    async def _async_sleep(self, seconds):
        """Fonction d'attente asynchrone"""
        import asyncio
        await asyncio.sleep(seconds)
    
    def _status_monitor_task(self) -> None:
        """Tâche de surveillance de l'état du robot (simulation)"""
        while self.running and self.connected:
            try:
                # Simulation de la batterie qui descend lentement
                if self.battery_level > 0:
                    self.battery_level -= random.uniform(0, 0.2)
                    self.battery_level = max(0, self.battery_level)
                    self.logger.info(f"Batterie simulée: {self.battery_level:.1f}%")
                
                # Appeler le callback si défini
                if self.status_callback:
                    self.status_callback({
                        "connected": self.connected,
                        "battery_level": round(self.battery_level)
                    })
                
            except Exception as e:
                self.logger.error(f"Erreur lors de la simulation du statut: {str(e)}")
            
            # Attendre avant la prochaine vérification
            time.sleep(5)
    
    def set_status_callback(self, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Définit un callback pour les mises à jour de statut"""
        self.status_callback = callback
    
    async def move(self, x: float = 0, y: float = 0, z: float = 0, speed: float = 0.5) -> bool:
        """Déplace le robot - simulation"""
        if not self.connected:
            return False
            
        try:
            self.logger.info(f"Simulation: Déplacement du robot - x:{x}, y:{y}, z:{z}, vitesse:{speed}")
            await self._async_sleep(abs(max(x, y, z)) * 2)  # Simule un temps de déplacement
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du déplacement: {str(e)}")
            return False
    
    async def rotate(self, angle: float, speed: float = 30) -> bool:
        """Fait tourner le robot - simulation"""
        if not self.connected:
            return False
            
        try:
            self.logger.info(f"Simulation: Rotation du robot - angle:{angle}, vitesse:{speed}")
            await self._async_sleep(abs(angle/90))  # Simule un temps de rotation
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la rotation: {str(e)}")
            return False
    
    async def set_led(self, r: int, g: int, b: int, effect: str = "solid") -> bool:
        """Change la couleur des LEDs - simulation"""
        if not self.connected:
            return False
            
        try:
            self.logger.info(f"Simulation: Changement des LEDs - R:{r}, G:{g}, B:{b}, effet:{effect}")
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du changement de LED: {str(e)}")
            return False
    
    def get_camera_stream(self):
        """Récupère le flux vidéo de la caméra - simulation"""
        if not self.connected:
            return None
            
        self.logger.info("Simulation: Accès au flux caméra du robot")
        return None  # En simulation, on utilisera la webcam locale à la place
    
    def is_connected(self) -> bool:
        """Vérifie si le robot est connecté"""
        return self.connected
    
    async def get_battery_level(self) -> int:
        """Récupère le niveau de batterie"""
        return round(self.battery_level)
        
    async def send_command(self, command: str) -> Dict[str, Any]:
        """Envoie une commande directe au robot - simulation"""
        if not self.connected:
            return {"status": "error", "message": "Robot non connecté"}
            
        self.logger.info(f"Simulation: Envoi de commande: {command}")
        await self._async_sleep(0.5)  # Simule un délai de traitement
        
        return {
            "status": "success",
            "command": command,
            "result": "Commande exécutée en simulation"
        }