/**
 * Utilitaire pour la gestion des projets Blockly
 */

import { v4 as uuidv4 } from 'uuid';

// Clé de stockage dans le localStorage
const PROJECTS_STORAGE_KEY = 'robomaster_projects';

/**
 * Récupère tous les projets sauvegardés
 * 
 * @returns {Array} Liste des projets
 */
export function getAllProjects() {
  const projectsJSON = localStorage.getItem(PROJECTS_STORAGE_KEY);
  const projects = projectsJSON ? JSON.parse(projectsJSON) : [];
  
  // Trier les projets par date de modification (du plus récent au plus ancien)
  return projects.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0);
    const dateB = new Date(b.updatedAt || b.createdAt || 0);
    return dateB - dateA;  // Ordre décroissant
  });
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
  // S'assurer que project a un ID
  if (!project.id) {
    project.id = Date.now().toString();
  }

  const projects = getAllProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  const now = new Date().toISOString();
  let updatedProject;
  
  if (existingIndex >= 0) {
    // Mise à jour d'un projet existant
    updatedProject = {
      ...projects[existingIndex],
      ...project,
      updatedAt: now
    };
    projects[existingIndex] = updatedProject;
  } else {
    // Nouveau projet
    updatedProject = {
      ...project,
      createdAt: now,
      updatedAt: now
    };
    projects.push(updatedProject);
  }
  
  // Sauvegarde en localStorage
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  
  // Écrire le fichier dans le stockage de l'application (si disponible)
  saveProjectToFile(updatedProject);
  
  return updatedProject;
}

/**
 * Essaie de sauvegarder le projet dans un fichier
 * @param {Object} project Le projet à sauvegarder
 * @private
 */
function saveProjectToFile(project) {
  try {
    // Cette fonction essaie de sauvegarder le projet dans un fichier
    // Mais vu que c'est une application web, on ne peut pas écrire directement sur le disque
    // Sans backend, on peut utiliser IndexedDB comme alternative pour stocker plus de données
    
    // Sauvegarder dans IndexedDB si disponible
    if (window.indexedDB) {
      const request = window.indexedDB.open("RoboMasterProjects", 1);
      
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['projects'], 'readwrite');
        const store = transaction.objectStore('projects');
        store.put(project);
      };
      
      request.onerror = function(event) {
        console.error("Erreur lors de l'ouverture de la base de données:", event.target.error);
      };
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du projet dans un fichier:", error);
  }
}

/**
 * Charge les projets depuis IndexedDB si disponible
 * @private
 */
export function loadProjectsFromStorage() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(getAllProjects());
      return;
    }
    
    try {
      const request = window.indexedDB.open("RoboMasterProjects", 1);
      
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['projects'], 'readonly');
        const store = transaction.objectStore('projects');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = function() {
          const projects = getAllRequest.result;
          if (projects && projects.length > 0) {
            // Mise à jour du localStorage avec les projets d'IndexedDB
            localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
            resolve(projects.sort((a, b) => {
              const dateA = new Date(a.updatedAt || a.createdAt || 0);
              const dateB = new Date(b.updatedAt || b.createdAt || 0);
              return dateB - dateA;
            }));
          } else {
            // Si IndexedDB est vide, on utilise les projets du localStorage
            const localProjects = getAllProjects();
            // Et on les sauvegarde dans IndexedDB
            if (localProjects.length > 0) {
              const writeTransaction = db.transaction(['projects'], 'readwrite');
              const writeStore = writeTransaction.objectStore('projects');
              localProjects.forEach(project => {
                writeStore.put(project);
              });
            }
            resolve(localProjects);
          }
        };
        
        getAllRequest.onerror = function(event) {
          console.error("Erreur lors de la récupération des projets:", event.target.error);
          resolve(getAllProjects());
        };
      };
      
      request.onerror = function(event) {
        console.error("Erreur lors de l'ouverture de la base de données:", event.target.error);
        resolve(getAllProjects());
      };
    } catch (error) {
      console.error("Erreur lors du chargement des projets depuis IndexedDB:", error);
      resolve(getAllProjects());
    }
  });
}

/**
 * Supprime un projet
 * 
 * @param {string} id - ID du projet à supprimer
 * @returns {boolean} true si supprimé, false sinon
 */
