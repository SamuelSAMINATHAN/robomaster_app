/**
 * Blocks pour l'initialisation du robot
 */

import * as Blockly from 'blockly';

// Bloc d'initialisation du robot
Blockly.Blocks['robomaster_init'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Initialiser le robot");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Initialise la connexion avec le robot");
    this.setHelpUrl("");
  }
};

// Bloc pour fermer la connexion avec le robot
Blockly.Blocks['robomaster_close'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Fermer la connexion");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Ferme la connexion avec le robot");
    this.setHelpUrl("");
  }
};