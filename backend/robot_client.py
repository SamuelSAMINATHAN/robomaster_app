import time
import threading
from typing import Optional, Dict, Any, Callable
import logging

# Import du SDK RoboMaster
try:
    import robomaster
    from robomaster import robot
except ImportError:
    logging.error("Le SDK RoboMaster n'est pas installé. Veuillez l'installer avec 'pip install robomaster'")

class RobotClient:
    def __init__(self):
        self.robot = None
        self.connected = False
        self.battery_level = 0
        self.status_thread = None
        self.running = False
        self.status_callback = None
        self.logger = logging.getLogger("robot_client")
    
    def connect(self, ip: str = "192.168.42.2") -> bool:
        """Connecte au robot RoboMaster EP"""
        if self.connected:
            return True
            
        try:
            self.logger.info(f"Tentative de connexion au robot à l'adresse {ip}...")
            self.robot = robot.Robot()
            self.robot.initialize(conn_type="ap", proto_type="udp", sn=None, ip=ip)
            self.connected = True
            self.logger.info("Connexion au robot réussie")
            
            # Démarrer le thread de surveillance du statut
            self.start_status_monitoring()
            
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la connexion au robot: {str(e)}")
            self.connected = False
            return False
    
    def disconnect(self) -> None:
        """Déconnecte du robot"""
        if not self.connected or not self.robot:
            return
            
        try:
            # Arrêter le thread de surveillance
            self.stop_status_monitoring()
            
            # Déconnexion du robot
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
            self.status_thread.join(timeout=1.0)
    
    def _status_monitor_task(self) -> None:
        """Tâche de surveillance de l'état du robot"""
        while self.running and self.connected and self.robot:
            try:
                # Récupérer le niveau de batterie
                battery = self.robot.battery
                self.battery_level = battery.get_battery_info()["battery_info"]["battery_percentage"]
                
                # Appeler le callback si défini
                if self.status_callback:
                    self.status_callback({
                        "connected": self.connected,
                        "battery_level": self.battery_level
                    })
            except Exception as e:
                self.logger.error(f"Erreur lors de la récupération du statut: {str(e)}")
                # Si erreur de connexion, marquer comme déconnecté
                if "connection" in str(e).lower():
                    self.connected = False
                    if self.status_callback:
                        self.status_callback({"connected": False})
                    break
            
            # Attendre avant la prochaine vérification
            time.sleep(5)
    
    def set_status_callback(self, callback: Callable[[Dict[str, Any]], None]) -> None:
        """Définit un callback pour les mises à jour de statut"""
        self.status_callback = callback
    
    def move(self, x: float = 0, y: float = 0, z: float = 0, speed: float = 0.5) -> bool:
        """Déplace le robot (en mètres)"""
        if not self.connected or not self.robot:
            return False
            
        try:
            self.robot.chassis.move(x=x, y=y, z=z, xy_speed=speed)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du déplacement: {str(e)}")
            return False
    
    def rotate(self, angle: float, speed: float = 30) -> bool:
        """Fait tourner le robot (en degrés)"""
        if not self.connected or not self.robot:
            return False
            
        try:
            self.robot.chassis.drive_speed(x=0, y=0, z=angle, timeout=None)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors de la rotation: {str(e)}")
            return False
    
    def set_led(self, r: int, g: int, b: int, effect: str = "solid") -> bool:
        """Change la couleur des LEDs"""
        if not self.connected or not self.robot:
            return False
            
        try:
            led_effect = robomaster.led.LED_EFFECT_SOLID
            if effect == "blink":
                led_effect = robomaster.led.LED_EFFECT_BLINK
            elif effect == "breath":
                led_effect = robomaster.led.LED_EFFECT_BREATH
                
            self.robot.led.set_led(comp=robomaster.led.LED_ALL, r=r, g=g, b=b, effect=led_effect)
            return True
        except Exception as e:
            self.logger.error(f"Erreur lors du changement de LED: {str(e)}")
            return False
    
    def get_camera_stream(self):
        """Récupère le flux vidéo de la caméra"""
        if not self.connected or not self.robot:
            return None
            
        try:
            return self.robot.camera
        except Exception as e:
            self.logger.error(f"Erreur lors de l'accès à la caméra: {str(e)}")
            return None
    
    def is_connected(self) -> bool:
        """Vérifie si le robot est connecté"""
        return self.connected
    
    def get_battery_level(self) -> int:
        """Récupère le niveau de batterie"""
        return self.battery_level