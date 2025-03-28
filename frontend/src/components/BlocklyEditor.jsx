import React, { useEffect, useRef } from 'react';
import { useRobotStore } from '../store/RobotStore';
import * as Blockly from 'blockly';
import 'blockly/python';
import 'blockly/blocks';

// Importer les blocs personnalisés
import '../blockly/blocks/index.js';
import '../blockly/generators/index.js';

export default function BlocklyEditor({ onCodeGenerated }) {
  const blocklyDiv = useRef(null);
  const blocklyWorkspace = useRef(null);
  
  const { 
    currentScript, 
    updateBlocklyXml, 
    updatePythonCode,
    setScriptModified 
  } = useRobotStore();

  // Initialisation de Blockly
  useEffect(() => {
    if (!blocklyDiv.current || blocklyWorkspace.current) return;

    // Configuration de la toolbox (boîte à outils)
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
          ],
        },
        {
          kind: 'category',
          name: 'Variables',
          colour: '#A65C81',
          custom: 'VARIABLE',
        },
        {
          kind: 'category',
          name: 'RoboMaster',
          colour: '#A6745C',
          contents: [
            // Ces blocs seront définis dans les fichiers custom blocks
            { kind: 'block', type: 'robot_move' },
            { kind: 'block', type: 'robot_led' },
            { kind: 'block', type: 'robot_arm' },
            { kind: 'block', type: 'robot_gripper' },
          ],
        },
      ],
    };

    // S'assurer que le div est correctement dimensionné avant d'injecter Blockly
    blocklyDiv.current.style.width = '100%';
    blocklyDiv.current.style.height = '500px';

    // Création de l'espace de travail Blockly
    blocklyWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox,
      scrollbars: true,
      horizontalLayout: false,
      trashcan: true,
      sounds: false,
      // Utiliser des chemins relatifs pour les médias
      media: './media/',
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
    });

    // Chargement du XML si disponible
    if (currentScript?.blocklyXml) {
      try {
        const xml = Blockly.Xml.textToDom(currentScript.blocklyXml);
        Blockly.Xml.domToWorkspace(xml, blocklyWorkspace.current);
      } catch (e) {
        console.error('Erreur lors du chargement du XML Blockly:', e);
      }
    }

    // Événement de changement
    blocklyWorkspace.current.addChangeListener(() => {
      // Sauvegarde du XML
      const xml = Blockly.Xml.workspaceToDom(blocklyWorkspace.current);
      const xmlText = Blockly.Xml.domToText(xml);
      updateBlocklyXml(xmlText);
      
      // Génération du code Python
      const pythonCode = Blockly.Python.workspaceToCode(blocklyWorkspace.current);
      updatePythonCode(pythonCode);
      
      if (onCodeGenerated) {
        onCodeGenerated(pythonCode);
      }
      
      setScriptModified(true);
    });

    return () => {
      // Nettoyage de l'espace de travail Blockly
      if (blocklyWorkspace.current) {
        blocklyWorkspace.current.dispose();
      }
    };
  }, [currentScript?.blocklyXml, onCodeGenerated, updateBlocklyXml, updatePythonCode, setScriptModified]);

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-full min-h-[500px] border border-gray-700 rounded"
    />
  );
}