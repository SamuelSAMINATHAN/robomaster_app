/**
 * Générateur Python pour les blocs d'initialisation du robot
 */

import * as Blockly from 'blockly/core';

Blockly.Python['robomaster_init'] = function(block) {
  // Code Python pour initialiser le robot
  const code = `# Initialisation du robot
from robomaster import robot
import time

# Créer une instance du robot
ep_robot = robot.Robot()

# Se connecter au robot
ep_robot.initialize(conn_type="sta")

# Attendre que la connexion soit établie
print("Robot initialisé et connecté")
`;
  
  return code;
};

Blockly.Python['robomaster_close'] = function(block) {
  // Code Python pour fermer la connexion
  const code = `# Fermer la connexion avec le robot
ep_robot.close()
print("Connexion fermée")
`;
  
  return code;
}; 