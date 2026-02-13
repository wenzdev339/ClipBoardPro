export const en = {
  // App Title & Brand
  app: {
    title: 'ClipBoard Pro',
    version: 'Version',
    madeBy: 'Made with',
    by: 'by'
  },

  // Header
  header: {
    items: 'items',
    searchPlaceholder: 'Search Clipboard',
    filter: 'Filter',
    viewMode: 'View Mode',
    clearAll: 'Clear All',
    settings: 'Settings'
  },

  // Filter Options
  filter: {
    all: 'All',
    text: 'Text',
    images: 'Images',
    code: 'Code'
  },

  // Clipboard Item
  item: {
    text: 'Text',
    image: 'Image',
    code: 'Code',
    copy: 'Copy',
    copied: 'Copied',
    edit: 'Edit',
    delete: 'Delete',
    justNow: 'Just now',
    minutesAgo: '{{count}}m ago',
    hoursAgo: '{{count}}h ago',
    daysAgo: '{{count}}d ago'
  },

  // Empty State
  empty: {
    title: 'No clipboard history',
    titleSearch: 'No results found',
    description: 'Copy some text or images',
    descriptionSearch: 'No items match "{{query}}". Try a different search term.'
  },

  // Edit Modal
  edit: {
    title: 'Edit Content',
    save: 'Save Changes',
    cancel: 'Cancel',
    shortcuts: {
      save: 'to save',
      cancel: 'to cancel'
    }
  },

  // Settings Modal
  settings: {
    title: 'Settings',
    save: 'Save Changes',
    cancel: 'Cancel',
    
    // Sections
    sections: {
      application: 'Application',
      appearance: 'Appearance',
      language: 'Language',
      storage: 'Storage',
      privacy: 'Privacy',
      shortcuts: 'Shortcuts'
    },

    // Application Settings
    application: {
      closeBehavior: 'Close Button Behavior',
      minimizeToTray: 'Minimize to tray',
      closeApplication: 'Close application',
      startWhenTurnsOn: 'Start when computer turns on',
      startMinimized: 'Start minimized to tray',
      showTrayNotifications: 'Show tray notifications',
      updating: 'Updating...'
    },

    // Appearance Settings
    appearance: {
      theme: 'Theme',
      themes: {
        dark: 'Dark',
        light: 'Light',
        auto: 'Auto (System)'
      },
      builtInThemes: 'Built-in Themes',
      defaultView: 'Default View',
      gridView: 'Grid View',
      listView: 'List View',
      themeBuilder: 'Theme Builder',
      customizeIcons: 'Customize Icons'
    },

    // Language Settings
    language: {
      interfaceLanguage: 'Interface Language'
    },

    // Storage Settings
    storage: {
      maximumItems: 'Maximum Items',
      autoDelete: 'Auto Delete',
      items: '{{count}} items',
      never: 'Never',
      after5min: 'After 5 minutes',
      after15min: 'After 15 minutes',
      after30min: 'After 30 minutes',
      after1hour: 'After 1 hour',
      after2hours: 'After 2 hours',
      after6hours: 'After 6 hours',
      after12hours: 'After 12 hours',
      after1day: 'After 1 day',
      after3days: 'After 3 days',
      after7days: 'After 7 days',
      after30days: 'After 30 days'
    },

    // Privacy Settings
    privacy: {
      monitorClipboard: 'Monitor clipboard automatically',
      saveOnClose: 'Save clipboard on app close',
      excludeSensitive: 'Exclude sensitive data'
    },

    // Shortcuts Settings
    shortcuts: {
      quickAccess: 'Quick Access',
      clearAll: 'Clear All',
      pressKeys: 'Press keys...',
      cancel: 'Cancel',
      recording: 'Recording...'
    },

    // Danger Zone
    danger: {
      clearAllData: 'Clear All Data',
      resetSettings: 'Reset Settings',
      confirmClear: 'Click again to confirm',
      confirmReset: 'Click again to confirm'
    }
  },

  // Tray Menu
  tray: {
    show: 'Show Window',
    hide: 'Hide Window',
    quit: 'Quit'
  },

  // Footer
  footer: {
    donate: 'Donate',
    support: 'Support the developer'
  },

  // Notifications
  notifications: {
    itemCopied: 'Item copied to clipboard',
    itemDeleted: 'Item deleted',
    historyCleared: 'History cleared',
    settingsSaved: 'Settings saved',
    settingsReset: 'Settings reset to default'
  },

  // Error Messages
  errors: {
    copyFailed: 'Failed to copy to clipboard',
    loadFailed: 'Failed to load data',
    saveFailed: 'Failed to save settings'
  },

  // View Modes
  viewMode: {
    grid: 'Grid',
    list: 'List'
  }
};
