import { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage, clipboard, globalShortcut } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconPath = path.join(app.getAppPath(), 'dist-react', 'images', 'ClipBoardPro_Logo.ico')

let mainWindow;
let tray = null;
let isQuitting = false;
let closeBehavior = 'minimize';
let startMinimized = false;
let openAtLogin = true;
let hotkeys = {
  quickAccess: 'Ctrl+Shift+X',
  clearAll: 'Ctrl+Shift+Delete'
};

// เพิ่มตัวแปรสำหรับ clipboard monitoring
let clipboardMonitorInterval;
let lastClipboardText = '';
let lastClipboardImage = '';
let isMonitoringActive = false;

// ฟังก์ชันตรวจสอบ global flag จาก renderer process
async function checkInternalCopyFlag() {
  if (!mainWindow || mainWindow.isDestroyed()) return false;
  
  try {
    const result = await mainWindow.webContents.executeJavaScript('window.isInternalCopyOperation || false');
    return result;
  } catch (error) {
    return false;
  }
}

function findIndexHtml() {
  const possiblePaths = [
    path.join(process.cwd(), 'dist-react', 'index.html'),
    path.join(__dirname, '../dist-react/index.html'),
    path.join(__dirname, '../../dist-react/index.html'),
    path.resolve('./dist-react/index.html')
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }

  return null;
}

function setAutoStart(enabled) {
  try {
    openAtLogin = enabled;
    
    app.setLoginItemSettings({
      openAtLogin: enabled,
      openAsHidden: enabled && startMinimized,
      name: 'ClipBoard Pro',
      path: process.execPath,
      args: enabled && startMinimized ? ['--hidden'] : []
    });
    
    return true;
  } catch (error) {
    return false;
  }
}

function initializeAutoStart() {
  try {
    const loginItemSettings = app.getLoginItemSettings();
    
    if (!loginItemSettings.openAtLogin) {
      setAutoStart(true);
    } else {
      openAtLogin = loginItemSettings.openAtLogin;
    }
  } catch (error) {
    setAutoStart(true);
  }
}

function getAutoStartStatus() {
  try {
    const loginItemSettings = app.getLoginItemSettings();
    return {
      openAtLogin: loginItemSettings.openAtLogin,
      openAsHidden: loginItemSettings.openAsHidden,
      wasOpenedAtLogin: loginItemSettings.wasOpenedAtLogin,
      wasOpenedAsHidden: loginItemSettings.wasOpenedAsHidden
    };
  } catch (error) {
    return { openAtLogin: false, openAsHidden: false };
  }
}

function handleCommandLineArgs() {
  const args = process.argv;
  
  if (args.includes('--hidden')) {
    startMinimized = true;
  }
  
  const loginItemSettings = getAutoStartStatus();
  if (loginItemSettings.wasOpenedAtLogin) {
    if (loginItemSettings.wasOpenedAsHidden) {
      startMinimized = true;
    }
  }
}

