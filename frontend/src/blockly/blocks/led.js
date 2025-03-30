/**
 * @license
 * Blocs Blockly personnalisés pour contrôler les LED du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Définir la fréquence du flash de la LED
 */
Blockly.Blocks['led_set_flash_frequency'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la fréquence du flash de la LED");
    this.appendDummyInput()
        .appendField("Zone")
        .appendField(new Blockly.FieldDropdown([
          ["toutes", "all"],
          ["avant", "front"],
          ["arrière", "back"],
          ["gauche", "left"],
          ["droite", "right"]
        ]), "ZONE");
    this.appendValueInput("FREQUENCY")
        .setCheck("Number")
        .appendField("Fréquence (Hz)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Définit la fréquence de clignotement des LED en hertz.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 2: Définir la couleur et le comportement des LEDs du châssis
 */
Blockly.Blocks['led_set_chassis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la couleur de la LED")
        .appendField(new Blockly.FieldDropdown([
          ["toutes", "all"],
          ["avant", "front"],
          ["arrière", "back"],
          ["gauche", "left"],
          ["droite", "right"]
        ]), "ZONE")
        .appendField("du châssis à")
        .appendField(new Blockly.FieldColour("#ff0000"), "COLOR")
        .appendField("et le comportement à")
        .appendField(new Blockly.FieldDropdown([
          ["fixe", "solid"],
          ["éteinte", "off"],
          ["clignote lentement", "blink"],
          ["clignote rapidement", "pulse"]
        ]), "BEHAVIOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Définit la couleur et le comportement (fixe ou clignotant) des LEDs du châssis.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 3: Définir la couleur et le comportement des LEDs de la nacelle
 */
Blockly.Blocks['led_set_gimbal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la couleur de la LED")
        .appendField(new Blockly.FieldDropdown([
          ["toutes", "all"],
          ["gauche", "left"],
          ["droite", "right"]
        ]), "ZONE")
        .appendField("de la nacelle à")
        .appendField(new Blockly.FieldColour("#ff0000"), "COLOR")
        .appendField("et le comportement à")
        .appendField(new Blockly.FieldDropdown([
          ["fixe", "solid"],
          ["éteinte", "off"],
          ["clignote lentement", "blink"],
          ["clignote rapidement", "pulse"]
        ]), "BEHAVIOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Définit la couleur et le comportement (fixe ou clignotant) des LEDs de la nacelle (tourelle).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 4: Définir la séquence de la LED de la nacelle
 */
Blockly.Blocks['led_set_gimbal_sequence'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la séquence de la LED")
        .appendField(new Blockly.FieldDropdown([
          ["toutes", "all"],
          ["gauche", "left"],
          ["droite", "right"]
        ]), "ZONE")
        .appendField("de la nacelle à")
        .appendField(new Blockly.FieldNumber(0, 0, 9), "SEQUENCE")
        .appendField("et le comportement à")
        .appendField(new Blockly.FieldDropdown([
          ["fixe", "solid"],
          ["clignote lentement", "blink"],
          ["clignote rapidement", "pulse"]
        ]), "BEHAVIOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Définit une séquence particulière pour l'affichage des LEDs de la nacelle.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 5: Éteindre la LED
 */
Blockly.Blocks['led_turn_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Éteindre la LED")
        .appendField(new Blockly.FieldDropdown([
          ["toutes", "all"],
          ["avant", "front"],
          ["arrière", "back"],
          ["gauche", "left"],
          ["droite", "right"]
        ]), "ZONE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Éteint les LEDs d'une zone spécifique.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 6: Allumer / Éteindre la lumière de la trajectoire de tir
 */
Blockly.Blocks['led_trajectory_light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["allumer", "on"],
          ["éteindre", "off"]
        ]), "STATE")
        .appendField("la lumière de la trajectoire de tir");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Permet d'activer ou de désactiver la lumière de visée (laser ou LED) du canon.");
    this.setHelpUrl("");
  }
}; 