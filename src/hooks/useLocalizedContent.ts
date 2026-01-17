import { useTranslation } from 'react-i18next';

/**
 * 도구별 로컬 i18n 객체와 전역 i18n을 연동하는 훅
 * 기존 코드와의 호환성을 유지하면서 언어 전환을 지원합니다.
 */
export function useLocalizedContent<T extends Record<string, unknown>>(
  localI18n: Record<string, T>
): { t: T; lang: string; isKorean: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ko' ? 'ko' : 'en';
  const isKorean = lang === 'ko';
  
  // 해당 언어의 번역이 없으면 한국어로 폴백
  const t = localI18n[lang] || localI18n['ko'];
  
  return { t, lang, isKorean };
}

export default useLocalizedContent;
