import React from 'react';
import { useRobotStore } from '../store/RobotStore';

export default function BlocklyTopbar() {
  const { 
    isExecuting, 
    setExecuting,
    currentScript
  } = useRobotStore();

  const handleExecute = () => {
    if (!isExecuting && currentScript?.pythonCode) {
      setExecuting(true);
      // Ici, on ajouterait l'appel à l'API pour exécuter le code
      setTimeout(() => {
        setExecuting(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleExecute}
          disabled={isExecuting || !currentScript}
          className={`px-4 py-2 rounded ${isExecuting || !currentScript ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
        >
          {isExecuting ? 'Exécution...' : 'Exécuter'}
        </button>
        
        <button 
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
          disabled={!currentScript}
        >
          Sauvegarder
        </button>
      </div>
      
      <div className="text-white font-medium">
        {currentScript?.name || 'Nouveau script'}
        {currentScript?.modified && <span className="ml-2 text-yellow-400">*</span>}
      </div>
    </div>
  );
}