/**
 * Fichier d'initialisation pour Blockly
 * Ce fichier importe et configure les blocs et générateurs personnalisés
 */

// Importer Blockly depuis le package npm
import * as Blockly from 'blockly';
import 'blockly/python';
import 'blockly/blocks';

// Importer les définitions de blocs
import './blocks/mon_module.js';

// Importer les générateurs de code
import './generators/mon_module.js';

// Exporter les fonctionnalités Blockly pour les utiliser ailleurs dans l'application
export { Blockly };
export default {
  // Fonctions d'initialisation ou de configuration supplémentaires peuvent être ajoutées ici
};
