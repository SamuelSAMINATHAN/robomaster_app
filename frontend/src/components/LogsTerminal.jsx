import React, { useRef, useEffect } from 'react';
import { useRobotStore } from '../store/RobotStore';

export default function LogsTerminal({ className = '' }) {
  const { logs } = useRobotStore();
  const logsEndRef = useRef(null);
  
  // Auto-scroll vers le bas quand de nouveaux logs arrivent
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  
  return (
    <div className={`bg-gray-900 rounded-md overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-white">Logs</h3>
      </div>
      
      <div className="p-2 overflow-auto max-h-[300px] text-sm font-mono bg-black text-white">
        {logs.length === 0 ? (
          <div className="text-gray-500 p-2">Aucun log disponible</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="py-1 border-b border-gray-800 last:border-0">
              {log}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}