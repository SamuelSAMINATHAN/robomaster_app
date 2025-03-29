import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject, renameProject, createNewProject, deleteAllProjects, importProjectFromFile } from '../utils/projectStorage';
import { useRobotStore } from '../store/RobotStore';
import { FaPencilAlt, FaTimes, FaRobot, FaPlus, FaBook, FaTrash, FaFileImport } from 'react-icons/fa';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectToRename, setProjectToRename] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const navigate = useNavigate();
  const { setCurrentScript } = useRobotStore();

  // Fonction pour charger les projets
  const loadProjects = () => {
    const loadedProjects = getAllProjects();
    setProjects(loadedProjects);
  };

  useEffect(() => {
    // Charger les projets depuis le stockage local
    loadProjects();
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

  const handleNewScript = async () => {
    // Demander un nom pour le nouveau script avant de le créer
    const newProject = await createNewProject();
    
    // Si l'utilisateur a annulé, on ne fait rien
    if (!newProject) return;
    
    // Mettre à jour la liste des projets
    loadProjects();
    
    // Définir le nouveau projet comme script actuel
    setCurrentScript({
      id: newProject.id,
      name: newProject.name,
      blocklyXml: newProject.blocklyXml,
      pythonCode: newProject.pythonCode,
      modified: false
    });
    
    // Naviguer vers l'éditeur Blockly
    navigate('/blockly');
  };

  const handleImport = async () => {
    // Importer un script depuis un fichier
    const importedProject = await importProjectFromFile();
    if (importedProject) {
      // Recharger la liste des projets
      loadProjects();
      
      // Afficher un message de succès
      alert(`Le script "${importedProject.name}" a été importé avec succès.`);
    }
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = () => {
    deleteAllProjects();
    setProjects([]);
    setShowDeleteAllModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-700 bg-gray-800 shadow-lg">
        <div className="container mx-auto flex items-center">
          <FaRobot className="text-blue-400 mr-4" size={32} />
          <h1 className="text-3xl font-bold">Application RoboMaster</h1>
        </div>
      </header>

      <main className="flex-1 p-6 container mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Bienvenue dans l'application de programmation RoboMaster</h2>
          <p className="mb-6 text-gray-300">
            Créez et exécutez facilement des programmes pour contrôler votre robot avec des blocs de programmation.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleNewScript}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow font-medium transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Nouveau script Blockly
            </button>
            
            <button
              onClick={handleImport}
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg shadow font-medium transition-colors flex items-center"
            >
              <FaFileImport className="mr-2" />
              Importer un script
            </button>
            
            <Link
              to="/guide"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow font-medium transition-colors flex items-center"
            >
              <FaBook className="mr-2" />
              Guide d'utilisation
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Mes scripts</h2>
          {projects.length > 0 && (
            <button
              onClick={handleDeleteAllClick}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow flex items-center transition-colors"
              title="Supprimer tous les scripts"
            >
              <FaTrash className="mr-2" size={14} />
              Tout supprimer
            </button>
          )}
        </div>
        
        {projects.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg">
            <p className="text-gray-400 mb-6 text-lg">Vous n'avez pas encore de scripts</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleNewScript}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Créer mon premier script
              </button>
              
              <button
                onClick={handleImport}
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <FaFileImport className="mr-2" />
                Importer un script
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition cursor-pointer relative shadow-lg border border-gray-700 hover:border-blue-500"
                onClick={() => handleProjectClick(project)}
              >
                <div className="font-semibold text-xl mb-2">{project.name}</div>
                <div className="text-sm text-gray-400 mb-4">
                  Dernière modification: {new Date(project.updatedAt || project.createdAt).toLocaleString()}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => handleRenameClick(e, project)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full shadow transition-colors"
                    title="Renommer"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, project)}
                    className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full shadow transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer le script "{projectToDelete?.name}" ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression de tous les scripts */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Supprimer tous les scripts</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer <span className="font-bold text-red-500">tous les scripts</span> ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAll}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors"
              >
                Tout supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renommage */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Renommer le script</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Nouveau nom du script"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmRename}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
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