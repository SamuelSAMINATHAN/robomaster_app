import React, { useEffect, useRef, useState } from 'react';
import { useRobotStore } from '../store/RobotStore';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/python';
import 'blockly/javascript';

// Style pour masquer les barres de défilement et améliorer l'interface Blockly
const blocklyStyles = `
  /* Masquer les barres de défilement */
  .blocklyScrollbarHorizontal,
  .blocklyScrollbarVertical {
    display: none !important;
  }
  
  /* Curseur "grab" pour indiquer que l'espace est déplaçable */
  .blocklyWorkspace {
    cursor: grab !important;
  }
  
  .blocklyWorkspace.blocklyDragging {
    cursor: grabbing !important;
  }
  
  /* Améliorer l'apparence des flyouts (panneaux déroulants) */
  .blocklyFlyout {
    border-right: none !important;
    overflow: hidden !important;
  }
  
  .blocklyFlyoutBackground {
    fill-opacity: 0.9;
  }
  
  /* Empêcher le clignotement et assurer la visibilité des éléments */
  .blocklyFlyoutScrollbar {
    display: none !important;
  }
  
  .blocklyToolboxDiv {
    overflow: auto !important;
  }
  
  /* Garantir que les blocs dans le flyout sont visibles */
  .blocklyFlyout .blocklyBlockCanvas {
    overflow: visible !important;
  }
  
  /* Améliorer le contraste des catégories */
  .blocklyTreeRow:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  .blocklyTreeSelected {
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
`;

// Définir la toolbox standard et personnalisée
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logique',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category',
      name: 'Boucles',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_forEach' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#5C68A6',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_round' },
      ],
    },
    {
      kind: 'category',
      name: 'Texte',
      colour: '#A65C81',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_print' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '#A6745C',
    },
    {
      kind: 'category',
      name: 'Fonctions',
      custom: 'PROCEDURE',
      colour: '#995BA5',
    },
    // Ajouter les catégories personnalisées pour RoboMaster
    {
      kind: 'category',
      name: 'RoboMaster',
      colour: '#FF6800',
      contents: [
        { kind: 'block', type: 'robomaster_init' },
        { kind: 'block', type: 'robomaster_close' },
      ],
    },
    {
      kind: 'category',
      name: 'Chassis',
      colour: '#3373CC',
      contents: [
        { kind: 'block', type: 'chassis_move' },
        { kind: 'block', type: 'chassis_stop' },
        { kind: 'block', type: 'chassis_set_speed' },
      ],
    },
    {
      kind: 'category',
      name: 'LED',
      colour: '#33CC33',
      contents: [
        { kind: 'block', type: 'led_set_color' },
        { kind: 'block', type: 'led_effect' },
      ],
    },
    {
      kind: 'category',
      name: 'Tourelle',
      colour: '#9400D3',
      contents: [
        { kind: 'block', type: 'gimbal_move' },
        { kind: 'block', type: 'gimbal_stop' },
      ],
    },
    {
      kind: 'category',
      name: 'Caméra',
      colour: '#00AEEF',
      contents: [
        { kind: 'block', type: 'camera_start' },
        { kind: 'block', type: 'camera_stop' },
      ],
    },
    {
      kind: 'category',
      name: 'Bras',
      colour: '#E066FF',
      contents: [
        { kind: 'block', type: 'robotic_arm_move' },
        { kind: 'block', type: 'robotic_arm_stop' },
      ],
    },
    {
      kind: 'category',
      name: 'Capteurs',
      colour: '#FFD700',
      contents: [
        { kind: 'block', type: 'battery_level' },
      ],
    },
  ],
};

