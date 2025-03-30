/**
 * @license
 * Générateurs Python pour les blocs LED du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Convertit une valeur hexadécimale de couleur en composantes RGB
 */
function hexToRgb(hex) {
  // Supprimer le # si présent
  hex = hex.replace('#', '');
  
  // Convertir les valeurs hexadécimales en valeurs décimales
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Bloc 1: Définir la fréquence du flash de la LED
 */
Blockly.Python['led_set_flash_frequency'] = function(block) {
  const zone = block.getFieldValue('ZONE');
  const frequency = Blockly.Python.valueToCode(block, 'FREQUENCY', Blockly.Python.ORDER_ATOMIC) || '1';
  
  // Utilisation du SDK - led.set_led avec l'effet "flash" et la fréquence spécifiée
  const code = `led.set_led(comp="${zone}", r=255, g=255, b=255, effect="flash", freq=${frequency})\n`;
  return code;
};

/**
 * Bloc 2: Définir la couleur et le comportement des LEDs du châssis
 */
Blockly.Python['led_set_chassis'] = function(block) {
  const zone = block.getFieldValue('ZONE');
  const color = block.getFieldValue('COLOR');
  const behavior = block.getFieldValue('BEHAVIOR');
  
  // Conversion de la couleur hexadécimale en RGB
  const rgb = hexToRgb(color);
  
  // Mappage des comportements Blockly aux effets du SDK
  let effect;
  switch (behavior) {
    case 'solid':
      effect = 'on';
      break;
    case 'off':
      effect = 'off';
      break;
    case 'blink':
      effect = 'flash';
      break;
    case 'pulse':
      effect = 'breath';
      break;
    default:
      effect = 'on';
  }
  
  // Utilisation du SDK - led.set_led pour le châssis
  const code = `led.set_led(comp="${zone}", r=${rgb.r}, g=${rgb.g}, b=${rgb.b}, effect="${effect}")\n`;
  return code;
};

/**
 * Bloc 3: Définir la couleur et le comportement des LEDs de la nacelle
 */
Blockly.Python['led_set_gimbal'] = function(block) {
  const zone = block.getFieldValue('ZONE');
  const color = block.getFieldValue('COLOR');
  const behavior = block.getFieldValue('BEHAVIOR');
  
  // Conversion de la couleur hexadécimale en RGB
  const rgb = hexToRgb(color);
  
  // Mappage des comportements Blockly aux effets du SDK
  let effect;
  switch (behavior) {
    case 'solid':
      effect = 'on';
      break;
    case 'off':
      effect = 'off';
      break;
    case 'blink':
      effect = 'flash';
      break;
    case 'pulse':
      effect = 'breath';
      break;
    default:
      effect = 'on';
  }
  
  // Utilisation du SDK - led.set_led pour la nacelle
  const code = `led.set_led(comp="${zone}", r=${rgb.r}, g=${rgb.g}, b=${rgb.b}, effect="${effect}")\n`;
  return code;
};

/**
 * Bloc 4: Définir la séquence de la LED de la nacelle
 */
Blockly.Python['led_set_gimbal_sequence'] = function(block) {
  const zone = block.getFieldValue('ZONE');
  const sequence = block.getFieldValue('SEQUENCE');
  const behavior = block.getFieldValue('BEHAVIOR');
  
  // Mappage des comportements aux effets du SDK
  let effect;
  switch (behavior) {
    case 'solid':
      effect = 'on';
      break;
    case 'blink':
      effect = 'flash';
      break;
    case 'pulse':
      effect = 'breath';
      break;
    default:
      effect = 'on';
  }
  
  // Utilisation du SDK - led.set_gimbal_led avec liste LED
  const code = `led.set_gimbal_led(comp="${zone}", r=255, g=255, b=255, led_list=[${sequence}], effect="${effect}")\n`;
  return code;
};

/**
 * Bloc 5: Éteindre la LED
 */
Blockly.Python['led_turn_off'] = function(block) {
  const zone = block.getFieldValue('ZONE');
  
  // Utilisation du SDK - led.set_led avec l'effet "off"
  const code = `led.set_led(comp="${zone}", r=0, g=0, b=0, effect="off")\n`;
  return code;
};

/**
 * Bloc 6: Allumer / Éteindre la lumière de la trajectoire de tir
 */
Blockly.Python['led_trajectory_light'] = function(block) {
  const state = block.getFieldValue('STATE');
  
  // Utilisation du SDK - blaster.set_led
  const code = `blaster.set_led(enable=${state === 'on'})\n`;
  return code;
}; 