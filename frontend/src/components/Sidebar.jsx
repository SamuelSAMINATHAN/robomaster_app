import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/blockly', label: 'Éditeur Blockly', icon: '🧩' },
    { path: '/guide', label: 'Guide', icon: '📚' },
    { path: '/settings', label: 'Paramètres', icon: '⚙️' },
  ];
  
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6 flex items-center">
        <span className="mr-2">🤖</span>
        <span>RoboMaster</span>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === item.path ? 'bg-gray-700' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700 mt-6">
        <div className="text-sm text-gray-400">
          <p>Version 1.0.0</p>
          <p>© 2023 RoboMaster App</p>
        </div>
      </div>
    </div>
  );
}