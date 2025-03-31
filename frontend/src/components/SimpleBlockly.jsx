import React, { useEffect, useRef, useState } from 'react';
import { useRobotStore } from '../store/RobotStore';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/python';
import 'blockly/javascript';

// Style pour masquer les barres de défilement et améliorer l'interface Blockly
const blocklyStyles = `
  /* Masquer toutes les scrollbars */
  .blocklyScrollbarHorizontal,
  .blocklyScrollbarVertical {
    display: none !important;
  }
  
  /* Style de base de l'espace de travail */
  .blocklyWorkspace {
    cursor: grab !important;
  }
  
  .blocklyWorkspace.blocklyDragging {
    cursor: grabbing !important;
  }
  
  /* Gestion cohérente des overflow */
  .blocklyFlyout {
    overflow: visible !important;
    border-right: none !important;
  }
  
  .blocklyFlyoutBackground {
    fill-opacity: 0.95;
  }
  
  .blocklyToolboxDiv {
    overflow: visible !important;
    border-right: 1px solid #ddd;
  }
  
  /* Style des catégories */
  .blocklyTreeRow:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  .blocklyTreeSelected {
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
`;

// Remplacer la définition de la toolbox par une version avec des catégories construites dynamiquement
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    // Catégorie Logique
    {
      kind: 'category',
      name: 'Logique',
      colour: '#5C81A6',
      // Retirer les blocs de cette catégorie car ils sont dupliqués dans les catégories Math et Commandes
      contents: [
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    // Catégorie Boucles
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
    // Catégorie Math refactorisée
    {
      kind: 'category',
      name: 'Math',
      colour: '#5C68A6',
      contents: [
        // Nombre
        { kind: 'block', type: 'math_number' },
        
        // Une seule instance de chaque opération arithmétique
        { 
          kind: 'block', 
          type: 'math_arithmetic', 
          fields: { 'OP': 'ADD' },
          inputs: {
            'A': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } },
            'B': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } }
          }
        },
        { 
          kind: 'block', 
          type: 'math_arithmetic', 
          fields: { 'OP': 'MINUS' },
          inputs: {
            'A': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } },
            'B': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } }
          } 
        },
        { 
          kind: 'block', 
          type: 'math_arithmetic', 
          fields: { 'OP': 'MULTIPLY' },
          inputs: {
            'A': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } },
            'B': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } }
          } 
        },
        { 
          kind: 'block', 
          type: 'math_arithmetic', 
          fields: { 'OP': 'DIVIDE' },
          inputs: {
            'A': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } },
            'B': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } }
          } 
        },
        
        // Nombre aléatoire
        { 
          kind: 'block', 
          type: 'math_random_int',
          inputs: {
            'FROM': { shadow: { type: 'math_number', fields: { 'NUM': 1 } } },
            'TO': { shadow: { type: 'math_number', fields: { 'NUM': 100 } } }
          } 
        },
        
        // Arrondi et transformations
        { 
          kind: 'block', 
          type: 'math_round',
          inputs: {
            'NUM': { shadow: { type: 'math_number', fields: { 'NUM': 3.1 } } }
          } 
        },
        { 
          kind: 'block', 
          type: 'math_modulo',
          inputs: {
            'DIVIDEND': { shadow: { type: 'math_number', fields: { 'NUM': 64 } } },
            'DIVISOR': { shadow: { type: 'math_number', fields: { 'NUM': 10 } } }
          } 
        },
        { 
          kind: 'block', 
          type: 'math_single',
          fields: { 'OP': 'ROOT' },
          inputs: {
            'NUM': { shadow: { type: 'math_number', fields: { 'NUM': 9 } } }
          } 
        },
        { 
          kind: 'block', 
          type: 'math_single',
          fields: { 'OP': 'ABS' },
          inputs: {
            'NUM': { shadow: { type: 'math_number', fields: { 'NUM': -9 } } }
          } 
        },
        { kind: 'block', type: 'math_map' },
        
        // Comparaisons 
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'EQ' }
        },
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'NEQ' }
        },
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'LT' }
        },
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'LTE' }
        },
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'GT' }
        },
        { 
          kind: 'block', 
          type: 'logic_compare',
          fields: { 'OP': 'GTE' }
        },
        
        // Opérateurs logiques
        { 
          kind: 'block', 
          type: 'logic_operation',
          fields: { 'OP': 'AND' }
        },
        { 
          kind: 'block', 
          type: 'logic_operation',
          fields: { 'OP': 'OR' }
        },
        { kind: 'block', type: 'logic_negate' },
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
      colour: '#9966FF',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Fonctions',
      custom: 'PROCEDURE',
      colour: '#995BA5',
    },
    // Catégorie Objet de données
    {
      kind: 'category',
      name: 'Objet de données',
      colour: '#9966FF',
      custom: 'VARIABLE',
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
        // Groupes fonctionnels
        // 1. Contrôles de base
        { kind: 'block', type: 'chassis_stop' },
        { kind: 'block', type: 'chassis_move' },
        { kind: 'block', type: 'chassis_set_pwm' },
        { kind: 'block', type: 'chassis_set_accelerator' },
        
        // 2. Vitesses et paramètres
        { kind: 'block', type: 'chassis_set_speed' },
        { kind: 'block', type: 'chassis_set_translation_speed' },
        { kind: 'block', type: 'chassis_set_rotation_speed' },
        { kind: 'block', type: 'chassis_set_wheel_speed' },
        
        // 3. Translations
        { kind: 'block', type: 'chassis_follow_gimbal' },
        { kind: 'block', type: 'chassis_translate_direction' },
        { kind: 'block', type: 'chassis_translate_direction_duration' },
        { kind: 'block', type: 'chassis_translate_direction_distance' },
        { kind: 'block', type: 'chassis_translate_direction_speed' },
        { kind: 'block', type: 'chassis_translate_xy' },
        
        // 4. Rotations
        { kind: 'block', type: 'chassis_rotate_direction' },
        { kind: 'block', type: 'chassis_rotate_direction_duration' },
        { kind: 'block', type: 'chassis_rotate_direction_angle' },
        { kind: 'block', type: 'chassis_rotate_direction_speed' },
        
        // 5. Mouvements combinés
        { kind: 'block', type: 'chassis_move_combined' },
        
        // 6. Capteurs et états
        { kind: 'block', type: 'chassis_get_angle' },
        { kind: 'block', type: 'chassis_get_position' },
        { kind: 'block', type: 'chassis_collision_event' },
        { kind: 'block', type: 'chassis_collision_condition' },
      ],
    },
    {
      kind: 'category',
      name: 'LED',
      colour: '#33CC33',
      contents: [
        { kind: 'block', type: 'led_set_flash_frequency' },
        { kind: 'block', type: 'led_set_chassis_color' },
        { kind: 'block', type: 'led_set_gimbal_color' },
        { kind: 'block', type: 'led_set_gimbal_sequence' },
        { kind: 'block', type: 'led_turn_off' },
        { kind: 'block', type: 'led_set_sight' }
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
        // Contrôle de la pince
        { kind: 'block', type: 'robotic_gripper_set' },
        { kind: 'block', type: 'robotic_gripper_is_state' },
        { kind: 'block', type: 'robotic_gripper_closed_status' },
        { kind: 'block', type: 'robotic_gripper_open_status' },
        
        // Contrôle du bras
        { kind: 'block', type: 'robotic_arm_move_direction' },
        { kind: 'block', type: 'robotic_arm_move_coordinates' },
        { kind: 'block', type: 'robotic_arm_recenter' },
        { kind: 'block', type: 'robotic_arm_get_position' },
        
        // Contrôle des servos
        { kind: 'block', type: 'robotic_servo_set_angle' },
        { kind: 'block', type: 'robotic_servo_set_action' },
        { kind: 'block', type: 'robotic_servo_set_speed' },
        { kind: 'block', type: 'robotic_servo_get_angle' },
      ],
    },
    {
      kind: 'category',
      name: 'Capteurs',
      colour: '#FFD700',
      contents: [
        { kind: 'block', type: 'sensor_ir_distance_toggle' },
        { kind: 'block', type: 'sensor_ir_distance_event' },
        { kind: 'block', type: 'sensor_ir_distance_wait' },
        { kind: 'block', type: 'sensor_ir_distance_condition' },
        { kind: 'block', type: 'sensor_ir_distance_value' },
      ],
    },
    {
      kind: 'category',
      name: 'Multimédia',
      colour: '#FF4500',
      contents: [
        { kind: 'block', type: 'multimedia_play_sound' },
        { kind: 'block', type: 'multimedia_play_sound_blocking' },
        { kind: 'block', type: 'multimedia_play_custom_audio' },
        { kind: 'block', type: 'multimedia_play_custom_audio_blocking' },
        { kind: 'block', type: 'multimedia_take_photo' },
        { kind: 'block', type: 'multimedia_record_video' },
      ],
    },
    {
      kind: 'category',
      name: 'Commandes',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'command_wait' },
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'command_forever' },
        { kind: 'block', type: 'controls_if' },
        { 
          kind: 'block', 
          type: 'controls_if',
          extraState: { hasElse: true } 
        },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'command_stop_program' },
      ],
    },
    {
      kind: 'category',
      name: 'Système',
      colour: '#008080',
      contents: [
        { kind: 'block', type: 'system_set_movement_mode' },
        { kind: 'block', type: 'system_timer_control' },
        { kind: 'block', type: 'system_set_camera_zoom' },
        { kind: 'block', type: 'system_get_timer_duration' },
        { kind: 'block', type: 'system_get_program_runtime' },
        { kind: 'block', type: 'system_get_time_info' },
        { kind: 'block', type: 'system_get_timestamp' },
        { kind: 'block', type: 'system_get_battery_level' },
      ],
    },
    {
      kind: 'category',
      name: 'Armure',
      colour: '#DC143C', // Rouge cramoisi
      contents: [
        // Actions
        { kind: 'block', type: 'armor_set_sensitivity' },
        { kind: 'block', type: 'armor_wait_for_hit' },
        { kind: 'block', type: 'armor_wait_for_ir_hit' },
        
        // Événements
        { kind: 'block', type: 'armor_hit_event' },
        { kind: 'block', type: 'armor_ir_hit_event' },
        
        // Conditions et valeurs
        { kind: 'block', type: 'armor_is_hit' },
        { kind: 'block', type: 'armor_is_ir_hit' },
        { kind: 'block', type: 'armor_last_hit_info' },
      ],
    },
    {
      kind: 'category',
      name: 'Intelligence',
      colour: '#800080', // Violet
      contents: [
        // Actions
        { kind: 'block', type: 'intelligence_toggle_recognition' },
        { kind: 'block', type: 'intelligence_set_marker_distance' },
        { kind: 'block', type: 'intelligence_set_recognition_color' },
        { kind: 'block', type: 'intelligence_set_exposure' },
        { kind: 'block', type: 'intelligence_identify_and_aim' },
        { kind: 'block', type: 'intelligence_wait_for_recognition' },
        
        // Événements
        { kind: 'block', type: 'intelligence_recognition_event' },
        
        // Conditions
        { kind: 'block', type: 'intelligence_is_recognized' },
        
        // Valeurs
        { kind: 'block', type: 'intelligence_marker_info' },
        { kind: 'block', type: 'intelligence_object_info' },
        { kind: 'block', type: 'intelligence_gesture_info' },
        { kind: 'block', type: 'intelligence_line_info' },
        { kind: 'block', type: 'intelligence_lines_info' },
        { kind: 'block', type: 'intelligence_brightness' },
        { kind: 'block', type: 'intelligence_aim_position' },
      ],
    },
    {
      kind: 'category',
      name: 'Listes',
      colour: '#AA77DD',
      contents: [
        {
          kind: 'button',
          text: 'Créer une liste',
          callbackKey: 'CREATE_LIST',
        },
        {
          kind: 'block',
          type: 'data_list_define',
        },
        {
          kind: 'block',
          type: 'data_list_add',
        },
        {
          kind: 'block',
          type: 'data_list_remove_item',
        },
        {
          kind: 'block',
          type: 'data_list_remove_all',
        },
        {
          kind: 'block',
          type: 'data_list_insert',
        },
        {
          kind: 'block',
          type: 'data_list_replace',
        },
        {
          kind: 'block',
          type: 'data_list_get_item',
        },
        {
          kind: 'block',
          type: 'data_list_length',
        },
        {
          kind: 'block',
          type: 'data_list_contains',
        }
      ],
    },
    {
      kind: 'category',
      name: 'Régulateurs PID',
      colour: '#8844CC',
      contents: [
        {
          kind: 'button',
          text: 'Créer un régulateur PID',
          callbackKey: 'CREATE_PID',
        },
        {
          kind: 'block',
          type: 'data_pid_set_parameters',
        },
        {
          kind: 'block',
          type: 'data_pid_set_error',
        },
        {
          kind: 'block',
          type: 'data_pid_get_output',
        }
      ],
    },
  ],
};

