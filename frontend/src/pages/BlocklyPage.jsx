import React, { useState, useEffect } from 'react';
import BlocklyEditor from '../components/BlocklyEditor.jsx';
import BlocklyTopbar from '../components/BlocklyTopbar.jsx';
import CameraDisplay from '../components/CameraDisplay.jsx';
import LogsTerminal from '../components/LogsTerminal.jsx';
import PythonViewer from '../components/PythonViewer.jsx';
import { useRobotStore } from '../store/RobotStore';
import { createNewProject } from '../utils/projectStorage';

export default function BlocklyPage() {
  const [showPython, setShowPython] = useState(false);
  const { setCurrentScript, showCamera, toggleCamera } = useRobotStore();
  
  // Créer un nouveau projet au chargement si aucun n'est sélectionné
  useEffect(() => {
    const newProject = createNewProject();
    setCurrentScript({
      id: newProject.id,
      name: newProject.name,
      blocklyXml: newProject.blocklyXml,
      pythonCode: newProject.pythonCode,
      modified: false
    });
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Zone Blockly à gauche */}
      <div className="flex-1 flex flex-col">
        <BlocklyTopbar />
        <div className="flex-1 p-4">
          <BlocklyEditor />
        </div>
      </div>

      {/* Zone Caméra/Logs/Python à droite */}
      <div className="w-full md:w-1/3 border-l border-gray-700 flex flex-col">
        {/* Boutons en haut */}
        <div className="flex space-x-2 p-4 bg-gray-800 border-b border-gray-700">
          <button 
            onClick={() => setShowPython(!showPython)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          >
            {showPython ? 'Masquer code Python' : 'Afficher code Python'}
          </button>
          <button 
            onClick={toggleCamera}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          >
            {showCamera ? 'Masquer caméra' : 'Afficher caméra'}
          </button>
        </div>

        <div className="flex-1 p-4 flex flex-col space-y-4 overflow-auto">
          {showPython && (
            <PythonViewer className="flex-1" />
          )}
          
          {showCamera && (
            <CameraDisplay className="flex-1" />
          )}
          
          <LogsTerminal className="flex-1" />
        </div>
      </div>
    </div>
  );
}