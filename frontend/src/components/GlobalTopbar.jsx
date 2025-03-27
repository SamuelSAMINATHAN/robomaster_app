import React from 'react';
import { useRobotStore } from '../store/RobotStore';
import { Link } from 'react-router-dom';

export default function GlobalTopbar() {
  const { 
    connected, 
    connecting, 
    connectionError,
    batteryLevel, 
    connect, 
    disconnect 
  } = useRobotStore();

  return (
    <div className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo / Titre à gauche */}
        <Link to="/" className="text-xl font-semibold flex items-center">
          <span>RoboMaster App</span>
        </Link>

        {/* Section de droite */}
        <div className="flex items-center space-x-4">
          {connected ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="relative w-24 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>
                <span className="text-sm">{batteryLevel}%</span>
              </div>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-500 px-3 py-1 text-sm rounded"
              >
                Déconnecter
              </button>
            </>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className={`px-4 py-2 rounded text-sm ${connecting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {connecting ? 'Connexion...' : 'Connecter au robot'}
            </button>
          )}
          {connectionError && (
            <span className="text-red-400 text-sm">{connectionError}</span>
          )}
        </div>
      </div>
    </div>
  );
}