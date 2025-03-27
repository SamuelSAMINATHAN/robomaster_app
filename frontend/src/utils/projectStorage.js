/**
 * Utilitaire pour la gestion des projets Blockly
 */

import { v4 as uuidv4 } from 'uuid';

// Clé de stockage dans le localStorage
const STORAGE_KEY = 'robomaster_blockly_projects';

/**
 * Récupère tous les projets sauvegardés
 * 
 * @returns {Array} Liste des projets
 */
export function getAllProjects() {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    if (!projectsJson) return [];

    const projects = JSON.parse(projectsJson);
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return [];
  }
}

/**
 * Récupère un projet par son ID
 * 
 * @param {string} id - ID du projet
 * @returns {Object|null} Le projet ou null s'il n'existe pas
 */
export function getProjectById(id) {
  const projects = getAllProjects();
  return projects.find(project => project.id === id) || null;
}

/**
 * Sauvegarde un projet
 * 
 * @param {Object} project - Projet à sauvegarder
 * @returns {Object} Le projet sauvegardé avec ID
 */
export function saveProject(project) {
  if (!project || typeof project !== 'object') {
    throw new Error('Un objet projet valide est requis');
  }

  const projects = getAllProjects();
  const now = new Date().toISOString();

  if (project.id) {
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      const updatedProject = {
        ...projects[index],
        ...project,
        updatedAt: now
      };

      // S'assurer que tous les champs requis sont présents
      if (!updatedProject.name) updatedProject.name = 'Sans titre';
      if (!updatedProject.blocklyXml) updatedProject.blocklyXml = '';
      if (!updatedProject.pythonCode) updatedProject.pythonCode = '';

      projects[index] = updatedProject;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

      return updatedProject;
    }
  }

  const newProject = {
    id: project.id || uuidv4(),
    name: project.name || 'Sans titre',
    blocklyXml: project.blocklyXml || '',
    pythonCode: project.pythonCode || '',
    createdAt: now,
    updatedAt: now
  };

  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  return newProject;
}

/**
 * Supprime un projet
 * 
 * @param {string} id - ID du projet à supprimer
 * @returns {boolean} true si supprimé, false sinon
 */
export function deleteProject(id) {
  const projects = getAllProjects();
  const initialLength = projects.length;

  const filteredProjects = projects.filter(project => project.id !== id);

  if (filteredProjects.length !== initialLength) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    return true;
  }

  return false;
}

/**
 * Renomme un projet
 * 
 * @param {string} id - ID du projet
 * @param {string} newName - Nouveau nom
 * @returns {Object|null} Le projet mis à jour ou null
 */
export function renameProject(id, newName) {
  const projects = getAllProjects();
  const index = projects.findIndex(project => project.id === id);

  if (index === -1) return null;

  projects[index].name = newName;
  projects[index].updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  return projects[index];
}

/**
 * Crée un nouveau projet vide
 * 
 * @param {string} name - Nom du projet
 * @returns {Object} Le nouveau projet
 */
export function createNewProject(name = "Nouveau script") {
  return saveProject({
    name,
    blocklyXml: '',
    pythonCode: ''
  });
}

// Fonction pour exporter un projet (nouvelle fonctionnalité)
export function exportProject(id) {
  const project = getProjectById(id);
  if (!project) return null;
  
  const exportData = JSON.stringify(project);
  return exportData;
}

// Fonction pour importer un projet (nouvelle fonctionnalité)
export function importProject(projectData) {
  try {
    const project = JSON.parse(projectData);
    
    // Vérifier que le projet a une structure valide
    if (!project || !project.name || typeof project.blocklyXml === 'undefined') {
      throw new Error('Format de projet invalide');
    }
    
    // Générer un nouvel ID pour éviter les conflits
    project.id = uuidv4();
    
    return saveProject(project);
  } catch (error) {
    console.error('Erreur lors de l\'importation du projet:', error);
    return null;
  }
}
