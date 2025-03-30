/**
 * @license
 * Blocs Blockly personnalisés pour les objets de données du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Créer une variable
 * Note: Ce bloc est natif à Blockly, nous n'avons pas besoin de le définir
 */

/**
 * Bloc 2: Créer une liste
 * Note: Nous utilisons le bloc Array natif de Blockly, mais nous ajoutons un bloc spécifique
 */
Blockly.Blocks['data_create_list'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Créer une liste");
    this.appendValueInput("LENGTH")
        .setCheck("Number")
        .appendField("de longueur");
    this.appendValueInput("DEFAULT")
        .appendField("avec valeur par défaut");
    this.setOutput(true, "Array");
    this.setColour(260);
    this.setTooltip("Crée une liste de la longueur spécifiée avec une valeur par défaut.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 3: Créer un régulateur PID
 */
Blockly.Blocks['data_create_pid_controller'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Créer un régulateur PID");
    this.appendValueInput("KP")
        .setCheck("Number")
        .appendField("P (proportionnel)");
    this.appendValueInput("KI")
        .setCheck("Number")
        .appendField("I (intégral)");
    this.appendValueInput("KD")
        .setCheck("Number")
        .appendField("D (dérivatif)");
    this.setOutput(true, "PID");
    this.setColour(260);
    this.setTooltip("Crée un objet de régulation PID (Proportionnel–Intégral–Dérivatif) configurable pour gérer des boucles de contrôle.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc: Mettre à jour la variable de régulation PID
 */
Blockly.Blocks['data_pid_update'] = {
  init: function() {
    this.appendValueInput("PID")
        .setCheck("PID")
        .appendField("Mettre à jour le régulateur PID");
    this.appendValueInput("ERROR")
        .setCheck("Number")
        .appendField("avec l'erreur");
    this.setOutput(true, "Number");
    this.setColour(260);
    this.setTooltip("Calcule et renvoie la sortie du régulateur PID en fonction de l'erreur fournie.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc: Accéder à un élément de la liste
 */
Blockly.Blocks['data_list_get_item'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("dans la liste");
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("obtenir l'élément à l'index");
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip("Accède à un élément spécifique dans une liste par son index (commence à 0).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc: Modifier un élément de la liste
 */
Blockly.Blocks['data_list_set_item'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("dans la liste");
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("modifier l'élément à l'index");
    this.appendValueInput("VALUE")
        .appendField("à la valeur");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("Modifie un élément spécifique dans une liste à un index donné (commence à 0).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc: Longueur de la liste
 */
Blockly.Blocks['data_list_length'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("longueur de la liste");
    this.setOutput(true, "Number");
    this.setColour(260);
    this.setTooltip("Renvoie le nombre d'éléments dans la liste.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc: Ajouter un élément à la liste
 */
Blockly.Blocks['data_list_append'] = {
  init: function() {
    this.appendValueInput("LIST")
        .setCheck("Array")
        .appendField("à la liste");
    this.appendValueInput("VALUE")
        .appendField("ajouter l'élément");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("Ajoute un nouvel élément à la fin de la liste.");
    this.setHelpUrl("");
  }
}; 