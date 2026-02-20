import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * URL 경로에 따라 i18n 언어를 자동으로 동기화하는 Provider.
 *
 * - /en/* 경로 → 영어(en) 설정
 * - /* 경로    → 한국어(ko) 설정
 *
 * 이 컴포넌트 덕분에 언어 전환이 localStorage가 아닌
 * URL 주소 자체로 결정되어 SEO에 유리합니다.
 */
export default function LangProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const targetLang = location.pathname.startsWith('/en') ? 'en' : 'ko';
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [location.pathname, i18n]);

  return <>{children}</>;
}
