import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from './locales/ko.json';
import en from './locales/en.json';

// 지원 언어 목록
export const supportedLanguages = ['ko', 'en'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// 언어 정보
export const languageInfo: Record<SupportedLanguage, { name: string; flag: string }> = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next) // react-i18next 초기화
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    fallbackLng: 'ko', // 기본 언어
    supportedLngs: supportedLanguages,
    
    // 언어 감지 옵션
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'toolhub-language',
    },
    
    interpolation: {
      escapeValue: false, // React는 이미 XSS 방지됨
    },
    
    react: {
      useSuspense: false, // SSR 없이 사용
    },
  });

export default i18n;
