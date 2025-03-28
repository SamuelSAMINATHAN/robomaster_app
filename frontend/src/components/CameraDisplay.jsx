import React, { useEffect, useState } from 'react';
import { useRobotStore } from '../store/RobotStore';

export default function CameraDisplay({ className = '' }) {
  const { connected } = useRobotStore();
  const [useWebcam, setUseWebcam] = useState(!connected);
  const [imageError, setImageError] = useState(false);
  
  // Mettre à jour le type de caméra à utiliser lorsque l'état de connexion change
  useEffect(() => {
    setUseWebcam(!connected);
    setImageError(false); // Réinitialiser l'état d'erreur lors du changement de source
  }, [connected]);
  
  // Démarrer la webcam au chargement du composant
  useEffect(() => {
    // Appeler l'API pour démarrer la webcam
    if (!connected) {
      fetch('/api/start_webcam')
        .then(response => response.json())
        .then(data => {
          console.log('Webcam démarrée:', data);
        })
        .catch(err => {
          console.error('Erreur lors du démarrage de la webcam:', err);
        });
    }
    
    // Cleanup: arrêter la webcam quand le composant est démonté
    return () => {
      if (!connected) {
        fetch('/api/stop_webcam').catch(err => {
          console.error('Erreur lors de l\'arrêt de la webcam:', err);
        });
      }
    };
  }, [connected]);
  
  const handleImageError = () => {
    setImageError(true);
    console.error('Erreur de chargement du flux vidéo');
  };
  
  return (
    <div className={`bg-gray-900 rounded-md overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <h3 className="font-medium text-white">Caméra</h3>
      </div>
      
      <div className="aspect-video bg-black flex items-center justify-center">
        {!imageError ? (
          connected ? (
            <img 
              src="/api/video_feed" 
              alt="Flux vidéo du robot" 
              className="max-w-full max-h-full"
              onError={handleImageError}
              key="robot-video"
            />
          ) : (
            <img 
              src="/api/webcam_feed" 
              alt="Flux webcam locale" 
              className="max-w-full max-h-full"
              onError={handleImageError}
              key="webcam-video"
            />
          )
        ) : (
          <div className="text-gray-500 text-center p-4">
            <p>Flux vidéo non disponible</p>
            <p className="text-sm">{connected ? 'Problème avec la caméra du robot' : 'Problème avec la webcam locale'}</p>
          </div>
        )}
      </div>
    </div>
  );
}