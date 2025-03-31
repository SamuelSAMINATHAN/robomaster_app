import sys
import io
import traceback
import logging
import asyncio
from typing import Dict, Any, List, Callable, Optional
from contextlib import redirect_stdout, redirect_stderr
import time
from concurrent.futures import ThreadPoolExecutor

from robot_client import RobotClient
from translator import translate_blockly_code

class PythonExecutor:
    """Exécuteur de code Python pour les scripts Blockly"""
    
    def __init__(self, robot_client: RobotClient):
        self.robot_client = robot_client
        self.current_execution = None
        self.logger = logging.getLogger("python_executor")
        self.log_callback = None
        self.thread_pool = ThreadPoolExecutor(max_workers=1)
        self.timeout = 30  # Timeout en secondes pour l'exécution du code
        self._forbidden_imports = {
            'os', 'sys', 'subprocess', 'socket', 'threading', 'multiprocessing',
            'ctypes', 'cffi', 'cryptography', 'hashlib', 'random', 'secrets'
        }
    
    def set_log_callback(self, callback: Callable[[str], None]) -> None:
        """Définit un callback pour les logs d'exécution"""
        self.log_callback = callback
    
    def _check_forbidden_imports(self, code: str) -> List[str]:
        """Vérifie si le code contient des imports interdits"""
        forbidden_found = []
        for line in code.split('\n'):
            line = line.strip()
            if line.startswith('import '):
                module = line.split()[1].split('.')[0]
                if module in self._forbidden_imports:
                    forbidden_found.append(module)
            elif line.startswith('from '):
                module = line.split()[1].split('.')[0]
                if module in self._forbidden_imports:
                    forbidden_found.append(module)
        return forbidden_found
    
    async def execute_code(self, code: str) -> Dict[str, Any]:
        """Exécute du code Python généré par Blockly
        
        Args:
            code: Code Python à exécuter
            
        Returns:
            Résultat de l'exécution avec statut et logs
        """
        if not self.robot_client.is_connected():
            return {
                "success": False,
                "message": "Le robot n'est pas connecté",
                "logs": ["Erreur: Le robot n'est pas connecté. Veuillez vous connecter avant d'exécuter un script."]
            }
        
        # Vérifier les imports interdits
        forbidden_imports = self._check_forbidden_imports(code)
        if forbidden_imports:
            return {
                "success": False,
                "message": "Imports interdits détectés",
                "logs": [f"Erreur: Les imports suivants sont interdits pour des raisons de sécurité: {', '.join(forbidden_imports)}"]
            }
        
        # Préparer la capture des sorties
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        logs = []
        
        # Préparer le code avec les imports nécessaires
        prepared_code = translate_blockly_code(code)
        
        try:
            # Créer une tâche asynchrone pour l'exécution avec timeout
            async def execute_with_timeout():
                # Capturer stdout et stderr
                with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                    # Créer un environnement d'exécution avec accès au robot
                    exec_globals = {
                        "robot": self.robot_client,
                        "print": self._create_print_function(logs),
                        "__name__": "__main__",
                        "time": time,
                        "asyncio": asyncio
                    }
                    
                    # Exécuter le code dans un thread séparé
                    loop = asyncio.get_event_loop()
                    await loop.run_in_executor(
                        self.thread_pool,
                        lambda: exec(prepared_code, exec_globals)
                    )
            
            # Exécuter avec timeout
            try:
                await asyncio.wait_for(execute_with_timeout(), timeout=self.timeout)
            except asyncio.TimeoutError:
                return {
                    "success": False,
                    "message": f"Timeout après {self.timeout} secondes",
                    "logs": logs + [f"Erreur: Le script a dépassé la limite de temps de {self.timeout} secondes"]
                }
            
            # Récupérer les sorties
            stdout_output = stdout_capture.getvalue()
            stderr_output = stderr_capture.getvalue()
            
            if stdout_output:
                logs.append(f"Sortie standard:\n{stdout_output}")
            
            if stderr_output:
                logs.append(f"Erreurs:\n{stderr_output}")
            
            return {
                "success": True,
                "message": "Exécution réussie",
                "logs": logs
            }
            
        except Exception as e:
            # Capturer l'exception
            error_msg = f"Erreur: {str(e)}"
            tb = traceback.format_exc()
            
            self.logger.error(f"Erreur lors de l'exécution du code: {error_msg}\n{tb}")
            
            return {
                "success": False,
                "message": error_msg,
                "logs": logs + [error_msg, f"Détails:\n{tb}"]
            }
    
    def _create_print_function(self, logs_list: List[str]) -> Callable:
        """Crée une fonction print personnalisée qui capture les sorties
        
        Args:
            logs_list: Liste où stocker les logs
            
        Returns:
            Fonction print personnalisée
        """
        def custom_print(*args, **kwargs):
            # Utiliser la même logique que print() pour formater la sortie
            output = io.StringIO()
            print(*args, file=output, **kwargs)
            log_line = output.getvalue().rstrip()
            
            # Ajouter à la liste des logs
            logs_list.append(log_line)
            
            # Appeler le callback si défini
            if self.log_callback:
                self.log_callback(log_line)
            
            # Afficher également dans la console pour le débogage
            print(*args, **kwargs)
            
        return custom_print
    
    def is_executing(self) -> bool:
        """Vérifie si un script est en cours d'exécution"""
        return self.current_execution is not None and not self.current_execution.done()
    
    async def stop_execution(self) -> None:
        """Arrête l'exécution en cours du script"""
        if self.current_execution and not self.current_execution.done():
            self.current_execution.cancel()
            try:
                await self.current_execution
            except asyncio.CancelledError:
                pass
            self.current_execution = None