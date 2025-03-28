import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject, renameProject, saveProject } from '../utils/projectStorage'; // Importer la fonction pour sauvegarder un projet
import { useRobotStore } from '../store/RobotStore';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectToRename, setProjectToRename] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
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

  const handleDeleteClick = (e, project) => {
    e.stopPropagation(); // Empêcher la navigation vers l'éditeur
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleRenameClick = (e, project) => {
    e.stopPropagation(); // Empêcher la navigation vers l'éditeur
    setProjectToRename(project);
    setNewProjectName(project.name);
    setShowRenameModal(true);
  };

  const confirmRename = () => {
    if (projectToRename && newProjectName.trim()) {
      const updatedProject = renameProject(projectToRename.id, newProjectName.trim());
      if (updatedProject) {
        setProjects(projects.map(p => p.id === projectToRename.id ? updatedProject : p));
      }
      setShowRenameModal(false);
      setProjectToRename(null);
      setNewProjectName('');
    }
  };

  const handleNewScript = () => {
    const newProject = {
      id: Date.now().toString(),
      name: 'Nouveau Script',
      blocklyXml: '',
      pythonCode: '',
      updatedAt: new Date().toISOString(),
    };

    saveProject(newProject); // Sauvegarder le nouveau projet
    setProjects([...projects, newProject]); // Mettre à jour la liste des projets
    setCurrentScript(newProject); // Définir le nouveau projet comme script actuel
    navigate('/blockly'); // Naviguer vers l'éditeur Blockly
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Bienvenue dans l'application RoboMaster</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <Link
            to="#"
            onClick={handleNewScript}
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
                className="bg-gray-800 p-4 rounded hover:bg-gray-700 transition cursor-pointer relative"
                onClick={() => handleProjectClick(project)}
              >
                <div className="font-semibold text-lg">{project.name}</div>
                <div className="text-sm text-gray-400">
                  Modifié le: {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={(e) => handleRenameClick(e, project)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full"
                    title="Renommer"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, project)}
                    className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full"
                    title="Supprimer"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer le script "{projectToDelete?.name}" ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renommage */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Renommer le script</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 mb-6 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Nouveau nom du script"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmRename}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!newProjectName.trim()}
              >
                Renommer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}