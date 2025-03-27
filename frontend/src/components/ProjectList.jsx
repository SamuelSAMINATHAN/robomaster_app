import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../utils/projectStorage';
import { useRobotStore } from '../store/RobotStore';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { setCurrentScript } = useRobotStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
  };

  const handleProjectClick = (project) => {
    setCurrentScript({
      id: project.id,
      name: project.name,
      blocklyXml: project.blocklyXml,
      pythonCode: project.pythonCode,
      modified: false
    });
    
    navigate('/blockly');
  };

  const handleDeleteProject = (e, id) => {
    e.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(id);
      loadProjects();
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded">
        <p className="text-gray-400 mb-2">Aucun projet trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map(project => (
        <div 
          key={project.id} 
          className="bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer relative"
          onClick={() => handleProjectClick(project)}
        >
          <h3 className="font-medium">{project.name}</h3>
          <p className="text-sm text-gray-400">
            Modifié le: {new Date(project.updatedAt).toLocaleDateString()}
          </p>
          <button
            onClick={(e) => handleDeleteProject(e, project.id)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}