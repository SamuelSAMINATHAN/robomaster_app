import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import BlocklyPage from "./pages/BlocklyPage.jsx";
import GlobalTopbar from "./components/GlobalTopbar.jsx";
import { useRobotStore } from "./store/RobotStore";

// Fonction pour récupérer l'état du robot depuis le backend
const fetchRobotStatus = async (setConnected, setBatteryLevel, setExecuting) => {
  try {
    const response = await fetch('http://localhost:8000/status');
    if (response.ok) {
      const data = await response.json();
      setConnected(data.connected);
      setBatteryLevel(data.battery_level);
      setExecuting(data.executing);
      console.log('État du robot récupéré:', data);
    } else {
      console.error('Erreur lors de la récupération de l\'état du robot:', response.status);
    }
  } catch (error) {
    console.error('Erreur lors de la connexion au backend:', error);
  }
};

export default function App() {
  const { setConnected, setBatteryLevel, setExecuting } = useRobotStore();

  // Récupérer l'état du robot au chargement de l'application
  useEffect(() => {
    fetchRobotStatus(setConnected, setBatteryLevel, setExecuting);
    
    // Mettre à jour l'état toutes les 5 secondes
    const interval = setInterval(() => {
      fetchRobotStatus(setConnected, setBatteryLevel, setExecuting);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [setConnected, setBatteryLevel, setExecuting]);

  return (
    <Router>
      <GlobalTopbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blockly" element={<BlocklyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
