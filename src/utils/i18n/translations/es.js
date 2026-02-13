export const es = {
  // App Title & Brand
  app: {
    title: 'ClipBoard Pro',
    version: 'Versión',
    madeBy: 'Hecho con',
    by: 'por'
  },

  // Header
  header: {
    items: 'elementos',
    searchPlaceholder: 'Buscar en portapapeles',
    filter: 'Filtrar',
    viewMode: 'Modo de vista',
    clearAll: 'Limpiar todo',
    settings: 'Configuración'
  },

  // Filter Options
  filter: {
    all: 'Todo',
    text: 'Texto',
    images: 'Imágenes',
    code: 'Código'
  },

  // Clipboard Item
  item: {
    text: 'Texto',
    image: 'Imagen',
    code: 'Código',
    copy: 'Copiar',
    copied: 'Copiado',
    edit: 'Editar',
    delete: 'Eliminar',
    justNow: 'Ahora mismo',
    minutesAgo: 'Hace {{count}} min',
    hoursAgo: 'Hace {{count}} h',
    daysAgo: 'Hace {{count}} días'
  },

  // Empty State
  empty: {
    title: 'Sin historial del portapapeles',
    titleSearch: 'No se encontraron resultados',
    description: 'Copia algún texto o imágenes',
    descriptionSearch: 'No hay elementos que coincidan con "{{query}}". Prueba con otro término de búsqueda.'
  },

  // Edit Modal
  edit: {
    title: 'Editar contenido',
    save: 'Guardar cambios',
    cancel: 'Cancelar',
    shortcuts: {
      save: 'para guardar',
      cancel: 'para cancelar'
    }
  },

  // Settings Modal
  settings: {
    title: 'Configuración',
    save: 'Guardar cambios',
    cancel: 'Cancelar',
    
    sections: {
      application: 'Aplicación',
      appearance: 'Apariencia',
      language: 'Idioma',
      storage: 'Almacenamiento',
      privacy: 'Privacidad',
      shortcuts: 'Atajos'
    },

    application: {
      closeBehavior: 'Comportamiento del botón cerrar',
      minimizeToTray: 'Minimizar a la bandeja',
      closeApplication: 'Cerrar aplicación',
      startWhenTurnsOn: 'Iniciar con el ordenador',
      startMinimized: 'Iniciar minimizado en la bandeja',
      showTrayNotifications: 'Mostrar notificaciones en la bandeja',
      updating: 'Actualizando...'
    },

    appearance: {
      theme: 'Tema',
      themes: {
        dark: 'Oscuro',
        light: 'Claro',
        auto: 'Auto (Sistema)'
      },
      builtInThemes: 'Temas integrados',
      defaultView: 'Vista predeterminada',
      gridView: 'Vista de cuadrícula',
      listView: 'Vista de lista',
      themeBuilder: 'Constructor de temas',
      customizeIcons: 'Personalizar iconos'
    },

    language: {
      interfaceLanguage: 'Idioma de la interfaz'
    },

    storage: {
      maximumItems: 'Máximo de elementos',
      autoDelete: 'Eliminación automática',
      items: '{{count}} elementos',
      never: 'Nunca',
      after5min: 'Después de 5 minutos',
      after15min: 'Después de 15 minutos',
      after30min: 'Después de 30 minutos',
      after1hour: 'Después de 1 hora',
      after2hours: 'Después de 2 horas',
      after6hours: 'Después de 6 horas',
      after12hours: 'Después de 12 horas',
      after1day: 'Después de 1 día',
      after3days: 'Después de 3 días',
      after7days: 'Después de 7 días',
      after30days: 'Después de 30 días'
    },

    privacy: {
      monitorClipboard: 'Monitorear portapapeles automáticamente',
      saveOnClose: 'Guardar portapapeles al cerrar',
      excludeSensitive: 'Excluir datos sensibles'
    },

    shortcuts: {
      quickAccess: 'Acceso rápido',
      clearAll: 'Limpiar todo',
      pressKeys: 'Presiona las teclas...',
      cancel: 'Cancelar',
      recording: 'Grabando...'
    },

    danger: {
      clearAllData: 'Borrar todos los datos',
      resetSettings: 'Restablecer configuración',
      confirmClear: 'Haz clic de nuevo para confirmar',
      confirmReset: 'Haz clic de nuevo para confirmar'
    }
  },

  tray: {
    show: 'Mostrar ventana',
    hide: 'Ocultar ventana',
    quit: 'Salir'
  },

  footer: {
    donate: 'Donar',
    support: 'Apoyar al desarrollador'
  },

  notifications: {
    itemCopied: 'Copiado al portapapeles',
    itemDeleted: 'Elemento eliminado',
    historyCleared: 'Historial limpiado',
    settingsSaved: 'Configuración guardada',
    settingsReset: 'Configuración restablecida'
  },

  errors: {
    copyFailed: 'Error al copiar al portapapeles',
    loadFailed: 'Error al cargar datos',
    saveFailed: 'Error al guardar configuración'
  },

  viewMode: {
    grid: 'Cuadrícula',
    list: 'Lista'
  }
};
