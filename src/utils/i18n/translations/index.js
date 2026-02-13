import { en } from './en';
import { th } from './th';
import { ja } from './ja';
import { ko } from './ko';
import { zh } from './zh';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ru } from './ru';

export const translations = {
  en,  // English
  th,  // Thai (ไทย)
  ja,  // Japanese (日本語)
  ko,  // Korean (한국어)
  zh,  // Chinese (中文)
  es,  // Spanish (Español)
  fr,  // French (Français)
  de,  // German (Deutsch)
  ru,  // Russian (Русский)
};

// Export available language codes for easy access
export const availableLanguages = Object.keys(translations);

// Export function to check if a language is available
export const isLanguageAvailable = (langCode) => {
  return availableLanguages.includes(langCode);
};

// Export function to get translation for a specific language
export const getTranslation = (langCode) => {
  return translations[langCode] || translations.en; // Fallback to English
};