export default function SimpleBlockly() {
  const blocklyContainerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { updateBlocklyXml, updatePythonCode, currentScript } = useRobotStore();

  useEffect(() => {
    // Ajouter le style pour modifier le curseur
    const styleElement = document.createElement('style');
    styleElement.textContent = blocklyStyles;
    document.head.appendChild(styleElement);

    let workspace = null;
    let mouseEventCleanup = null; // Référence pour nettoyer les gestionnaires d'événements
    
    // Fonction pour initialiser Blockly
    const initBlockly = () => {
      try {
        if (!blocklyContainerRef.current) {
          console.error("Référence au conteneur non disponible");
          return;
        }

        // Vider le conteneur avant de réinjecter Blockly
        blocklyContainerRef.current.innerHTML = '';

        // Définir les blocs personnalisés
        defineCustomBlocks();

        console.log("Injection de Blockly dans", blocklyContainerRef.current);
        
        // Injection de Blockly avec une configuration simple
        workspace = Blockly.inject(blocklyContainerRef.current, {
          toolbox,
          trashcan: true,
          media: '/media/', // Chemin vers les médias (copié avec copy-blockly-media.js)
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          move: {
            drag: true,
            wheel: true
          },
          horizontalLayout: false,
          // Activer les barres de défilement mais les cacher avec CSS
          scrollbars: true,
          // Rendre le flyout et la boîte à outils plus stables
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          sounds: false,
          maxInstances: {
            'controls_for': 4,
            'controls_whileUntil': 4,
            'math_arithmetic': 8
          }
        });

        // Charger le XML s'il existe
        if (currentScript?.blocklyXml) {
          try {
            const xml = Blockly.Xml.textToDom(currentScript.blocklyXml);
            Blockly.Xml.domToWorkspace(xml, workspace);
          } catch (e) {
            console.error("Erreur lors du chargement du XML Blockly:", e);
          }
        }

        // Gérer les événements de souris pour le déplacement de l'espace de travail
        const workspaceSvg = blocklyContainerRef.current.querySelector('.blocklySvg');
        if (workspaceSvg) {
          let isDragging = false;
          let startX = 0;
          let startY = 0;

          const handleMouseDown = (e) => {
            // Vérifier si on clique sur le fond et non sur un bloc
            const isBackgroundClick = e.target.classList.contains('blocklyMainBackground') || 
                                     e.target.classList.contains('blocklySvg');
            if (isBackgroundClick) {
              isDragging = true;
              workspaceSvg.classList.add('blocklyDragging');
              
              // Enregistrer la position initiale de la souris
              startX = e.clientX;
              startY = e.clientY;
            }
          };

          const handleMouseMove = (e) => {
            if (isDragging) {
              // Calculer le déplacement de la souris
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              
              // Déplacer l'espace de travail avec l'API de Blockly
              workspace.scroll(dx, dy);
              
              // Mettre à jour la position de départ pour le prochain déplacement
              startX = e.clientX;
              startY = e.clientY;
            }
          };

          const handleMouseUp = () => {
            if (isDragging) {
              isDragging = false;
              workspaceSvg.classList.remove('blocklyDragging');
            }
          };

          workspaceSvg.addEventListener('mousedown', handleMouseDown);
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);

          // Fonction pour nettoyer les événements
          mouseEventCleanup = () => {
            workspaceSvg.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
        }

        // Écouter les changements
        workspace.addChangeListener(() => {
          try {
            // Sauvegarder le XML
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            updateBlocklyXml(xmlText);
            
            // Générer le code Python
            const code = Blockly.Python ? 
              Blockly.Python.workspaceToCode(workspace) :
              Blockly.JavaScript.workspaceToCode(workspace) + "\n// Python non disponible, code JavaScript généré à la place";
            
            updatePythonCode(code);
          } catch (err) {
            console.error("Erreur lors de la génération du code:", err);
          }
        });

        setLoaded(true);
        console.log("Blockly initialisé avec succès");
      } catch (err) {
        console.error("Erreur lors de l'initialisation de Blockly:", err);
        setError(`Erreur d'initialisation: ${err.message}`);
      }
    };

    // Définir les blocs personnalisés RoboMaster et leurs générateurs
    const defineCustomBlocks = () => {
      try {
        // Définir les blocs RoboMaster
        console.log("Définition des blocs RoboMaster...");

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

        // Bloc chassis_move
        Blockly.Blocks['chassis_move'] = {
          init: function() {
            this.appendValueInput('X_SPEED')
                .setCheck('Number')
                .appendField('Déplacer chassis vitesse X');
            this.appendValueInput('Y_SPEED')
                .setCheck('Number')
                .appendField('vitesse Y');
            this.appendValueInput('Z_SPEED')
                .setCheck('Number')
                .appendField('vitesse Z');
            this.appendValueInput('DURATION')
                .setCheck('Number')
                .appendField('durée (s)');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplacer le chassis avec les vitesses spécifiées');
          }
        };

        // Bloc chassis_stop
        Blockly.Blocks['chassis_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter le chassis');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Arrêter tout mouvement du chassis');
          }
        };

        // Bloc pour régler la vitesse du chassis
        Blockly.Blocks['chassis_set_speed'] = {
          init: function() {
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('Régler vitesse chassis');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Régler la vitesse du chassis');
          }
        };

        // Bloc pour allumer la LED
        Blockly.Blocks['led_set_color'] = {
          init: function() {
            this.appendValueInput('R')
                .setCheck('Number')
                .appendField('Couleur LED R');
            this.appendValueInput('G')
                .setCheck('Number')
                .appendField('G');
            this.appendValueInput('B')
                .setCheck('Number')
                .appendField('B');
            this.appendDummyInput()
                .appendField('position')
                .appendField(new Blockly.FieldDropdown([
                  ['Toutes les LEDs', 'all'],
                  ['LED haut', 'top'],
                  ['LED bas', 'bottom'],
                  ['LED gauche', 'left'],
                  ['LED droite', 'right']
                ]), 'LED_POSITION');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip('Définir la couleur de la LED');
          }
        };

        // Bloc LED effet
        Blockly.Blocks['led_effect'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Effet LED')
                .appendField(new Blockly.FieldDropdown([
                  ['Solide', 'solid'],
                  ['Clignotant', 'blink'],
                  ['Pulse', 'pulse'],
                  ['Éteint', 'off']
                ]), 'EFFECT');
            this.appendValueInput('R')
                .setCheck('Number')
                .appendField('R');
            this.appendValueInput('G')
                .setCheck('Number')
                .appendField('G');
            this.appendValueInput('B')
                .setCheck('Number')
                .appendField('B');
            this.appendValueInput('FREQUENCY')
                .setCheck('Number')
                .appendField('Fréquence (Hz)');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip('Configurer un effet LED');
          }
        };

        // Blocs pour gimbal
        Blockly.Blocks['gimbal_move'] = {
          init: function() {
            this.appendValueInput('PITCH_SPEED')
                .setCheck('Number')
                .appendField('Déplacer tourelle vitesse pitch');
            this.appendValueInput('YAW_SPEED')
                .setCheck('Number')
                .appendField('vitesse yaw');
            this.appendValueInput('DURATION')
                .setCheck('Number')
                .appendField('durée (s)');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip('Déplacer la tourelle');
          }
        };

        Blockly.Blocks['gimbal_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter tourelle');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip('Arrêter la tourelle');
          }
        };

        // Bloc pour la caméra
        Blockly.Blocks['camera_start'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Démarrer caméra');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('Démarrer la caméra');
          }
        };

        Blockly.Blocks['camera_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter caméra');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('Arrêter la caméra');
          }
        };

        // Blocs pour bras robotique
        Blockly.Blocks['robotic_arm_move'] = {
          init: function() {
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('Déplacer bras X');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('Y');
            this.appendValueInput('Z')
                .setCheck('Number')
                .appendField('Z');
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('Vitesse');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(340);
            this.setTooltip('Déplacer le bras robotique');
          }
        };

        Blockly.Blocks['robotic_arm_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter bras');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(340);
            this.setTooltip('Arrêter le bras robotique');
          }
        };

        // Bloc pour le niveau de batterie
        Blockly.Blocks['battery_level'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Niveau de batterie');
            this.setOutput(true, 'Number');
            this.setColour(60);
            this.setTooltip('Obtenir le niveau de batterie');
          }
        };

        // Définir les générateurs Python
        console.log("Définition des générateurs Python...");

        // Générateur pour robomaster_init
        Blockly.Python['robomaster_init'] = function(block) {
          return 'robot = RoboMaster()\nrobot.initialize()\n';
        };

        // Générateur pour robomaster_close
        Blockly.Python['robomaster_close'] = function(block) {
          return 'robot.close()\n';
        };

        // Générateur pour chassis_move
        Blockly.Python['chassis_move'] = function(block) {
          const x_speed = Blockly.Python.valueToCode(block, 'X_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          const y_speed = Blockly.Python.valueToCode(block, 'Y_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          const z_speed = Blockly.Python.valueToCode(block, 'Z_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          const duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_ATOMIC) || '0';
          
          return `robot.chassis.move(${x_speed}, ${y_speed}, ${z_speed}, ${duration})\n`;
        };

        // Générateur pour chassis_stop
        Blockly.Python['chassis_stop'] = function(block) {
          return 'robot.chassis.stop()\n';
        };

        // Générateur pour chassis_set_speed
        Blockly.Python['chassis_set_speed'] = function(block) {
          const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          return `robot.chassis.set_speed(${speed})\n`;
        };

        // Générateur pour led_set_color
        Blockly.Python['led_set_color'] = function(block) {
          const r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_ATOMIC) || '0';
          const g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_ATOMIC) || '0';
          const b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_ATOMIC) || '0';
          const position = block.getFieldValue('LED_POSITION');
          
          return `robot.led.set_color(${r}, ${g}, ${b}, "${position}")\n`;
        };

        // Générateur pour led_effect
        Blockly.Python['led_effect'] = function(block) {
          const effect = block.getFieldValue('EFFECT');
          const r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_ATOMIC) || '0';
          const g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_ATOMIC) || '0';
          const b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_ATOMIC) || '0';
          const frequency = Blockly.Python.valueToCode(block, 'FREQUENCY', Blockly.Python.ORDER_ATOMIC) || '1';
          
          return `robot.led.set_effect("${effect}", ${r}, ${g}, ${b}, ${frequency})\n`;
        };

        // Générateur pour gimbal_move
        Blockly.Python['gimbal_move'] = function(block) {
          const pitch = Blockly.Python.valueToCode(block, 'PITCH_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          const yaw = Blockly.Python.valueToCode(block, 'YAW_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
          const duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_ATOMIC) || '0';
          
          return `robot.gimbal.move(${pitch}, ${yaw}, ${duration})\n`;
        };

        // Générateur pour gimbal_stop
        Blockly.Python['gimbal_stop'] = function(block) {
          return 'robot.gimbal.stop()\n';
        };

        // Générateur pour camera_start
        Blockly.Python['camera_start'] = function(block) {
          return 'robot.camera.start()\n';
        };

        // Générateur pour camera_stop
        Blockly.Python['camera_stop'] = function(block) {
          return 'robot.camera.stop()\n';
        };

        // Générateur pour robotic_arm_move
        Blockly.Python['robotic_arm_move'] = function(block) {
          const x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC) || '0';
          const y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC) || '0';
          const z = Blockly.Python.valueToCode(block, 'Z', Blockly.Python.ORDER_ATOMIC) || '0';
          const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '10';
          
          return `robot.arm.move(${x}, ${y}, ${z}, ${speed})\n`;
        };

        // Générateur pour robotic_arm_stop
        Blockly.Python['robotic_arm_stop'] = function(block) {
          return 'robot.arm.stop()\n';
        };

        // Générateur pour battery_level
        Blockly.Python['battery_level'] = function(block) {
          return ['robot.battery.get_level()', Blockly.Python.ORDER_FUNCTION_CALL];
        };

        console.log("Blocs personnalisés et générateurs définis avec succès");
      } catch (err) {
        console.error("Erreur lors de la définition des blocs personnalisés:", err);
      }
    };

    // Charger Blockly
    initBlockly();

    // Ajuster la taille lorsque la fenêtre change
    const handleResize = () => {
      if (workspace) {
        Blockly.svgResize(workspace);
      }
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Supprimer le style ajouté
      document.head.removeChild(styleElement);
      
      // Nettoyer les gestionnaires d'événements de souris
      if (mouseEventCleanup) {
        mouseEventCleanup();
      }
      
      // Si on a une instance de workspace, la nettoyer
      if (workspace) {
        workspace.dispose();
      }
    };
  }, [updateBlocklyXml, updatePythonCode, currentScript]);

  if (error) {
    return (
      <div className="border border-red-500 bg-red-100 text-red-700 p-4 m-4 rounded">
        <h3 className="font-bold">Erreur</h3>
        <p>{error}</p>
        <p className="mt-2">Vérifiez la console pour plus de détails.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div 
        ref={blocklyContainerRef}
        className="h-full w-full"
        style={{ position: 'relative', minHeight: '400px', border: 'none' }}
      ></div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-center">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white">Chargement de Blockly...</p>
          </div>
        </div>
      )}
    </div>
  );
} 