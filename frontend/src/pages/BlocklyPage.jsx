import React, { useState, useEffect } from 'react';
import { useRobotStore } from '../store/RobotStore';
import SimpleBlockly from '../components/SimpleBlockly';
import BlocklyTopbar from '../components/BlocklyTopbar';
import CameraDisplay from '../components/CameraDisplay';
import LogsTerminal from '../components/LogsTerminal';
import PythonViewer from '../components/PythonViewer';
import { askForProjectName, createNewProject } from '../utils/projectStorage';
import { FaPlay, FaChevronRight, FaChevronLeft, FaCode, FaVideo } from 'react-icons/fa';

export default function BlocklyPage() {
  const { 
    currentScript, 
    setCurrentScript, 
    showCamera, 
    toggleCamera,
    isExecuting,
    setExecuting
  } = useRobotStore();
  
  const [showPython, setShowPython] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // Créer un nouveau script si aucun n'est sélectionné
  useEffect(() => {
    const initializeProject = async () => {
      if (!currentScript) {
        const newProject = await createNewProject();
        if (newProject) {
          setCurrentScript({
            id: newProject.id,
            name: newProject.name,
            blocklyXml: newProject.blocklyXml,
            pythonCode: newProject.pythonCode,
            modified: false
          });
        }
      }
    };
    
    initializeProject();
  }, [currentScript, setCurrentScript]);

  const handleExecute = async () => {
    if (!isExecuting && currentScript?.pythonCode) {
      setExecuting(true);
      try {
        // Appel à l'API pour exécuter le code
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: currentScript.pythonCode,
            code_type: 'python'
          }),
        });
        
        // Traiter la réponse
        if (response.ok) {
          const result = await response.json();
          console.log('Exécution réussie:', result);
        } else {
          console.error('Erreur lors de l\'exécution:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de l\'exécution:', error);
      } finally {
        // Terminer l'exécution après un court délai
        setTimeout(() => {
          setExecuting(false);
        }, 500);
      }
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <BlocklyTopbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Zone Blockly (gauche) - Supprimer la bordure */}
        <div className={`${collapsed ? 'w-11/12' : 'w-3/5'} relative transition-all duration-300`}>
          <SimpleBlockly />
          
          {/* Bouton de collapse/expand en haut à droite de Blockly */}
          <button 
            onClick={toggleCollapse}
            className="absolute top-4 right-0 transform translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10"
            title={collapsed ? "Afficher le panneau latéral" : "Agrandir Blockly"}
          >
            {collapsed ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          
          {/* Mini-contrôles quand interface rétractée (maintenant en haut) */}
          {collapsed && (
            <div className="absolute top-16 right-4 flex flex-col space-y-2">
              <button 
                onClick={handleExecute}
                disabled={isExecuting}
                className={`p-3 rounded-full shadow-lg ${isExecuting ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'}`}
                title="Exécuter le script"
              >
                <FaPlay />
              </button>
            </div>
          )}
        </div>
        
        {/* Zone Camera/Logs/Python (droite) */}
        <div className={`${collapsed ? 'w-1/12' : 'w-2/5'} flex flex-col transition-all duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Contrôles supérieurs */}
          <div className="bg-gray-800 p-2 border-b border-gray-700 flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowPython(!showPython)}
                className={`flex items-center px-3 py-1 rounded ${showPython ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <FaCode className="mr-1" size={14} />
                Code Python
              </button>
              
              <button 
                onClick={toggleCamera}
                className={`flex items-center px-3 py-1 rounded ${showCamera ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <FaVideo className="mr-1" size={14} />
                Caméra
              </button>

              <button 
                onClick={handleExecute}
                disabled={isExecuting}
                className={`flex items-center px-3 py-1 rounded ${isExecuting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
              >
                <FaPlay className="mr-1" size={14} />
                {isExecuting ? 'Exécution...' : 'Exécuter'}
              </button>
            </div>
          </div>
          
          {/* Zone contenu dynamique */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {showCamera && (
              <div className={`${showPython ? 'h-1/2' : 'h-3/4'} border-b border-gray-700 bg-black`}>
                <div className="h-6 bg-gray-800 text-xs px-2 py-1">Caméra</div>
                <div className="h-[calc(100%-1.5rem)]">
                  <CameraDisplay />
                </div>
              </div>
            )}
            
            {showPython && (
              <div className={`${showCamera ? 'h-1/3' : 'h-2/3'} border-b border-gray-700 bg-gray-900`}>
                <div className="h-6 bg-gray-800 text-xs px-2 py-1">Code Python</div>
                <div className="h-[calc(100%-1.5rem)] overflow-auto">
                  <PythonViewer />
                </div>
              </div>
            )}
            
            <div className={`${showCamera && showPython ? 'h-1/6' : (showCamera || showPython) ? 'h-1/4' : 'h-full'} bg-gray-900`}>
              <div className="h-6 bg-gray-800 text-xs px-2 py-1">Logs</div>
              <div className="h-[calc(100%-1.5rem)] overflow-auto">
                <LogsTerminal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}