/**
 * Générateur Python pour les blocs d'initialisation du robot
 */

import * as Blockly from 'blockly/core';
import 'blockly/python';

Blockly.Python['robot_init'] = function(block) {
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