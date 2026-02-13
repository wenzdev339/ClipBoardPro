import React, { useState, useEffect } from 'react'
import '../scss/TitleBar.scss'

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    const electronExists = typeof window !== 'undefined' && window.electronAPI
    setIsElectron(electronExists)
    
    if (electronExists) {
      // Check initial maximized state
      window.electronAPI.isMaximized().then(setIsMaximized).catch(console.error)
      
      // Set up listener for window state changes
      let cleanup = null
      if (typeof window.electronAPI.onWindowMaximized === 'function') {
        cleanup = window.electronAPI.onWindowMaximized((maximized) => {
          setIsMaximized(maximized)
        })
      }
      
      // Cleanup function
      return () => {
        if (cleanup && typeof cleanup === 'function') {
          cleanup()
        }
        if (window.electronAPI && window.electronAPI.removeAllListeners) {
          window.electronAPI.removeAllListeners()
        }
      }
    }
  }, [])

  const handleMinimize = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.minimizeWindow()
      } catch (error) {
        console.error('Error minimizing window:', error)
      }
    }
  }

  const handleMaximize = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.maximizeWindow()
        // State will be updated via the listener
      } catch (error) {
        console.error('Error maximizing window:', error)
      }
    }
  }

  const handleClose = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.closeWindow()
      } catch (error) {
        console.error('Error closing window:', error)
      }
    }
  }

  return (
    <div className="title-bar">
      <div className="title-bar-content">
        <div className="app-title">
          <img src="./images/ClipBoardPro_Logo.png" alt="Logo" className="app-icon-img" />
          <span className="app-name">ClipBoard Pro Beta 1.0.0</span>
        </div>
        
        {isElectron && (
          <div className="window-controls">
            <button 
              className="control-btn minimize" 
              onClick={handleMinimize}
              title="Minimize"
            >
              <span>—</span>
            </button>
            <button 
              className="control-btn maximize" 
              onClick={handleMaximize}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <span>{isMaximized ? "❐" : "□"}</span>
            </button>
            <button 
              className="control-btn close" 
              onClick={handleClose}
              title="Close"
            >
              <span>×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TitleBar