import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects } from '../utils/projectStorage';
import { useRobotStore } from '../store/RobotStore';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { setCurrentScript } = useRobotStore();

  useEffect(() => {
    // Charger les projets depuis le stockage local
    const loadedProjects = getAllProjects();
    setProjects(loadedProjects);
  }, []);

  const handleProjectClick = (project) => {
    // Définir le projet actuel dans le store
    setCurrentScript({
      id: project.id,
      name: project.name,
      blocklyXml: project.blocklyXml,
      pythonCode: project.pythonCode,
      modified: false
    });
    
    // Naviguer vers l'éditeur Blockly
    navigate('/blockly');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Bienvenue dans l'application RoboMaster</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <Link
            to="/blockly"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0"
          >
            Nouveau script Blockly
          </Link>
          <Link
            to="/guide"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Guide d'utilisation
          </Link>
        </div>

        <h2 className="text-xl font-semibold mb-4">Mes scripts</h2>
        
        {projects.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded text-center">
            <p className="text-gray-400 mb-4">Vous n'avez pas encore de scripts</p>
            <Link
              to="/blockly"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded inline-block"
            >
              Créer mon premier script
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 p-4 rounded hover:bg-gray-700 transition cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <div className="font-semibold text-lg">{project.name}</div>
                <div className="text-sm text-gray-400">
                  Modifié le: {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}