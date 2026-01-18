import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../config/siteConfig';
import { getToolIcon } from '../config/toolIcons';
import { languageInfo, supportedLanguages } from '../i18n';
import type { SupportedLanguage } from '../i18n';
import AdBanner from './AdBanner';

interface LayoutProps {
  children: ReactNode;
}

// 카테고리 키를 i18n 키로 매핑
const categoryI18nKey: Record<string, string> = {
  '금융/부동산': 'categories.finance',
  '건강/라이프스타일': 'categories.health',
  '생활/사회': 'categories.life',
  '업무/생산성': 'categories.productivity',
  '개발/IT': 'categories.dev',
  '게임/재미': 'categories.fun',
  '유틸리티': 'categories.utility',
};

// 카테고리별 색상 매핑 (사이드바용)
const categoryColors: Record<string, { bg: string; text: string; hover: string; border: string; title: string; titleBg: string }> = {
  '금융/부동산': { bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:bg-emerald-100', border: 'border-emerald-200', title: 'text-emerald-800', titleBg: 'bg-emerald-100' },
  '건강/라이프스타일': { bg: 'bg-rose-50', text: 'text-rose-700', hover: 'hover:bg-rose-100', border: 'border-rose-200', title: 'text-rose-800', titleBg: 'bg-rose-100' },
  '생활/사회': { bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:bg-amber-100', border: 'border-amber-200', title: 'text-amber-800', titleBg: 'bg-amber-100' },
  '업무/생산성': { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-100', border: 'border-blue-200', title: 'text-blue-800', titleBg: 'bg-blue-100' },
  '개발/IT': { bg: 'bg-violet-50', text: 'text-violet-700', hover: 'hover:bg-violet-100', border: 'border-violet-200', title: 'text-violet-800', titleBg: 'bg-violet-100' },
  '게임/재미': { bg: 'bg-pink-50', text: 'text-pink-700', hover: 'hover:bg-pink-100', border: 'border-pink-200', title: 'text-pink-800', titleBg: 'bg-pink-100' },
  '유틸리티': { bg: 'bg-cyan-50', text: 'text-cyan-700', hover: 'hover:bg-cyan-100', border: 'border-cyan-200', title: 'text-cyan-800', titleBg: 'bg-cyan-100' },
  '쇼핑/실생활': { bg: 'bg-orange-50', text: 'text-orange-700', hover: 'hover:bg-orange-100', border: 'border-orange-200', title: 'text-orange-800', titleBg: 'bg-orange-100' },
  '음악/창작': { bg: 'bg-indigo-50', text: 'text-indigo-700', hover: 'hover:bg-indigo-100', border: 'border-indigo-200', title: 'text-indigo-800', titleBg: 'bg-indigo-100' },
  '디자인': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', hover: 'hover:bg-fuchsia-100', border: 'border-fuchsia-200', title: 'text-fuchsia-800', titleBg: 'bg-fuchsia-100' },
};

const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', hover: 'hover:bg-gray-100', border: 'border-gray-200', title: 'text-gray-800', titleBg: 'bg-gray-100' };

// 도구 ID를 i18n 키로 매핑
const toolI18nKey: Record<string, string> = {
  'loan-calculator': 'tools.loanCalculator.title',
  'savings-calculator': 'tools.savingsCalculator.title',
  'brokerage-fee-calculator': 'tools.brokerageFeeCalculator.title',
  'severance-calculator': 'tools.severanceCalculator.title',
  'bmi-calculator': 'tools.bmiCalculator.title',
  'bmr-calculator': 'tools.bmrCalculator.title',
  'calorie-burn-calculator': 'tools.calorieBurnCalculator.title',
  'age-calculator': 'tools.ageCalculator.title',
  'military-calculator': 'tools.militaryCalculator.title',
  'gpa-calculator': 'tools.gpaCalculator.title',
  'salary-calculator': 'tools.salaryCalculator.title',
  'zodiac-calculator': 'tools.zodiacCalculator.title',
  'd-day-calculator': 'tools.ddayCalculator.title',
  'character-counter': 'tools.characterCounter.title',
  'percent-calculator': 'tools.percentCalculator.title',
  'unit-converter': 'tools.unitConverter.title',
  'json-formatter': 'tools.jsonFormatter.title',
  'base64': 'tools.base64Tool.title',
  'url-encoder': 'tools.urlEncoder.title',
  'lorem-ipsum': 'tools.loremIpsum.title',
  'spin-wheel': 'tools.spinWheel.title',
  'food-slot-machine': 'tools.foodSlotMachine.title',
  'scratch-card': 'tools.scratchCard.title',
  'team-generator': 'tools.teamGenerator.title',
  'magic-conch': 'tools.magicConch.title',
  'fortune-cookie': 'tools.fortuneCookie.title',
  'reaction-test': 'tools.reactionTest.title',
  'word-frequency': 'tools.wordFrequency.title',
  'browser-info': 'tools.browserInfo.title',
  'reserve-calculator': 'tools.reserveCalculator.title',
  'sleep-calculator': 'tools.sleepCalculator.title',
  // 새로 추가된 도구들
  'qr-generator': 'tools.qrGenerator.title',
  'case-converter': 'tools.caseConverter.title',
  'coin-flip': 'tools.coinFlip.title',
  'dice-roller': 'tools.diceRoller.title',
  'mandalart': 'tools.mandalart.title',
  'korean-romanizer': 'tools.koreanRomanizer.title',
  'number-base-converter': 'tools.numberBaseConverter.title',
  'list-shuffler': 'tools.listShuffler.title',
  'timer': 'tools.timer.title',
  'color-converter': 'tools.colorConverter.title',
  'sticky-note': 'tools.stickyNote.title',
  'webp-converter': 'tools.webpConverter.title',
  'ip-port-checker': 'tools.ipPortChecker.title',
  // 디자인 도구 추가
  'placeholder-image': 'tools.placeholderImage.title',
  'svg-blob-generator': 'tools.svgBlobGenerator.title',
  'social-media-size-guide': 'tools.socialMediaSizeGuide.title',
  'css-filter-lab': 'tools.cssFilterLab.title',
  'css-pattern-generator': 'tools.cssPatternGenerator.title',
  // UI/UX 및 편의 도구 추가
  'logo-safe-area': 'tools.logoSafeArea.title',
  'favicon-preview': 'tools.faviconPreview.title',
  'button-generator': 'tools.buttonGenerator.title',
  'color-blindness-simulator': 'tools.colorBlindnessSimulator.title',
  'screen-resolution': 'tools.screenResolution.title',
};

/**
 * 공통 레이아웃 컴포넌트
 * - 좌측 사이드바 네비게이션
 * - 카테고리별 도구 목록
 * - 반응형 디자인 적용
 * - 다국어 지원
 */
export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // 언어 변경 함수
  const changeLanguage = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  // 카테고리별로 도구 그룹화
  const toolsByCategory = siteConfig.tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof siteConfig.tools>);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 (모바일용) */}
      <header className="bg-white shadow-sm sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-blue-600">
            🛠️ ToolHub
          </Link>
          <div className="flex items-center space-x-2">
            {/* 언어 선택 버튼 (모바일) */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                aria-label="언어 선택"
              >
                <span className="text-lg">{languageInfo[i18n.language as SupportedLanguage]?.flag || '🌐'}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {supportedLanguages.map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                        i18n.language === lng ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{languageInfo[lng].flag}</span>
                      <span>{languageInfo[lng].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <div className="flex flex-1">
        {/* 좌측 사이드바 */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen
            w-64 bg-gray-100 shadow-lg
            transition-transform duration-300 ease-in-out
            overflow-y-auto z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* 사이드바 헤더 */}
          <div className="sticky top-0 bg-gray-100 border-b border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-2xl">🛠️</span>
                <span>ToolHub</span>
              </Link>
              {/* 언어 선택 버튼 (데스크탑) */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1 text-sm border border-gray-200 rounded-lg hover:border-blue-300"
                  aria-label="언어 선택"
                >
                  <span>{languageInfo[i18n.language as SupportedLanguage]?.flag || '🌐'}</span>
                  <span className="text-xs">{languageInfo[i18n.language as SupportedLanguage]?.name || 'Language'}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {supportedLanguages.map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          i18n.language === lng ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span>{languageInfo[lng].flag}</span>
                        <span>{languageInfo[lng].name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="p-2">
            {/* 홈 링크 */}
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center px-4 py-2.5 rounded-lg mb-1 transition-all
                ${location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('common.home')}
            </Link>

            {/* 카테고리별 도구 목록 */}
            {Object.entries(toolsByCategory).map(([category, tools]) => {
              const colors = categoryColors[category] || defaultColor;
              return (
              <div key={category} className={`mb-1 rounded-xl ${colors.bg} p-1.5`}>
                <h3 className={`px-3 py-1.5 text-xs font-bold ${colors.title} ${colors.titleBg} uppercase tracking-wider rounded-lg mb-0.5`}>
                  {t(categoryI18nKey[category] || category)}
                </h3>
                <ul className="space-y-0.5">
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={tool.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-start px-3 py-2 rounded-lg transition-all
                          ${location.pathname === tool.path
                            ? `bg-white shadow-sm ${colors.text} font-semibold`
                            : `${colors.text} ${colors.hover}`
                          }
                        `}
                      >
                        <span className="mr-2.5 mt-0.5 flex-shrink-0">{getToolIcon(tool.id)}</span>
                        <span className="flex-1 text-sm leading-tight">
                          {t(toolI18nKey[tool.id] || tool.title.split(' - ')[0])}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
            })}

            {/* 구분선 */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* 기타 링크 */}
            <div className="space-y-1">
              <Link
                to="/privacy-policy"
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-sm transition-all
                  ${location.pathname === '/privacy-policy'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {t('common.privacyPolicy')}
              </Link>
            </div>
          </nav>
        </aside>

        {/* 모바일 오버레이 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 상단 광고 배너 */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-5xl mx-auto">
              <AdBanner slot="1234567890" format="horizontal" className="rounded-lg overflow-hidden" />
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <main className="flex-grow px-4 py-6 lg:px-8 lg:py-8">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          {/* 하단 광고 배너 */}
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <div className="max-w-5xl mx-auto">
              <AdBanner slot="0987654321" format="horizontal" className="rounded-lg overflow-hidden" />
            </div>
          </div>

          {/* 푸터 */}
          <footer className="bg-gray-800 text-gray-300 mt-auto">
            <div className="px-6 py-8">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 사이트 정보 */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">ToolHub</h3>
                    <p className="text-sm">
                      {t('common.footer.description')}
                    </p>
                  </div>

                  {/* 빠른 링크 */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">{t('common.toolList')}</h3>
                    <ul className="space-y-2 text-sm">
                      {siteConfig.tools.slice(0, 8).map((tool) => (
                        <li key={tool.id}>
                          <Link
                            to={tool.path}
                            className="hover:text-white transition-colors"
                          >
                            {t(toolI18nKey[tool.id] || tool.title.split(' - ')[0])}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 법적 정보 */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">{t('common.info')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">
                          {t('common.privacyPolicy')}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 저작권 */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                  <p>{t('common.footer.copyright', { year: currentYear })}</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
