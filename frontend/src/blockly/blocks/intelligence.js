/**
 * @license
 * Blocs Blockly personnalisés pour les fonctionnalités d'intelligence du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Activer/Désactiver l'identification d'un élément
 */
Blockly.Blocks['vision_enable_detection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["activer", "enable"],
          ["désactiver", "disable"]
        ]), "ACTION")
        .appendField("l'identification de")
        .appendField(new Blockly.FieldDropdown([
          ["marqueurs visuels", "marker"],
          ["gestes", "gesture"],
          ["personnes", "person"],
          ["robots EP Core", "robot"]
        ]), "ELEMENT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Active ou désactive l'identification d'un type d'objet.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 2: Activer/Désactiver l'identification de lignes
 */
Blockly.Blocks['vision_enable_line_detection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["activer", "enable"],
          ["désactiver", "disable"]
        ]), "ACTION")
        .appendField("l'identification de lignes");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Active ou désactive la reconnaissance des lignes tracées.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 3: Activer/Désactiver la reconnaissance des applaudissements
 */
Blockly.Blocks['sound_enable_clap_detection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["activer", "enable"],
          ["désactiver", "disable"]
        ]), "ACTION")
        .appendField("l'identification des applaudissements");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Permet la détection sonore des applaudissements.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 4: Définir la distance d'identification des marqueurs visuels
 */
Blockly.Blocks['vision_set_marker_detection_distance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la distance d'identification des marqueurs visuels à")
        .appendField(new Blockly.FieldNumber(1, 0.5, 3, 0.1), "DISTANCE")
        .appendField("m");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Fixe la distance maximale pour reconnaître un marqueur visuel.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 5: Définir la couleur d'identification des marqueurs visuels
 */
Blockly.Blocks['vision_set_marker_detection_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir")
        .appendField(new Blockly.FieldDropdown([
          ["rouge", "red"],
          ["bleu", "blue"],
          ["vert", "green"]
        ]), "COLOR")
        .appendField("comme couleur d'identification du marqueur visuel");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Spécifie quelle couleur de marqueur le robot doit détecter.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 6: Définir la couleur d'identification des lignes
 */
Blockly.Blocks['vision_set_line_detection_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir")
        .appendField(new Blockly.FieldDropdown([
          ["rouge", "red"],
          ["bleu", "blue"],
          ["vert", "green"]
        ]), "COLOR")
        .appendField("comme couleur d'identification de la ligne");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Définit la couleur des lignes à reconnaître.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 7: Définir la valeur d'exposition
 */
Blockly.Blocks['vision_set_exposure_value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Définir la valeur d'exposition à")
        .appendField(new Blockly.FieldDropdown([
          ["faible", "low"],
          ["normale", "normal"],
          ["élevée", "high"]
        ]), "LEVEL");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Réglage de la sensibilité de la caméra à la lumière.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 8: Quand le robot identifie [élément]
 */
Blockly.Blocks['vision_when_detect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Quand le robot identifie")
        .appendField(new Blockly.FieldDropdown([
          ["personnes", "person"],
          ["robots EP Core", "robot"],
          ["gestes", "gesture"],
          ["applaudissements", "sound_applause"],
          ["marqueurs visuels", "marker"]
        ]), "ELEMENT");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setColour(230);
    this.setTooltip("Déclenche une action lorsqu'un élément est détecté.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 9: [Élément] identifié(e)
 */
Blockly.Blocks['vision_is_detected'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["personnes", "person"],
          ["gestes", "gesture"],
          ["applaudissements", "sound_applause"],
          ["marqueurs visuels", "marker"]
        ]), "ELEMENT")
        .appendField("identifié(e)");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("Condition booléenne vraie si l'objet a été identifié.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 10: Attendre jusqu'à l'identification de [élément]
 */
Blockly.Blocks['vision_wait_for_detection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Attendre jusqu'à l'identification de")
        .appendField(new Blockly.FieldDropdown([
          ["personnes", "person"],
          ["gestes", "gesture"],
          ["applaudissements", "sound_applause"],
          ["marqueurs visuels", "marker"]
        ]), "ELEMENT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Met en pause l'exécution jusqu'à détection de l'élément.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 11: Infos sur le marqueur visuel identifié
 */
Blockly.Blocks['vision_marker_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Infos sur le marqueur visuel identifié");
    this.setOutput(true, "Array");
    this.setColour(230);
    this.setTooltip("Récupère des données (id, position, taille) du marqueur.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 12: Infos sur personnes identifiées
 */
Blockly.Blocks['vision_person_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Infos sur personnes identifiées");
    this.setOutput(true, "Array");
    this.setColour(230);
    this.setTooltip("Donne les infos (nombre, coordonnées, taille) des personnes ou robots EP Core détectés.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 13: Infos sur le geste identifié
 */
Blockly.Blocks['vision_gesture_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Infos sur le geste identifié");
    this.setOutput(true, "Array");
    this.setColour(230);
    this.setTooltip("Renvoie l'index, la position et la taille du geste détecté.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 14: Infos sur la ligne identifiée
 */
Blockly.Blocks['vision_line_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Infos sur la ligne identifiée");
    this.setOutput(true, "Array");
    this.setColour(230);
    this.setTooltip("Donne les paramètres d'une ligne unique (position, angle, courbure).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 15: Infos sur les lignes identifiées
 */
Blockly.Blocks['vision_lines_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Infos sur les lignes identifiées");
    this.setOutput(true, "Array");
    this.setColour(230);
    this.setTooltip("Fournit les infos sur plusieurs lignes détectées (X, Y, angle, courbure…).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 16: Luminosité actuelle
 */
Blockly.Blocks['vision_brightness'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Luminosité actuelle");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Donne la luminosité ambiante perçue par la caméra.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 17: Position de visée
 */
Blockly.Blocks['vision_target_position'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Position de visée")
        .appendField(new Blockly.FieldDropdown([
          ["X", "x"],
          ["Y", "y"]
        ]), "AXIS");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Renvoie la position actuelle de la visée du robot (X ou Y).");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 19: Quand le robot identifie [nombre] applaudissements
 */
Blockly.Blocks['sound_when_detect_claps'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Quand le robot identifie")
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"]
        ]), "COUNT")
        .appendField("applaudissements");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setColour(230);
    this.setTooltip("Déclenche un événement en fonction du nombre d'applaudissements détectés.");
    this.setHelpUrl("");
  }
};

/**
 * Bloc 20: [nombre] applaudissements identifié(e)
 */
Blockly.Blocks['sound_is_claps_detected'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"]
        ]), "COUNT")
        .appendField("applaudissements identifié(e)");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("Condition vraie si le bon nombre d'applaudissements a été détecté.");
    this.setHelpUrl("");
  }
}; 