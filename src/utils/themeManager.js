// utils/themeManager.js - Fixed Advanced Theme Management System
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'customThemes'
    this.CURRENT_THEME_KEY = 'currentTheme'
    this.themes = new Map()
    this.currentTheme = null
    this.isTransitioning = false
    this.loadThemesFromStorage()
  }

  // Load themes from localStorage
  loadThemesFromStorage() {
    try {
      const storedThemes = localStorage.getItem(this.STORAGE_KEY)
      if (storedThemes) {
        const themesData = JSON.parse(storedThemes)
        Object.entries(themesData).forEach(([name, config]) => {
          this.themes.set(name, config)
        })
      }
      
      const currentTheme = localStorage.getItem(this.CURRENT_THEME_KEY)
      if (currentTheme) {
        this.currentTheme = currentTheme
      }
    } catch (error) {
      console.error('Failed to load themes from storage:', error)
    }
  }

  // Save themes to localStorage
  saveThemesToStorage() {
    try {
      const themesObject = Object.fromEntries(this.themes)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themesObject))
    } catch (error) {
      console.error('Failed to save themes to storage:', error)
      throw error
    }
  }

  // Get available themes
  getAvailableThemes() {
    const builtInThemes = ['dark', 'light']
    const customThemes = Array.from(this.themes.keys())
    return [...builtInThemes, ...customThemes]
  }

  // Save a theme
  async saveTheme(name, config) {
    try {
      // Validate theme config structure
      if (!config || typeof config !== 'object') {
        throw new Error('Invalid theme configuration')
      }

      // Save to memory
      this.themes.set(name, {
        ...config,
        name,
        updatedAt: new Date().toISOString()
      })
      
      // Save to localStorage
      this.saveThemesToStorage()
      
      console.log(`✅ Theme "${name}" saved successfully`)
      return true
    } catch (error) {
      console.error('Failed to save theme:', error)
      throw error
    }
  }

  // Load theme configuration
  loadThemeConfig(name) {
    if (this.themes.has(name)) {
      return this.themes.get(name)
    }
    return null
  }

  // Delete a theme
  async deleteTheme(name) {
    try {
      if (!this.themes.has(name)) {
        throw new Error(`Theme "${name}" not found`)
      }

      this.themes.delete(name)
      this.saveThemesToStorage()
      
      // If deleted theme was current, switch to dark
      if (this.currentTheme === name) {
        await this.applyTheme('dark')
      }

      return true
    } catch (error) {
      console.error('Failed to delete theme:', error)
      throw error
    }
  }

  // Apply a theme with smooth transition
  async applyTheme(themeName) {
    if (this.isTransitioning) {
      console.log('Theme transition in progress, skipping...')
      return false
    }

    try {
      this.isTransitioning = true
      const root = document.documentElement
      
      // Add loading class to prevent flicker
      document.body.classList.add('theme-loading')
      
      // Clear any existing custom theme variables first
      this.clearCustomThemeVariables()
      
      if (themeName === 'dark' || themeName === 'light') {
        // Apply built-in theme
        console.log(`🎨 Applying built-in theme: ${themeName}`)
        root.setAttribute('data-theme', themeName)
        
        // Ensure custom theme attribute is removed
        root.removeAttribute('data-custom-theme')
        
      } else if (this.themes.has(themeName)) {
        // Apply custom theme
        console.log(`🎨 Applying custom theme: ${themeName}`)
        const themeConfig = this.themes.get(themeName)
        
        // Set both attributes for maximum compatibility
        root.setAttribute('data-theme', 'custom')
        root.setAttribute('data-custom-theme', themeName)
        
        // Apply CSS variables with small delay to ensure DOM is ready
        setTimeout(() => {
          const cssVars = this.generateCSSVariables(themeConfig)
          this.applyThemeVariables(cssVars)
        }, 50)
        
      } else {
        throw new Error(`Theme "${themeName}" not found`)
      }
      
      // Update current theme
      this.currentTheme = themeName
      localStorage.setItem(this.CURRENT_THEME_KEY, themeName)
      
      // Remove loading class after transition
      setTimeout(() => {
        document.body.classList.remove('theme-loading')
        this.isTransitioning = false
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { theme: themeName } 
        }))
        
        console.log(`✅ Theme "${themeName}" applied successfully`)
      }, 150)
      
      return true
    } catch (error) {
      console.error('Failed to apply theme:', error)
      document.body.classList.remove('theme-loading')
      this.isTransitioning = false
      throw error
    }
  }

  // Clear custom theme variables
  clearCustomThemeVariables() {
    const root = document.documentElement
    const customProperties = [
      '--bg-primary', '--bg-secondary', '--bg-tertiary', '--bg-elevated',
      '--text-primary', '--text-secondary', '--text-muted', '--text-disabled',
      '--accent-primary', '--accent-secondary', '--accent-muted',
      '--border-primary', '--border-secondary', '--border-accent',
      '--success', '--warning', '--error', '--info',
      '--clipboard-bg', '--clipboard-bg-hover', '--clipboard-border', '--clipboard-border-hover',
      '--clipboard-border-width', '--clipboard-border-radius', '--clipboard-shadow', '--clipboard-shadow-hover',
      '--type-text-bg', '--type-text-color', '--type-text-border',
      '--type-code-bg', '--type-code-color', '--type-code-border',
      '--type-image-bg', '--type-image-color', '--type-image-border',
      '--btn-copy-bg', '--btn-copy-bg-hover', '--btn-copy-color', '--btn-copy-color-hover',
      '--btn-copy-border', '--btn-copy-border-hover',
      '--btn-edit-bg', '--btn-edit-bg-hover', '--btn-edit-color', '--btn-edit-color-hover',
      '--btn-edit-border', '--btn-edit-border-hover',
      '--btn-delete-bg', '--btn-delete-bg-hover', '--btn-delete-color', '--btn-delete-color-hover',
      '--btn-delete-border', '--btn-delete-border-hover'
    ]
    
    customProperties.forEach(property => {
      root.style.removeProperty(property)
    })
  }

  // Set current theme
  setCurrentTheme(themeName) {
    this.currentTheme = themeName
    localStorage.setItem(this.CURRENT_THEME_KEY, themeName)
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme || 'dark'
  }

  // Generate CSS variables from theme config
  generateCSSVariables(themeConfig) {
    const variables = {}
    
    // Background colors
    if (themeConfig.background) {
      variables['--bg-primary'] = themeConfig.background.primary
      variables['--bg-secondary'] = themeConfig.background.secondary
      variables['--bg-tertiary'] = themeConfig.background.tertiary
      variables['--bg-elevated'] = themeConfig.background.elevated
    }
    
    // Text colors
    if (themeConfig.text) {
      variables['--text-primary'] = themeConfig.text.primary
      variables['--text-secondary'] = themeConfig.text.secondary
      variables['--text-muted'] = themeConfig.text.muted
      variables['--text-disabled'] = themeConfig.text.disabled
    }
    
    // Accent colors
    if (themeConfig.accent) {
      variables['--accent-primary'] = themeConfig.accent.primary
      variables['--accent-secondary'] = themeConfig.accent.secondary
      variables['--accent-muted'] = themeConfig.accent.muted
    }
    
    // Clipboard item styling
    if (themeConfig.clipboardItem) {
      variables['--clipboard-bg'] = themeConfig.clipboardItem.background
      variables['--clipboard-bg-hover'] = themeConfig.clipboardItem.backgroundHover
      variables['--clipboard-border'] = themeConfig.clipboardItem.borderColor
      variables['--clipboard-border-hover'] = themeConfig.clipboardItem.borderColorHover
      variables['--clipboard-border-width'] = `${themeConfig.clipboardItem.borderWidth}px`
      variables['--clipboard-border-radius'] = `${themeConfig.clipboardItem.borderRadius}px`
      variables['--clipboard-shadow'] = themeConfig.clipboardItem.shadow
      variables['--clipboard-shadow-hover'] = themeConfig.clipboardItem.shadowHover
    }
    
    // Type icons
    if (themeConfig.typeIcons) {
      // Text icon
      if (themeConfig.typeIcons.text) {
        variables['--type-text-bg'] = themeConfig.typeIcons.text.background
        variables['--type-text-color'] = themeConfig.typeIcons.text.color
        variables['--type-text-border'] = themeConfig.typeIcons.text.borderColor
      }
      
      // Code icon
      if (themeConfig.typeIcons.code) {
        variables['--type-code-bg'] = themeConfig.typeIcons.code.background
        variables['--type-code-color'] = themeConfig.typeIcons.code.color
        variables['--type-code-border'] = themeConfig.typeIcons.code.borderColor
      }
      
      // Image icon
      if (themeConfig.typeIcons.image) {
        variables['--type-image-bg'] = themeConfig.typeIcons.image.background
        variables['--type-image-color'] = themeConfig.typeIcons.image.color
        variables['--type-image-border'] = themeConfig.typeIcons.image.borderColor
      }
    }
    
    // Buttons
    if (themeConfig.buttons) {
      // Copy button
      if (themeConfig.buttons.copy) {
        variables['--btn-copy-bg'] = themeConfig.buttons.copy.background
        variables['--btn-copy-bg-hover'] = themeConfig.buttons.copy.backgroundHover
        variables['--btn-copy-color'] = themeConfig.buttons.copy.color
        variables['--btn-copy-color-hover'] = themeConfig.buttons.copy.colorHover
        variables['--btn-copy-border'] = themeConfig.buttons.copy.borderColor
        variables['--btn-copy-border-hover'] = themeConfig.buttons.copy.borderColorHover
      }
      
      // Edit button
      if (themeConfig.buttons.edit) {
        variables['--btn-edit-bg'] = themeConfig.buttons.edit.background
        variables['--btn-edit-bg-hover'] = themeConfig.buttons.edit.backgroundHover
        variables['--btn-edit-color'] = themeConfig.buttons.edit.color
        variables['--btn-edit-color-hover'] = themeConfig.buttons.edit.colorHover
        variables['--btn-edit-border'] = themeConfig.buttons.edit.borderColor
        variables['--btn-edit-border-hover'] = themeConfig.buttons.edit.borderColorHover
      }
      
      // Delete button
      if (themeConfig.buttons.delete) {
        variables['--btn-delete-bg'] = themeConfig.buttons.delete.background
        variables['--btn-delete-bg-hover'] = themeConfig.buttons.delete.backgroundHover
        variables['--btn-delete-color'] = themeConfig.buttons.delete.color
        variables['--btn-delete-color-hover'] = themeConfig.buttons.delete.colorHover
        variables['--btn-delete-border'] = themeConfig.buttons.delete.borderColor
        variables['--btn-delete-border-hover'] = themeConfig.buttons.delete.borderColorHover
      }
    }
    
    // Status colors
    if (themeConfig.status) {
      variables['--success'] = themeConfig.status.success
      variables['--warning'] = themeConfig.status.warning
      variables['--error'] = themeConfig.status.error
      variables['--info'] = themeConfig.status.info
    }
    
    // Legacy support for old structure
    if (themeConfig.colors) {
      variables['--bg-primary'] = themeConfig.colors.bgPrimary || variables['--bg-primary']
      variables['--bg-secondary'] = themeConfig.colors.bgSecondary || variables['--bg-secondary']
      variables['--bg-tertiary'] = themeConfig.colors.bgTertiary || variables['--bg-tertiary']
      variables['--bg-elevated'] = themeConfig.colors.bgElevated || variables['--bg-elevated']
      variables['--text-primary'] = themeConfig.colors.textPrimary || variables['--text-primary']
      variables['--text-secondary'] = themeConfig.colors.textSecondary || variables['--text-secondary']
      variables['--text-muted'] = themeConfig.colors.textMuted || variables['--text-muted']
      variables['--text-disabled'] = themeConfig.colors.textDisabled || variables['--text-disabled']
      variables['--accent-primary'] = themeConfig.colors.accentPrimary || variables['--accent-primary']
      variables['--accent-secondary'] = themeConfig.colors.accentSecondary || variables['--accent-secondary']
      variables['--accent-muted'] = themeConfig.colors.accentMuted || variables['--accent-muted']
      variables['--border-primary'] = themeConfig.colors.borderPrimary || variables['--border-primary']
      variables['--border-secondary'] = themeConfig.colors.borderSecondary || variables['--border-secondary']
      variables['--border-accent'] = themeConfig.colors.borderAccent || variables['--border-accent']
      variables['--success'] = themeConfig.colors.success || variables['--success']
      variables['--warning'] = themeConfig.colors.warning || variables['--warning']
      variables['--error'] = themeConfig.colors.error || variables['--error']
      variables['--info'] = themeConfig.colors.info || variables['--info']
    }
    
    return variables
  }

  // Apply CSS variables to document with batch update
  applyThemeVariables(variables) {
    const root = document.documentElement
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      Object.entries(variables).forEach(([property, value]) => {
        if (value) {
          root.style.setProperty(property, value)
        }
      })
      
      // Trigger a custom event for components that need to react to variable changes
      window.dispatchEvent(new CustomEvent('cardCustomizationChanged'))
    })
  }

  // Export theme to file
  exportTheme(themeName) {
    const themeConfig = this.themes.get(themeName)
    if (!themeConfig) {
      throw new Error(`Theme "${themeName}" not found`)
    }

    const exportData = {
      ...themeConfig,
      exportedAt: new Date().toISOString(),
      exportedBy: 'ClipBoard Pro Theme Builder'
    }

    return exportData
  }

  // Import theme from data
  async importTheme(themeData) {
    try {
      // Validate theme data
      if (!themeData.name) {
        throw new Error('Invalid theme data: missing name')
      }

      // Ensure unique name
      let themeName = themeData.name
      let counter = 1
      while (this.themes.has(themeName)) {
        themeName = `${themeData.name}_${counter}`
        counter++
      }

      // Save the imported theme
      await this.saveTheme(themeName, {
        ...themeData,
        name: themeName,
        importedAt: new Date().toISOString()
      })

      return themeName
    } catch (error) {
      console.error('Failed to import theme:', error)
      throw error
    }
  }

  // Get theme preview data
  getThemePreview(themeName) {
    if (themeName === 'dark' || themeName === 'light') {
      return {
        name: themeName,
        isBuiltIn: true,
        colors: {}
      }
    }

    const themeConfig = this.loadThemeConfig(themeName)
    if (!themeConfig) {
      return null
    }

    return {
      name: themeConfig.name || themeName,
      author: themeConfig.author,
      description: themeConfig.description,
      isBuiltIn: false,
      colors: themeConfig.background || themeConfig.colors || {},
      createdAt: themeConfig.createdAt,
      updatedAt: themeConfig.updatedAt
    }
  }

  // Reset all themes (dangerous operation)
  resetAllThemes() {
    try {
      this.themes.clear()
      localStorage.removeItem(this.STORAGE_KEY)
      this.setCurrentTheme('dark')
      this.applyTheme('dark')
      return true
    } catch (error) {
      console.error('Failed to reset themes:', error)
      throw error
    }
  }

  // Get theme statistics
  getThemeStats() {
    return {
      totalThemes: this.themes.size + 2, // +2 for built-in themes
      customThemes: this.themes.size,
      builtInThemes: 2, // dark and light
      currentTheme: this.currentTheme,
      storageSize: new Blob([localStorage.getItem(this.STORAGE_KEY) || '']).size
    }
  }

  // Force refresh current theme (useful for debugging)
  async refreshCurrentTheme() {
    const current = this.getCurrentTheme()
    console.log(`🔄 Refreshing current theme: ${current}`)
    await this.applyTheme(current)
  }
}

// Create singleton instance
export const themeManager = new ThemeManager()

// Export as default as well
export default themeManager