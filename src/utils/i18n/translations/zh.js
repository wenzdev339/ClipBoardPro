export const zh = {
  // App Title & Brand
  app: {
    title: 'ClipBoard Pro',
    version: '版本',
    madeBy: '用心制作',
    by: '由'
  },

  // Header
  header: {
    items: '项',
    searchPlaceholder: '搜索剪贴板',
    filter: '筛选',
    viewMode: '视图模式',
    clearAll: '清除全部',
    settings: '设置'
  },

  // Filter Options
  filter: {
    all: '全部',
    text: '文本',
    images: '图片',
    code: '代码'
  },

  // Clipboard Item
  item: {
    text: '文本',
    image: '图片',
    code: '代码',
    copy: '复制',
    copied: '已复制',
    edit: '编辑',
    delete: '删除',
    justNow: '刚刚',
    minutesAgo: '{{count}}分钟前',
    hoursAgo: '{{count}}小时前',
    daysAgo: '{{count}}天前'
  },

  // Empty State
  empty: {
    title: '无剪贴板历史',
    titleSearch: '未找到结果',
    description: '复制一些文本或图片',
    descriptionSearch: '没有与"{{query}}"匹配的项目。请尝试其他搜索词。'
  },

  // Edit Modal
  edit: {
    title: '编辑内容',
    save: '保存更改',
    cancel: '取消',
    shortcuts: {
      save: '保存',
      cancel: '取消'
    }
  },

  // Settings Modal
  settings: {
    title: '设置',
    save: '保存更改',
    cancel: '取消',
    
    // Sections
    sections: {
      application: '应用程序',
      appearance: '外观',
      language: '语言',
      storage: '存储',
      privacy: '隐私',
      shortcuts: '快捷键'
    },

    // Application Settings
    application: {
      closeBehavior: '关闭按钮行为',
      minimizeToTray: '最小化到托盘',
      closeApplication: '关闭应用程序',
      startWhenTurnsOn: '开机时启动',
      startMinimized: '启动时最小化到托盘',
      showTrayNotifications: '显示托盘通知',
      updating: '更新中...'
    },

    // Appearance Settings
    appearance: {
      theme: '主题',
      themes: {
        dark: '深色',
        light: '浅色',
        auto: '自动（系统）'
      },
      builtInThemes: '内置主题',
      defaultView: '默认视图',
      gridView: '网格视图',
      listView: '列表视图',
      themeBuilder: '主题生成器',
      customizeIcons: '自定义图标'
    },

    // Language Settings
    language: {
      interfaceLanguage: '界面语言'
    },

    // Storage Settings
    storage: {
      maximumItems: '最大项目数',
      autoDelete: '自动删除',
      items: '{{count}}个项目',
      never: '从不',
      after5min: '5分钟后',
      after15min: '15分钟后',
      after30min: '30分钟后',
      after1hour: '1小时后',
      after2hours: '2小时后',
      after6hours: '6小时后',
      after12hours: '12小时后',
      after1day: '1天后',
      after3days: '3天后',
      after7days: '7天后',
      after30days: '30天后'
    },

    // Privacy Settings
    privacy: {
      monitorClipboard: '自动监控剪贴板',
      saveOnClose: '应用关闭时保存剪贴板',
      excludeSensitive: '排除敏感数据'
    },

    // Shortcuts Settings
    shortcuts: {
      quickAccess: '快速访问',
      clearAll: '清除全部',
      pressKeys: '按键...',
      cancel: '取消',
      recording: '记录中...'
    },

    // Danger Zone
    danger: {
      clearAllData: '清除所有数据',
      resetSettings: '重置设置',
      confirmClear: '再次点击确认',
      confirmReset: '再次点击确认'
    }
  },

  // Tray Menu
  tray: {
    show: '显示窗口',
    hide: '隐藏窗口',
    quit: '退出'
  },

  // Footer
  footer: {
    donate: '捐赠',
    support: '支持开发者'
  },

  // Notifications
  notifications: {
    itemCopied: '已复制到剪贴板',
    itemDeleted: '项目已删除',
    historyCleared: '历史已清除',
    settingsSaved: '设置已保存',
    settingsReset: '设置已重置为默认值'
  },

  // Error Messages
  errors: {
    copyFailed: '无法复制到剪贴板',
    loadFailed: '无法加载数据',
    saveFailed: '无法保存设置'
  },

  // View Modes
  viewMode: {
    grid: '网格',
    list: '列表'
  }
};