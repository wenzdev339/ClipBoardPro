export const ru = {
  app: {
    title: 'ClipBoard Pro',
    version: 'Версия',
    madeBy: 'Сделано с',
    by: ''
  },

  header: {
    items: 'элементов',
    searchPlaceholder: 'Поиск в буфере обмена',
    filter: 'Фильтр',
    viewMode: 'Режим просмотра',
    clearAll: 'Очистить всё',
    settings: 'Настройки'
  },

  filter: {
    all: 'Все',
    text: 'Текст',
    images: 'Изображения',
    code: 'Код'
  },

  item: {
    text: 'Текст',
    image: 'Изображение',
    code: 'Код',
    copy: 'Копировать',
    copied: 'Скопировано',
    edit: 'Редактировать',
    delete: 'Удалить',
    justNow: 'Только что',
    minutesAgo: '{{count}} мин. назад',
    hoursAgo: '{{count}} ч. назад',
    daysAgo: '{{count}} дн. назад'
  },

  empty: {
    title: 'История буфера обмена пуста',
    titleSearch: 'Результаты не найдены',
    description: 'Скопируйте текст или изображения',
    descriptionSearch: 'Нет элементов, соответствующих "{{query}}". Попробуйте другой поисковый запрос.'
  },

  edit: {
    title: 'Редактировать содержимое',
    save: 'Сохранить изменения',
    cancel: 'Отмена',
    shortcuts: {
      save: 'для сохранения',
      cancel: 'для отмены'
    }
  },

  settings: {
    title: 'Настройки',
    save: 'Сохранить изменения',
    cancel: 'Отмена',
    
    sections: {
      application: 'Приложение',
      appearance: 'Внешний вид',
      language: 'Язык',
      storage: 'Хранилище',
      privacy: 'Конфиденциальность',
      shortcuts: 'Горячие клавиши'
    },

    application: {
      closeBehavior: 'Поведение кнопки закрытия',
      minimizeToTray: 'Свернуть в трей',
      closeApplication: 'Закрыть приложение',
      startWhenTurnsOn: 'Запускать при включении компьютера',
      startMinimized: 'Запускать свёрнутым',
      showTrayNotifications: 'Показывать уведомления',
      updating: 'Обновление...'
    },

    appearance: {
      theme: 'Тема',
      themes: {
        dark: 'Тёмная',
        light: 'Светлая',
        auto: 'Авто (Системная)'
      },
      builtInThemes: 'Встроенные темы',
      defaultView: 'Вид по умолчанию',
      gridView: 'Сетка',
      listView: 'Список',
      themeBuilder: 'Конструктор тем',
      customizeIcons: 'Настроить иконки'
    },

    language: {
      interfaceLanguage: 'Язык интерфейса'
    },

    storage: {
      maximumItems: 'Максимум элементов',
      autoDelete: 'Автоудаление',
      items: '{{count}} элементов',
      never: 'Никогда',
      after5min: 'Через 5 минут',
      after15min: 'Через 15 минут',
      after30min: 'Через 30 минут',
      after1hour: 'Через 1 час',
      after2hours: 'Через 2 часа',
      after6hours: 'Через 6 часов',
      after12hours: 'Через 12 часов',
      after1day: 'Через 1 день',
      after3days: 'Через 3 дня',
      after7days: 'Через 7 дней',
      after30days: 'Через 30 дней'
    },

    privacy: {
      monitorClipboard: 'Автоматически отслеживать буфер обмена',
      saveOnClose: 'Сохранять при закрытии',
      excludeSensitive: 'Исключить конфиденциальные данные'
    },

    shortcuts: {
      quickAccess: 'Быстрый доступ',
      clearAll: 'Очистить всё',
      pressKeys: 'Нажмите клавиши...',
      cancel: 'Отмена',
      recording: 'Запись...'
    },

    danger: {
      clearAllData: 'Удалить все данные',
      resetSettings: 'Сбросить настройки',
      confirmClear: 'Нажмите ещё раз для подтверждения',
      confirmReset: 'Нажмите ещё раз для подтверждения'
    }
  },

  tray: {
    show: 'Показать окно',
    hide: 'Скрыть окно',
    quit: 'Выход'
  },

  footer: {
    donate: 'Поддержать',
    support: 'Поддержать разработчика'
  },

  notifications: {
    itemCopied: 'Скопировано в буфер обмена',
    itemDeleted: 'Элемент удалён',
    historyCleared: 'История очищена',
    settingsSaved: 'Настройки сохранены',
    settingsReset: 'Настройки сброшены'
  },

  errors: {
    copyFailed: 'Не удалось скопировать',
    loadFailed: 'Не удалось загрузить данные',
    saveFailed: 'Не удалось сохранить настройки'
  },

  viewMode: {
    grid: 'Сетка',
    list: 'Список'
  }
};