const { contextBridge, ipcRenderer } = require('electron');

// Remove any existing listeners to prevent memory leaks
const removeAllListeners = () => {
  ipcRenderer.removeAllListeners('window-maximized');
  ipcRenderer.removeAllListeners('clipboard-changed');
};

// Expose window controls to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // Open external URL
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Close behavior settings
  setCloseBehavior: (behavior) => ipcRenderer.invoke('set-close-behavior', behavior),
  getCloseBehavior: () => ipcRenderer.invoke('get-close-behavior'),

  // Start minimized settings
  setStartMinimized: (minimized) => ipcRenderer.invoke('set-start-minimized', minimized),
  getStartMinimized: () => ipcRenderer.invoke('get-start-minimized'),

  // Auto Start settings - เพิ่มใหม่
  setAutoStart: (enabled) => ipcRenderer.invoke('set-auto-start', enabled),
  getAutoStart: () => ipcRenderer.invoke('get-auto-start'),
  getAutoStartStatus: () => ipcRenderer.invoke('get-auto-start-status'),

  // Hotkey settings
  updateHotkeys: (hotkeys) => ipcRenderer.invoke('update-hotkeys', hotkeys),
  getHotkeys: () => ipcRenderer.invoke('get-hotkeys'),

  // Tray controls
  showWindow: () => ipcRenderer.invoke('show-window'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),

  // Native Clipboard APIs
  clipboard: {
    startMonitoring: () => ipcRenderer.invoke('start-clipboard-monitoring'),
    stopMonitoring: () => ipcRenderer.invoke('stop-clipboard-monitoring'),
    getText: () => ipcRenderer.invoke('get-clipboard-text'),
    getImage: () => ipcRenderer.invoke('get-clipboard-image'),
    setText: (text) => ipcRenderer.invoke('set-clipboard-text', text),
    setImage: (imageDataURL) => ipcRenderer.invoke('set-clipboard-image', imageDataURL),
    
    // Listen to clipboard changes from main process
    onChange: (callback) => {
      const handler = (event, data) => {
        console.log('Clipboard change received in preload:', data);
        callback(data);
      };
      ipcRenderer.on('clipboard-changed', handler);
      return () => {
        ipcRenderer.removeListener('clipboard-changed', handler);
      };
    }
  },

  // Listen to clear all shortcut
  onClearAllShortcut: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('clear-all-shortcut', handler);
    return () => {
      ipcRenderer.removeListener('clear-all-shortcut', handler);
    };
  },

  // Listen to window state changes
  onWindowMaximized: (callback) => {
    removeAllListeners();
    const handler = (event, isMaximized) => callback(isMaximized);
    ipcRenderer.on('window-maximized', handler);
    return () => {
      ipcRenderer.removeListener('window-maximized', handler);
    };
  },

  removeAllListeners,

  platform: process.platform,

  getVersion: () => process.env.npm_package_version || '1.0.0'
});