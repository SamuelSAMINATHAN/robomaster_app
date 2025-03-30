/**
 * @license
 * Générateurs Python pour les blocs d'intelligence du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Activer/Désactiver l'identification d'un élément
 */
Blockly.Python['vision_enable_detection'] = function(block) {
  const action = block.getFieldValue('ACTION');
  const element = block.getFieldValue('ELEMENT');
  
  let code = '';
  if (action === 'enable') {
    code = `vision.sub_detect_info(name="${element}")\n`;
  } else {
    code = `vision.unsub_detect_info(name="${element}")\n`;
  }
  
  return code;
};

/**
 * Bloc 2: Activer/Désactiver l'identification de lignes
 */
Blockly.Python['vision_enable_line_detection'] = function(block) {
  const action = block.getFieldValue('ACTION');
  
  let code = '';
  if (action === 'enable') {
    code = `vision.sub_detect_info(name="line")\n`;
  } else {
    code = `vision.unsub_detect_info(name="line")\n`;
  }
  
  return code;
};

/**
 * Bloc 3: Activer/Désactiver la reconnaissance des applaudissements
 */
Blockly.Python['sound_enable_clap_detection'] = function(block) {
  const action = block.getFieldValue('ACTION');
  
  let code = '';
  if (action === 'enable') {
    code = `sound.enable_sound_recognition(sound_detection_on=True)\n`;
  } else {
    code = `sound.enable_sound_recognition(sound_detection_on=False)\n`;
  }
  
  return code;
};

/**
 * Bloc 4: Définir la distance d'identification des marqueurs visuels
 */
Blockly.Python['vision_set_marker_detection_distance'] = function(block) {
  const distance = block.getFieldValue('DISTANCE');
  
  // La distance est convertie en mètres
  return `vision.set_marker_detection_distance(distance=${distance})\n`;
};

/**
 * Bloc 5: Définir la couleur d'identification des marqueurs visuels
 */
Blockly.Python['vision_set_marker_detection_color'] = function(block) {
  const color = block.getFieldValue('COLOR');
  
  return `vision.set_marker_detection_color(color="${color}")\n`;
};

/**
 * Bloc 6: Définir la couleur d'identification des lignes
 */
Blockly.Python['vision_set_line_detection_color'] = function(block) {
  const color = block.getFieldValue('COLOR');
  
  return `vision.set_line_recognition_color(color="${color}")\n`;
};

/**
 * Bloc 7: Définir la valeur d'exposition
 */
Blockly.Python['vision_set_exposure_value'] = function(block) {
  const level = block.getFieldValue('LEVEL');
  
  // Convertir level en valeur d'exposition pour la caméra
  let value = 0;
  if (level === 'low') {
    value = -1;
  } else if (level === 'normal') {
    value = 0;
  } else if (level === 'high') {
    value = 1;
  }
  
  return `camera.set_ev(value=${value})\n`;
};

/**
 * Bloc 8: Quand le robot identifie [élément]
 */
Blockly.Python['vision_when_detect'] = function(block) {
  const element = block.getFieldValue('ELEMENT');
  const statements = Blockly.Python.statementToCode(block, 'DO');
  
  let eventName = '';
  if (element === 'sound_applause') {
    eventName = 'sound_applause_event';
  } else {
    eventName = `vision_${element}_event`;
  }
  
  // Créer une fonction de rappel qui sera exécutée lorsque l'élément est détecté
  let code = `\ndef ${eventName}_callback(info):\n`;
  if (statements) {
    const indentedStatements = Blockly.Python.prefixLines(statements, Blockly.Python.INDENT);
    code += indentedStatements;
  } else {
    code += Blockly.Python.INDENT + 'pass\n';
  }
  
  // Abonner la fonction à l'événement de détection
  if (element === 'sound_applause') {
    code += `\nsound.register_event(sound.applause_event(callback=${eventName}_callback))\n`;
  } else {
    code += `\nvision.sub_detect_info(name="${element}", callback=${eventName}_callback)\n`;
  }
  
  return code;
};

/**
 * Bloc 9: [Élément] identifié(e)
 */
Blockly.Python['vision_is_detected'] = function(block) {
  const element = block.getFieldValue('ELEMENT');
  
  // Crée une variable globale qui sera mise à jour par les événements
  let code = '';
  if (element === 'sound_applause') {
    code = `sound.check_applause_event()`;
  } else {
    code = `vision.check_detection("${element}")`;
  }
  
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 10: Attendre jusqu'à l'identification de [élément]
 */
Blockly.Python['vision_wait_for_detection'] = function(block) {
  const element = block.getFieldValue('ELEMENT');
  
  let code = '';
  if (element === 'sound_applause') {
    code = `sound.wait_for_applause()\n`;
  } else {
    code = `vision.wait_for_detection("${element}")\n`;
  }
  
  return code;
};

/**
 * Bloc 11: Infos sur le marqueur visuel identifié
 */
Blockly.Python['vision_marker_info'] = function(block) {
  // Récupère les informations sur le marqueur détecté
  return [`vision.get_marker_detection_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 12: Infos sur personnes identifiées
 */
Blockly.Python['vision_person_info'] = function(block) {
  // Récupère les informations sur les personnes détectées
  return [`vision.get_person_detection_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 13: Infos sur le geste identifié
 */
Blockly.Python['vision_gesture_info'] = function(block) {
  // Récupère les informations sur le geste détecté
  return [`vision.get_gesture_detection_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 14: Infos sur la ligne identifiée
 */
Blockly.Python['vision_line_info'] = function(block) {
  // Récupère les informations sur la ligne détectée
  return [`vision.get_line_detection_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 15: Infos sur les lignes identifiées
 */
Blockly.Python['vision_lines_info'] = function(block) {
  // Récupère les informations sur toutes les lignes détectées
  return [`vision.get_all_lines_detection_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 16: Luminosité actuelle
 */
Blockly.Python['vision_brightness'] = function(block) {
  // Récupère la luminosité actuelle perçue par la caméra
  return [`camera.get_brightness()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

/**
 * Bloc 17: Position de visée
 */
Blockly.Python['vision_target_position'] = function(block) {
  const axis = block.getFieldValue('AXIS');
  
  // Récupère la position de visée selon l'axe choisi
  return [`gimbal.get_attitude()["${axis}"]`, Blockly.Python.ORDER_MEMBER];
};

/**
 * Bloc 19: Quand le robot identifie [nombre] applaudissements
 */
Blockly.Python['sound_when_detect_claps'] = function(block) {
  const count = block.getFieldValue('COUNT');
  const statements = Blockly.Python.statementToCode(block, 'DO');
  
  // Créer une fonction de rappel pour un nombre spécifique d'applaudissements
  let code = `\ndef on_clap_${count}_callback(info):\n`;
  if (statements) {
    const indentedStatements = Blockly.Python.prefixLines(statements, Blockly.Python.INDENT);
    code += indentedStatements;
  } else {
    code += Blockly.Python.INDENT + 'pass\n';
  }
  
  // Abonner la fonction à l'événement d'applaudissement spécifique
  code += `\nsound.register_event(sound.applause_event(applause_type=${count}, callback=on_clap_${count}_callback))\n`;
  
  return code;
};

/**
 * Bloc 20: [nombre] applaudissements identifié(e)
 */
Blockly.Python['sound_is_claps_detected'] = function(block) {
  const count = block.getFieldValue('COUNT');
  
  // Vérifier si le nombre spécifique d'applaudissements a été détecté
  return [`sound.check_applause_event(applause_type=${count})`, Blockly.Python.ORDER_FUNCTION_CALL];
}; 