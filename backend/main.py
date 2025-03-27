from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import asyncio
import json
from typing import List, Dict, Any

# Import des modules locaux
from robot_client import RobotClient
from executor import PythonExecutor
from stream import VideoStream
from logs import LogCapture
from schemas import ExecutionRequest, RobotStatus
from translator import translate_blockly_code
from config import settings

# Création de l'application FastAPI
app = FastAPI(title="RoboMaster App Backend")

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez l'origine exacte
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation des composants
robot_client = RobotClient()
executor = PythonExecutor(robot_client)
video_stream = VideoStream(robot_client)
log_capture = LogCapture()

# Liste des connexions WebSocket actives
active_connections: List[WebSocket] = []

# État global du robot
robot_state = {
    "connected": False,
    "battery_level": 0,
    "executing": False,
}

# Routes API
@app.get("/")
async def read_root():
    return {"status": "ok", "message": "RoboMaster App Backend"}

@app.get("/status")
async def get_status():
    return RobotStatus(
        connected=robot_state["connected"],
        battery_level=robot_state["battery_level"],
        executing=robot_state["executing"]
    )

@app.get("/video_feed")
async def video_feed():
    if not robot_state["connected"]:
        raise HTTPException(status_code=400, detail="Robot not connected")
    
    return StreamingResponse(
        video_stream.get_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.post("/connect")
async def connect_robot():
    try:
        await robot_client.connect()
        robot_state["connected"] = True
        robot_state["battery_level"] = await robot_client.get_battery_level()
        # Démarrer le flux vidéo
        await video_stream.start()
        return {"status": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")

@app.post("/disconnect")
async def disconnect_robot():
    try:
        await robot_client.disconnect()
        robot_state["connected"] = False
        # Arrêter le flux vidéo
        await video_stream.stop()
        return {"status": "disconnected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")

@app.post("/execute")
async def execute_code(request: ExecutionRequest):
    if not robot_state["connected"]:
        raise HTTPException(status_code=400, detail="Robot not connected")
    
    if robot_state["executing"]:
        raise HTTPException(status_code=400, detail="Code execution already in progress")
    
    try:
        robot_state["executing"] = True
        
        # Traduire le code Blockly en Python si nécessaire
        if request.code_type == "blockly":
            python_code = translate_blockly_code(request.code)
        else:
            python_code = request.code
        
        # Exécuter le code
        with log_capture:
            result = await executor.execute(python_code)
        
        robot_state["executing"] = False
        return {
            "status": "success",
            "result": result,
            "logs": log_capture.get_logs()
        }
    except Exception as e:
        robot_state["executing"] = False
        return {
            "status": "error",
            "error": str(e),
            "logs": log_capture.get_logs()
        }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Attendre les messages du client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Traiter les différents types de messages
            if message.get("type") == "command":
                # Traiter les commandes directes au robot
                if not robot_state["connected"]:
                    await websocket.send_json({"status": "error", "message": "Robot not connected"})
                else:
                    try:
                        result = await robot_client.send_command(message.get("command"))
                        await websocket.send_json({"status": "success", "result": result})
                    except Exception as e:
                        await websocket.send_json({"status": "error", "message": str(e)})
            
            # Autres types de messages peuvent être ajoutés ici
    
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception as e:
        if websocket in active_connections:
            active_connections.remove(websocket)

# Fonction pour diffuser les mises à jour d'état à tous les clients connectés
async def broadcast_state():
    while True:
        if robot_state["connected"]:
            try:
                # Mettre à jour l'état du robot
                robot_state["battery_level"] = await robot_client.get_battery_level()
                
                # Diffuser l'état à tous les clients
                for connection in active_connections:
                    await connection.send_json({
                        "type": "state_update",
                        "data": robot_state
                    })
            except Exception as e:
                print(f"Error updating robot state: {e}")
        
        # Attendre avant la prochaine mise à jour
        await asyncio.sleep(5)

# Démarrer la tâche de diffusion d'état en arrière-plan
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_state())

@app.on_event("shutdown")
async def shutdown_event():
    if robot_state["connected"]:
        await robot_client.disconnect()
        await video_stream.stop()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
