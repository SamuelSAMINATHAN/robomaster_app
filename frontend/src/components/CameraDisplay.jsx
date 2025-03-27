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