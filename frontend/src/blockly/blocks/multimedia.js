/**
 * @license
 * Blocs Blockly personnalisés pour les fonctionnalités multimédia du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Jouer un effet sonore pour [effet]
 */
Blockly.Blocks['media_play_sound_effect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Jouer un effet sonore pour")
        .appendField(new Blockly.FieldDropdown([
          ["impact", "hit"],
          ["tir", "fire"],
          ["scan", "scan"],
          ["identification réussie", "recognize_success"],
          ["rotation de la nacelle", "gimbal_rotate"],
          ["début du compte à rebours", "count_down"]
        ]), "EFFECT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Le robot joue un effet sonore prédéfini, puis continue immédiatement l'exécution des instructions suivantes.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 2: Jouer l'effet sonore [effet] jusqu'à la fin
 */
Blockly.Blocks['media_play_sound_effect_wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Jouer l'effet sonore")
        .appendField(new Blockly.FieldDropdown([
          ["impact", "hit"],
          ["tir", "fire"],
          ["scan", "scan"],
          ["identification réussie", "recognize_success"],
          ["rotation de la nacelle", "gimbal_rotate"],
          ["début du compte à rebours", "count_down"]
        ]), "EFFECT")
        .appendField("jusqu'à la fin");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Le robot joue un effet sonore prédéfini et attend la fin du son avant de poursuivre le programme.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 3: Lire audio personnalisé [fichier]
 */
Blockly.Blocks['media_play_custom_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lire audio personnalisé")
        .appendField(new Blockly.FieldDropdown([
          ["Audio 1", "audio1"],
          ["Audio 2", "audio2"],
          ["Audio 3", "audio3"],
          ["Audio 4", "audio4"],
          ["Audio 5", "audio5"]
        ]), "AUDIO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Joue un fichier audio importé par l'utilisateur. Le robot continue immédiatement l'exécution.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 4: Lire audio personnalisé [fichier] jusqu'à la fin
 */
Blockly.Blocks['media_play_custom_audio_wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lire audio personnalisé")
        .appendField(new Blockly.FieldDropdown([
          ["Audio 1", "audio1"],
          ["Audio 2", "audio2"],
          ["Audio 3", "audio3"],
          ["Audio 4", "audio4"],
          ["Audio 5", "audio5"]
        ]), "AUDIO")
        .appendField("jusqu'à la fin");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Joue un fichier audio importé, et attend la fin de la lecture avant de continuer.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 5: Prendre une photo
 */
Blockly.Blocks['media_take_photo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Prendre une photo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Le robot prend une photo et produit un bruit d'obturateur. L'image est sauvegardée sur la carte SD.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 6: [lancer/arrêter] l'enregistrement vidéo
 */
Blockly.Blocks['media_video_recording'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["lancer", "start"],
          ["arrêter", "stop"]
        ]), "ACTION")
        .appendField("l'enregistrement vidéo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Lance ou arrête un enregistrement vidéo. Les vidéos sont sauvegardées sur la carte SD.");
    this.setHelpUrl("");
  }
}; 