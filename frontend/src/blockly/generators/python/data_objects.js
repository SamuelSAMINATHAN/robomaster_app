/**
 * @license
 * Générateurs Python pour les blocs d'objets de données du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 2: Créer une liste
 */
Blockly.Python['data_create_list'] = function(block) {
  const listName = block.getFieldValue('LIST_NAME');
  const elements = [];
  
  for (let i = 0; i < block.itemCount_; i++) {
    const element = Blockly.Python.valueToCode(block, 'ITEM' + i, Blockly.Python.ORDER_NONE) || 'None';
    elements.push(element);
  }
  
  return `${listName} = [${elements.join(', ')}]\n`;
};

/**
 * Bloc: Définir une liste
 */
Blockly.Python['data_list_define'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const value = block.getFieldValue('VALUE');
  
  if (value === 'liste vide') {
    return `${listName} = []\n`;
  } else {
    return `${listName} = ${value}\n`;
  }
};

/**
 * Bloc: Ajouter un élément à la liste
 */
Blockly.Python['data_list_add'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
  
  return `${listName}.append(${item})\n`;
};

/**
 * Bloc: Supprimer un élément de la liste
 */
Blockly.Python['data_list_remove_item'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
  
  // Génère un code qui supprime l'élément en toute sécurité (avec vérification d'index)
  return `if 0 <= ${index} < len(${listName}):\n  ${listName}.pop(${index})\n`;
};

/**
 * Bloc: Vider la liste
 */
Blockly.Python['data_list_remove_all'] = function(block) {
  const listName = block.getFieldValue('LIST');
  
  return `${listName}.clear()\n`;
};

/**
 * Bloc: Insérer un élément dans la liste
 */
Blockly.Python['data_list_insert'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
  const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
  
  // Génère un code qui insère l'élément en toute sécurité (avec vérification d'index)
  return `if 0 <= ${index} <= len(${listName}):\n  ${listName}.insert(${index}, ${item})\n`;
};

/**
 * Bloc: Remplacer un élément dans la liste
 */
Blockly.Python['data_list_replace'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
  const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
  
  // Génère un code qui remplace l'élément en toute sécurité (avec vérification d'index)
  return `if 0 <= ${index} < len(${listName}):\n  ${listName}[${index}] = ${item}\n`;
};

/**
 * Bloc: Obtenir un élément de la liste
 */
Blockly.Python['data_list_get_item'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
  
  // Génère un code qui récupère l'élément en toute sécurité (avec vérification d'index)
  const code = `(${listName}[${index}] if 0 <= ${index} < len(${listName}) else None)`;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};

/**
 * Bloc: Obtenir les premiers éléments d'une liste
 */
Blockly.Python['data_list_get_first_items'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const count = Blockly.Python.valueToCode(block, 'COUNT', Blockly.Python.ORDER_NONE) || '1';
  
  const code = `${listName}[:${count}]`;
  return [code, Blockly.Python.ORDER_SLICE];
};

/**
 * Bloc: Obtenir la longueur de la liste
 */
Blockly.Python['data_list_length'] = function(block) {
  const listName = block.getFieldValue('LIST');
  
  const code = `len(${listName})`;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc: Vérifier si la liste contient un élément
 */
Blockly.Python['data_list_contains'] = function(block) {
  const listName = block.getFieldValue('LIST');
  const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
  
  const code = `${item} in ${listName}`;
  return [code, Blockly.Python.ORDER_RELATIONAL];
};

/**
 * Bloc: Définir l'erreur du PID
 */
Blockly.Python['data_pid_set_error'] = function(block) {
  const pidName = block.getFieldValue('PID');
  const errorValue = Blockly.Python.valueToCode(block, 'ERROR', Blockly.Python.ORDER_NONE) || '0';
  
  return `${pidName}.set_error(${errorValue})\n`;
};

/**
 * Bloc: Définir les paramètres du PID
 */
Blockly.Python['data_pid_set_parameters'] = function(block) {
  const pidName = block.getFieldValue('PID');
  const kp = Blockly.Python.valueToCode(block, 'KP', Blockly.Python.ORDER_NONE) || '1.0';
  const ki = Blockly.Python.valueToCode(block, 'KI', Blockly.Python.ORDER_NONE) || '0.0';
  const kd = Blockly.Python.valueToCode(block, 'KD', Blockly.Python.ORDER_NONE) || '0.0';
  
  return `${pidName}.set_parameters(kp=${kp}, ki=${ki}, kd=${kd})\n`;
};

/**
 * Bloc: Obtenir la sortie du PID
 */
Blockly.Python['data_pid_get_output'] = function(block) {
  const pidName = block.getFieldValue('PID');
  
  return [`${pidName}.get_output()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 3: Créer un régulateur PID
 */
Blockly.Python['data_create_pid_controller'] = function(block) {
  const kp = Blockly.Python.valueToCode(block, 'KP', Blockly.Python.ORDER_ATOMIC) || '0';
  const ki = Blockly.Python.valueToCode(block, 'KI', Blockly.Python.ORDER_ATOMIC) || '0';
  const kd = Blockly.Python.valueToCode(block, 'KD', Blockly.Python.ORDER_ATOMIC) || '0';
  
  // Crée une classe PID pour gérer la régulation proportionnelle-intégrale-dérivative
  // Nous insérons d'abord la définition de la classe au début du programme si ce n'est pas déjà fait
  Blockly.Python.definitions_['pid_controller'] = `
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.previous_error = 0
        self.integral = 0
    
    def set_error(self, error, dt=1.0):
        # Calcul du terme proportionnel
        p = self.kp * error
        
        # Calcul du terme intégral
        self.integral += error * dt
        i = self.ki * self.integral
        
        # Calcul du terme dérivé
        d = self.kd * (error - self.previous_error) / dt
        
        # Mise à jour de l'erreur précédente
        self.previous_error = error
        
        # Calcul de la sortie PID
        self.output = p + i + d
        return self.output
    
    def set_parameters(self, kp=None, ki=None, kd=None):
        if kp is not None: self.kp = kp
        if ki is not None: self.ki = ki
        if kd is not None: self.kd = kd
    
    def get_output(self):
        return self.output
`;
  
  // Crée une instance de la classe PIDController
  const code = `PIDController(${kp}, ${ki}, ${kd})`;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
}; 