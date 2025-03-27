import React, { useState } from 'react';
import { useRobotStore } from '../store/RobotStore';
import { saveProject } from '../utils/projectStorage';

export default function SavePrompt({ onClose }) {
  const { currentScript, setCurrentScript } = useRobotStore();
  const [projectName, setProjectName] = useState(currentScript?.name || 'Nouveau script');
  
  const handleSave = () => {
    if (!currentScript) return;
    
    const savedProject = saveProject({
      id: currentScript.id,
      name: projectName,
      blocklyXml: currentScript.blocklyXml,
      pythonCode: currentScript.pythonCode
    });
    
    setCurrentScript({
      ...currentScript,
      id: savedProject.id,
      name: projectName,
      modified: false
    });
    
    if (onClose) onClose();
  };
  
  const handleDiscard = () => {
    if (onClose) onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Sauvegarder les modifications</h2>
        
        <p className="mb-4">Voulez-vous sauvegarder les modifications apportées à votre script ?</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nom du script</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDiscard}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
          >
            Ne pas sauvegarder
          </button>
          
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}