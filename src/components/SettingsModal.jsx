// SettingsModal.jsx (Updated with ThemeBuilder integration)
import React, { useState, useEffect } from 'react'
import { useLanguage } from '../utils/i18n'
import '../scss/SettingsModal.scss'

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  onClearAllData, 
  onResetSettings,
  onOpenThemeBuilder,
  onOpenIconCustomizer,
  viewMode,
  setViewMode,
  theme,
  setTheme,
  availableThemes = ['dark', 'light'],
  refreshThemes,
  language,
  setLanguage,
  closeBehavior,
  setCloseBehavior,
  startMinimized,
  setStartMinimized,
  autoStart,
  setAutoStart,
  showTrayNotifications,
  setShowTrayNotifications,
  quickAccessHotkey,
  setQuickAccessHotkey,
  clearAllHotkey,
  setClearAllHotkey
}) => {
  const { t, language: i18nLanguage, setLanguage: setI18nLanguage, getSupportedLanguages } = useLanguage();
  const supportedLanguages = getSupportedLanguages();
  
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [isRecordingQuickAccess, setIsRecordingQuickAccess] = useState(false)
  const [isRecordingClearAll, setIsRecordingClearAll] = useState(false)
  const [autoStartLoading, setAutoStartLoading] = useState(false)
  const [themeCategories, setThemeCategories] = useState({
    built_in: [],
    custom: []
  })

  // Categorize themes on mount and when availableThemes changes
  useEffect(() => {
    const builtInThemes = ['dark', 'light', 'auto']
    const categories = {
      built_in: availableThemes.filter(t => builtInThemes.includes(t)),
      custom: availableThemes.filter(t => !builtInThemes.includes(t))
    }
    setThemeCategories(categories)
  }, [availableThemes])

  // Load language setting from Electron when modal opens
  useEffect(() => {
    const loadLanguageSetting = async () => {
      if (isOpen && window.electronAPI && window.electronAPI.getLanguage) {
        try {
          const savedLanguage = await window.electronAPI.getLanguage();
          console.log('Loaded language from Electron in Settings Modal:', savedLanguage);
          
          if (savedLanguage && savedLanguage !== i18nLanguage) {
            setI18nLanguage(savedLanguage);
            if (setLanguage) {
              setLanguage(savedLanguage);
            }
          }
        } catch (error) {
          console.error('Failed to load language setting in Settings Modal:', error);
        }
      }
    };
    
    if (isOpen) {
      loadLanguageSetting();
    }
  }, [isOpen, i18nLanguage, setI18nLanguage, setLanguage]);

  if (!isOpen) return null

  // Handle language change
  const handleLanguageChange = async (newLang) => {
    try {
      console.log('Settings Modal: Changing language to:', newLang);
      
      // Update i18n language immediately
      setI18nLanguage(newLang);
      
      // Call parent component callback (App.jsx)
      if (setLanguage) {
        await setLanguage(newLang);
      }
      
      // Save to Electron as well (double-check)
      if (window.electronAPI && window.electronAPI.setLanguage) {
        try {
          const success = await window.electronAPI.setLanguage(newLang);
          if (success) {
            console.log('Language setting saved to Electron from Settings Modal');
          } else {
            console.error('Failed to save language setting to Electron from Settings Modal');
          }
        } catch (error) {
          console.error('Error saving language to Electron:', error);
        }
      }
      
    } catch (error) {
      console.error('Error in handleLanguageChange:', error);
    }
  };

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAllData()
      setConfirmClear(false)
      onClose()
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const handleResetSettings = () => {
    if (confirmReset) {
      onResetSettings()
      setConfirmReset(false)
      onClose()
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleThemeChange = async (newTheme) => {
    try {
      await setTheme(newTheme)
      // Refresh themes list to ensure it's up to date
      if (refreshThemes) {
        refreshThemes()
      }
    } catch (error) {
      console.error('Failed to change theme:', error)
      alert(t('settings.errors.themeChangeFailed'))
    }
  }

  // Handle Auto Start setting
  const handleAutoStartChange = async (enabled) => {
    setAutoStartLoading(true);
    
    try {
      if (window.electronAPI && window.electronAPI.setAutoStart) {
        const success = await window.electronAPI.setAutoStart(enabled);
        if (success) {
          setAutoStart(enabled);
          console.log(`Auto start ${enabled ? 'enabled' : 'disabled'}`);
        } else {
          console.error('Failed to change auto start setting');
          alert(t('settings.errors.autoStartFailed'));
        }
      } else {
        // Browser fallback
        setAutoStart(enabled);
        console.log(`Auto start setting changed to: ${enabled} (browser mode)`);
      }
    } catch (error) {
      console.error('Failed to set auto start:', error);
      alert(t('settings.errors.autoStartFailed'));
    }
    
    setAutoStartLoading(false);
  };

  const handleHotkeyRecord = (type, event) => {
    event.preventDefault()
    
    const keys = []
    if (event.ctrlKey || event.metaKey) keys.push(event.ctrlKey ? 'Ctrl' : 'Cmd')
    if (event.altKey) keys.push('Alt')
    if (event.shiftKey) keys.push('Shift')
    
    // Only add the main key if it's not a modifier
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      keys.push(event.key.length === 1 ? event.key.toUpperCase() : event.key)
    }
    
    if (keys.length >= 2) { // At least one modifier + one key
      const hotkey = keys.join('+')
      
      if (type === 'quickAccess') {
        setQuickAccessHotkey(hotkey)
        setIsRecordingQuickAccess(false)
      } else if (type === 'clearAll') {
        setClearAllHotkey(hotkey)
        setIsRecordingClearAll(false)
      }
      
      // Send to main process
      if (window.electronAPI && window.electronAPI.updateHotkeys) {
        window.electronAPI.updateHotkeys({
          quickAccess: type === 'quickAccess' ? hotkey : quickAccessHotkey,
          clearAll: type === 'clearAll' ? hotkey : clearAllHotkey
        })
      }
    }
  }

  const startRecording = (type) => {
    if (type === 'quickAccess') {
      setIsRecordingQuickAccess(true)
      setIsRecordingClearAll(false)
    } else if (type === 'clearAll') {
      setIsRecordingClearAll(true)
      setIsRecordingQuickAccess(false)
    }
  }

  const stopRecording = () => {
    setIsRecordingQuickAccess(false)
    setIsRecordingClearAll(false)
  }

  const getThemeDisplayName = (themeName) => {
    const displayNames = {
      dark: t('Dark Theme'),
      light: t('Light Theme'), 
      auto: t('Auto Theme')
    }
    
    // For custom themes, try to get display name from localStorage
    if (themeName.startsWith('custom-')) {
      try {
        const themeData = localStorage.getItem(`theme-${themeName}`)
        if (themeData) {
          const parsed = JSON.parse(themeData)
          return parsed.displayName || parsed.name || themeName
        }
      } catch (error) {
        // Fallback to theme name
      }
    }
    
    return displayNames[themeName] || themeName.charAt(0).toUpperCase() + themeName.slice(1)
  }

  // Handle opening theme builder
  const handleOpenThemeBuilder = () => {
    if (onOpenThemeBuilder) {
      onOpenThemeBuilder()
      // Don't close settings modal - let user navigate back
    }
  }

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="modal-header">
          <h3 className="modal-title">{t('settings.title')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="settings-grid">
            
            {/* Application Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.application')}</h4>
              <div className="setting-group">
                <label className="setting-label">{t('settings.application.closeBehavior')}</label>
                <div className="setting-control">
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="closeBehavior"
                        value="minimize"
                        checked={closeBehavior === 'minimize'}
                        onChange={(e) => setCloseBehavior(e.target.value)}
                      />
                      <span>{t('settings.application.minimizeToTray')}</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="closeBehavior"
                        value="close"
                        checked={closeBehavior === 'close'}
                        onChange={(e) => setCloseBehavior(e.target.value)}
                      />
                      <span>{t('settings.application.closeApplication')}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="setting-group">
                <div className="setting-control">
                  <label className="checkbox-option">
                    <input 
                      type="checkbox"
                      checked={autoStart}
                      onChange={(e) => handleAutoStartChange(e.target.checked)}
                      disabled={autoStartLoading}
                    />
                    <span>
                      {autoStartLoading ? t('settings.application.updating') : t('settings.application.startWhenTurnsOn')}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="setting-group">
                <div className="setting-control">
                  <label className="checkbox-option">
                    <input 
                      type="checkbox" 
                      checked={startMinimized}
                      onChange={(e) => setStartMinimized(e.target.checked)}
                    />
                    <span>{t('settings.application.startMinimized')}</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Enhanced Appearance Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.appearance')}</h4>
              <div className="setting-group">
                <label className="setting-label">{t('settings.appearance.theme')}</label>
                <div className="setting-control">
                  <select 
                    value={theme} 
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="select-input"
                  >
                    {/* Built-in Themes */}
                    <optgroup label={t('settings.appearance.builtInThemes')}>
                      {themeCategories.built_in.map(themeName => (
                        <option key={themeName} value={themeName}>
                          {getThemeDisplayName(themeName)}
                        </option>
                      ))}
                    </optgroup>
                    
                    {/* Custom Themes */}
                    {themeCategories.custom.length > 0 && (
                      <optgroup label={t('settings.appearance.customThemes')}>
                        {themeCategories.custom.map(themeName => (
                          <option key={themeName} value={themeName}>
                            {getThemeDisplayName(themeName)} ({t('settings.appearance.custom')})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>
              
              {/* Theme Management */}
              {onOpenThemeBuilder && (
                <div className="setting-group">
                  <div className="theme-management">
                    <button 
                      className="theme-builder-btn"
                      onClick={handleOpenThemeBuilder}
                    >
                      {t('settings.appearance.themeBuilder') || 'Theme Builder'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="setting-group">
                <label className="setting-label">{t('settings.appearance.defaultView')}</label>
                <div className="setting-control">
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="viewMode"
                        value="grid"
                        checked={viewMode === 'grid'}
                        onChange={(e) => setViewMode(e.target.value)}
                      />
                      <span>{t('settings.appearance.gridView')}</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="viewMode"
                        value="list"
                        checked={viewMode === 'list'}
                        onChange={(e) => setViewMode(e.target.value)}
                      />
                      <span>{t('settings.appearance.listView')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.language')}</h4>
              <div className="setting-group">
                <label className="setting-label">{t('settings.language.interfaceLanguage')}</label>
                <div className="setting-control">
                  <select 
                    value={i18nLanguage} 
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="select-input"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Storage Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.storage')}</h4>
              <div className="setting-group">
                <label className="setting-label">{t('settings.storage.maximumItems')}</label>
                <div className="setting-control">
                  <select className="select-input">
                    <option value="50">{t('settings.storage.items', { count: 50 })}</option>
                    <option value="100">{t('settings.storage.items', { count: 100 })}</option>
                    <option value="200">{t('settings.storage.items', { count: 200 })}</option>
                    <option value="500">{t('settings.storage.items', { count: 500 })}</option>
                  </select>
                </div>
              </div>
              
              <div className="setting-group">
                <label className="setting-label">{t('settings.storage.autoDelete')}</label>
                <div className="setting-control">
                  <select className="select-input">
                    <option value="never">{t('settings.storage.never')}</option>
                    <option value="5min">{t('settings.storage.after5min')}</option>
                    <option value="15min">{t('settings.storage.after15min')}</option>
                    <option value="30min">{t('settings.storage.after30min')}</option>
                    <option value="1hour">{t('settings.storage.after1hour')}</option>
                    <option value="2hours">{t('settings.storage.after2hours')}</option>
                    <option value="6hours">{t('settings.storage.after6hours')}</option>
                    <option value="12hours">{t('settings.storage.after12hours')}</option>
                    <option value="1day">{t('settings.storage.after1day')}</option>
                    <option value="3days">{t('settings.storage.after3days')}</option>
                    <option value="7days">{t('settings.storage.after7days')}</option>
                    <option value="30days">{t('settings.storage.after30days')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.privacy')}</h4>
              <div className="setting-group">
                <div className="setting-control">
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    <span>{t('settings.privacy.monitorClipboard')}</span>
                  </label>
                </div>
              </div>
              
              <div className="setting-group">
                <div className="setting-control">
                  <label className="checkbox-option">
                    <input type="checkbox" />
                    <span>{t('settings.privacy.saveOnClose')}</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Shortcuts Settings */}
            <div className="setting-section">
              <h4 className="section-title">{t('settings.sections.shortcuts')}</h4>
              <div className="setting-group">
                <label className="setting-label">{t('settings.shortcuts.quickAccess')}</label>
                <div className="setting-control">
                  <div className="hotkey-input">
                    <div 
                      className={`hotkey-display ${isRecordingQuickAccess ? 'recording' : ''}`}
                      onClick={() => startRecording('quickAccess')}
                      onKeyDown={(e) => isRecordingQuickAccess && handleHotkeyRecord('quickAccess', e)}
                      tabIndex={0}
                    >
                      {isRecordingQuickAccess ? (
                        <span className="recording-text">{t('settings.shortcuts.pressKeys')}</span>
                      ) : (
                        quickAccessHotkey.split('+').map((key, index) => (
                          <span key={index}>
                            <kbd>{key}</kbd>
                            {index < quickAccessHotkey.split('+').length - 1 && ' + '}
                          </span>
                        ))
                      )}
                    </div>
                    {isRecordingQuickAccess && (
                      <button className="stop-recording" onClick={stopRecording}>
                        {t('settings.shortcuts.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="setting-group">
                <label className="setting-label">{t('settings.shortcuts.clearAll')}</label>
                <div className="setting-control">
                  <div className="hotkey-input">
                    <div 
                      className={`hotkey-display ${isRecordingClearAll ? 'recording' : ''}`}
                      onClick={() => startRecording('clearAll')}
                      onKeyDown={(e) => isRecordingClearAll && handleHotkeyRecord('clearAll', e)}
                      tabIndex={0}
                    >
                      {isRecordingClearAll ? (
                        <span className="recording-text">{t('settings.shortcuts.pressKeys')}</span>
                      ) : (
                        clearAllHotkey.split('+').map((key, index) => (
                          <span key={index}>
                            <kbd>{key}</kbd>
                            {index < clearAllHotkey.split('+').length - 1 && ' + '}
                          </span>
                        ))
                      )}
                    </div>
                    {isRecordingClearAll && (
                      <button className="stop-recording" onClick={stopRecording}>
                        {t('settings.shortcuts.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div className="modal-footer">
          <div className="footer-actions">
            <div className="danger-actions">
              <button 
                className={`danger-btn ${confirmClear ? 'confirm' : ''}`}
                onClick={handleClearAll}
              >
                {confirmClear ? t('settings.danger.confirmClear') : t('settings.danger.clearAllData')}
              </button>
              <button 
                className={`danger-btn ${confirmReset ? 'confirm' : ''}`}
                onClick={handleResetSettings}
              >
                {confirmReset ? t('settings.danger.confirmReset') : t('settings.danger.resetSettings')}
              </button>
            </div>
            
            <div className="primary-actions">
              <button className="cancel-btn" onClick={onClose}>
                {t('settings.cancel')}
              </button>
              <button className="save-btn" onClick={onClose}>
                {t('settings.save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal