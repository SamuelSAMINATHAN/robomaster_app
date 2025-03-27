import json
import asyncio
from typing import List, Dict, Any, Optional, Set
import logging
from fastapi import WebSocket, WebSocketDisconnect

class WebSocketManager:
    """Gestionnaire de connexions WebSocket"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.logger = logging.getLogger("websocket_manager")
    
    async def connect(self, websocket: WebSocket) -> None:
        """Accepte une connexion WebSocket
        
        Args:
            websocket: Connexion WebSocket à accepter
        """
        await websocket.accept()
        self.active_connections.add(websocket)
        self.logger.info(f"Nouvelle connexion WebSocket (total: {len(self.active_connections)})")
    
    async def disconnect(self, websocket: WebSocket) -> None:
        """Déconnecte une connexion WebSocket
        
        Args:
            websocket: Connexion WebSocket à déconnecter
        """
        self.active_connections.discard(websocket)
        self.logger.info(f"Connexion WebSocket fermée (total: {len(self.active_connections)})")
    
    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket) -> None:
        """Envoie un message à une connexion spécifique
        
        Args:
            message: Message à envoyer
            websocket: Connexion WebSocket cible
        """
        await websocket.send_text(json.dumps(message))