export function deleteProject(id) {
  const projects = getAllProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length < projects.length) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
    
    // Supprimer également de IndexedDB si disponible
    if (window.indexedDB) {
      try {
        const request = window.indexedDB.open("RoboMasterProjects", 1);
        
        request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(['projects'], 'readwrite');
          const store = transaction.objectStore('projects');
          store.delete(id);
        };
      } catch (error) {
        console.error("Erreur lors de la suppression du projet d'IndexedDB:", error);
      }
    }
    
    return true;
  }
  
  return false;
}

/**
 * Supprime tous les projets existants
 * @returns {boolean} True si supprimé
 */
export function deleteAllProjects() {
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
  
  // Supprimer également de IndexedDB si disponible
  if (window.indexedDB) {
    try {
      const request = window.indexedDB.open("RoboMasterProjects", 1);
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['projects'], 'readwrite');
        const store = transaction.objectStore('projects');
        store.clear();
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les projets d'IndexedDB:", error);
    }
  }
  
  return true;
}

/**
 * Renomme un projet
 * 
 * @param {string} id - ID du projet
 * @param {string} newName - Nouveau nom
 * @returns {Object|null} Le projet mis à jour ou null
 */
export function renameProject(id, newName) {
  const project = getProjectById(id);
  if (!project) return null;
  
  const updatedProject = {
    ...project,
    name: newName,
    updatedAt: new Date().toISOString()
  };
  
  saveProject(updatedProject);
  return updatedProject;
}

/**
 * Demande à l'utilisateur un nom pour le projet
 * 
 * @returns {Promise<string>} Le nom fourni par l'utilisateur ou null si annulé
 */
export function askForProjectName(defaultName = "Nouveau script") {
  return new Promise((resolve) => {
    const name = window.prompt("Entrez un nom pour votre script:", defaultName);
    if (name === null) {
      resolve(null);
    } else {
      resolve(name.trim() || defaultName);
    }
  });
}

/**
 * Crée un nouveau projet, demandant d'abord un nom à l'utilisateur
 * Si le nom est fourni en paramètre, ne demande pas à l'utilisateur
 * 
 * @param {string} [providedName] - Nom optionnel du projet
 * @returns {Promise<Object|null>} Le nouveau projet ou null si annulé
 */
export async function createNewProject(providedName = null) {
  try {
    // Si le nom n'est pas fourni, demander à l'utilisateur
    const projectName = providedName || await askForProjectName();
    
    // Si l'utilisateur annule, retourner null
    if (!projectName) return null;
    
    // Créer et sauvegarder le projet
    return saveProject({
      name: projectName,
      blocklyXml: '',
      pythonCode: ''
    });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return null;
  }
}

/**
 * Exporte un projet vers un fichier local (.rmb)
 * 
 * @param {string} id - ID du projet à exporter
 * @returns {boolean} - true si l'exportation a réussi
 */
export function exportProjectToFile(id) {
  const project = getProjectById(id);
  if (!project) return false;
  
  try {
    const exportData = JSON.stringify(project, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.rmb`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyage
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'exportation du projet:", error);
    return false;
  }
}

/**
 * Importe un projet depuis un fichier local (.rmb)
 * 
 * @returns {Promise<Object|null>} Le projet importé ou null en cas d'erreur
 */
export function importProjectFromFile() {
  return new Promise((resolve) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.rmb,.json';
      
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const project = JSON.parse(e.target.result);
            
            // Vérifier que le projet a une structure valide
            if (!project || !project.name || typeof project.blocklyXml === 'undefined') {
              console.error('Format de projet invalide');
              resolve(null);
              return;
            }
            
            // Générer un nouvel ID pour éviter les conflits
            project.id = uuidv4();
            
            const savedProject = saveProject(project);
            resolve(savedProject);
          } catch (error) {
            console.error("Erreur lors du parsing du fichier:", error);
            resolve(null);
          }
        };
        
        reader.onerror = () => {
          console.error("Erreur lors de la lecture du fichier");
          resolve(null);
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      console.error("Erreur lors de l'importation du projet:", error);
      resolve(null);
    }
  });
}

/**
 * Exporte tous les projets vers un fichier ZIP
 * Cette fonction nécessiterait une bibliothèque comme JSZip
 */
export function exportAllProjects() {
  // Implémentation future si nécessaire
  console.log('Export de tous les projets - non implémenté');
  return false;
}

/**
 * Initialise la synchronisation entre localStorage et IndexedDB
 */
export function initStorage() {
  loadProjectsFromStorage().then(projects => {
    console.log(`Chargé ${projects.length} projet(s) depuis le stockage.`);
  });
}