// ปรับปรุง Clipboard Monitoring ให้ตรวจสอบ global flag
function startClipboardMonitoring() {
  if (isMonitoringActive) return;
  isMonitoringActive = true;

  try {
    lastClipboardText = clipboard.readText();
    const image = clipboard.readImage();
    lastClipboardImage = image.isEmpty() ? '' : image.toDataURL();
  } catch (error) {
    // Silent error handling
  }
  
  clipboardMonitorInterval = setInterval(async () => {
    if (!isMonitoringActive) return;
    
    // ตรวจสอบ global flag ก่อนประมวลผล
    const isInternalCopy = await checkInternalCopyFlag();
    if (isInternalCopy) {
      return;
    }
    
    try {
      // ตรวจสอบ text
      const currentText = clipboard.readText();
      if (currentText && 
          currentText !== lastClipboardText && 
          currentText.trim() !== '' &&
          currentText.length > 0 &&
          currentText.length < 1000000) {
        
        lastClipboardText = currentText;
        
        if (mainWindow && !mainWindow.isDestroyed()) {
          // ตรวจสอบ flag อีกครั้งก่อนส่ง
          const stillInternalCopy = await checkInternalCopyFlag();
          if (!stillInternalCopy) {
            setTimeout(async () => {
              const finalCheck = await checkInternalCopyFlag();
              if (mainWindow && !mainWindow.isDestroyed() && !finalCheck) {
                mainWindow.webContents.send('clipboard-changed', {
                  type: 'text',
                  content: currentText,
                  timestamp: new Date().toISOString()
                });
              }
            }, 200);
          }
        }
      }

      // ตรวจสอบ image
      const currentImage = clipboard.readImage();
      if (!currentImage.isEmpty()) {
        const imageDataURL = currentImage.toDataURL();
        if (imageDataURL && 
            imageDataURL !== lastClipboardImage && 
            imageDataURL !== '' &&
            imageDataURL.length > 100 &&
            imageDataURL.length < 50000000) {
          
          lastClipboardImage = imageDataURL;
          
          if (mainWindow && !mainWindow.isDestroyed()) {
            // ตรวจสอบ flag อีกครั้งก่อนส่ง
            const stillInternalCopy = await checkInternalCopyFlag();
            if (!stillInternalCopy) {
              setTimeout(async () => {
                const finalCheck = await checkInternalCopyFlag();
                if (mainWindow && !mainWindow.isDestroyed() && !finalCheck) {
                  mainWindow.webContents.send('clipboard-changed', {
                    type: 'image',
                    content: imageDataURL,
                    timestamp: new Date().toISOString()
                  });
                }
              }, 300);
            }
          }
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }, 500);
}

function stopClipboardMonitoring() {
  isMonitoringActive = false;
  if (clipboardMonitorInterval) {
    clearInterval(clipboardMonitorInterval);
    clipboardMonitorInterval = null;
  }
}

function registerGlobalShortcuts() {
  try {
    globalShortcut.unregisterAll();
    
    if (hotkeys.quickAccess) {
      const quickAccessKey = hotkeys.quickAccess.replace('Ctrl', process.platform === 'darwin' ? 'Cmd' : 'Ctrl');
      globalShortcut.register(quickAccessKey, () => {
        showWindowAtCursor();
      });
    }
    
    if (hotkeys.clearAll) {
      const clearAllKey = hotkeys.clearAll.replace('Ctrl', process.platform === 'darwin' ? 'Cmd' : 'Ctrl');
      globalShortcut.register(clearAllKey, () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('clear-all-shortcut');
        }
      });
    }

    if (process.platform === 'darwin') {
      globalShortcut.register('Cmd+Shift+4', () => {
        setTimeout(checkClipboardForScreenshot, 1000);
        setTimeout(checkClipboardForScreenshot, 3000);
      });
      
      globalShortcut.register('Cmd+Shift+3', () => {
        setTimeout(checkClipboardForScreenshot, 1000);
        setTimeout(checkClipboardForScreenshot, 3000);
      });
    }

    if (process.platform === 'win32') {
      globalShortcut.register('PrintScreen', () => {
        setTimeout(checkClipboardForScreenshot, 1000);
        setTimeout(checkClipboardForScreenshot, 2500);
      });
      
      globalShortcut.register('Alt+PrintScreen', () => {
        setTimeout(checkClipboardForScreenshot, 1000);
        setTimeout(checkClipboardForScreenshot, 2500);
      });
    }
  } catch (error) {
    // Silent error handling
  }
}

function showWindowAtCursor() {
  if (!mainWindow) return;
  
  try {
    const { screen } = require('electron');
    const cursor = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursor);
    
    const windowBounds = mainWindow.getBounds();
    const x = Math.max(display.bounds.x, Math.min(
      cursor.x - windowBounds.width / 2,
      display.bounds.x + display.bounds.width - windowBounds.width
    ));
    const y = Math.max(display.bounds.y, Math.min(
      cursor.y - windowBounds.height / 2,
      display.bounds.y + display.bounds.height - windowBounds.height
    ));
    
    mainWindow.setPosition(Math.round(x), Math.round(y));
    
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  } catch (error) {
    showWindow();
  }
}

async function checkClipboardForScreenshot() {
  if (!isMonitoringActive) return;
  
  const isInternalCopy = await checkInternalCopyFlag();
  if (isInternalCopy) return;
  
  try {
    const image = clipboard.readImage();
    if (!image.isEmpty()) {
      const imageDataURL = image.toDataURL();
      if (imageDataURL !== lastClipboardImage && imageDataURL.length > 100) {
        lastClipboardImage = imageDataURL;
        
        if (mainWindow && !mainWindow.isDestroyed()) {
          setTimeout(async () => {
            const finalCheck = await checkInternalCopyFlag();
            if (mainWindow && !mainWindow.isDestroyed() && !finalCheck) {
              mainWindow.webContents.send('clipboard-changed', {
                type: 'image',
                content: imageDataURL,
                timestamp: new Date().toISOString()
              });
            }
          }, 200);
        }
      }
    }
  } catch (error) {
    // Silent error handling
  }
}

function createTray() {
  const trayIconPath = path.join(app.getAppPath(), 'dist-react', 'images', 'ClipBoardPro_Logo.png')
  const icon = nativeImage.createFromPath(trayIconPath).resize({ width: 16, height: 16 })
  
  tray = new Tray(icon);
  tray.setToolTip('ClipBoard Pro')
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'ClipBoard Pro',
      type: 'normal',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Show Window',
      type: 'normal',
      click: showWindow
    },
    {
      label: 'Hide Window',
      type: 'normal',
      click: hideWindow
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click: quitApp
    }
  ]);
  
  tray.setToolTip('ClipBoard Pro - Clipboard Manager');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow.isVisible()) {
      hideWindow();
    } else {
      showWindow();
    }
  });
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      hideWindow();
    } else {
      showWindow();
    }
  });
}

function showWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  }
}

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

function quitApp() {
  isQuitting = true;
  stopClipboardMonitoring();
  globalShortcut.unregisterAll();
  if (tray) {
    tray.destroy();
  }
  app.quit();
}

function createWindow() {
  handleCommandLineArgs();
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    icon: iconPath,
    frame: false,
    titleBarStyle: 'hidden',
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
      offscreen: false
    },
    show: !startMinimized,
    backgroundColor: '#0a0a0a',
    transparent: false,
    hasShadow: true
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = findIndexHtml();
    if (indexPath) {
      mainWindow.loadFile(indexPath);
    } else {
      mainWindow.loadURL('file://' + path.join(process.cwd(), 'dist-react', 'index.html'));
    }
  }

  mainWindow.once('ready-to-show', () => {
    if (!startMinimized) {
      mainWindow.show();
    }
    
    setTimeout(() => {
      startClipboardMonitoring();
      registerGlobalShortcuts();
    }, 1000);
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      if (closeBehavior === 'minimize') {
        hideWindow();
      } else {
        quitApp();
      }
    }
  });

  mainWindow.on('hide', () => {
    // ไม่หยุด monitoring
  });

  mainWindow.on('show', () => {
    if (!isMonitoringActive) {
      startClipboardMonitoring();
    }
  });

  // Window controls
  ipcMain.handle('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) {
      if (closeBehavior === 'minimize') {
        hideWindow();
      } else {
        quitApp();
      }
    }
  });

  ipcMain.handle('window-is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximized', false);
  });

  ipcMain.handle('open-external', async (_event, url) => {
    await shell.openExternal(url);
  });

  createTray();
}

app.whenReady().then(() => {
  initializeAutoStart();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      showWindow();
    }
  });
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

app.on('before-quit', () => {
  isQuitting = true;
  stopClipboardMonitoring();
  globalShortcut.unregisterAll();
});

app.on('will-quit', () => {
  stopClipboardMonitoring();
  globalShortcut.unregisterAll();
  if (tray) {
    tray.destroy();
  }
});

// IPC handlers สำหรับ clipboard
ipcMain.handle('start-clipboard-monitoring', () => {
  startClipboardMonitoring();
  return true;
});

ipcMain.handle('stop-clipboard-monitoring', () => {
  stopClipboardMonitoring();
  return true;
});

ipcMain.handle('get-clipboard-text', () => {
  try {
    return clipboard.readText();
  } catch (error) {
    return '';
  }
});

ipcMain.handle('get-clipboard-image', () => {
  try {
    const image = clipboard.readImage();
    return image.isEmpty() ? null : image.toDataURL();
  } catch (error) {
    return null;
  }
});

// ปรับปรุง IPC handlers สำหรับ set clipboard - ไม่ต้องใช้ internal flags แล้ว
ipcMain.handle('set-clipboard-text', (event, text) => {
  try {
    clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle('set-clipboard-image', (event, imageDataURL) => {
  try {
    const image = nativeImage.createFromDataURL(imageDataURL);
    clipboard.writeImage(image);
    return true;
  } catch (error) {
    return false;
  }
});

// IPC handler สำหรับ close behavior setting
ipcMain.handle('set-close-behavior', (event, behavior) => {
  closeBehavior = behavior;
  return true;
});

ipcMain.handle('get-close-behavior', () => {
  return closeBehavior;
});

// IPC handlers สำหรับ start minimized setting
ipcMain.handle('set-start-minimized', (event, minimized) => {
  startMinimized = minimized;
  
  if (openAtLogin) {
    setAutoStart(true);
  }
  
  return true;
});

ipcMain.handle('get-start-minimized', () => {
  return startMinimized;
});

// IPC handlers สำหรับ Auto Start
ipcMain.handle('set-auto-start', (event, enabled) => {
  return setAutoStart(enabled);
});

ipcMain.handle('get-auto-start', () => {
  const status = getAutoStartStatus();
  return status.openAtLogin;
});

ipcMain.handle('get-auto-start-status', () => {
  return getAutoStartStatus();
});

// IPC handlers สำหรับ hotkeys
ipcMain.handle('update-hotkeys', (event, newHotkeys) => {
  hotkeys = { ...hotkeys, ...newHotkeys };
  registerGlobalShortcuts();
  return true;
});

ipcMain.handle('get-hotkeys', () => {
  return hotkeys;
});