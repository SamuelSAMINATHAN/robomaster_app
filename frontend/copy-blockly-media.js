const fs = require('fs');
const path = require('path');

// Chemins source et destination
const BLOCKLY_MEDIA_PATH = path.join(__dirname, 'node_modules', 'blockly', 'media');
const PUBLIC_MEDIA_PATH = path.join(__dirname, 'public', 'media');

// Fonction pour copier un fichier
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  console.log(`Copié: ${path.basename(source)}`);
}

// Fonction pour copier un dossier récursivement
function copyDir(source, destination) {
  // Créer le dossier destination s'il n'existe pas
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  // Lire le contenu du dossier source
  const files = fs.readdirSync(source);
  
  // Copier chaque fichier/dossier
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    // Vérifier si c'est un dossier ou un fichier
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Si c'est un dossier, copier récursivement
      copyDir(sourcePath, destPath);
    } else {
      // Si c'est un fichier, le copier
      copyFile(sourcePath, destPath);
    }
  }
}

console.log('Copie des fichiers média Blockly...');

try {
  // Vérifier que le dossier source existe
  if (!fs.existsSync(BLOCKLY_MEDIA_PATH)) {
    console.error(`Erreur: Le dossier source n'existe pas: ${BLOCKLY_MEDIA_PATH}`);
    process.exit(1);
  }
  
  // Copier les fichiers
  copyDir(BLOCKLY_MEDIA_PATH, PUBLIC_MEDIA_PATH);
  console.log(`Terminé! Fichiers copiés vers: ${PUBLIC_MEDIA_PATH}`);
} catch (error) {
  console.error('Erreur lors de la copie des fichiers:', error);
  process.exit(1);
} 