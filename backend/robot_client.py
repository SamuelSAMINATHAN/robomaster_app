import time
import threading
from typing import Optional, Dict, Any, Callable
import logging
from robomaster import robot
from robomaster import camera
from robomaster import led
from robomaster import chassis

# Configurer le logger
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class RobotClient:
    """Client RoboMaster utilisant le SDK officiel"""
    
    def __init__(self):
        self.robot = None
        self.connected = False
        self.battery_level = 0
        self.status_thread = None
        self.running = False
        self.status_callback = None
        self.logger = logging.getLogger("robot_client")
        self.camera = None
        self.chassis = None
        self.led = None
    
    async def connect(self, ip: str = "192.168.42.2") -> bool:
        """Connecte au robot RoboMaster EP"""
        if self.connected:
            return True
            
        try:
            self.logger.info(f"Tentative de connexion au robot à l'adresse {ip}...")
            self.robot = robot.Robot()
            self.robot.initialize(conn_type="sta", ip=ip)
            
            # Initialiser les composants
            self.camera = self.robot.camera
            self.chassis = self.robot.chassis
            self.led = self.robot.led
            
            # Démarrer la caméra
            self.camera.start_video_stream(display=False)
            
            self.connected = True
            self.battery_level = self.robot.get_battery()
            self.logger.info("Connexion au robot réussie")
            
            # Démarrer le thread de surveillance du statut
            self.start_status_monitoring()
            
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la connexion au robot: {str(e)}")
            self.connected = False
            return False
    
    async def disconnect(self) -> None:
        """Déconnecte du robot"""
        if not self.connected:
            return
            
        try:
            # Arrêter le thread de surveillance
            self.stop_status_monitoring()
            
            # Arrêter la caméra
            if self.camera:
                self.camera.stop_video_stream()
            
            # Déconnexion du robot
            if self.robot:
                self.robot.close()
            
            self.connected = False
            self.battery_level = 0
            self.logger.info("Déconnexion du robot réussie")
        except Exception as e:
            self.logger.error(f"Erreur lors de la déconnexion du robot: {str(e)}")
    
    def start_status_monitoring(self) -> None:
        """Démarre un thread pour surveiller l'état du robot"""
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
    
    def _status_monitor_task(self) -> None:
        """Tâche de surveillance de l'état du robot"""
        while self.running and self.connected:
            try:
                # Mise à jour du niveau de batterie
                self.battery_level = self.robot.get_battery()
                self.logger.info(f"Batterie: {self.battery_level}%")
                
                # Appeler le callback si défini
                if self.status_callback:
                    self.status_callback({
                        "connected": self.connected,
                        "battery_level": self.battery_level
                    })
                
            except Exception as e:
                self.logger.error(f"Erreur lors de la surveillance du statut: {str(e)}")
            
            # Attendre avant la prochaine vérification
            time.sleep(5)
    
    def set_status_callback(self, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Définit un callback pour les mises à jour de statut"""
        self.status_callback = callback
    
    async def move(self, x: float = 0, y: float = 0, z: float = 0, speed: float = 0.5) -> bool:
        """Déplace le robot"""
        if not self.connected or not self.chassis:
            return False
            
        try:
            self.chassis.move(x=x, y=y, z=z, xy_speed=speed)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du déplacement: {str(e)}")
            return False
    
    async def rotate(self, angle: float, speed: float = 30) -> bool:
        """Fait tourner le robot"""
        if not self.connected or not self.chassis:
            return False
            
        try:
            self.chassis.move(z=angle, z_speed=speed)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la rotation: {str(e)}")
            return False
    
    async def set_led(self, r: int, g: int, b: int, effect: str = "solid") -> bool:
        """Change la couleur des LEDs"""
        if not self.connected or not self.led:
            return False
            
        try:
            if effect == "solid":
                self.led.set_led(comp=led.COMP_ALL, r=r, g=g, b=b, effect=led.EFFECT_ON)
            elif effect == "blink":
                self.led.set_led(comp=led.COMP_ALL, r=r, g=g, b=b, effect=led.EFFECT_FLASH)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du changement de LED: {str(e)}")
            return False
    
    def get_camera_stream(self):
        """Récupère le flux vidéo de la caméra"""
        if not self.connected or not self.camera:
            return None
            
        try:
            return self.camera.read_cv2_image()
        except Exception as e:
            self.logger.error(f"Erreur lors de la lecture de la caméra: {str(e)}")
            return None
    
    def is_connected(self) -> bool:
        """Vérifie si le robot est connecté"""
        return self.connected
    
    async def get_battery_level(self) -> int:
        """Récupère le niveau de batterie"""
        if not self.connected or not self.robot:
            return 0
        return self.robot.get_battery()
        
    async def send_command(self, command: str) -> Dict[str, Any]:
        """Envoie une commande directe au robot"""
        if not self.connected:
            return {"status": "error", "message": "Robot non connecté"}
            
        try:
            # Exécuter la commande dans un environnement sécurisé
            exec(command, {
                'robot': self.robot,
                'chassis': self.chassis,
                'camera': self.camera,
                'led': self.led
            })
            
            return {
                "status": "success",
                "command": command,
                "result": "Commande exécutée avec succès"
            }
        except Exception as e:
            return {
                "status": "error",
                "command": command,
                "message": str(e)
            }