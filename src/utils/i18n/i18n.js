// src/utils/i18n/i18n.js
import { translations } from './translations';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './config';

class I18n {
  constructor() {
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.fallbackLanguage = DEFAULT_LANGUAGE;
    this.translations = translations;
    this.listeners = [];
    this.isInitialized = false;
  }

  // Initialize with saved language or browser language - รองรับ async
  async init(savedLanguage = null) {
    let languageToUse = null;

    // 1. ลองโหลดจาก Electron ก่อน
    if (!savedLanguage && window.electronAPI && window.electronAPI.getLanguage) {
      try {
        const electronLanguage = await window.electronAPI.getLanguage();
        if (electronLanguage && this.translations[electronLanguage]) {
          languageToUse = electronLanguage;
        }
      } catch (error) {
      }
    }

    // 2. ใช้ savedLanguage ที่ส่งมา
    if (!languageToUse && savedLanguage && this.translations[savedLanguage]) {
      languageToUse = savedLanguage;
    }

    // 3. ลองโหลดจาก localStorage
    if (!languageToUse) {
      try {
        const localStorageLanguage = localStorage.getItem('appLanguage');
        if (localStorageLanguage && this.translations[localStorageLanguage]) {
          languageToUse = localStorageLanguage;
        }
      } catch (error) {
        console.error('i18n: Failed to load language from localStorage:', error);
      }
    }

    // 4. ใช้ browser language
    if (!languageToUse) {
      const browserLang = navigator.language.split('-')[0];
      if (this.translations[browserLang]) {
        languageToUse = browserLang;
      }
    }

    // 5. ใช้ default language
    if (!languageToUse) {
      languageToUse = DEFAULT_LANGUAGE;
    }

    this.currentLanguage = languageToUse;
    this.isInitialized = true;
    
    // Update document direction
    this.updateDocumentDirection();
    
    return this.currentLanguage;
  }

  // Get current language
  getLanguage() {
    return this.currentLanguage;
  }

  // Set language - รองรับการบันทึกลง Electron
  async setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      this.updateDocumentDirection();
      
      // บันทึกลง Electron
      if (window.electronAPI && window.electronAPI.setLanguage) {
        try {
          await window.electronAPI.setLanguage(language);
        } catch (error) {
          console.error('i18n: Failed to save language to Electron:', error);
        }
      }
      
      // บันทึกลง localStorage เป็น backup
      try {
        localStorage.setItem('appLanguage', language);
      } catch (error) {
        console.error('i18n: Failed to save language to localStorage:', error);
      }
      
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Update document direction for RTL languages
  updateDocumentDirection() {
    const langConfig = SUPPORTED_LANGUAGES[this.currentLanguage];
    if (langConfig) {
      document.documentElement.dir = langConfig.direction;
      document.documentElement.lang = this.currentLanguage;
    }
  }

  // Get translation
  t(key, params = {}) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to default language
        translation = this.getFallbackTranslation(keys);
        break;
      }
    }

    // Replace parameters in translation
    if (typeof translation === 'string') {
      return this.interpolate(translation, params);
    }

    return translation || key;
  }

  // Get fallback translation
  getFallbackTranslation(keys) {
    let translation = this.translations[this.fallbackLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return null;
      }
    }
    
    return translation;
  }

  // Interpolate parameters in translation string
  interpolate(str, params) {
    let result = str;
    
    Object.keys(params).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, params[key]);
    });
    
    return result;
  }

  // Format relative time
  formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    
    if (diff < 60000) { // Less than 1 minute
      return this.t('item.justNow');
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return this.t('item.minutesAgo', { count: minutes });
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return this.t('item.hoursAgo', { count: hours });
    } else {
      const days = Math.floor(diff / 86400000);
      return this.t('item.daysAgo', { count: days });
    }
  }

  // Subscribe to language changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners of language change
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Get all supported languages
  getSupportedLanguages() {
    return Object.keys(SUPPORTED_LANGUAGES).map(code => ({
      code,
      ...SUPPORTED_LANGUAGES[code]
    }));
  }

  // Check if language is supported
  isLanguageSupported(language) {
    return !!this.translations[language];
  }

  // Check if i18n is initialized
  getIsInitialized() {
    return this.isInitialized;
  }
}

// Create singleton instance
const i18n = new I18n();

export default i18n;