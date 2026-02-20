import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 현재 언어 컨텍스트에 맞게 URL 경로를 생성·전환하는 훅.
 *
 * @example
 * const { toLangPath, navigateToLang, isEnglish } = useLangPath();
 *
 * // 현재 /en/* 경로에 있을 때 '/tools/bmi-calculator' 전달 → '/en/tools/bmi-calculator' 반환
 * <Link to={toLangPath('/tools/bmi-calculator')} />
 *
 * // 언어 전환 버튼 클릭 → URL 이동
 * <button onClick={() => navigateToLang('ko')} />
 */
export function useLangPath() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEnglish = location.pathname.startsWith('/en');
  const currentLang: 'ko' | 'en' = isEnglish ? 'en' : 'ko';

  /**
   * 기본 경로(예: /tools/bmi-calculator)를 현재 언어에 맞게 변환.
   * 한국어 모드에서는 그대로 반환.
   * 영어 모드에서는 /en 접두사를 붙여 반환.
   */
  const toLangPath = (path: string): string => {
    if (!isEnglish) return path;
    if (path === '/') return '/en';
    if (path.startsWith('/en')) return path; // 이미 영어 경로면 그대로
    return `/en${path}`;
  };

  /**
   * 현재 경로에서 대상 언어로 전환한 URL을 반환.
   */
  const switchLangPath = (targetLang: 'ko' | 'en'): string => {
    const currentPath = location.pathname;
    if (targetLang === 'en') {
      if (currentPath.startsWith('/en')) return currentPath;
      return currentPath === '/' ? '/en' : `/en${currentPath}`;
    } else {
      if (!currentPath.startsWith('/en')) return currentPath;
      const stripped = currentPath.replace(/^\/en/, '');
      return stripped || '/';
    }
  };

  /**
   * 언어를 전환하며 해당 URL로 이동.
   */
  const navigateToLang = (targetLang: 'ko' | 'en') => {
    navigate(switchLangPath(targetLang));
  };

  return { toLangPath, switchLangPath, navigateToLang, isEnglish, currentLang };
}

export default useLangPath;
