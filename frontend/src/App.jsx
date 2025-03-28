import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import BlocklyPage from "./pages/BlocklyPage.jsx";
import GlobalTopbar from "./components/GlobalTopbar.jsx";
import { useRobotStore } from "./store/RobotStore";

// Fonction pour récupérer l'état du robot depuis le backend (fallback si WebSocket n'est pas disponible)
const fetchRobotStatus = async (setConnected, setBatteryLevel, setExecuting) => {
  try {
    const response = await fetch('/api/status');
    if (response.ok) {
      const data = await response.json();
      setConnected(data.connected);
      setBatteryLevel(data.battery_level);
      setExecuting(data.executing);
      console.log('État du robot récupéré via HTTP:', data);
      return data;
    } else {
      console.error('Erreur lors de la récupération de l\'état du robot:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion au backend:', error);
    return null;
  }
};

// Fonction pour établir une connexion WebSocket avec le backend
const setupWebSocket = (setConnected, setBatteryLevel, setExecuting) => {
  // Déterminer l'URL du WebSocket en fonction de l'environnement
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = window.location.port || '8000'; // Utiliser le port de la page ou 8000 par défaut
  const wsUrl = `${protocol}//${host}:${port}/ws`;
  
  console.log(`Tentative de connexion WebSocket à ${wsUrl}`);
  
  let ws = null;
  try {
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connexion WebSocket établie');
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Traiter les mises à jour d'état du robot
        if (message.type === 'state_update') {
          const data = message.data;
          setConnected(data.connected);
          setBatteryLevel(data.battery_level);
          setExecuting(data.executing);
          console.log('État du robot mis à jour via WebSocket:', data);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };
    
    ws.onclose = (event) => {
      console.log(`Connexion WebSocket fermée (code: ${event.code}), tentative de reconnexion dans 5 secondes...`);
      setTimeout(() => setupWebSocket(setConnected, setBatteryLevel, setExecuting), 5000);
    };
    
    ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  } catch (error) {
    console.error('Erreur lors de la création du WebSocket:', error);
    return null;
  }
  
  return ws;
};

export default function App() {
  const { setConnected, setBatteryLevel, setExecuting } = useRobotStore();
  const wsRef = useRef(null);
  const statusIntervalRef = useRef(null);

  // Établir la connexion WebSocket et récupérer l'état du robot au chargement de l'application
  useEffect(() => {
    // Fonction pour initialiser toutes les connexions
    const initConnections = async () => {
      // Récupérer l'état initial via HTTP
      const initialStatus = await fetchRobotStatus(setConnected, setBatteryLevel, setExecuting);
      
      // Établir la connexion WebSocket pour les mises à jour en temps réel
      wsRef.current = setupWebSocket(setConnected, setBatteryLevel, setExecuting);
      
      // Configurer une vérification périodique de l'état (toutes les 10 secondes)
      // Cela servira de fallback si le WebSocket ne fonctionne pas correctement
      statusIntervalRef.current = setInterval(async () => {
        await fetchRobotStatus(setConnected, setBatteryLevel, setExecuting);
      }, 10000);
    };
    
    initConnections();
    
    // Nettoyage à la fermeture du composant
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
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
