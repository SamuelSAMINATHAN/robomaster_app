import cv2
import numpy as np
import asyncio
import logging
from typing import Optional, Dict, Any, List, Callable
from fastapi import WebSocket
from fastapi.responses import StreamingResponse

from robot_client import RobotClient
from config import settings

class VideoStream:
    """Gère le flux vidéo du robot"""
    
    def __init__(self, robot_client: RobotClient):
        self.robot_client = robot_client
        self.camera = None
        self.running = False
        self.frame_callback = None
        self.current_frame = None
        self.logger = logging.getLogger("video_stream")
        self.custom_processor = None
        
    async def start(self) -> bool:
        """Démarre le flux vidéo du robot
        
        Returns:
            True si le flux a démarré avec succès, False sinon
        """
        try:
            # L'initialisation dépend de l'API du robot
            # Code fictif ici, à adapter selon l'API réelle du robot
            self.running = True
            
            # Démarrer la boucle de capture dans un thread séparé
            asyncio.create_task(self._capture_loop())
            
            self.logger.info("Flux vidéo du robot démarré avec succès")
            return True
            
        except Exception as e:
            self.logger.error(f"Erreur lors du démarrage du flux vidéo du robot: {str(e)}")
            return False
            
    async def stop(self) -> None:
        """Arrête le flux vidéo du robot"""
        self.running = False
        
    async def _capture_loop(self) -> None:
        """Boucle de capture d'images du robot"""
        while self.running:
            try:
                # Code fictif, à remplacer par le vrai code du robot
                # Créer une image noire avec un texte par défaut
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(frame, "Flux Robot", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                
                self.current_frame = frame
                
            except Exception as e:
                self.logger.error(f"Erreur lors de la capture d'image du robot: {str(e)}")
                await asyncio.sleep(0.5)
                continue
                
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
    
    def get_jpeg_frame(self) -> Optional[bytes]:
        """Récupère l'image courante au format JPEG
        
        Returns:
            Image JPEG ou None si pas disponible
        """
        if self.current_frame is None:
            # Créer une image par défaut
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(frame, "Pas d'image", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        else:
            frame = self.current_frame
            
        try:
            # Convertir l'image en JPEG
            _, jpeg_frame = cv2.imencode('.jpg', frame)
            return jpeg_frame.tobytes()
        except Exception as e:
            self.logger.error(f"Erreur lors de la conversion en JPEG: {str(e)}")
            return None
    
    async def generate_frames(self):
        """Générateur de frames pour le streaming HTTP"""
        while True:
            jpeg_frame = self.get_jpeg_frame()
            
            if jpeg_frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg_frame + b'\r\n')
            
            # Attendre avant la prochaine frame
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
    
    def get_stream(self):
        """Crée un générateur de frames pour le streaming HTTP
        
        Returns:
            Générateur de frames pour StreamingResponse
        """
        return self.generate_frames()


class WebcamStream:
    """Gère le flux vidéo de la webcam locale"""
    
    def __init__(self):
        self.camera = None
        self.camera_index = 0  # Webcam par défaut (0 pour la webcam intégrée)
        self.running = False
        self.frame_callback = None
        self.current_frame = None
        self.logger = logging.getLogger("webcam_stream")
        self.custom_processor = None
        self.active_connections: List[WebSocket] = []
        # Vérifier si la logging est configurée correctement
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
    
    async def start(self) -> bool:
        """Démarre le flux vidéo de la webcam locale
        
        Returns:
            True si le flux a démarré avec succès, False sinon
        """
        try:
            # Si une instance de caméra est déjà ouverte, la fermer d'abord
            if self.camera is not None:
                self.camera.release()
                
            # Ouvrir la webcam locale
            self.camera = cv2.VideoCapture(self.camera_index)
            if not self.camera.isOpened():
                self.logger.error(f"Impossible d'accéder à la webcam locale (index {self.camera_index})")
                return False
            
            # Configurer la résolution
            self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, settings.VIDEO_WIDTH)
            self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, int(settings.VIDEO_WIDTH * 9/16))
            
            self.running = True
            
            # Démarrer la boucle de capture dans un thread séparé
            asyncio.create_task(self._capture_loop())
            
            self.logger.info("Flux webcam démarré avec succès")
            return True
            
        except Exception as e:
            self.logger.error(f"Erreur lors du démarrage du flux webcam: {str(e)}")
            return False
    
    async def stop(self) -> None:
        """Arrête le flux vidéo de la webcam"""
        self.running = False
        
        if self.camera:
            try:
                self.camera.release()
                self.logger.info("Flux webcam arrêté")
            except Exception as e:
                self.logger.error(f"Erreur lors de l'arrêt du flux webcam: {str(e)}")
    
    def set_frame_callback(self, callback: Callable[[np.ndarray], None]) -> None:
        """Définit un callback pour les nouvelles images
        
        Args:
            callback: Fonction à appeler avec chaque nouvelle image
        """
        self.frame_callback = callback
    
    def set_custom_processor(self, processor: Callable[[np.ndarray], np.ndarray]) -> None:
        """Définit un processeur d'image personnalisé
        
        Args:
            processor: Fonction qui prend une image et retourne une image modifiée
        """
        self.custom_processor = processor
    
    def clear_custom_processor(self) -> None:
        """Supprime le processeur d'image personnalisé"""
        self.custom_processor = None
    
    async def _capture_loop(self) -> None:
        """Boucle de capture d'images de la webcam"""
        frames_without_success = 0
        max_frames_without_success = 10
        
        while self.running and self.camera and self.camera.isOpened():
            try:
                # Récupérer une image de la webcam
                ret, frame = self.camera.read()
                
                if ret and frame is not None:
                    # Réinitialiser le compteur d'erreurs
                    frames_without_success = 0
                    
                    # Appliquer le processeur personnalisé si défini
                    if self.custom_processor:
                        try:
                            frame = self.custom_processor(frame)
                        except Exception as e:
                            self.logger.error(f"Erreur dans le processeur d'image: {str(e)}")
                    
                    # Stocker l'image courante
                    self.current_frame = frame
                    
                    # Appeler le callback si défini
                    if self.frame_callback:
                        self.frame_callback(frame)
                    
                    # Envoyer l'image à tous les clients WebSocket connectés
                    if self.active_connections:
                        await self._broadcast_frame(frame)
                else:
                    frames_without_success += 1
                    self.logger.warning(f"Échec de capture d'image ({frames_without_success}/{max_frames_without_success})")
                    
                    # Si trop d'échecs consécutifs, recréer la connexion caméra
                    if frames_without_success >= max_frames_without_success:
                        self.logger.warning("Tentative de réinitialisation de la webcam")
                        if self.camera:
                            self.camera.release()
                        
                        # Réessayer d'ouvrir la webcam
                        self.camera = cv2.VideoCapture(self.camera_index)
                        if not self.camera.isOpened():
                            self.logger.error("Impossible de réinitialiser la webcam")
                            # Si ça ne fonctionne pas, arrêter la boucle
                            self.running = False
                            break
                        
                        # Réinitialiser le compteur d'erreurs
                        frames_without_success = 0
            
            except Exception as e:
                self.logger.error(f"Erreur lors de la capture d'image webcam: {str(e)}")
                # Petite pause en cas d'erreur pour éviter de saturer le CPU
                await asyncio.sleep(0.5)
                continue
            
            # Attendre avant la prochaine capture
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
        
        self.logger.info("Boucle de capture terminée")
    
    def get_current_frame(self) -> Optional[np.ndarray]:
        """Récupère l'image courante
        
        Returns:
            Image courante ou None si pas disponible
        """
        return self.current_frame
    
    def get_jpeg_frame(self) -> Optional[bytes]:
        """Récupère l'image courante au format JPEG
        
        Returns:
            Image JPEG ou None si pas disponible
        """
        if self.current_frame is None:
            # Créer une image par défaut
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(frame, "Webcam non disponible", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        else:
            frame = self.current_frame
            
        try:
            # Convertir l'image en JPEG
            _, jpeg_frame = cv2.imencode('.jpg', frame)
            return jpeg_frame.tobytes()
        except Exception as e:
            self.logger.error(f"Erreur lors de la conversion en JPEG: {str(e)}")
            return None
    
    async def generate_frames(self):
        """Générateur de frames pour le streaming HTTP"""
        while True:
            jpeg_frame = self.get_jpeg_frame()
            
            if jpeg_frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg_frame + b'\r\n')
            
            # Attendre avant la prochaine frame
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
    
    def get_stream(self):
        """Crée un générateur de frames pour le streaming HTTP
        
        Returns:
            Générateur de frames pour StreamingResponse
        """
        return self.generate_frames()
    
    async def connect(self, websocket: WebSocket) -> None:
        """Accepte une connexion WebSocket et l'ajoute à la liste des connexions actives
        
        Args:
            websocket: Connexion WebSocket à accepter
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        self.logger.info(f"Nouvelle connexion WebSocket pour le flux vidéo (total: {len(self.active_connections)})")
    
    async def disconnect(self, websocket: WebSocket) -> None:
        """Supprime une connexion WebSocket de la liste des connexions actives
        
        Args:
            websocket: Connexion WebSocket à supprimer
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.logger.info(f"Connexion WebSocket fermée (total: {len(self.active_connections)})")
    
    async def _broadcast_frame(self, frame: np.ndarray) -> None:
        """Diffuse une image à tous les clients WebSocket connectés
        
        Args:
            frame: Image à diffuser
        """
        if not self.active_connections:
            return
            
        try:
            # Convertir l'image en JPEG
            _, jpeg_data = cv2.imencode('.jpg', frame)
            jpeg_bytes = jpeg_data.tobytes()
            
            # Envoyer l'image à tous les clients
            for websocket in self.active_connections.copy():
                try:
                    await websocket.send_bytes(jpeg_bytes)
                except Exception as e:
                    self.logger.error(f"Erreur lors de l'envoi à un client WebSocket: {str(e)}")
                    await self.disconnect(websocket)
        except Exception as e:
            self.logger.error(f"Erreur lors de la diffusion de l'image: {str(e)}")
    
    async def get_frame(self) -> Optional[np.ndarray]:
        """Capture et retourne une seule image de la webcam
        
        Returns:
            Image capturée ou None en cas d'erreur
        """
        # Si la webcam n'est pas déjà en cours d'exécution, l'ouvrir temporairement
        if not self.running:
            try:
                temp_camera = cv2.VideoCapture(self.camera_index)
                if not temp_camera.isOpened():
                    self.logger.error("Impossible d'accéder à la webcam pour une seule image")
                    return None
                
                ret, frame = temp_camera.read()
                temp_camera.release()
                
                if ret and frame is not None:
                    return frame
                else:
                    self.logger.error("Échec de capture d'une seule image")
                    return None
            except Exception as e:
                self.logger.error(f"Erreur lors de la capture d'une seule image: {str(e)}")
                return None
        else:
            # Si la webcam est déjà en cours d'exécution, utiliser l'image courante
            return self.get_current_frame()