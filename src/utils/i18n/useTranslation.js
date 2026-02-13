// src/utils/i18n/useTranslation.js
import { useState, useEffect } from 'react';
import i18n from './i18n';

export function useTranslation() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18n.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return {
    t: (key, params) => i18n.t(key, params),
    language: i18n.getLanguage(),
    setLanguage: (lang) => i18n.setLanguage(lang),
    formatRelativeTime: (date) => i18n.formatRelativeTime(date),
    getSupportedLanguages: () => i18n.getSupportedLanguages(),
  };
}