export default function SimpleBlockly() {
  const blocklyContainerRef = useRef(null);
  const workspaceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { updateBlocklyXml, updatePythonCode, currentScript } = useRobotStore();

  // Définir les blocs personnalisés avant le rendu du composant
  useEffect(() => {
    try {
      defineCustomBlocks();
    } catch (err) {
      console.error("Erreur lors de la définition des blocs personnalisés:", err);
      setError(`Erreur de définition des blocs: ${err.message}`);
    }
  }, []);

  // Initialiser Blockly une seule fois
  useEffect(() => {
    if (!blocklyContainerRef.current) return;
    
    // Ajouter le style
    const styleElement = document.createElement('style');
    styleElement.textContent = blocklyStyles;
    document.head.appendChild(styleElement);

    // Initialiser seulement si ce n'est pas déjà fait
    if (!workspaceRef.current) {
      try {
        console.log("Injection de Blockly dans", blocklyContainerRef.current);
        
        // Vérification des blocs manquants
        console.log("Vérification des blocs définis...");
        const missingBlocks = [];
        const checkCategory = (category) => {
          if (category.contents) {
            category.contents.forEach(item => {
              if (item.kind === 'block' && !Blockly.Blocks[item.type]) {
                missingBlocks.push(item.type);
              } else if (item.kind === 'category') {
                checkCategory(item);
              }
            });
          }
        };
        
        // Vérifier récursivement toutes les catégories
        toolbox.contents.forEach(category => {
          checkCategory(category);
        });
        
        if (missingBlocks.length > 0) {
          console.error("Blocs manquants dans la toolbox:", missingBlocks);
          setError(`Blocs manquants: ${missingBlocks.join(', ')}`);
          return;
        }
        
        // Configuration de Blockly
        workspaceRef.current = Blockly.inject(blocklyContainerRef.current, {
          toolbox,
          trashcan: true,
          media: '/media/',
          zoom: {
            controls: true,
            wheel: false,
            startScale: 1.0,
            maxScale: 2,
            minScale: 0.6,
            scaleSpeed: 1.1
          },
          move: {
            drag: true,
            wheel: false
          },
          grid: {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          scrollbars: false,
          sounds: false
        });
        
        // Enregistrer les gestionnaires pour les boutons personnalisés
        workspaceRef.current.registerButtonCallback('CREATE_VARIABLE', function(workspace) {
          Blockly.Variables.createVariableButtonHandler(workspace);
        });
        
        workspaceRef.current.registerButtonCallback('CREATE_LIST', function(workspace) {
          Blockly.Variables.createVariableButtonHandler(workspace, null, 'list');
        });
        
        workspaceRef.current.registerButtonCallback('CREATE_PID', function(workspace) {
          Blockly.Variables.createVariableButtonHandler(workspace, null, 'pid');
        });

        // Charger le XML s'il existe
        if (currentScript?.blocklyXml) {
          try {
            const xml = Blockly.Xml.textToDom(currentScript.blocklyXml);
            Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          } catch (e) {
            console.error("Erreur lors du chargement du XML Blockly:", e);
          }
        }

        // Écouter les changements seulement quand des changements significatifs se produisent
        workspaceRef.current.addChangeListener((event) => {
          if (event.type === Blockly.Events.FINISHED_LOADING) return;
          
          // N'enregistrez pas les changements pendant le chargement ou les modifications UI mineures
          if (event.type === Blockly.Events.BLOCK_MOVE || 
              event.type === Blockly.Events.BLOCK_CHANGE || 
              event.type === Blockly.Events.BLOCK_CREATE || 
              event.type === Blockly.Events.BLOCK_DELETE) {
            
          try {
            // Sauvegarder le XML
              const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
            const xmlText = Blockly.Xml.domToText(xml);
            updateBlocklyXml(xmlText);
            
            // Générer le code Python
              const code = Blockly.Python.workspaceToCode(workspaceRef.current);
            updatePythonCode(code);
          } catch (err) {
            console.error("Erreur lors de la génération du code:", err);
            }
          }
        });

        setLoaded(true);
        console.log("Blockly initialisé avec succès");
      } catch (err) {
        console.error("Erreur lors de l'initialisation de Blockly:", err);
        setError(`Erreur d'initialisation: ${err.message}`);
      }
    }

    // Ajuster la taille lorsque la fenêtre change
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Supprimer le style ajouté
      document.head.removeChild(styleElement);
      
      // Ne pas disposer du workspace à chaque fois
      // Le workspace sera réutilisé
    };
  }, [currentScript, updateBlocklyXml, updatePythonCode]);

    // Définir les blocs personnalisés RoboMaster et leurs générateurs
    const defineCustomBlocks = () => {
      try {
        // Définir les blocs RoboMaster
        console.log("Définition des blocs RoboMaster...");

        // --- DÉFINITION DES BLOCS DE LISTE ---
        // Bloc data_list_define
        Blockly.Blocks['data_list_define'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck('Array')
                .appendField('Définir la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST')
                .appendField('à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Définit la valeur initiale d\'une liste');
          }
        };

        // Bloc data_list_add
        Blockly.Blocks['data_list_add'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('Ajouter l\'élément')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Ajoute un élément à la fin de la liste');
          }
        };

        // Bloc data_list_remove_item
        Blockly.Blocks['data_list_remove_item'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Supprimer l\'élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Supprime l\'élément à la position spécifiée (commence à 1)');
          }
        };

        // Bloc data_list_remove_all
        Blockly.Blocks['data_list_remove_all'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Vider la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Supprime tous les éléments de la liste');
          }
        };

        // Bloc data_list_insert
        Blockly.Blocks['data_list_insert'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('Insérer l\'élément');
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Insère un élément à la position spécifiée (commence à 1)');
          }
        };

        // Bloc data_list_replace
        Blockly.Blocks['data_list_replace'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Remplacer l\'élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('par');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Remplace l\'élément à la position spécifiée (commence à 1)');
          }
        };

        // Bloc data_list_get_item
        Blockly.Blocks['data_list_get_item'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setOutput(true, null);
            this.setColour('#AA77DD');
            this.setTooltip('Récupère l\'élément à la position spécifiée (commence à 1)');
          }
        };

        // Bloc data_list_length
        Blockly.Blocks['data_list_length'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Longueur de la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setOutput(true, 'Number');
            this.setColour('#AA77DD');
            this.setTooltip('Renvoie le nombre d\'éléments dans la liste');
          }
        };

        // Bloc data_list_contains
        Blockly.Blocks['data_list_contains'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('La liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST')
                .appendField('contient');
            this.setOutput(true, 'Boolean');
            this.setColour('#AA77DD');
            this.setTooltip('Vérifie si la liste contient l\'élément spécifié');
          }
        };
        
        // --- DÉFINITION DES BLOCS PID ---
        // Bloc data_pid_set_parameters
        Blockly.Blocks['data_pid_set_parameters'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Régler les paramètres du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID');
            this.appendValueInput('P')
                .setCheck('Number')
                .appendField('P =');
            this.appendValueInput('I')
                .setCheck('Number')
                .appendField('I =');
            this.appendValueInput('D')
                .setCheck('Number')
                .appendField('D =');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#8844CC');
            this.setTooltip('Règle les paramètres P, I et D du régulateur PID');
          }
        };
        
        // Bloc data_pid_set_error
        Blockly.Blocks['data_pid_set_error'] = {
          init: function() {
            this.appendValueInput('ERROR')
                .setCheck('Number')
                .appendField('Définir l\'erreur du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID')
                .appendField('à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#8844CC');
            this.setTooltip('Définit la valeur d\'erreur pour le calcul du PID');
          }
        };
        
        // Bloc data_pid_get_output
        Blockly.Blocks['data_pid_get_output'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Sortie du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID');
            this.setOutput(true, 'Number');
            this.setColour('#8844CC');
            this.setTooltip('Retourne la valeur de sortie calculée par le régulateur PID');
          }
        };

        // --- GÉNÉRATEURS PYTHON POUR LES BLOCS DE LISTE ---
        Blockly.Python['data_list_define'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || '[]';
          return list + ' = ' + value + '\n';
        };

        Blockly.Python['data_list_add'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_ATOMIC) || 'None';
          return list + '.append(' + item + ')\n';
        };

        Blockly.Python['data_list_remove_item'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '1';
          
          // Ajuster l'index pour Python (commence à 0)
          return 'if 1 <= ' + index + ' <= len(' + list + '):\n' +
                 '  del ' + list + '[' + index + ' - 1]\n';
        };

        Blockly.Python['data_list_remove_all'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          return list + '.clear()\n';
        };

        Blockly.Python['data_list_insert'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_ATOMIC) || 'None';
          const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '1';
          
          // Ajuster l'index pour Python (commence à 0)
          return 'if 1 <= ' + index + ' <= len(' + list + ') + 1:\n' +
                 '  ' + list + '.insert(' + index + ' - 1, ' + item + ')\n';
        };

        Blockly.Python['data_list_replace'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_ATOMIC) || 'None';
          const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '1';
          
          // Ajuster l'index pour Python (commence à 0)
          return 'if 1 <= ' + index + ' <= len(' + list + '):\n' +
                 '  ' + list + '[' + index + ' - 1] = ' + item + '\n';
        };

        Blockly.Python['data_list_get_item'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_ATOMIC) || '1';
          
          // Ajuster l'index pour Python (commence à 0) avec vérification de limites
          const code = '(' + list + '[' + index + ' - 1] if 1 <= ' + index + ' <= len(' + list + ') else None)';
          return [code, Blockly.Python.ORDER_CONDITIONAL];
        };

        Blockly.Python['data_list_length'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const code = 'len(' + list + ')';
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        };

        Blockly.Python['data_list_contains'] = function(block) {
          const list = Blockly.Python.variableDB_.getName(block.getFieldValue('LIST'), Blockly.Variables.NAME_TYPE);
          const item = Blockly.Python.valueToCode(block, 'ITEM', Blockly.Python.ORDER_ATOMIC) || 'None';
          const code = item + ' in ' + list;
          return [code, Blockly.Python.ORDER_RELATIONAL];
        };

        // --- GÉNÉRATEURS PYTHON POUR LES BLOCS PID ---
        Blockly.Python['data_pid_set_parameters'] = function(block) {
          const pid = Blockly.Python.variableDB_.getName(block.getFieldValue('PID'), Blockly.Variables.NAME_TYPE);
          const p = Blockly.Python.valueToCode(block, 'P', Blockly.Python.ORDER_ATOMIC) || '1.0';
          const i = Blockly.Python.valueToCode(block, 'I', Blockly.Python.ORDER_ATOMIC) || '0.0';
          const d = Blockly.Python.valueToCode(block, 'D', Blockly.Python.ORDER_ATOMIC) || '0.0';
          
          return pid + '.set_parameters(p=' + p + ', i=' + i + ', d=' + d + ')\n';
        };

        Blockly.Python['data_pid_set_error'] = function(block) {
          const pid = Blockly.Python.variableDB_.getName(block.getFieldValue('PID'), Blockly.Variables.NAME_TYPE);
          const error = Blockly.Python.valueToCode(block, 'ERROR', Blockly.Python.ORDER_ATOMIC) || '0.0';
          
          return pid + '.set_error(' + error + ')\n';
        };

        Blockly.Python['data_pid_get_output'] = function(block) {
          const pid = Blockly.Python.variableDB_.getName(block.getFieldValue('PID'), Blockly.Variables.NAME_TYPE);
          const code = pid + '.get_output()';
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        };

        // Enregistrer les types de variables personnalisés
        Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
          const variableModelList = workspace.getVariablesOfType('');
          const variableBlocks = [];
          
          // Ajout des blocs pour les variables normales
          if (variableModelList.length > 0) {
            // Bloc pour obtenir la variable
            variableBlocks.push({
              kind: 'block',
              type: 'variables_get',
              fields: {
                VAR: variableModelList[0].name
              }
            });
            
            // Bloc pour définir la variable
            variableBlocks.push({
              kind: 'block',
              type: 'variables_set',
              fields: {
                VAR: variableModelList[0].name
              }
            });
          }
          
          // Gérer les variables de type liste
          const listVariableList = workspace.getVariablesOfType('list');
          if (listVariableList.length > 0) {
            // Bloc pour définir une liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_define',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour ajouter un élément à la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_add',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour supprimer un élément de la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_remove_item',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour vider la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_remove_all',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour insérer un élément dans la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_insert',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour remplacer un élément dans la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_replace',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour obtenir un élément de la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_get_item',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour obtenir les premiers éléments de la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_get_first_items',
              fields: {
                LIST: listVariableList[0].name,
                COUNT: '3'
              }
            });
            
            // Bloc pour obtenir la longueur de la liste
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_length',
              fields: {
                LIST: listVariableList[0].name
              }
            });
            
            // Bloc pour vérifier si la liste contient un élément
            variableBlocks.push({
              kind: 'block',
              type: 'data_list_contains',
              fields: {
                LIST: listVariableList[0].name
              }
            });
          }
          
          // Gérer les variables de type PID
          const pidVariableList = workspace.getVariablesOfType('pid');
          if (pidVariableList.length > 0) {
            // Bloc pour définir les paramètres du PID
            variableBlocks.push({
              kind: 'block',
              type: 'data_pid_set_parameters',
              fields: {
                PID: pidVariableList[0].name
              }
            });
            
            // Bloc pour définir l'erreur du PID
            variableBlocks.push({
              kind: 'block',
              type: 'data_pid_set_error',
              fields: {
                PID: pidVariableList[0].name
              }
            });
            
            // Bloc pour obtenir la sortie du PID
            variableBlocks.push({
              kind: 'block',
              type: 'data_pid_get_output',
              fields: {
                PID: pidVariableList[0].name
              }
            });
          }
          
          return variableBlocks;
        };

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

        // === BLOCS CHASSIS AVANCÉS ===
        
        // Bloc chassis_set_pwm
        Blockly.Blocks['chassis_set_pwm'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck('Number')
                .appendField('Régler PWM port')
                .appendField(new Blockly.FieldDropdown([
                  ['1', '1'],
                  ['2', '2'],
                  ['3', '3'],
                  ['4', '4'],
                  ['5', '5'],
                  ['6', '6']
                ]), 'PORT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Régler la valeur PWM pour un port spécifique');
          }
        };
        
        // Bloc chassis_set_accelerator
        Blockly.Blocks['chassis_set_accelerator'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['Activer', 'enable'],
                  ['Désactiver', 'disable']
                ]), 'ACTION')
                .appendField('accélérateur de chassis');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Active ou désactive l\'accélérateur du chassis');
          }
        };
        
        // Bloc chassis_follow_gimbal
        Blockly.Blocks['chassis_follow_gimbal'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Suivre la tourelle avec un angle de');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Configure le chassis pour suivre la tourelle');
          }
        };
        
        // Bloc chassis_set_translation_speed
        Blockly.Blocks['chassis_set_translation_speed'] = {
          init: function() {
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('Configurer vitesse de translation à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Configure la vitesse de translation du chassis');
          }
        };
        
        // Bloc chassis_set_rotation_speed
        Blockly.Blocks['chassis_set_rotation_speed'] = {
          init: function() {
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('Configurer vitesse de rotation à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Configure la vitesse de rotation du chassis');
          }
        };
        
        // Bloc chassis_set_wheel_speed
        Blockly.Blocks['chassis_set_wheel_speed'] = {
          init: function() {
            this.appendValueInput('FRONT_LEFT')
                .setCheck('Number')
                .appendField('Configurer vitesse roues: avant gauche');
            this.appendValueInput('FRONT_RIGHT')
                .setCheck('Number')
                .appendField('avant droite');
            this.appendValueInput('REAR_LEFT')
                .setCheck('Number')
                .appendField('arrière gauche');
            this.appendValueInput('REAR_RIGHT')
                .setCheck('Number')
                .appendField('arrière droite');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Configure la vitesse de chaque roue indépendamment');
          }
        };
        
        // Bloc chassis_translate_direction
        Blockly.Blocks['chassis_translate_direction'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Translater le chassis dans la direction');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplace le chassis dans la direction spécifiée (angle en degrés)');
          }
        };
        
        // Bloc chassis_translate_direction_duration
        Blockly.Blocks['chassis_translate_direction_duration'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Translater le chassis dans la direction');
            this.appendValueInput('DURATION')
                .setCheck('Number')
                .appendField('pendant');
            this.appendDummyInput()
                .appendField('secondes');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplace le chassis dans la direction spécifiée pendant une durée donnée');
          }
        };
        
        // Bloc chassis_translate_direction_distance
        Blockly.Blocks['chassis_translate_direction_distance'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Translater le chassis dans la direction');
            this.appendValueInput('DISTANCE')
                .setCheck('Number')
                .appendField('sur une distance de');
            this.appendDummyInput()
                .appendField('mètres');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplace le chassis dans la direction spécifiée sur une distance donnée');
          }
        };
        
        // Bloc chassis_translate_direction_speed
        Blockly.Blocks['chassis_translate_direction_speed'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Translater le chassis dans la direction');
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('à la vitesse');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplace le chassis dans la direction spécifiée à la vitesse donnée');
          }
        };
        
        // Bloc chassis_translate_xy
        Blockly.Blocks['chassis_translate_xy'] = {
          init: function() {
            this.appendValueInput('X_SPEED')
                .setCheck('Number')
                .appendField('Translater le chassis avec vitesse X');
            this.appendValueInput('Y_SPEED')
                .setCheck('Number')
                .appendField('vitesse Y');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Déplace le chassis avec des vitesses X et Y spécifiées');
          }
        };
        
        // Bloc chassis_rotate_direction
        Blockly.Blocks['chassis_rotate_direction'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Tourner le chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['à gauche', 'left'],
                  ['à droite', 'right']
                ]), 'DIRECTION');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Fait tourner le chassis dans la direction spécifiée');
          }
        };
        
        // Bloc chassis_rotate_direction_duration
        Blockly.Blocks['chassis_rotate_direction_duration'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Tourner le chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['à gauche', 'left'],
                  ['à droite', 'right']
                ]), 'DIRECTION');
            this.appendValueInput('DURATION')
                .setCheck('Number')
                .appendField('pendant');
            this.appendDummyInput()
                .appendField('secondes');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Fait tourner le chassis dans la direction spécifiée pendant une durée donnée');
          }
        };
        
        // Bloc chassis_rotate_direction_angle
        Blockly.Blocks['chassis_rotate_direction_angle'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Tourner le chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['à gauche', 'left'],
                  ['à droite', 'right']
                ]), 'DIRECTION');
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('de');
            this.appendDummyInput()
                .appendField('degrés');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Fait tourner le chassis dans la direction spécifiée d\'un angle donné');
          }
        };
        
        // Bloc chassis_rotate_direction_speed
        Blockly.Blocks['chassis_rotate_direction_speed'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Tourner le chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['à gauche', 'left'],
                  ['à droite', 'right']
                ]), 'DIRECTION');
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField('à la vitesse');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Fait tourner le chassis dans la direction spécifiée à la vitesse donnée');
          }
        };
        
        // Bloc chassis_move_combined
        Blockly.Blocks['chassis_move_combined'] = {
          init: function() {
            this.appendValueInput('ANGLE')
                .setCheck('Number')
                .appendField('Déplacer le chassis avec un angle de');
            this.appendDummyInput()
                .appendField('et rotation')
                .appendField(new Blockly.FieldDropdown([
                  ['à gauche', 'left'],
                  ['à droite', 'right'],
                  ['aucune', 'none']
                ]), 'DIRECTION');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip('Combine translation et rotation du chassis');
          }
        };
        
        // Bloc chassis_get_angle
        Blockly.Blocks['chassis_get_angle'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Obtenir angle du chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['roulis', 'roll'],
                  ['tangage', 'pitch'],
                  ['lacet', 'yaw']
                ]), 'AXIS');
            this.setOutput(true, 'Number');
            this.setColour(230);
            this.setTooltip('Récupère l\'angle actuel du chassis selon l\'axe spécifié');
          }
        };
        
        // Bloc chassis_get_position
        Blockly.Blocks['chassis_get_position'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Position du chassis')
                .appendField(new Blockly.FieldDropdown([
                  ['X', 'x'],
                  ['Y', 'y'],
                  ['Z', 'z']
                ]), 'COORDINATE');
            this.setOutput(true, 'Number');
            this.setColour(230);
            this.setTooltip('Récupère la position actuelle du chassis selon l\'axe spécifié');
          }
        };
        
        // Bloc chassis_collision_event
        Blockly.Blocks['chassis_collision_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Quand une collision est détectée');
            this.appendStatementInput('DO')
                .setCheck(null);
            this.setColour(230);
            this.setTooltip('Exécute le code quand une collision est détectée sur le chassis');
          }
        };
        
        // Bloc chassis_collision_condition
        Blockly.Blocks['chassis_collision_condition'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Collision détectée');
            this.setOutput(true, 'Boolean');
            this.setColour(230);
            this.setTooltip('Vérifie si une collision est détectée sur le chassis');
          }
        };

        // === BLOCS LED ===
        
        // Bloc led_set_flash_frequency
        Blockly.Blocks['led_set_flash_frequency'] = {
          init: function() {
            this.appendValueInput('FREQUENCY')
                .setCheck('Number')
                .appendField("Configurer la fréquence de clignotement des LED")
                .appendField(new Blockly.FieldDropdown([
                  ['toutes', 'all'],
                  ['châssis', 'chassis'],
                  ['tourelle', 'gimbal']
                ]), 'ZONE')
                .appendField("à");
            this.appendDummyInput()
                .appendField("Hz");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Configure la fréquence de clignotement des LED en Hz');
            this.setInputsInline(true);
          }
        };
        
        // Bloc led_set_chassis_color
        Blockly.Blocks['led_set_chassis_color'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir la couleur LED")
                .appendField(new Blockly.FieldDropdown([
                  ['châssis avant gauche', 'front_left'],
                  ['châssis avant droit', 'front_right'],
                  ['châssis arrière gauche', 'rear_left'],
                  ['châssis arrière droit', 'rear_right'],
                  ['châssis complet', 'chassis_all']
                ]), 'ZONE');
            this.appendValueInput('R')
                .setCheck('Number')
                .appendField("R:");
            this.appendValueInput('G')
                .setCheck('Number')
                .appendField("G:");
            this.appendValueInput('B')
                .setCheck('Number')
                .appendField("B:");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['fixe', 'on'],
                  ['clignotement lent', 'blink_slow'],
                  ['clignotement rapide', 'blink_fast'],
                  ['éteint', 'off']
                ]), 'BEHAVIOR');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Définit la couleur RGB et le comportement des LED du châssis');
            this.setInputsInline(true);
          }
        };

        // Bloc led_set_gimbal_color
        Blockly.Blocks['led_set_gimbal_color'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir la couleur de la tourelle")
                .appendField(new Blockly.FieldDropdown([
                  ['côté gauche', 'left'],
                  ['côté droit', 'right'],
                  ['tourelle complète', 'all']
                ]), 'ZONE');
            this.appendValueInput('R')
                .setCheck('Number')
                .appendField("R:");
            this.appendValueInput('G')
                .setCheck('Number')
                .appendField("G:");
            this.appendValueInput('B')
                .setCheck('Number')
                .appendField("B:");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['fixe', 'on'],
                  ['clignotement lent', 'blink_slow'],
                  ['clignotement rapide', 'blink_fast'],
                  ['éteint', 'off']
                ]), 'BEHAVIOR');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Définit la couleur RGB et le comportement des LED de la tourelle');
            this.setInputsInline(true);
          }
        };
        
        // Bloc led_set_gimbal_sequence
        Blockly.Blocks['led_set_gimbal_sequence'] = {
          init: function() {
            this.appendValueInput('SEQUENCE')
                .setCheck('Number')
                .appendField("Configurer la séquence des LED de la tourelle")
                .appendField(new Blockly.FieldDropdown([
                  ['côté gauche', 'left'],
                  ['côté droit', 'right'],
                  ['tourelle complète', 'all']
                ]), 'ZONE')
                .appendField("à");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['fixe', 'on'],
                  ['clignotement lent', 'blink_slow'],
                  ['clignotement rapide', 'blink_fast']
                ]), 'BEHAVIOR');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Configure une séquence prédéfinie pour les LED de la tourelle');
            this.setInputsInline(true);
          }
        };
        
        // Bloc led_turn_off
        Blockly.Blocks['led_turn_off'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Éteindre les LED")
                .appendField(new Blockly.FieldDropdown([
                  ['toutes', 'all'],
                  ['châssis', 'chassis'],
                  ['tourelle', 'gimbal']
                ]), 'ZONE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Éteint les LED spécifiées');
          }
        };
        
        // Bloc led_set_sight
        Blockly.Blocks['led_set_sight'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Régler lumière de visée")
                .appendField(new Blockly.FieldDropdown([
                  ['allumée', 'on'],
                  ['éteinte', 'off']
                ]), 'STATE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CC33');
            this.setTooltip('Allume ou éteint la lumière de visée de la tourelle');
          }
        };

        // === BLOCS TOURELLE ET CAMERA ===
        
        // Bloc gimbal_move
        Blockly.Blocks['gimbal_move'] = {
          init: function() {
            this.appendValueInput('PITCH_SPEED')
                .setCheck('Number')
                .appendField('Tourner la tourelle vitesse tangage');
            this.appendValueInput('YAW_SPEED')
                .setCheck('Number')
                .appendField('vitesse lacet');
            this.appendValueInput('DURATION')
                .setCheck('Number')
                .appendField('durée (s)');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9400D3');
            this.setTooltip('Tourne la tourelle avec les vitesses spécifiées');
          }
        };

        // Bloc gimbal_stop
        Blockly.Blocks['gimbal_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter la tourelle');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9400D3');
            this.setTooltip('Arrête tout mouvement de la tourelle');
          }
        };

        // Bloc camera_start
        Blockly.Blocks['camera_start'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Démarrer la caméra');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#00AEEF');
            this.setTooltip('Démarre le flux vidéo de la caméra');
          }
        };

        // Bloc camera_stop
        Blockly.Blocks['camera_stop'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter la caméra');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#00AEEF');
            this.setTooltip('Arrête le flux vidéo de la caméra');
          }
        };

        // === BLOCS MULTIMÉDIA ===
        
        // Bloc multimedia_play_sound
        Blockly.Blocks['multimedia_play_sound'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Jouer l'effet sonore")
                .appendField(new Blockly.FieldDropdown([
                  ['salutation', 'greet'],
                  ['attaque', 'attack'],
                  ['dégât', 'damage'],
                  ['défaite', 'defeat'],
                  ['victoire', 'victory'],
                  ['surprise', 'surprise'],
                  ['alerte', 'alert']
                ]), 'SOUND_EFFECT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Joue un effet sonore prédéfini (non bloquant)');
          }
        };
        
        // Bloc multimedia_play_sound_blocking
        Blockly.Blocks['multimedia_play_sound_blocking'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Jouer l'effet sonore (bloquant)")
                .appendField(new Blockly.FieldDropdown([
                  ['salutation', 'greet'],
                  ['attaque', 'attack'],
                  ['dégât', 'damage'],
                  ['défaite', 'defeat'],
                  ['victoire', 'victory'],
                  ['surprise', 'surprise'],
                  ['alerte', 'alert']
                ]), 'SOUND_EFFECT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Joue un effet sonore prédéfini et attend la fin de la lecture');
          }
        };
        
        // Bloc multimedia_play_custom_audio
        Blockly.Blocks['multimedia_play_custom_audio'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Jouer le fichier audio")
                .appendField(new Blockly.FieldTextInput("fichier.mp3"), 'AUDIO_FILE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Joue un fichier audio personnalisé (non bloquant)');
          }
        };
        
        // Bloc multimedia_play_custom_audio_blocking
        Blockly.Blocks['multimedia_play_custom_audio_blocking'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Jouer le fichier audio (bloquant)")
                .appendField(new Blockly.FieldTextInput("fichier.mp3"), 'AUDIO_FILE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Joue un fichier audio personnalisé et attend la fin de la lecture');
          }
        };
        
        // Bloc multimedia_take_photo
        Blockly.Blocks['multimedia_take_photo'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Prendre une photo");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Prend une photo avec la caméra');
          }
        };
        
        // Bloc multimedia_record_video
        Blockly.Blocks['multimedia_record_video'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['Démarrer', 'start'],
                  ['Arrêter', 'stop']
                ]), 'ACTION')
                .appendField("l'enregistrement vidéo");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF4500');
            this.setTooltip('Démarre ou arrête l\'enregistrement vidéo');
          }
        };

        // === BLOCS ROBOTIQUE ===
        
        // Bloc robotic_gripper_set
        Blockly.Blocks['robotic_gripper_set'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Régler la pince sur")
                .appendField(new Blockly.FieldDropdown([
                  ['ouvert', 'open'],
                  ['fermé', 'close'],
                  ['arrêt', 'stop']
                ]), 'STATE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Ouvre, ferme ou arrête la pince');
          }
        };
        
        // Bloc robotic_gripper_is_state
        Blockly.Blocks['robotic_gripper_is_state'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Pince complètement")
                .appendField(new Blockly.FieldDropdown([
                  ['ouverte', 'open'],
                  ['fermée', 'closed']
                ]), 'STATE');
            this.setOutput(true, 'Boolean');
            this.setColour('#E066FF');
            this.setTooltip('Condition qui retourne vrai si la pince est complètement ouverte ou fermée');
          }
        };
        
        // Bloc robotic_gripper_closed_status
        Blockly.Blocks['robotic_gripper_closed_status'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Statut fermé de la pince");
            this.setOutput(true, 'Number');
            this.setColour('#E066FF');
            this.setTooltip('Retourne 1 si la pince est fermée, 0 sinon');
          }
        };
        
        // Bloc robotic_gripper_open_status
        Blockly.Blocks['robotic_gripper_open_status'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Statut d'ouverture de la pince");
            this.setOutput(true, 'Number');
            this.setColour('#E066FF');
            this.setTooltip('Retourne 1 si la pince est ouverte, 0 sinon');
          }
        };
        
        // Bloc robotic_arm_move_direction
        Blockly.Blocks['robotic_arm_move_direction'] = {
          init: function() {
            this.appendValueInput('DISTANCE')
                  .setCheck('Number')
                .appendField("Configurer le bras robotique pour bouger vers")
                .appendField(new Blockly.FieldDropdown([
                  ['avant', 'forward'],
                  ['arrière', 'backward'],
                  ['haut', 'up'],
                  ['bas', 'down']
                ]), 'DIRECTION')
                .appendField("de");
            this.appendDummyInput()
                  .appendField("mm");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Déplace le bras dans une direction donnée sur une distance définie');
            this.setInputsInline(true);
          }
        };
        
        // Bloc robotic_arm_move_coordinates
        Blockly.Blocks['robotic_arm_move_coordinates'] = {
          init: function() {
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField("Configurer le bras robotique pour bouger vers les coordonnées (X");
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField(", Y");
            this.appendDummyInput()
                  .appendField(")");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Déplace le bras vers une position absolue donnée en mm');
            this.setInputsInline(true);
          }
        };
        
        // Bloc robotic_arm_recenter
        Blockly.Blocks['robotic_arm_recenter'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Recentrer le bras robotique");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Ramène le bras à sa position d\'origine (0,0)');
          }
        };
        
        // Bloc robotic_arm_get_position
        Blockly.Blocks['robotic_arm_get_position'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Position actuelle du bras robotique");
            this.setOutput(true, 'Array');
            this.setColour('#E066FF');
            this.setTooltip('Donne la position actuelle du bras sous forme de coordonnées (X, Y en mm)');
          }
        };
        
        // Bloc robotic_servo_set_angle
        Blockly.Blocks['robotic_servo_set_angle'] = {
          init: function() {
            this.appendValueInput('SERVO')
                .setCheck('Number')
                .appendField("Configurer servo");
            this.appendValueInput('ANGLE')
                  .setCheck('Number')
                .appendField("pour tourner à");
            this.appendDummyInput()
                  .appendField("°");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Tourne un servo moteur à un angle défini. Valeurs positives : horaire, négatives : antihoraire');
            this.setInputsInline(true);
          }
        };
        
        // Bloc robotic_servo_set_action
        Blockly.Blocks['robotic_servo_set_action'] = {
          init: function() {
            this.appendValueInput('SERVO')
                  .setCheck('Number')
                .appendField("Définir servo");
              this.appendDummyInput()
                  .appendField("à")
                  .appendField(new Blockly.FieldDropdown([
                    ['Recentrer', 'center'],
                    ['Arrêter', 'stop']
                  ]), 'ACTION');
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Recentre le servo ou l\'arrête');
            this.setInputsInline(true);
          }
        };
        
        // Bloc robotic_servo_set_speed
        Blockly.Blocks['robotic_servo_set_speed'] = {
          init: function() {
            this.appendValueInput('SERVO')
                  .setCheck('Number')
                .appendField("Configurer servo");
            this.appendValueInput('SPEED')
                .setCheck('Number')
                .appendField("pour tourner à");
            this.appendDummyInput()
                  .appendField("°/s");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#E066FF');
            this.setTooltip('Tourne le servo à une vitesse définie. Positif = horaire, négatif = antihoraire');
            this.setInputsInline(true);
          }
        };
        
        // Bloc robotic_servo_get_angle
        Blockly.Blocks['robotic_servo_get_angle'] = {
          init: function() {
            this.appendValueInput('SERVO')
                  .setCheck('Number')
                .appendField("Angle servo");
            this.setOutput(true, 'Number');
            this.setColour('#E066FF');
            this.setTooltip('Retourne l\'angle actuel du servo spécifié');
            this.setInputsInline(true);
          }
        };
        
        // Bloc armor_set_sensitivity
        Blockly.Blocks['armor_set_sensitivity'] = {
          init: function() {
            this.appendValueInput('SENSITIVITY')
                  .setCheck('Number')
                .appendField("Définir la sensibilité de l'armure à");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
            this.setColour('#DC143C');
            this.setTooltip('Ajuste la sensibilité de détection des impacts. Plus la valeur est élevée, plus la détection est sensible');
            this.setInputsInline(true);
          }
        };
        
        // Bloc armor_hit_event
        Blockly.Blocks['armor_hit_event'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Quand l'armure")
                  .appendField(new Blockly.FieldDropdown([
                    ['avant', 'front'],
                    ['arrière', 'back'],
                    ['gauche', 'left'],
                    ['droite', 'right'],
                    ['aléatoire', 'random']
                  ]), 'ZONE')
                  .appendField("est touchée");
            this.appendStatementInput('DO')
                  .setCheck(null);
            this.setColour('#DC143C');
            this.setTooltip('Déclenche un événement lorsque la zone spécifiée de l\'armure est touchée');
          }
        };
        
        // Bloc armor_last_hit_info
        Blockly.Blocks['armor_last_hit_info'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField(new Blockly.FieldDropdown([
                    ['ID', 'id'],
                    ['horodatage', 'timestamp']
                  ]), 'DATA')
                  .appendField("de la dernière armure touchée");
            this.setOutput(true, null);
            this.setColour('#DC143C');
            this.setTooltip('Retourne des informations sur la dernière armure touchée');
          }
        };
        
        // Bloc armor_is_hit
        Blockly.Blocks['armor_is_hit'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Armure")
                  .appendField(new Blockly.FieldDropdown([
                    ['avant', 'front'],
                    ['arrière', 'back'],
                    ['gauche', 'left'],
                    ['droite', 'right'],
                    ['aléatoire', 'random']
                  ]), 'ZONE')
                  .appendField("touchée");
            this.setOutput(true, 'Boolean');
            this.setColour('#DC143C');
            this.setTooltip('Condition qui vérifie si une armure spécifique a été touchée');
          }
        };
        
        // Bloc armor_wait_for_hit
        Blockly.Blocks['armor_wait_for_hit'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Attendre un impact sur l'armure")
                  .appendField(new Blockly.FieldDropdown([
                    ['avant', 'front'],
                    ['arrière', 'back'],
                    ['gauche', 'left'],
                    ['droite', 'right'],
                    ['aléatoire', 'random']
                  ]), 'ZONE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#DC143C');
            this.setTooltip('Interrompt l\'exécution jusqu\'à ce que l\'armure soit touchée à l\'endroit spécifié');
          }
        };

        // Bloc armor_ir_hit_event
        Blockly.Blocks['armor_ir_hit_event'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Lorsqu'un robot est touché par un faisceau infrarouge");
            this.appendStatementInput('DO')
                  .setCheck(null);
            this.setColour('#DC143C');
            this.setTooltip('Déclenche un événement quand un capteur infrarouge détecte un impact');
          }
        };
        
        // Bloc armor_wait_for_ir_hit
        Blockly.Blocks['armor_wait_for_ir_hit'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Attendez que le robot soit touché par un faisceau infrarouge");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#DC143C');
            this.setTooltip('Attend qu\'un capteur infrarouge détecte une attaque avant de poursuivre');
          }
        };
        
        // Bloc armor_is_ir_hit
        Blockly.Blocks['armor_is_ir_hit'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Robot touché par un faisceau infrarouge");
            this.setOutput(true, 'Boolean');
            this.setColour('#DC143C');
            this.setTooltip('Retourne vrai si un impact infrarouge a été détecté sur le robot');
          }
        };
        
        // Bloc sensor_ir_distance_toggle
        Blockly.Blocks['sensor_ir_distance_toggle'] = {
          init: function() {
            this.appendValueInput('SENSOR')
                  .setCheck('Number')
                .appendField("Capteur de distance infrarouge")
                .appendField(new Blockly.FieldDropdown([
                  ['activer', 'enable'],
                  ['désactiver', 'disable']
                ]), 'ACTION')
                .appendField("fonctions de mesures");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FFD700');
            this.setTooltip('Active ou désactive les fonctions de mesure d\'un capteur infrarouge spécifique');
            this.setInputsInline(true);
          }
        };
        
        // Bloc sensor_ir_distance_event
        Blockly.Blocks['sensor_ir_distance_event'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Lorsque la valeur du capteur de distance infrarouge est");
            this.appendValueInput('SENSOR')
                  .setCheck('Number');
            this.appendDummyInput()
                  .appendField(new Blockly.FieldDropdown([
                    ['≥', '>='],
                    ['≤', '<='],
                    ['=', '=='],
                    ['>', '>'],
                    ['<', '<']
                  ]), 'COMPARATOR');
            this.appendValueInput('VALUE')
                  .setCheck('Number');
            this.appendDummyInput()
                  .appendField("cm");
            this.appendStatementInput('DO')
                  .setCheck(null);
            this.setColour('#FFD700');
            this.setTooltip('Déclenche une action lorsque la distance mesurée par un capteur répond à la condition spécifiée');
            this.setInputsInline(true);
          }
        };
        
        // Bloc sensor_ir_distance_wait
        Blockly.Blocks['sensor_ir_distance_wait'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Attendez que la valeur de distance")
                  .appendField(new Blockly.FieldDropdown([
                    ['≥', '>='],
                    ['≤', '<='],
                    ['=', '=='],
                    ['>', '>'],
                    ['<', '<']
                  ]), 'COMPARATOR');
            this.appendValueInput('VALUE')
                  .setCheck('Number');
            this.appendValueInput('SENSOR')
                  .setCheck('Number')
                  .appendField("cm du capteur de distance infrarouge");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FFD700');
            this.setTooltip('Attend qu\'une condition sur la distance mesurée soit remplie avant de continuer l\'exécution');
            this.setInputsInline(true);
          }
        };
        
        // Bloc sensor_ir_distance_condition
        Blockly.Blocks['sensor_ir_distance_condition'] = {
          init: function() {
            this.appendDummyInput()
                  .appendField("Valeur de distance")
                  .appendField(new Blockly.FieldDropdown([
                    ['≥', '>='],
                    ['≤', '<='],
                    ['=', '=='],
                    ['>', '>'],
                    ['<', '<']
                  ]), 'COMPARATOR');
            this.appendValueInput('VALUE')
                  .setCheck('Number');
            this.appendValueInput('SENSOR')
                  .setCheck('Number')
                  .appendField("cm du capteur de distance infrarouge");
            this.setOutput(true, 'Boolean');
            this.setColour('#FFD700');
            this.setTooltip('Vérifie si une condition sur la valeur de distance est vraie');
            this.setInputsInline(true);
          }
        };
        
        // Bloc sensor_ir_distance_value
        Blockly.Blocks['sensor_ir_distance_value'] = {
          init: function() {
            this.appendValueInput('SENSOR')
                  .setCheck('Number')
                .appendField("Capteur de distance infrarouge");
            this.appendDummyInput()
                  .appendField("→ valeur de distance");
            this.setOutput(true, 'Number');
            this.setColour('#FFD700');
            this.setTooltip('Retourne la distance mesurée par un capteur donné (en cm)');
            this.setInputsInline(true);
          }
        };

        // === BLOCS INTELLIGENCE ===
        
        // Bloc intelligence_toggle_recognition
        Blockly.Blocks['intelligence_toggle_recognition'] = function(block) {
          const action = block.getFieldValue('ACTION');
          const element = block.getFieldValue('ELEMENT');
          const enabled = action === 'enable';
          return `robot.vision.set_detection_enabled(type="${element}", enabled=${enabled})\n`;
        };
        
        // Bloc intelligence_set_marker_distance
        Blockly.Blocks['intelligence_set_marker_distance'] = function(block) {
          const distance = Blockly.Python.valueToCode(block, 'DISTANCE', Blockly.Python.ORDER_ATOMIC) || '3';
          return `robot.vision.set_marker_detection_distance(${distance})\n`;
        };
        
        // Bloc intelligence_set_recognition_color
        Blockly.Blocks['intelligence_set_recognition_color'] = function(block) {
          const color = block.getFieldValue('COLOR');
          const type = block.getFieldValue('TYPE');
          return `robot.vision.set_detection_color(type="${type}", color="${color}")\n`;
        };
        
        // Bloc intelligence_set_exposure
        Blockly.Blocks['intelligence_set_exposure'] = function(block) {
          const level = block.getFieldValue('LEVEL');
          // Convertir le niveau en valeur numérique
          let exposureValue = 4; // valeur moyenne par défaut
          if (level === 'low') {
            exposureValue = 2;
          } else if (level === 'high') {
            exposureValue = 6;
          }
          return `robot.camera.set_exposure(${exposureValue})\n`;
        };
        
        // Bloc intelligence_identify_and_aim
        Blockly.Blocks['intelligence_identify_and_aim'] = function(block) {
          const element = block.getFieldValue('ELEMENT');
          return `robot.vision.identify_and_aim("${element}")\n`;
        };
        
        // Bloc intelligence_recognition_event
        Blockly.Blocks['intelligence_recognition_event'] = function(block) {
          const element = block.getFieldValue('ELEMENT');
          const statements = Blockly.Python.statementToCode(block, 'DO');
          return `@robot.vision.on_detect("${element}")\ndef recognition_handler_${element}():\n${statements}\n`;
        };
        
        // Bloc intelligence_is_recognized
        Blockly.Blocks['intelligence_is_recognized'] = function(block) {
          const element = block.getFieldValue('ELEMENT');
          return [`robot.vision.is_detected("${element}")`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_wait_for_recognition
        Blockly.Blocks['intelligence_wait_for_recognition'] = function(block) {
          const element = block.getFieldValue('ELEMENT');
          return `robot.vision.wait_for_detection("${element}")\n`;
        };
        
        // Bloc intelligence_marker_info
        Blockly.Blocks['intelligence_marker_info'] = function(block) {
          return [`robot.vision.get_marker_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_object_info
        Blockly.Blocks['intelligence_object_info'] = function(block) {
          const element = block.getFieldValue('ELEMENT');
          return [`robot.vision.get_detected_info("${element}")`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_gesture_info
        Blockly.Blocks['intelligence_gesture_info'] = function(block) {
          return [`robot.vision.get_gesture_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_line_info
        Blockly.Blocks['intelligence_line_info'] = function(block) {
          return [`robot.vision.get_line_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_lines_info
        Blockly.Blocks['intelligence_lines_info'] = function(block) {
          return [`robot.vision.get_lines_info()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_brightness
        Blockly.Blocks['intelligence_brightness'] = function(block) {
          return [`robot.camera.get_brightness()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc intelligence_aim_position
        Blockly.Blocks['intelligence_aim_position'] = function(block) {
          return [`robot.vision.get_aim_position()`, Blockly.Python.ORDER_FUNCTION_CALL];
        };

        // === BLOCS SYSTEME ===
        
        // Bloc system_set_movement_mode
        Blockly.Blocks['system_set_movement_mode'] = function(block) {
          const mode = block.getFieldValue('MODE');
          return `robot.set_movement_mode("${mode}")\n`;
        };
        
        // Bloc system_timer_control
        Blockly.Blocks['system_timer_control'] = function(block) {
          const action = block.getFieldValue('ACTION');
          return `timer.control("${action}")\n`;
        };
        
        // Bloc system_set_camera_zoom
        Blockly.Blocks['system_set_camera_zoom'] = function(block) {
          const zoomLevel = Blockly.Python.valueToCode(block, 'ZOOM_LEVEL', Blockly.Python.ORDER_ATOMIC) || '1';
          return `camera.set_zoom(${zoomLevel})\n`;
        };
        
        // Bloc system_get_timer_duration
        Blockly.Blocks['system_get_timer_duration'] = function(block) {
          return ['timer.get_elapsed_time()', Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc system_get_program_runtime
        Blockly.Blocks['system_get_program_runtime'] = function(block) {
          return ['program.get_runtime()', Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc system_get_time_info
        Blockly.Blocks['system_get_time_info'] = function(block) {
          const timeUnit = block.getFieldValue('TIME_UNIT');
          return [`time.get_current("${timeUnit}")`, Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc system_get_timestamp
        Blockly.Blocks['system_get_timestamp'] = function(block) {
          return ['system.get_uptime()', Blockly.Python.ORDER_FUNCTION_CALL];
        };
        
        // Bloc system_get_battery_level
        Blockly.Blocks['system_get_battery_level'] = function(block) {
          return ['robot.get_battery_level()', Blockly.Python.ORDER_FUNCTION_CALL];
        };

        // === BLOCS DATA ===
        
        // Bloc data_create_variable
        Blockly.Blocks['data_create_variable'] = function(block) {
          const varName = block.getFieldValue('VAR_NAME');
          const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ASSIGNMENT) || '0';
          return `${varName} = ${value}\n`;
        };
        
        // Bloc data_create_list
        Blockly.Blocks['data_create_list'] = function(block) {
          const listName = block.getFieldValue('LIST_NAME');
          const elements = [];
          
          for (let i = 0; i < block.itemCount_; i++) {
            const element = Blockly.Python.valueToCode(block, 'ITEM' + i, Blockly.Python.ORDER_NONE) || 'None';
            elements.push(element);
          }
          
          return `${listName} = [${elements.join(', ')}]\n`;
        };
        
        // Bloc data_create_pid
        Blockly.Blocks['data_create_pid'] = function(block) {
          const pidName = block.getFieldValue('PID_NAME');
          const p = Blockly.Python.valueToCode(block, 'P', Blockly.Python.ORDER_ATOMIC) || '1.0';
          const i = Blockly.Python.valueToCode(block, 'I', Blockly.Python.ORDER_ATOMIC) || '0.0';
          const d = Blockly.Python.valueToCode(block, 'D', Blockly.Python.ORDER_ATOMIC) || '0.0';
          
          // Import la classe PID et crée une instance
          return `from pid_controller import PID\n${pidName} = PID(p=${p}, i=${i}, d=${d})\n`;
        };

        // === BLOCS COMMANDES ===
        
        // Bloc command_wait
        Blockly.Blocks['command_wait'] = {
          init: function() {
            this.appendValueInput('TIME')
                .setCheck('Number')
                .appendField('Attendre');
            this.appendDummyInput()
                .appendField('secondes');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Attend le nombre de secondes spécifié avant de continuer');
            this.setInputsInline(true);
          }
        };
        
        // Bloc command_forever
        Blockly.Blocks['command_forever'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Répéter indéfiniment');
            this.appendStatementInput('DO')
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Exécute les blocs en boucle sans fin');
          }
        };
        
        // Bloc command_stop_program
        Blockly.Blocks['command_stop_program'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter le programme');
            this.setPreviousStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Arrête l\'exécution du programme');
          }
        };
        
        // === BLOCS SYSTÈME ===
        
        // Bloc system_set_movement_mode
        Blockly.Blocks['system_set_movement_mode'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir le mode de déplacement à")
                .appendField(new Blockly.FieldDropdown([
                  ['châssis directeur', 'chassis_lead'],
                  ['tourelle directrice', 'gimbal_lead'],
                  ['libre', 'free']
                ]), 'MODE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Définit le mode de déplacement du robot');
          }
        };
        
        // Bloc system_timer_control
        Blockly.Blocks['system_timer_control'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['lancer', 'start'],
                  ['suspendre', 'pause'],
                  ['arrêter', 'stop']
                ]), 'ACTION')
                .appendField("le chrono");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Contrôle le chronomètre interne');
          }
        };
        
        // Bloc system_set_camera_zoom
        Blockly.Blocks['system_set_camera_zoom'] = {
          init: function() {
            this.appendValueInput('ZOOM_LEVEL')
                .setCheck('Number')
                .appendField("Régler le zoom de la caméra à");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Règle le niveau de zoom de la caméra (1-5)');
          }
        };
        
        // Bloc system_get_timer_duration
        Blockly.Blocks['system_get_timer_duration'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Durée du chrono");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne la durée écoulée du chronomètre en secondes');
          }
        };
        
        // Bloc system_get_program_runtime
        Blockly.Blocks['system_get_program_runtime'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Temps d'exécution du programme");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne la durée totale d\'exécution du programme en secondes');
          }
        };
        
        // Bloc system_get_time_info
        Blockly.Blocks['system_get_time_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['année', 'year'],
                  ['mois', 'month'],
                  ['jour', 'day'],
                  ['heure', 'hour'],
                  ['minute', 'minute'],
                  ['seconde', 'second']
                ]), 'TIME_UNIT')
                .appendField("en cours");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne l\'information temporelle actuelle (année, mois, jour, etc.)');
          }
        };
        
        // Bloc system_get_timestamp
        Blockly.Blocks['system_get_timestamp'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Horodatage actuel");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne l\'horodatage actuel depuis l\'activation du robot');
          }
        };
        
        // Bloc system_get_battery_level
        Blockly.Blocks['system_get_battery_level'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Batterie restante");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne le niveau de batterie actuel en pourcentage');
          }
        };

        // === BLOCS INTELLIGENCE ===
        
        // Bloc intelligence_toggle_recognition
        Blockly.Blocks['intelligence_toggle_recognition'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['activer', 'enable'],
                  ['désactiver', 'disable']
                ]), 'ACTION')
                .appendField("l'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueurs visuels', 'markers'],
                  ['lignes', 'lines'],
                  ['applaudissements', 'claps']
                ]), 'ELEMENT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Active ou désactive la reconnaissance d\'éléments spécifiques');
          }
        };
        
        // Bloc intelligence_set_marker_distance
        Blockly.Blocks['intelligence_set_marker_distance'] = {
          init: function() {
            this.appendValueInput('DISTANCE')
                .setCheck('Number')
                .appendField("Définir la distance d'identification des marqueurs visuels à");
            this.appendDummyInput()
                .appendField("m");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Définit la portée maximale de détection des marqueurs visuels');
            this.setInputsInline(true);
          }
        };
        
        // Bloc intelligence_set_recognition_color
        Blockly.Blocks['intelligence_set_recognition_color'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir")
                .appendField(new Blockly.FieldDropdown([
                  ['rouge', 'red'],
                  ['bleu', 'blue'],
                  ['vert', 'green'],
                  ['jaune', 'yellow'],
                  ['orange', 'orange'],
                  ['violet', 'purple'],
                  ['noir', 'black'],
                  ['blanc', 'white']
                ]), 'COLOR')
                .appendField("comme couleur d'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['ligne', 'line']
                ]), 'TYPE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Détermine quelles couleurs seront reconnues comme ligne ou marqueur');
          }
        };
        
        // Bloc intelligence_set_exposure
        Blockly.Blocks['intelligence_set_exposure'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir la valeur d'exposition à")
                .appendField(new Blockly.FieldDropdown([
                  ['faible', 'low'],
                  ['moyenne', 'medium'],
                  ['élevée', 'high']
                ]), 'LEVEL');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Ajuste la sensibilité à la lumière (utile pour le suivi de ligne)');
          }
        };
        
        // Bloc intelligence_identify_and_aim
        Blockly.Blocks['intelligence_identify_and_aim'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Identifier")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("et y pointer le blaster");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Le robot repère un élément visuel et oriente son blaster vers lui');
          }
        };
        
        // Bloc intelligence_recognition_event
        Blockly.Blocks['intelligence_recognition_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Quand le robot identifie")
                .appendField(new Blockly.FieldDropdown([
                  ['un marqueur visuel', 'marker'],
                  ['une personne', 'person'],
                  ['une ligne', 'line'],
                  ['une forme', 'shape'],
                  ['un applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['un geste', 'gesture'],
                  ['un robot S1', 'robot']
                ]), 'ELEMENT');
            this.appendStatementInput('DO')
                .setCheck(null);
            this.setColour('#800080');
            this.setTooltip('Exécute un bloc quand un élément est détecté');
          }
        };
        
        // Bloc intelligence_is_recognized
        Blockly.Blocks['intelligence_is_recognized'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['geste', 'gesture'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("identifié(e)");
            this.setOutput(true, 'Boolean');
            this.setColour('#800080');
            this.setTooltip('Retourne vrai si l\'élément est détecté');
          }
        };
        
        // Bloc intelligence_wait_for_recognition
        Blockly.Blocks['intelligence_wait_for_recognition'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Attendre jusqu'à l'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['geste', 'gesture'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Suspend l\'exécution jusqu\'à ce qu\'un élément soit détecté');
          }
        };
        
        // Bloc intelligence_marker_info
        Blockly.Blocks['intelligence_marker_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur le marqueur visuel identifié");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les infos sur le marqueur détecté : nombre, ID, position (X, Y), largeur, hauteur');
          }
        };
        
        // Bloc intelligence_object_info
        Blockly.Blocks['intelligence_object_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur")
                .appendField(new Blockly.FieldDropdown([
                  ['personne', 'person'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("identifié(e)");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Retourne les données liées à un objet/personne détecté(e) : N, id, X, Y, largeur, hauteur');
          }
        };
        
        // Bloc intelligence_gesture_info
        Blockly.Blocks['intelligence_gesture_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur le geste identifié");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les infos détaillées sur un geste reconnu (position, taille, ID...)');
          }
        };
        
        // Bloc intelligence_line_info
        Blockly.Blocks['intelligence_line_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur la ligne identifiée");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les paramètres d\'une ligne détectée (points, coordonnées, courbure...)');
          }
        };
        
        // Bloc intelligence_lines_info
        Blockly.Blocks['intelligence_lines_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur les lignes identifiées");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les informations cumulées sur plusieurs lignes détectées');
          }
        };
        
        // Bloc intelligence_brightness
        Blockly.Blocks['intelligence_brightness'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Luminosité actuelle");
            this.setOutput(true, 'Number');
            this.setColour('#800080');
            this.setTooltip('Retourne la valeur de luminosité de l\'environnement détectée par la caméra');
          }
        };
        
        // Bloc intelligence_aim_position
        Blockly.Blocks['intelligence_aim_position'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Position de visée");
            this.setOutput(true, 'Number');
            this.setColour('#800080');
            this.setTooltip('Retourne la position de visée actuelle : X (abscisse) ou Y (ordonnée)');
          }
        };
        
        // === BLOCS OBJETS DE DONNÉES ===
        
        // Bloc math_map
        Blockly.Blocks['math_map'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck('Number')
                .appendField("Mapper");
            this.appendValueInput('FROM_LOW')
                .setCheck('Number')
                .appendField("de [");
            this.appendValueInput('FROM_HIGH')
                .setCheck('Number')
                .appendField(",");
            this.appendValueInput('TO_LOW')
                .setCheck('Number')
                .appendField("] vers [");
            this.appendValueInput('TO_HIGH')
                .setCheck('Number')
                .appendField(",");
            this.appendDummyInput()
                .appendField("]");
            this.setOutput(true, 'Number');
            this.setColour('#5C68A6');
            this.setTooltip('Transforme une valeur d\'une plage vers une autre');
            this.setInputsInline(true);
          }
        };
        
        // Ajout du générateur Python pour math_map
        Blockly.Python['math_map'] = function(block) {
          const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
          const fromLow = Blockly.Python.valueToCode(block, 'FROM_LOW', Blockly.Python.ORDER_NONE) || '0';
          const fromHigh = Blockly.Python.valueToCode(block, 'FROM_HIGH', Blockly.Python.ORDER_NONE) || '0';
          const toLow = Blockly.Python.valueToCode(block, 'TO_LOW', Blockly.Python.ORDER_NONE) || '0';
          const toHigh = Blockly.Python.valueToCode(block, 'TO_HIGH', Blockly.Python.ORDER_NONE) || '0';
          
          // Générer le code Python pour le mappage d'une plage à une autre
          const code = `((${value} - ${fromLow}) * (${toHigh} - ${toLow}) / (${fromHigh} - ${fromLow}) + ${toLow})`;
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        };

        // Bloc data_create_variable
        Blockly.Blocks['data_create_variable'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck(null)
                .appendField("Créer une variable nommée")
                .appendField(new Blockly.FieldTextInput("variable"), "VAR_NAME")
                .appendField("avec la valeur");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF8C00');
            this.setTooltip('Crée une variable avec un nom spécifique et une valeur initiale');
          }
        };
        
        // Bloc data_create_list
        Blockly.Blocks['data_create_list'] = function(block) {
          const listName = block.getFieldValue('LIST_NAME');
          const elements = [];
          
          for (let i = 0; i < block.itemCount_; i++) {
            const element = Blockly.Python.valueToCode(block, 'ITEM' + i, Blockly.Python.ORDER_NONE) || 'None';
            elements.push(element);
          }
          
          return `${listName} = [${elements.join(', ')}]\n`;
        };
        
        // Bloc data_create_pid
        Blockly.Blocks['data_create_pid'] = function(block) {
          const pidName = block.getFieldValue('PID_NAME');
          const p = Blockly.Python.valueToCode(block, 'P', Blockly.Python.ORDER_ATOMIC) || '1.0';
          const i = Blockly.Python.valueToCode(block, 'I', Blockly.Python.ORDER_ATOMIC) || '0.0';
          const d = Blockly.Python.valueToCode(block, 'D', Blockly.Python.ORDER_ATOMIC) || '0.0';
          
          // Import la classe PID et crée une instance
          return `from pid_controller import PID\n${pidName} = PID(p=${p}, i=${i}, d=${d})\n`;
        };

        // === BLOCS COMMANDES ===
        
        // Bloc command_wait
        Blockly.Blocks['command_wait'] = {
          init: function() {
            this.appendValueInput('TIME')
                .setCheck('Number')
                .appendField('Attendre');
            this.appendDummyInput()
                .appendField('secondes');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Attend le nombre de secondes spécifié avant de continuer');
            this.setInputsInline(true);
          }
        };
        
        // Bloc command_forever
        Blockly.Blocks['command_forever'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Répéter indéfiniment');
            this.appendStatementInput('DO')
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Exécute les blocs en boucle sans fin');
          }
        };
        
        // Bloc command_stop_program
        Blockly.Blocks['command_stop_program'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Arrêter le programme');
            this.setPreviousStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Arrête l\'exécution du programme');
          }
        };
        
        // === BLOCS SYSTÈME ===
        
        // Bloc system_set_movement_mode
        Blockly.Blocks['system_set_movement_mode'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir le mode de déplacement à")
                .appendField(new Blockly.FieldDropdown([
                  ['châssis directeur', 'chassis_lead'],
                  ['tourelle directrice', 'gimbal_lead'],
                  ['libre', 'free']
                ]), 'MODE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Définit le mode de déplacement du robot');
          }
        };
        
        // Bloc system_timer_control
        Blockly.Blocks['system_timer_control'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['lancer', 'start'],
                  ['suspendre', 'pause'],
                  ['arrêter', 'stop']
                ]), 'ACTION')
                .appendField("le chrono");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Contrôle le chronomètre interne');
          }
        };
        
        // Bloc system_set_camera_zoom
        Blockly.Blocks['system_set_camera_zoom'] = {
          init: function() {
            this.appendValueInput('ZOOM_LEVEL')
                .setCheck('Number')
                .appendField("Régler le zoom de la caméra à");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#008080');
            this.setTooltip('Règle le niveau de zoom de la caméra (1-5)');
          }
        };
        
        // Bloc system_get_timer_duration
        Blockly.Blocks['system_get_timer_duration'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Durée du chrono");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne la durée écoulée du chronomètre en secondes');
          }
        };
        
        // Bloc system_get_program_runtime
        Blockly.Blocks['system_get_program_runtime'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Temps d'exécution du programme");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne la durée totale d\'exécution du programme en secondes');
          }
        };
        
        // Bloc system_get_time_info
        Blockly.Blocks['system_get_time_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['année', 'year'],
                  ['mois', 'month'],
                  ['jour', 'day'],
                  ['heure', 'hour'],
                  ['minute', 'minute'],
                  ['seconde', 'second']
                ]), 'TIME_UNIT')
                .appendField("en cours");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne l\'information temporelle actuelle (année, mois, jour, etc.)');
          }
        };
        
        // Bloc system_get_timestamp
        Blockly.Blocks['system_get_timestamp'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Horodatage actuel");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne l\'horodatage actuel depuis l\'activation du robot');
          }
        };
        
        // Bloc system_get_battery_level
        Blockly.Blocks['system_get_battery_level'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Batterie restante");
            this.setOutput(true, 'Number');
            this.setColour('#008080');
            this.setTooltip('Retourne le niveau de batterie actuel en pourcentage');
          }
        };

        // === BLOCS INTELLIGENCE ===
        
        // Bloc intelligence_toggle_recognition
        Blockly.Blocks['intelligence_toggle_recognition'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['activer', 'enable'],
                  ['désactiver', 'disable']
                ]), 'ACTION')
                .appendField("l'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueurs visuels', 'markers'],
                  ['lignes', 'lines'],
                  ['applaudissements', 'claps']
                ]), 'ELEMENT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Active ou désactive la reconnaissance d\'éléments spécifiques');
          }
        };
        
        // Bloc intelligence_set_marker_distance
        Blockly.Blocks['intelligence_set_marker_distance'] = {
          init: function() {
            this.appendValueInput('DISTANCE')
                .setCheck('Number')
                .appendField("Définir la distance d'identification des marqueurs visuels à");
            this.appendDummyInput()
                .appendField("m");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Définit la portée maximale de détection des marqueurs visuels');
            this.setInputsInline(true);
          }
        };
        
        // Bloc intelligence_set_recognition_color
        Blockly.Blocks['intelligence_set_recognition_color'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir")
                .appendField(new Blockly.FieldDropdown([
                  ['rouge', 'red'],
                  ['bleu', 'blue'],
                  ['vert', 'green'],
                  ['jaune', 'yellow'],
                  ['orange', 'orange'],
                  ['violet', 'purple'],
                  ['noir', 'black'],
                  ['blanc', 'white']
                ]), 'COLOR')
                .appendField("comme couleur d'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['ligne', 'line']
                ]), 'TYPE');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Détermine quelles couleurs seront reconnues comme ligne ou marqueur');
          }
        };
        
        // Bloc intelligence_set_exposure
        Blockly.Blocks['intelligence_set_exposure'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Définir la valeur d'exposition à")
                .appendField(new Blockly.FieldDropdown([
                  ['faible', 'low'],
                  ['moyenne', 'medium'],
                  ['élevée', 'high']
                ]), 'LEVEL');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Ajuste la sensibilité à la lumière (utile pour le suivi de ligne)');
          }
        };
        
        // Bloc intelligence_identify_and_aim
        Blockly.Blocks['intelligence_identify_and_aim'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Identifier")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("et y pointer le blaster");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Le robot repère un élément visuel et oriente son blaster vers lui');
          }
        };
        
        // Bloc intelligence_recognition_event
        Blockly.Blocks['intelligence_recognition_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Quand le robot identifie")
                .appendField(new Blockly.FieldDropdown([
                  ['un marqueur visuel', 'marker'],
                  ['une personne', 'person'],
                  ['une ligne', 'line'],
                  ['une forme', 'shape'],
                  ['un applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['un geste', 'gesture'],
                  ['un robot S1', 'robot']
                ]), 'ELEMENT');
            this.appendStatementInput('DO')
                .setCheck(null);
            this.setColour('#800080');
            this.setTooltip('Exécute un bloc quand un élément est détecté');
          }
        };
        
        // Bloc intelligence_is_recognized
        Blockly.Blocks['intelligence_is_recognized'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['geste', 'gesture'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("identifié(e)");
            this.setOutput(true, 'Boolean');
            this.setColour('#800080');
            this.setTooltip('Retourne vrai si l\'élément est détecté');
          }
        };
        
        // Bloc intelligence_wait_for_recognition
        Blockly.Blocks['intelligence_wait_for_recognition'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Attendre jusqu'à l'identification de")
                .appendField(new Blockly.FieldDropdown([
                  ['marqueur visuel', 'marker'],
                  ['personne', 'person'],
                  ['ligne', 'line'],
                  ['forme', 'shape'],
                  ['applaudissement', 'clap_once'],
                  ['deux applaudissements', 'clap_twice'],
                  ['geste', 'gesture'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#800080');
            this.setTooltip('Suspend l\'exécution jusqu\'à ce qu\'un élément soit détecté');
          }
        };
        
        // Bloc intelligence_marker_info
        Blockly.Blocks['intelligence_marker_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur le marqueur visuel identifié");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les infos sur le marqueur détecté : nombre, ID, position (X, Y), largeur, hauteur');
          }
        };
        
        // Bloc intelligence_object_info
        Blockly.Blocks['intelligence_object_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur")
                .appendField(new Blockly.FieldDropdown([
                  ['personne', 'person'],
                  ['robot S1', 'robot']
                ]), 'ELEMENT')
                .appendField("identifié(e)");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Retourne les données liées à un objet/personne détecté(e) : N, id, X, Y, largeur, hauteur');
          }
        };
        
        // Bloc intelligence_gesture_info
        Blockly.Blocks['intelligence_gesture_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur le geste identifié");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les infos détaillées sur un geste reconnu (position, taille, ID...)');
          }
        };
        
        // Bloc intelligence_line_info
        Blockly.Blocks['intelligence_line_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur la ligne identifiée");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les paramètres d\'une ligne détectée (points, coordonnées, courbure...)');
          }
        };
        
        // Bloc intelligence_lines_info
        Blockly.Blocks['intelligence_lines_info'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Infos sur les lignes identifiées");
            this.setOutput(true, null);
            this.setColour('#800080');
            this.setTooltip('Donne les informations cumulées sur plusieurs lignes détectées');
          }
        };
        
        // Bloc intelligence_brightness
        Blockly.Blocks['intelligence_brightness'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Luminosité actuelle");
            this.setOutput(true, 'Number');
            this.setColour('#800080');
            this.setTooltip('Retourne la valeur de luminosité de l\'environnement détectée par la caméra');
          }
        };
        
        // Bloc intelligence_aim_position
        Blockly.Blocks['intelligence_aim_position'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Position de visée");
            this.setOutput(true, 'Number');
            this.setColour('#800080');
            this.setTooltip('Retourne la position de visée actuelle : X (abscisse) ou Y (ordonnée)');
          }
        };
        
        // === BLOCS OBJETS DE DONNÉES ===
        
        // Bloc math_map
        Blockly.Blocks['math_map'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck('Number')
                .appendField("Mapper");
            this.appendValueInput('FROM_LOW')
                .setCheck('Number')
                .appendField("de [");
            this.appendValueInput('FROM_HIGH')
                .setCheck('Number')
                .appendField(",");
            this.appendValueInput('TO_LOW')
                .setCheck('Number')
                .appendField("] vers [");
            this.appendValueInput('TO_HIGH')
                .setCheck('Number')
                .appendField(",");
            this.appendDummyInput()
                .appendField("]");
            this.setOutput(true, 'Number');
            this.setColour('#5C68A6');
            this.setTooltip('Transforme une valeur d\'une plage vers une autre');
            this.setInputsInline(true);
          }
        };
        
        // Ajout du générateur Python pour math_map
        Blockly.Python['math_map'] = function(block) {
          const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
          const fromLow = Blockly.Python.valueToCode(block, 'FROM_LOW', Blockly.Python.ORDER_NONE) || '0';
          const fromHigh = Blockly.Python.valueToCode(block, 'FROM_HIGH', Blockly.Python.ORDER_NONE) || '0';
          const toLow = Blockly.Python.valueToCode(block, 'TO_LOW', Blockly.Python.ORDER_NONE) || '0';
          const toHigh = Blockly.Python.valueToCode(block, 'TO_HIGH', Blockly.Python.ORDER_NONE) || '0';
          
          // Générer le code Python pour le mappage d'une plage à une autre
          const code = `((${value} - ${fromLow}) * (${toHigh} - ${toLow}) / (${fromHigh} - ${fromLow}) + ${toLow})`;
          return [code, Blockly.Python.ORDER_FUNCTION_CALL];
        };

        // Bloc data_create_variable
        Blockly.Blocks['data_create_variable'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck(null)
                .appendField("Créer une variable nommée")
                .appendField(new Blockly.FieldTextInput("variable"), "VAR_NAME")
                .appendField("avec la valeur");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF8C00');
            this.setTooltip('Crée une variable avec un nom spécifique et une valeur initiale');
          }
        };
        
        // Bloc data_create_list
        Blockly.Blocks['data_create_list'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Créer une liste nommée")
                .appendField(new Blockly.FieldTextInput("liste"), "LIST_NAME");
            this.appendDummyInput('EMPTY')
                .appendField("vide");
            this.itemCount_ = 0;
            this.updateShape_();
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setMutator(new Blockly.Mutator(['list_create_with_item']));
            this.setColour('#FF8C00');
            this.setTooltip('Crée une liste avec un nom spécifique');
          },
          
          mutationToDom: function() {
            const container = document.createElement('mutation');
            container.setAttribute('items', this.itemCount_);
            return container;
          },
          
          domToMutation: function(xmlElement) {
            this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
            this.updateShape_();
          },
          
          decompose: function(workspace) {
            const containerBlock = workspace.newBlock('list_create_with_container');
            containerBlock.initSvg();
            
            let connection = containerBlock.getInput('STACK').connection;
            for (let i = 0; i < this.itemCount_; i++) {
              const itemBlock = workspace.newBlock('list_create_with_item');
              itemBlock.initSvg();
              connection.connect(itemBlock.previousConnection);
              connection = itemBlock.nextConnection;
            }
            
            return containerBlock;
          },
          
          compose: function(containerBlock) {
            let itemBlock = containerBlock.getInputTargetBlock('STACK');
            let connections = [];
            while (itemBlock) {
              connections.push(itemBlock.valueConnection_);
              itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            }
            
            this.itemCount_ = connections.length;
            this.updateShape_();
            
            for (let i = 0; i < this.itemCount_; i++) {
              if (connections[i]) {
                this.getInput('ITEM' + i).connection.connect(connections[i]);
              }
            }
          },
          
          saveConnections: function(containerBlock) {
            let itemBlock = containerBlock.getInputTargetBlock('STACK');
            let i = 0;
            while (itemBlock) {
              const input = this.getInput('ITEM' + i);
              itemBlock.valueConnection_ = input && input.connection.targetConnection;
              i++;
              itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            }
          },
          
          updateShape_: function() {
            // Supprimer les entrées existantes
            if (this.getInput('EMPTY')) {
              this.removeInput('EMPTY');
            }
            
            for (let i = 0; this.getInput('ITEM' + i); i++) {
              this.removeInput('ITEM' + i);
            }
            
            // Ajouter les nouvelles entrées
            if (this.itemCount_ === 0) {
              this.appendDummyInput('EMPTY')
                  .appendField("vide");
            } else {
              for (let i = 0; i < this.itemCount_; i++) {
                const input = this.appendValueInput('ITEM' + i)
                    .setCheck(null)
                    .appendField(i === 0 ? "avec les éléments" : "et");
              }
            }
          }
        };
        
        // Bloc pour le mutator de liste
        Blockly.Blocks['list_create_with_container'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("liste");
            this.appendStatementInput('STACK');
            this.setColour('#FF8C00');
            this.setTooltip('Conteneur pour les éléments de la liste');
            this.contextMenu = false;
          }
        };
        
        // Item pour le mutator de liste
        Blockly.Blocks['list_create_with_item'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("élément");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour('#FF8C00');
            this.setTooltip('Ajouter un élément à la liste');
            this.contextMenu = false;
          }
        };
        
        // Bloc data_create_pid
        Blockly.Blocks['data_create_pid'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("Créer un régulateur PID nommé")
                .appendField(new Blockly.FieldTextInput("pid"), "PID_NAME");
            this.appendValueInput('P')
                .setCheck('Number')
                .appendField("P :");
            this.appendValueInput('I')
                .setCheck('Number')
                .appendField("I :");
            this.appendValueInput('D')
                .setCheck('Number')
                .appendField("D :");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF8C00');
            this.setTooltip('Crée un régulateur PID avec les coefficients P, I et D');
          }
        };

        // === BLOCS DATA ===
        
        // Bloc data_list_define
        Blockly.Blocks['data_list_define'] = {
          init: function() {
            this.appendValueInput('VALUE')
                .setCheck('Array')
                .appendField('Définir la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST')
                .appendField('à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Définit la valeur initiale d\'une liste');
          }
        };

        Blockly.Blocks['data_list_add'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('Ajouter l\'élément')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Ajoute un élément à la fin de la liste');
          }
        };

        Blockly.Blocks['data_list_remove_item'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Supprimer l\'élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Supprime l\'élément à la position spécifiée (commence à 1)');
          }
        };

        Blockly.Blocks['data_list_remove_all'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Vider la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Supprime tous les éléments de la liste');
          }
        };

        Blockly.Blocks['data_list_insert'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('Insérer l\'élément');
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Insère un élément à la position spécifiée (commence à 1)');
          }
        };

        Blockly.Blocks['data_list_replace'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Remplacer l\'élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('par');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Remplace l\'élément à la position spécifiée (commence à 1)');
          }
        };

        Blockly.Blocks['data_list_get_item'] = {
          init: function() {
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField('Élément à la position')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setOutput(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Récupère l\'élément à la position spécifiée (commence à 1)');
          }
        };

        Blockly.Blocks['data_list_get_first_items'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Les')
                .appendField(new Blockly.FieldNumber(3, 1, 100), 'COUNT')
                .appendField('premiers éléments de')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setOutput(true, 'Array');
            this.setColour('#9966FF');
            this.setTooltip('Récupère les premiers éléments de la liste');
          }
        };

        Blockly.Blocks['data_list_length'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Longueur de la liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST');
            this.setOutput(true, 'Number');
            this.setColour('#9966FF');
            this.setTooltip('Renvoie le nombre d\'éléments dans la liste');
          }
        };

        Blockly.Blocks['data_list_contains'] = {
          init: function() {
            this.appendValueInput('ITEM')
                .setCheck(null)
                .appendField('La liste')
                .appendField(new Blockly.FieldVariable('liste', null, ['list'], 'list'), 'LIST')
                .appendField('contient');
            this.setOutput(true, 'Boolean');
            this.setColour('#9966FF');
            this.setTooltip('Vérifie si la liste contient l\'élément spécifié');
          }
        };
        
        // Définition des blocs de PID
        Blockly.Blocks['data_pid_set_parameters'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Régler les paramètres du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID');
            this.appendValueInput('P')
                .setCheck('Number')
                .appendField('P =');
            this.appendValueInput('I')
                .setCheck('Number')
                .appendField('I =');
            this.appendValueInput('D')
                .setCheck('Number')
                .appendField('D =');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Règle les paramètres P, I et D du régulateur PID');
          }
        };
        
        Blockly.Blocks['data_pid_set_error'] = {
          init: function() {
            this.appendValueInput('ERROR')
                .setCheck('Number')
                .appendField('Définir l\'erreur du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID')
                .appendField('à');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip('Définit la valeur d\'erreur pour le calcul du PID');
          }
        };
        
        Blockly.Blocks['data_pid_get_output'] = {
          init: function() {
            this.appendDummyInput()
                .appendField('Sortie du PID')
                .appendField(new Blockly.FieldVariable('pid', null, ['pid'], 'pid'), 'PID');
            this.setOutput(true, 'Number');
            this.setColour('#9966FF');
            this.setTooltip('Retourne la valeur de sortie calculée par le régulateur PID');
          }
        };

        console.log("Blocs personnalisés et générateurs définis avec succès");
      } catch (err) {
        console.error("Erreur lors de la définition des blocs personnalisés:", err);
      }
    };

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