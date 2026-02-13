
export const ko = {
  // App Title & Brand
  app: {
    title: 'ClipBoard Pro',
    version: '버전',
    madeBy: '제작',
    by: ''
  },

  // Header
  header: {
    items: '항목',
    searchPlaceholder: '클립보드 검색',
    filter: '필터',
    viewMode: '보기 모드',
    clearAll: '모두 지우기',
    settings: '설정'
  },

  // Filter Options
  filter: {
    all: '전체',
    text: '텍스트',
    images: '이미지',
    code: '코드'
  },

  // Clipboard Item
  item: {
    text: '텍스트',
    image: '이미지',
    code: '코드',
    copy: '복사',
    copied: '복사됨',
    edit: '편집',
    delete: '삭제',
    justNow: '방금 전',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    daysAgo: '{{count}}일 전'
  },

  // Empty State
  empty: {
    title: '클립보드 기록이 없습니다',
    titleSearch: '검색 결과가 없습니다',
    description: '텍스트나 이미지를 복사하세요',
    descriptionSearch: '"{{query}}"와 일치하는 항목이 없습니다. 다른 검색어를 시도해보세요.'
  },

  // Edit Modal
  edit: {
    title: '내용 편집',
    save: '변경 사항 저장',
    cancel: '취소',
    shortcuts: {
      save: '저장',
      cancel: '취소'
    }
  },

  // Settings Modal
  settings: {
    title: '설정',
    save: '변경 사항 저장',
    cancel: '취소',
    
    // Sections
    sections: {
      application: '애플리케이션',
      appearance: '모양',
      language: '언어',
      storage: '저장소',
      privacy: '개인정보',
      shortcuts: '단축키'
    },

    // Application Settings
    application: {
      closeBehavior: '닫기 버튼 동작',
      minimizeToTray: '트레이로 최소화',
      closeApplication: '애플리케이션 종료',
      startWhenTurnsOn: '컴퓨터 시작 시 실행',
      startMinimized: '트레이로 최소화하여 시작',
      showTrayNotifications: '트레이 알림 표시',
      updating: '업데이트 중...'
    },

    // Appearance Settings
    appearance: {
      theme: '테마',
      themes: {
        dark: '다크',
        light: '라이트',
        auto: '자동 (시스템)'
      },
      builtInThemes: '내장 테마',
      defaultView: '기본 보기',
      gridView: '격자 보기',
      listView: '목록 보기',
      themeBuilder: '테마 빌더',
      customizeIcons: '아이콘 사용자 지정'
    },

    // Language Settings
    language: {
      interfaceLanguage: '인터페이스 언어'
    },

    // Storage Settings
    storage: {
      maximumItems: '최대 항목 수',
      autoDelete: '자동 삭제',
      items: '{{count}}개 항목',
      never: '사용 안 함',
      after5min: '5분 후',
      after15min: '15분 후',
      after30min: '30분 후',
      after1hour: '1시간 후',
      after2hours: '2시간 후',
      after6hours: '6시간 후',
      after12hours: '12시간 후',
      after1day: '1일 후',
      after3days: '3일 후',
      after7days: '7일 후',
      after30days: '30일 후'
    },

    // Privacy Settings
    privacy: {
      monitorClipboard: '클립보드 자동 모니터링',
      saveOnClose: '앱 종료 시 클립보드 저장',
      excludeSensitive: '민감한 데이터 제외'
    },

    // Shortcuts Settings
    shortcuts: {
      quickAccess: '빠른 액세스',
      clearAll: '모두 지우기',
      pressKeys: '키를 누르세요...',
      cancel: '취소',
      recording: '기록 중...'
    },

    // Danger Zone
    danger: {
      clearAllData: '모든 데이터 지우기',
      resetSettings: '설정 초기화',
      confirmClear: '다시 클릭하여 확인',
      confirmReset: '다시 클릭하여 확인'
    }
  },

  // Tray Menu
  tray: {
    show: '창 표시',
    hide: '창 숨기기',
    quit: '종료'
  },

  // Footer
  footer: {
    donate: '후원',
    support: '개발자 지원'
  },

  // Notifications
  notifications: {
    itemCopied: '클립보드에 복사되었습니다',
    itemDeleted: '항목이 삭제되었습니다',
    historyCleared: '기록이 지워졌습니다',
    settingsSaved: '설정이 저장되었습니다',
    settingsReset: '설정이 기본값으로 재설정되었습니다'
  },

  // Error Messages
  errors: {
    copyFailed: '클립보드에 복사하지 못했습니다',
    loadFailed: '데이터를 로드하지 못했습니다',
    saveFailed: '설정을 저장하지 못했습니다'
  },

  // View Modes
  viewMode: {
    grid: '격자',
    list: '목록'
  }
};