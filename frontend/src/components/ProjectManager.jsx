import React, { useState, useEffect } from 'react';
import { useRobotStore } from '../store/RobotStore';
import { getAllProjects, saveProject, deleteProject } from '../utils/projectStorage';

export default function ProjectManager({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { currentScript, setCurrentScript } = useRobotStore();
  
  // Charger les projets au démarrage
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
  };
  
  const handleProjectSelect = (project) => {
    setCurrentScript({
      id: project.id,
      name: project.name,
      blocklyXml: project.blocklyXml,
      pythonCode: project.pythonCode,
      modified: false
    });
    
    if (onProjectSelect) {
      onProjectSelect(project);
    }
    
    setShowModal(false);
  };
  
  const handleSaveProject = () => {
    if (!currentScript) return;
    
    const savedProject = saveProject({
      id: currentScript.id,
      name: currentScript.name,
      blocklyXml: currentScript.blocklyXml,
      pythonCode: currentScript.pythonCode
    });
    
    setCurrentScript({
      ...currentScript,
      id: savedProject.id,
      modified: false
    });
    
    loadProjects();
  };
  
  const handleDeleteProject = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(id);
      loadProjects();
      
      if (currentScript && currentScript.id === id) {
        setCurrentScript(null);
      }
    }
  };
  
  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
        >
          Ouvrir un projet
        </button>
        
        <button
          onClick={handleSaveProject}
          disabled={!currentScript}
          className={`px-4 py-2 rounded text-white ${!currentScript ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
        >
          Sauvegarder
        </button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl text-white">
            <h2 className="text-xl font-bold mb-4">Sélectionner un projet</h2>
            
            <div className="max-h-[400px] overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-gray-400">Aucun projet disponible</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      className="bg-gray-700 p-4 rounded hover:bg-gray-600 cursor-pointer relative"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-400">
                        Modifié le: {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}