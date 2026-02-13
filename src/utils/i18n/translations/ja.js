export const ja = {
  app: {
    title: 'ClipBoard Pro',
    version: 'バージョン',
    madeBy: '作成者',
    by: ''
  },

  header: {
    items: '項目',
    searchPlaceholder: 'クリップボードを検索',
    filter: 'フィルター',
    viewMode: '表示モード',
    clearAll: 'すべてクリア',
    settings: '設定'
  },

  filter: {
    all: 'すべて',
    text: 'テキスト',
    images: '画像',
    code: 'コード'
  },

  item: {
    text: 'テキスト',
    image: '画像',
    code: 'コード',
    copy: 'コピー',
    copied: 'コピー済み',
    edit: '編集',
    delete: '削除',
    justNow: 'たった今',
    minutesAgo: '{{count}}分前',
    hoursAgo: '{{count}}時間前',
    daysAgo: '{{count}}日前'
  },

  empty: {
    title: 'クリップボード履歴がありません',
    titleSearch: '結果が見つかりません',
    description: 'テキストまたは画像をコピーしてください',
    descriptionSearch: '「{{query}}」に一致する項目がありません。別の検索語を試してください。'
  },

  edit: {
    title: 'コンテンツを編集',
    save: '変更を保存',
    cancel: 'キャンセル',
    shortcuts: {
      save: '保存',
      cancel: 'キャンセル'
    }
  },

  settings: {
    title: '設定',
    save: '変更を保存',
    cancel: 'キャンセル',
    
    sections: {
      application: 'アプリケーション',
      appearance: '外観',
      language: '言語',
      storage: 'ストレージ',
      privacy: 'プライバシー',
      shortcuts: 'ショートカット'
    },

    application: {
      closeBehavior: '閉じるボタンの動作',
      minimizeToTray: 'トレイに最小化',
      closeApplication: 'アプリケーションを閉じる',
      startWhenTurnsOn: 'コンピューター起動時に開始',
      startMinimized: 'トレイに最小化して開始',
      showTrayNotifications: 'トレイ通知を表示',
      updating: '更新中...'
    },

    appearance: {
      theme: 'テーマ',
      themes: {
        dark: 'ダーク',
        light: 'ライト',
        auto: '自動（システム）'
      },
      builtInThemes: 'ビルトインテーマ',
      defaultView: 'デフォルトビュー',
      gridView: 'グリッドビュー',
      listView: 'リストビュー',
      themeBuilder: 'テーマビルダー',
      customizeIcons: 'アイコンをカスタマイズ'
    },

    language: {
      interfaceLanguage: 'インターフェース言語'
    },

    storage: {
      maximumItems: '最大項目数',
      autoDelete: '自動削除',
      items: '{{count}}項目',
      never: 'なし',
      after5min: '5分後',
      after15min: '15分後',
      after30min: '30分後',
      after1hour: '1時間後',
      after2hours: '2時間後',
      after6hours: '6時間後',
      after12hours: '12時間後',
      after1day: '1日後',
      after3days: '3日後',
      after7days: '7日後',
      after30days: '30日後'
    },

    privacy: {
      monitorClipboard: 'クリップボードを自動監視',
      saveOnClose: 'アプリ終了時にクリップボードを保存',
      excludeSensitive: '機密データを除外'
    },

    shortcuts: {
      quickAccess: 'クイックアクセス',
      clearAll: 'すべてクリア',
      pressKeys: 'キーを押してください...',
      cancel: 'キャンセル',
      recording: '記録中...'
    },

    danger: {
      clearAllData: 'すべてのデータをクリア',
      resetSettings: '設定をリセット',
      confirmClear: 'もう一度クリックして確認',
      confirmReset: 'もう一度クリックして確認'
    }
  },

  tray: {
    show: 'ウィンドウを表示',
    hide: 'ウィンドウを非表示',
    quit: '終了'
  },

  footer: {
    donate: '寄付',
    support: '開発者をサポート'
  },

  notifications: {
    itemCopied: 'クリップボードにコピーしました',
    itemDeleted: '項目を削除しました',
    historyCleared: '履歴をクリアしました',
    settingsSaved: '設定を保存しました',
    settingsReset: '設定をデフォルトにリセットしました'
  },

  errors: {
    copyFailed: 'クリップボードへのコピーに失敗しました',
    loadFailed: 'データの読み込みに失敗しました',
    saveFailed: '設定の保存に失敗しました'
  },

  viewMode: {
    grid: 'グリッド',
    list: 'リスト'
  }
};