import { create } from 'zustand';

export const useRobotStore = create((set) => ({
  // État initial
  connected: false,
  connecting: false,
  connectionError: null,
  batteryLevel: 0,
  currentScript: null,
  isExecuting: false,
  logs: [],
  showCamera: true,

  // Setters manquants utilisés dans App.jsx
  setConnected: (connected) => set({ connected }),
  setBatteryLevel: (level) => set({ batteryLevel: level }),
  setExecuting: (executing) => set({ isExecuting: executing }),

  // Autres actions
  connect: () => {
    set({ connecting: true, connectionError: null });
    setTimeout(() => {
      set({ 
        connected: true, 
        connecting: false,
        batteryLevel: 85
      });
    }, 1500);
  },

  disconnect: () => set({ connected: false, batteryLevel: 0 }),

  setCurrentScript: (script) => set({ currentScript: script }),

  updateBlocklyXml: (xml) => set((state) => ({
    currentScript: state.currentScript 
      ? { ...state.currentScript, blocklyXml: xml, modified: true } 
      : null
  })),

  updatePythonCode: (code) => set((state) => ({
    currentScript: state.currentScript 
      ? { ...state.currentScript, pythonCode: code } 
      : null
  })),

  addLog: (log) => set((state) => ({ 
    logs: [...state.logs, log] 
  })),

  clearLogs: () => set({ logs: [] }),

  toggleCamera: () => set((state) => ({ 
    showCamera: !state.showCamera 
  })),

  setScriptModified: (modified) => set((state) => ({
    currentScript: state.currentScript 
      ? { ...state.currentScript, modified } 
      : null
  })),
}));