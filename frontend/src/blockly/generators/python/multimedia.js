/**
 * @license
 * Générateurs Python pour les blocs multimédia du RoboMaster
 */

import * as Blockly from 'blockly/core';

/**
 * Bloc 1: Jouer un effet sonore pour [effet]
 */
Blockly.Python['media_play_sound_effect'] = function(block) {
  const effect = block.getFieldValue('EFFECT');
  
  // Utilisation du SDK pour jouer un effet sonore sans attendre
  return `media.play_sound(sound="${effect}", wait_for_complete=False)\n`;
};

/**
 * Bloc 2: Jouer l'effet sonore [effet] jusqu'à la fin
 */
Blockly.Python['media_play_sound_effect_wait'] = function(block) {
  const effect = block.getFieldValue('EFFECT');
  
  // Utilisation du SDK pour jouer un effet sonore en attendant la fin
  return `media.play_sound(sound="${effect}", wait_for_complete=True)\n`;
};

/**
 * Bloc 3: Lire audio personnalisé [fichier]
 */
Blockly.Python['media_play_custom_audio'] = function(block) {
  const audio = block.getFieldValue('AUDIO');
  
  // Utilisation du SDK pour jouer un fichier audio personnalisé sans attendre
  return `media.play_custom_audio(filename="${audio}", wait_for_complete=False)\n`;
};

/**
 * Bloc 4: Lire audio personnalisé [fichier] jusqu'à la fin
 */
Blockly.Python['media_play_custom_audio_wait'] = function(block) {
  const audio = block.getFieldValue('AUDIO');
  
  // Utilisation du SDK pour jouer un fichier audio personnalisé en attendant la fin
  return `media.play_custom_audio(filename="${audio}", wait_for_complete=True)\n`;
};

/**
 * Bloc 5: Prendre une photo
 */
Blockly.Python['media_take_photo'] = function(block) {
  // Utilisation du SDK pour prendre une photo
  return `camera.take_photo()\n`;
};

/**
 * Bloc 6: [lancer/arrêter] l'enregistrement vidéo
 */
Blockly.Python['media_video_recording'] = function(block) {
  const action = block.getFieldValue('ACTION');
  
  // Utilisation du SDK pour démarrer ou arrêter l'enregistrement vidéo
  if (action === 'start') {
    return `camera.start_recording()\n`;
  } else {
    return `camera.stop_recording()\n`;
  }
}; 