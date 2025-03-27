import React from 'react';
import { useRobotStore } from '../store/RobotStore';

export default function CameraDisplay({ className = '' }) {
  const { connected } = useRobotStore();
  
  return (
    <div className={`bg-gray-900 rounded-md overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <h3 className="font-medium text-white">Caméra</h3>
      </div>
      
      <div className="aspect-video bg-black flex items-center justify-center">
        {connected ? (
          <img 
            src="/api/video_feed" 
            alt="Flux vidéo du robot" 
            className="max-w-full max-h-full"
            onError={(e) => {
              console.error('Erreur de chargement du flux vidéo');
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23333"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14px">Flux vidéo non disponible</text></svg>';
            }}
          />
        ) : (
          <div className="text-gray-500 text-center p-4">
            <p>Robot non connecté</p>
            <p className="text-sm">Connectez-vous pour voir le flux vidéo</p>
          </div>
        )}
      </div>
    </div>
  );
}