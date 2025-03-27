from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ExecutionRequest(BaseModel):
    """Requête d'exécution de code Python"""
    code: str = Field(..., description="Code Python à exécuter")
    script_name: Optional[str] = Field(None, description="Nom du script (optionnel)")

class ExecutionResponse(BaseModel):
    """Réponse à une requête d'exécution"""
    success: bool = Field(..., description="Indique si l'exécution a réussi")
    message: str = Field("", description="Message d'information ou d'erreur")
    logs: List[str] = Field(default_factory=list, description="Logs d'exécution")

class RobotStatus(BaseModel):
    """État du robot"""
    connected: bool = Field(..., description="Indique si le robot est connecté")
    battery_level: int = Field(0, description="Niveau de batterie (0-100)")
    executing: bool = Field(False, description="Indique si un script est en cours d'exécution")

class ScriptInfo(BaseModel):
    """Informations sur un script Blockly"""
    id: str = Field(..., description="Identifiant unique du script")
    name: str = Field(..., description="Nom du script")
    created_at: str = Field(..., description="Date de création (format ISO)")
    updated_at: str = Field(..., description="Date de dernière modification (format ISO)")

class ScriptContent(BaseModel):
    """Contenu d'un script Blockly"""
    id: str = Field(..., description="Identifiant unique du script")
    name: str = Field(..., description="Nom du script")
    blockly_xml: str = Field(..., description="Contenu XML Blockly")
    python_code: str = Field(..., description="Code Python généré")
    created_at: str = Field(..., description="Date de création (format ISO)")
    updated_at: str = Field(..., description="Date de dernière modification (format ISO)")

class SaveScriptRequest(BaseModel):
    """Requête de sauvegarde d'un script"""
    id: Optional[str] = Field(None, description="Identifiant unique du script (null pour nouveau)")
    name: str = Field(..., description="Nom du script")
    blockly_xml: str = Field(..., description="Contenu XML Blockly")
    python_code: str = Field(..., description="Code Python généré")

class WebSocketMessage(BaseModel):
    """Message WebSocket générique"""
    type: str = Field(..., description="Type de message")
    data: Dict[str, Any] = Field(default_factory=dict, description="Données du message")

class LogMessage(BaseModel):
    """Message de log"""
    level: str = Field(..., description="Niveau de log (info, warning, error)")
    message: str = Field(..., description="Message de log")
    timestamp: str = Field(..., description="Horodatage du message")