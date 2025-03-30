/**
 * @license
 * Générateurs Python pour les blocs d'objets de données du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 2: Créer une liste
 */
Blockly.Python['data_create_list'] = function(block) {
  const length = Blockly.Python.valueToCode(block, 'LENGTH', Blockly.Python.ORDER_ATOMIC) || '0';
  const defaultValue = Blockly.Python.valueToCode(block, 'DEFAULT', Blockly.Python.ORDER_ATOMIC) || 'None';
  
  // Crée une liste Python de la longueur spécifiée avec la valeur par défaut
  const code = `[${defaultValue}] * ${length}`;
  return [code, Blockly.Python.ORDER_ATOMIC];
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
    
    def update(self, error, dt=1.0):
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
        return p + i + d
`;
  
  // Crée une instance de la classe PIDController
  const code = `PIDController(${kp}, ${ki}, ${kd})`;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc: Mettre à jour la variable de régulation PID
 */
Blockly.Python['data_pid_update'] = function(block) {
  const pid = Blockly.Python.valueToCode(block, 'PID', Blockly.Python.ORDER_ATOMIC) || 'None';
  const error = Blockly.Python.valueToCode(block, 'ERROR', Blockly.Python.ORDER_ATOMIC) || '0';
  
  // Appelle la méthode update de l'objet PID avec l'erreur fournie
  const code = `${pid}.update(${error})`;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc: Accéder à un élément de la liste
 */
Blockly.Python['data_list_get_item'] = function(block) {
  const list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_ATOMIC) || '[]';
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '0';
  
  // Accède à un élément spécifique dans une liste par son index
  const code = `${list}[${index}]`;
  return [code, Blockly.Python.ORDER_MEMBER];
};

/**
 * Bloc: Modifier un élément de la liste
 */
Blockly.Python['data_list_set_item'] = function(block) {
  const list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_ATOMIC) || '[]';
  const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '0';
  const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || 'None';
  
  // Modifie un élément spécifique dans une liste à un index donné
  return `${list}[${index}] = ${value}\n`;
};

/**
 * Bloc: Longueur de la liste
 */
Blockly.Python['data_list_length'] = function(block) {
  const list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_ATOMIC) || '[]';
  
  // Renvoie le nombre d'éléments dans la liste
  const code = `len(${list})`;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc: Ajouter un élément à la liste
 */
Blockly.Python['data_list_append'] = function(block) {
  const list = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_ATOMIC) || '[]';
  const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || 'None';
  
  // Ajoute un nouvel élément à la fin de la liste
  return `${list}.append(${value})\n`;
}; 