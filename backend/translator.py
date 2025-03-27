import re
import logging
from typing import Optional

def translate_blockly_code(code: str) -> str:
    """
    Prépare le code Python généré par Blockly pour l'exécution
    en ajoutant les imports nécessaires et les appels d'initialisation/fermeture
    
    Args:
        code: Code Python généré par Blockly
        
    Returns:
        Code Python prêt à être exécuté
    """
    logger = logging.getLogger("translator")
    
    # Vérifier si le code est vide
    if not code or code.isspace():
        return "# Code vide\nprint('Aucun code à exécuter')\n"
    
    # Indenter le code utilisateur
    indented_code = "\n".join(["    " + line for line in code.split("\n")])
    
    # Créer le code final avec structure try/finally pour garantir la fermeture
    final_code = f"""# Code généré par Blockly et préparé pour l'exécution

import time

try:
    # Code utilisateur
{indented_code}
    
    # Pause à la fin pour voir les résultats
    print('Exécution terminée avec succès')
    
except Exception as e:
    print(f'Erreur lors de l'exécution: {{str(e)}}')
    
finally:
    # Assurez-vous que le robot est dans un état sûr
    print('Nettoyage des ressources...')
    # Arrêter tous les mouvements
    if robot and robot.is_connected():
        try:
            # Arrêter les mouvements
            robot.move(x=0, y=0, z=0)
            # Éteindre les LEDs
            robot.set_led(0, 0, 0)
        except Exception as cleanup_error:
            print(f'Erreur lors du nettoyage: {{str(cleanup_error)}}')
"""
    
    logger.debug("Code traduit généré")
    return final_code


def extract_python_from_blockly(blockly_xml: str) -> Optional[str]:
    """
    Extrait le code Python à partir du XML Blockly (si disponible)
    
    Args:
        blockly_xml: XML Blockly
        
    Returns:
        Code Python extrait ou None si non trouvé
    """
    # Cette fonction est utile si le XML Blockly contient déjà le code Python généré
    # Dans la plupart des cas, la génération se fait côté client
    
    if not blockly_xml:
        return None
    
    # Recherche d'une balise Python dans le XML (si implémentée)
    python_match = re.search(r'<python>(.*?)</python>', blockly_xml, re.DOTALL)
    if python_match:
        return python_match.group(1)
    
    return None