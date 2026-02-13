// ThemeBuilder.jsx - Single Page with Preview & Author
import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../utils/i18n'
import { themeManager } from '../utils/themeManager'
import '../scss/ThemeBuilder.scss'

const ThemeBuilder = ({ isOpen, onClose, currentTheme, onThemeApply }) => {
  const { t } = useLanguage()
  const [themeName, setThemeName] = useState('')
  const [themeAuthor, setThemeAuthor] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [customThemes, setCustomThemes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Comprehensive theme configuration
  const [themeConfig, setThemeConfig] = useState({
    name: '',
    description: '',
    author: '',
    version: '1.0.0',
    
    // Background Colors
    background: {
      primary: '#0a0a0a',
      secondary: '#161616',
      tertiary: '#1f1f1f',
      elevated: '#262626'
    },
    
    // Text Colors
    text: {
      primary: '#ffffff',
      secondary: '#e5e5e5',
      muted: '#b3b3b3',
      disabled: '#71717a'
    },
    
    // Accent Colors
    accent: {
      primary: '#FF1A00',
      secondary: '#FF5533',
      muted: 'rgba(255, 107, 53, 0.12)'
    },
    
    // Clipboard Item Styling
    clipboardItem: {
      background: '#161616',
      backgroundHover: '#1f1f1f',
      borderColor: '#2a2a2a',
      borderColorHover: '#404040',
      borderWidth: 1,
      borderRadius: 8,
      shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      shadowHover: '0 10px 25px rgba(0, 0, 0, 0.4)'
    },
    
    // Type Icons
    typeIcons: {
      text: {
        background: '#FF1A00',
        color: '#FFFFFF',
        borderColor: '#FF5533'
      },
      code: {
        background: '#8b5cf6',
        color: '#FFFFFF',
        borderColor: '#a78bfa'
      },
      image: {
        background: '#22c55e',
        color: '#FFFFFF',
        borderColor: '#4ade80'
      }
    },
    
    // Buttons
    buttons: {
      copy: {
        background: '#262626',
        backgroundHover: 'rgba(34, 197, 94, 0.2)',
        color: '#b3b3b3',
        colorHover: '#22c55e'
      },
      edit: {
        background: '#262626',
        backgroundHover: 'rgba(139, 92, 246, 0.2)',
        color: '#b3b3b3',
        colorHover: '#8b5cf6'
      },
      delete: {
        background: '#262626',
        backgroundHover: 'rgba(239, 68, 68, 0.2)',
        color: '#b3b3b3',
        colorHover: '#ef4444'
      }
    }
  })

  // Load custom themes on component mount
  useEffect(() => {
    if (isOpen) {
      loadCustomThemes()
      if (currentTheme && !['dark', 'light'].includes(currentTheme)) {
        loadThemeConfig(currentTheme)
      }
    }
  }, [isOpen, currentTheme])

  const loadCustomThemes = async () => {
    try {
      const themes = await themeManager.getAvailableThemes()
      setCustomThemes(themes.filter(theme => !['dark', 'light'].includes(theme)))
    } catch (error) {
      console.error('Failed to load custom themes:', error)
    }
  }

  const loadThemeConfig = async (themeName) => {
    try {
      const config = await themeManager.loadThemeConfig(themeName)
      if (config) {
        setThemeConfig(config)
        setThemeName(config.name)
        setThemeAuthor(config.author || '')
      }
    } catch (error) {
      console.error('Failed to load theme config:', error)
    }
  }

  // Update theme config helper
  const updateConfig = (section, key, value) => {
    setThemeConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setUnsavedChanges(true)
    
    if (isPreviewMode) {
      applyPreview()
    }
  }

  // Update nested config helper
  const updateNestedConfig = (section, subsection, key, value) => {
    setThemeConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }))
    setUnsavedChanges(true)
    
    if (isPreviewMode) {
      applyPreview()
    }
  }

  // Apply theme preview
  const applyPreview = () => {
    const cssVars = themeManager.generateCSSVariables(themeConfig)
    themeManager.applyThemeVariables(cssVars)
  }

  // Save theme
  const saveTheme = async () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name')
      return
    }

    setIsLoading(true)
    try {
      const themeToSave = {
        ...themeConfig,
        name: themeName,
        author: themeAuthor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await themeManager.saveTheme(themeName, themeToSave)
      await loadCustomThemes()
      setUnsavedChanges(false)
      onThemeApply(themeName)
      alert('Theme saved successfully!')
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Failed to save theme')
    } finally {
      setIsLoading(false)
    }
  }

  // Export theme
  const exportTheme = () => {
    try {
      const exportData = {
        ...themeConfig,
        name: themeName,
        author: themeAuthor,
        exportedAt: new Date().toISOString(),
        version: themeConfig.version || '1.0.0'
      }
      
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `${themeName || 'custom-theme'}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error('Failed to export theme:', error)
      alert('Failed to export theme')
    }
  }

  // Import theme
  const importTheme = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target.result)
        
        if (!importedTheme.name) {
          alert('Invalid theme file')
          return
        }
        
        setThemeConfig(importedTheme)
        setThemeName(importedTheme.name)
        setThemeAuthor(importedTheme.author || '')
        setUnsavedChanges(true)
        
        alert('Theme imported successfully!')
      } catch (error) {
        console.error('Failed to import theme:', error)
        alert('Failed to import theme')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      applyPreview()
    } else {
      onThemeApply(currentTheme)
    }
  }

  // Reset to default theme config
  const resetToDefaults = () => {
    setThemeConfig({
      name: '',
      description: '',
      author: '',
      version: '1.0.0',
      
      background: {
        primary: '#0a0a0a',
        secondary: '#161616',
        tertiary: '#1f1f1f',
        elevated: '#262626'
      },
      
      text: {
        primary: '#ffffff',
        secondary: '#e5e5e5',
        muted: '#b3b3b3',
        disabled: '#71717a'
      },
      
      accent: {
        primary: '#FF1A00',
        secondary: '#FF5533',
        muted: 'rgba(255, 107, 53, 0.12)'
      },
      
      clipboardItem: {
        background: '#161616',
        backgroundHover: '#1f1f1f',
        borderColor: '#2a2a2a',
        borderColorHover: '#404040',
        borderWidth: 1,
        borderRadius: 8,
        shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        shadowHover: '0 10px 25px rgba(0, 0, 0, 0.4)'
      },
      
      typeIcons: {
        text: {
          background: '#FF1A00',
          color: '#FFFFFF',
          borderColor: '#FF5533'
        },
        code: {
          background: '#8b5cf6',
          color: '#FFFFFF',
          borderColor: '#a78bfa'
        },
        image: {
          background: '#22c55e',
          color: '#FFFFFF',
          borderColor: '#4ade80'
        }
      },
      
      buttons: {
        copy: {
          background: '#262626',
          backgroundHover: 'rgba(34, 197, 94, 0.2)',
          color: '#b3b3b3',
          colorHover: '#22c55e'
        },
        edit: {
          background: '#262626',
          backgroundHover: 'rgba(139, 92, 246, 0.2)',
          color: '#b3b3b3',
          colorHover: '#8b5cf6'
        },
        delete: {
          background: '#262626',
          backgroundHover: 'rgba(239, 68, 68, 0.2)',
          color: '#b3b3b3',
          colorHover: '#ef4444'
        }
      }
    })
    setThemeName('')
    setThemeAuthor('')
    setUnsavedChanges(false)
  }

  // Handle close
  const handleClose = () => {
    if (unsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
        return
      }
    }
    
    if (isPreviewMode) {
      onThemeApply(currentTheme)
    }
    
    // Reset to defaults when closing
    resetToDefaults()
    setIsPreviewMode(false)
    onClose()
  }

  // Enhanced color picker component with drag to select
  const ColorPicker = ({ label, value, onChange, description }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)
    const [mouseDownTime, setMouseDownTime] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const colorInputRef = useRef(null)
    const CLICK_THRESHOLD = 200 // milliseconds
    const MOVE_THRESHOLD = 5 // pixels

    // Update temp value when prop value changes
    useEffect(() => {
      setTempValue(value)
    }, [value])

    // Handle mouse down - start tracking
    const handleMouseDown = (e) => {
      setMouseDownTime(Date.now())
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Handle mouse up - determine if it's click or drag
    const handleMouseUp = (e) => {
      const mouseUpTime = Date.now()
      const timeDiff = mouseUpTime - mouseDownTime
      const deltaX = Math.abs(e.clientX - mousePosition.x)
      const deltaY = Math.abs(e.clientY - mousePosition.y)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Only open color picker if it was a long press or drag
      if (timeDiff > CLICK_THRESHOLD || distance > MOVE_THRESHOLD) {
        colorInputRef.current?.click()
      }
    }

    // Handle text input changes
    const handleTextChange = (e) => {
      const newValue = e.target.value
      setTempValue(newValue)
      
      // Validate hex color format
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
        onChange(newValue)
      }
    }

    // Handle text input blur
    const handleTextBlur = () => {
      setIsEditing(false)
      // Revert to original value if invalid
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tempValue)) {
        setTempValue(value)
      }
    }

    // Handle text input key press
    const handleTextKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.target.blur()
      } else if (e.key === 'Escape') {
        setTempValue(value)
        setIsEditing(false)
      }
    }

    // Handle color value click for editing
    const handleColorValueClick = (e) => {
      e.stopPropagation()
      setIsEditing(true)
    }

    return (
      <div className="color-picker">
        <label className="color-label">
          {label}
          {description && <span className="color-description">{description}</span>}
        </label>
        <div className="color-input-wrapper">
          <div 
            className="color-preview" 
            style={{ backgroundColor: value }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
          >
            {isEditing ? (
              <input
                type="text"
                value={tempValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                className="color-text-input"
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <span 
                className="color-value"
                onClick={handleColorValueClick}
              >
                {value}
              </span>
            )}
          </div>
          <input
            ref={colorInputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="color-input"
          />
        </div>
      </div>
    )
  }

  // Slider component
  const SliderInput = ({ label, value, onChange, min = 0, max = 20, unit = 'px' }) => (
    <div className="slider-input">
      <label className="slider-label">
        {label}
        <span className="slider-value">{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
      />
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="theme-builder-overlay" onClick={handleClose}>
      <div className="theme-builder-single" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="builder-header">
          <div className="header-left">
            <h2>Theme Builder</h2>
            <div className="theme-info">
              <input
                type="text"
                value={themeName}
                onChange={(e) => {
                  setThemeName(e.target.value)
                  setUnsavedChanges(true)
                }}
                placeholder="Theme name"
                className="theme-name-input"
              />
              <input
                type="text"
                value={themeAuthor}
                onChange={(e) => {
                  setThemeAuthor(e.target.value)
                  setUnsavedChanges(true)
                }}
                placeholder="Author name"
                className="theme-author-input"
              />
            </div>
          </div>
          
          <div className="header-right">
            <button 
              className={`preview-btn ${isPreviewMode ? 'active' : ''}`}
              onClick={togglePreview}
            >
              {isPreviewMode ? 'Exit Preview' : 'Preview'}
            </button>
            
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>
        </div>

        {/* Content - Single Page Layout */}
        <div className="builder-content">
          <div className="content-grid">
            
            {/* Left Column - Controls */}
            <div className="controls-column">
              
              {/* Background Colors */}
              <div className="section-group">
                <h3>Background Colors</h3>
                <div className="color-grid">
                  <ColorPicker
                    label="Primary"
                    value={themeConfig.background.primary}
                    onChange={(value) => updateConfig('background', 'primary', value)}
                    description="Main app background"
                  />
                  <ColorPicker
                    label="Secondary"
                    value={themeConfig.background.secondary}
                    onChange={(value) => updateConfig('background', 'secondary', value)}
                    description="Card backgrounds"
                  />
                  <ColorPicker
                    label="Tertiary"
                    value={themeConfig.background.tertiary}
                    onChange={(value) => updateConfig('background', 'tertiary', value)}
                    description="Hover states"
                  />
                  <ColorPicker
                    label="Elevated"
                    value={themeConfig.background.elevated}
                    onChange={(value) => updateConfig('background', 'elevated', value)}
                    description="Modals & dropdowns"
                  />
                </div>
              </div>

              {/* Text Colors */}
              <div className="section-group">
                <h3>Text Colors</h3>
                <div className="color-grid">
                  <ColorPicker
                    label="Primary"
                    value={themeConfig.text.primary}
                    onChange={(value) => updateConfig('text', 'primary', value)}
                    description="Main text"
                  />
                  <ColorPicker
                    label="Secondary"
                    value={themeConfig.text.secondary}
                    onChange={(value) => updateConfig('text', 'secondary', value)}
                    description="Secondary text"
                  />
                  <ColorPicker
                    label="Muted"
                    value={themeConfig.text.muted}
                    onChange={(value) => updateConfig('text', 'muted', value)}
                    description="Subtle text"
                  />
                  <ColorPicker
                    label="Disabled"
                    value={themeConfig.text.disabled}
                    onChange={(value) => updateConfig('text', 'disabled', value)}
                    description="Disabled elements"
                  />
                </div>
              </div>

              {/* Accent Colors */}
              <div className="section-group">
                <h3>Accent Colors</h3>
                <div className="color-grid">
                  <ColorPicker
                    label="Primary"
                    value={themeConfig.accent.primary}
                    onChange={(value) => updateConfig('accent', 'primary', value)}
                    description="Brand color"
                  />
                  <ColorPicker
                    label="Secondary"
                    value={themeConfig.accent.secondary}
                    onChange={(value) => updateConfig('accent', 'secondary', value)}
                    description="Hover accent"
                  />
                </div>
              </div>

              {/* Card Layout */}
              <div className="section-group">
                <h3>Card Appearance</h3>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.clipboardItem.background}
                    onChange={(value) => updateConfig('clipboardItem', 'background', value)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={themeConfig.clipboardItem.backgroundHover}
                    onChange={(value) => updateConfig('clipboardItem', 'backgroundHover', value)}
                  />
                  <ColorPicker
                    label="Border"
                    value={themeConfig.clipboardItem.borderColor}
                    onChange={(value) => updateConfig('clipboardItem', 'borderColor', value)}
                  />
                  <ColorPicker
                    label="Hover Border"
                    value={themeConfig.clipboardItem.borderColorHover}
                    onChange={(value) => updateConfig('clipboardItem', 'borderColorHover', value)}
                  />
                </div>
                
                <div className="slider-grid">
                  <SliderInput
                    label="Border Width"
                    value={themeConfig.clipboardItem.borderWidth}
                    onChange={(value) => updateConfig('clipboardItem', 'borderWidth', value)}
                    min={0}
                    max={5}
                    unit="px"
                  />
                  <SliderInput
                    label="Border Radius"
                    value={themeConfig.clipboardItem.borderRadius}
                    onChange={(value) => updateConfig('clipboardItem', 'borderRadius', value)}
                    min={0}
                    max={20}
                    unit="px"
                  />
                </div>
              </div>

              {/* Type Icons */}
              <div className="section-group">
                <h3>Type Icons</h3>
                
                <h4>Text Icon</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.typeIcons.text.background}
                    onChange={(value) => updateNestedConfig('typeIcons', 'text', 'background', value)}
                  />
                  <ColorPicker
                    label="Icon Color"
                    value={themeConfig.typeIcons.text.color}
                    onChange={(value) => updateNestedConfig('typeIcons', 'text', 'color', value)}
                  />
                </div>

                <h4>Code Icon</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.typeIcons.code.background}
                    onChange={(value) => updateNestedConfig('typeIcons', 'code', 'background', value)}
                  />
                  <ColorPicker
                    label="Icon Color"
                    value={themeConfig.typeIcons.code.color}
                    onChange={(value) => updateNestedConfig('typeIcons', 'code', 'color', value)}
                  />
                </div>

                <h4>Image Icon</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.typeIcons.image.background}
                    onChange={(value) => updateNestedConfig('typeIcons', 'image', 'background', value)}
                  />
                  <ColorPicker
                    label="Icon Color"
                    value={themeConfig.typeIcons.image.color}
                    onChange={(value) => updateNestedConfig('typeIcons', 'image', 'color', value)}
                  />
                </div>
              </div>

              {/* Button Colors */}
              <div className="section-group">
                <h3>Button Colors</h3>
                
                <h4>Copy Button</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.buttons.copy.background}
                    onChange={(value) => updateNestedConfig('buttons', 'copy', 'background', value)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={themeConfig.buttons.copy.backgroundHover}
                    onChange={(value) => updateNestedConfig('buttons', 'copy', 'backgroundHover', value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={themeConfig.buttons.copy.color}
                    onChange={(value) => updateNestedConfig('buttons', 'copy', 'color', value)}
                  />
                  <ColorPicker
                    label="Hover Text"
                    value={themeConfig.buttons.copy.colorHover}
                    onChange={(value) => updateNestedConfig('buttons', 'copy', 'colorHover', value)}
                  />
                </div>

                <h4>Edit Button</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.buttons.edit.background}
                    onChange={(value) => updateNestedConfig('buttons', 'edit', 'background', value)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={themeConfig.buttons.edit.backgroundHover}
                    onChange={(value) => updateNestedConfig('buttons', 'edit', 'backgroundHover', value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={themeConfig.buttons.edit.color}
                    onChange={(value) => updateNestedConfig('buttons', 'edit', 'color', value)}
                  />
                  <ColorPicker
                    label="Hover Text"
                    value={themeConfig.buttons.edit.colorHover}
                    onChange={(value) => updateNestedConfig('buttons', 'edit', 'colorHover', value)}
                  />
                </div>

                <h4>Delete Button</h4>
                <div className="color-grid">
                  <ColorPicker
                    label="Background"
                    value={themeConfig.buttons.delete.background}
                    onChange={(value) => updateNestedConfig('buttons', 'delete', 'background', value)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={themeConfig.buttons.delete.backgroundHover}
                    onChange={(value) => updateNestedConfig('buttons', 'delete', 'backgroundHover', value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={themeConfig.buttons.delete.color}
                    onChange={(value) => updateNestedConfig('buttons', 'delete', 'color', value)}
                  />
                  <ColorPicker
                    label="Hover Text"
                    value={themeConfig.buttons.delete.colorHover}
                    onChange={(value) => updateNestedConfig('buttons', 'delete', 'colorHover', value)}
                  />
                </div>
              </div>

            </div>

            {/* Right Column - Preview */}
            <div className="preview-column">
              <div className="preview-section">
                <h3>Live Preview</h3>
                <div className="preview-container">
                  
                  {/* Text Item Preview */}
                  <div 
                    className="preview-item text-item"
                    style={{
                      background: themeConfig.clipboardItem.background,
                      borderColor: themeConfig.clipboardItem.borderColor,
                      borderWidth: `${themeConfig.clipboardItem.borderWidth}px`,
                      borderRadius: `${themeConfig.clipboardItem.borderRadius}px`,
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="item-header">
                      <div className="type-indicator">
                        <div 
                          className="type-icon"
                          style={{
                            background: themeConfig.typeIcons.text.background,
                            color: themeConfig.typeIcons.text.color
                          }}
                        >
                          T
                        </div>
                        <div className="type-info">
                          <span 
                            className="type-label"
                            style={{ color: themeConfig.text.primary }}
                          >
                            Text
                          </span>
                          <span 
                            className="timestamp"
                            style={{ color: themeConfig.text.muted }}
                          >
                            2 min ago
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <div className="text-preview">
                        <p style={{ color: themeConfig.text.primary }}>
                          Sample text content for theme preview. This shows how your text will look.
                        </p>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        className="action-btn copy-btn"
                        style={{
                          background: themeConfig.buttons.copy.background,
                          color: themeConfig.buttons.copy.color
                        }}
                      >
                        Copy
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        style={{
                          background: themeConfig.buttons.edit.background,
                          color: themeConfig.buttons.edit.color
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        style={{
                          background: themeConfig.buttons.delete.background,
                          color: themeConfig.buttons.delete.color
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Code Item Preview */}
                  <div 
                    className="preview-item code-item"
                    style={{
                      background: themeConfig.clipboardItem.background,
                      borderColor: themeConfig.clipboardItem.borderColor,
                      borderWidth: `${themeConfig.clipboardItem.borderWidth}px`,
                      borderRadius: `${themeConfig.clipboardItem.borderRadius}px`,
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="item-header">
                      <div className="type-indicator">
                        <div 
                          className="type-icon"
                          style={{
                            background: themeConfig.typeIcons.code.background,
                            color: themeConfig.typeIcons.code.color
                          }}
                        >
                          &lt;/&gt;
                        </div>
                        <div className="type-info">
                          <span 
                            className="type-label"
                            style={{ color: themeConfig.text.primary }}
                          >
                            Code
                          </span>
                          <span 
                            className="timestamp"
                            style={{ color: themeConfig.text.muted }}
                          >
                            5 min ago
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <div className="code-preview">
                        <pre><code style={{ color: themeConfig.text.primary }}>{`const theme = {
  colors: {
    primary: '${themeConfig.accent.primary}'
  }
}`}</code></pre>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        className="action-btn copy-btn"
                        style={{
                          background: themeConfig.buttons.copy.background,
                          color: themeConfig.buttons.copy.color
                        }}
                      >
                        Copy
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        style={{
                          background: themeConfig.buttons.edit.background,
                          color: themeConfig.buttons.edit.color
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        style={{
                          background: themeConfig.buttons.delete.background,
                          color: themeConfig.buttons.delete.color
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Image Item Preview */}
                  <div 
                    className="preview-item image-item"
                    style={{
                      background: themeConfig.clipboardItem.background,
                      borderColor: themeConfig.clipboardItem.borderColor,
                      borderWidth: `${themeConfig.clipboardItem.borderWidth}px`,
                      borderRadius: `${themeConfig.clipboardItem.borderRadius}px`,
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="item-header">
                      <div className="type-indicator">
                        <div 
                          className="type-icon"
                          style={{
                            background: themeConfig.typeIcons.image.background,
                            color: themeConfig.typeIcons.image.color
                          }}
                        >
                          IMG
                        </div>
                        <div className="type-info">
                          <span 
                            className="type-label"
                            style={{ color: themeConfig.text.primary }}
                          >
                            Image
                          </span>
                          <span 
                            className="timestamp"
                            style={{ color: themeConfig.text.muted }}
                          >
                            1 hour ago
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <div className="image-preview">
                        <div 
                          className="image-placeholder"
                          style={{ 
                            background: `linear-gradient(45deg, ${themeConfig.text.muted}, ${themeConfig.text.disabled})`,
                            color: themeConfig.text.primary
                          }}
                        >
                          Image Preview
                        </div>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        className="action-btn copy-btn"
                        style={{
                          background: themeConfig.buttons.copy.background,
                          color: themeConfig.buttons.copy.color
                        }}
                      >
                        Copy
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        style={{
                          background: themeConfig.buttons.delete.background,
                          color: themeConfig.buttons.delete.color
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="builder-footer">
          <div className="footer-left">
            <button className="action-btn secondary" onClick={() => fileInputRef.current?.click()}>
              Import Theme
            </button>
            <button className="action-btn secondary" onClick={exportTheme}>
              Export Theme
            </button>
          </div>
          
          <div className="footer-center">
            {themeAuthor && (
              <span className="author-credit" style={{ color: themeConfig.text.muted }}>
                Created by {themeAuthor}
              </span>
            )}
          </div>
          
          <div className="footer-right">
            <button className="action-btn primary" onClick={saveTheme} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Theme'}
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={importTheme}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}

export default ThemeBuilder