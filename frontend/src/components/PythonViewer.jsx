import React from 'react';
import { useRobotStore } from '../store/RobotStore';

export default function PythonViewer({ className = '' }) {
  const { currentScript } = useRobotStore();
  
  return (
    <div className={`bg-gray-900 text-white rounded-md overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">Code Python</h3>
      </div>
      
      <pre className="p-4 overflow-auto max-h-[500px] text-sm font-mono bg-gray-950">
        <code>
          {currentScript?.pythonCode || '# Aucun code généré'}
        </code>
      </pre>
    </div>
  );
}