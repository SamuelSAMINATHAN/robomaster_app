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
    
    def start_stream(self) -> bool:
        """Démarre le flux vidéo
        
        Returns:
            True si le flux a démarré avec succès, False sinon
        """
        if not self.robot_client.is_connected():
            self.logger.error("Impossible de démarrer le flux vidéo: robot non connecté")
            return False
        
        try:
            # Récupérer la caméra du robot
            self.camera = self.robot_client.get_camera_stream()
            if not self.camera:
                self.logger.error("Impossible d'accéder à la caméra du robot")
                return False
            
            # Démarrer le flux vidéo
            self.camera.start_video_stream(display=False)
            self.running = True
            
            # Démarrer la boucle de capture dans un thread séparé
            asyncio.create_task(self._capture_loop())
            
            self.logger.info("Flux vidéo démarré avec succès")
            return True
            
        except Exception as e:
            self.logger.error(f"Erreur lors du démarrage du flux vidéo: {str(e)}")
            return False
    
    def stop_stream(self) -> None:
        """Arrête le flux vidéo"""
        self.running = False
        
        if self.camera:
            try:
                self.camera.stop_video_stream()
                self.logger.info("Flux vidéo arrêté")
            except Exception as e:
                self.logger.error(f"Erreur lors de l'arrêt du flux vidéo: {str(e)}")
    
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
        """Boucle de capture d'images"""
        while self.running and self.camera:
            try:
                # Récupérer une image
                frame = self.camera.read_cv2_image(strategy="newest")
                
                if frame is not None:
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
            
            except Exception as e:
                self.logger.error(f"Erreur lors de la capture d'image: {str(e)}")
                # Petite pause en cas d'erreur pour éviter de saturer le CPU
                await asyncio.sleep(0.5)
                continue
            
            # Attendre avant la prochaine capture
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
    
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
            return None
        
        try:
            # Convertir l'image en JPEG
            _, jpeg_frame = cv2.imencode('.jpg', self.current_frame)
            return jpeg_frame.tobytes()
        except Exception as e:
            self.logger.error(f"Erreur lors de la conversion en JPEG: {str(e)}")
            return None
    
    async def generate_frames(self):
        """Générateur de frames pour le streaming HTTP"""
        while self.running:
            jpeg_frame = self.get_jpeg_frame()
            
            if jpeg_frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg_frame + b'\r\n')
            
            # Attendre avant la prochaine frame
            await asyncio.sleep(1.0 / settings.VIDEO_FPS)
    
    def get_stream_response(self) -> StreamingResponse:
        """Crée une réponse de streaming pour FastAPI
        
        Returns:
            Réponse de streaming HTTP
        """
        return StreamingResponse(
            self.generate_frames(),
            media_type="multipart/x-mixed-replace; boundary=frame"
        )