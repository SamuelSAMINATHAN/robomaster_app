import React from 'react';
import { useRobotStore } from '../store/RobotStore';
import { createNewProject, saveProject, renameProject } from '../utils/projectStorage';
import { FaPlus, FaSave, FaBatteryThreeQuarters } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function BlocklyTopbar() {
  const { 
    currentScript,
    setCurrentScript,
    updateBlocklyXml,
    updatePythonCode,
    connected,
    batteryLevel
  } = useRobotStore();
  
  const navigate = useNavigate();

  const handleCreateNew = async () => {
    // Créer un nouveau projet en demandant d'abord un nom
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
  };

  const handleSave = () => {
    if (currentScript) {
      // Sauvegarde le projet actuel
      saveProject(currentScript);
      // Mise à jour du script pour enlever le marqueur "modifié"
      setCurrentScript({
        ...currentScript,
        modified: false
      });
    }
  };

  const handleRename = async () => {
    if (currentScript) {
      const newName = window.prompt("Renommer le script:", currentScript.name);
      if (newName && newName !== currentScript.name) {
        const updatedProject = renameProject(currentScript.id, newName);
        if (updatedProject) {
          setCurrentScript({
            ...currentScript,
            name: updatedProject.name
          });
        }
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleBackToHome}
          className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
          title="Retour à l'accueil"
        >
          &larr; Accueil
        </button>
        
        <button 
          onClick={handleCreateNew}
          className="flex items-center bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-medium transition-colors"
          title="Créer un nouveau script"
        >
          <FaPlus className="mr-2" size={14} />
          Nouveau
        </button>

        <button 
          onClick={handleSave}
          disabled={!currentScript}
          className={`flex items-center px-4 py-2 rounded font-medium transition-colors ${
            !currentScript 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
          title="Sauvegarder le script"
        >
          <FaSave className="mr-2" size={14} />
          Sauvegarder
        </button>
      </div>
      
      <div className="flex items-center">
        {connected && (
          <div className="flex items-center mr-4 bg-gray-700 px-3 py-1 rounded">
            <FaBatteryThreeQuarters 
              className={`mr-2 ${
                batteryLevel > 50 ? 'text-green-500' : 
                batteryLevel > 20 ? 'text-yellow-500' : 
                'text-red-500'
              }`} 
              size={16} 
            />
            <span className="text-sm">{batteryLevel}%</span>
          </div>
        )}
        <div 
          onClick={handleRename} 
          className="bg-gray-700 px-3 py-2 rounded cursor-pointer hover:bg-gray-600 text-white font-medium"
          title="Cliquez pour renommer"
        >
          {currentScript?.name || 'Nouveau script'}
          {currentScript?.modified && <span className="ml-2 text-yellow-400">*</span>}
        </div>
      </div>
    </div>
  );
}