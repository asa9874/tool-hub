import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import AdBanner from './AdBanner';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 공통 레이아웃 컴포넌트
 * - 좌측 사이드바 네비게이션
 * - 카테고리별 도구 목록
 * - 반응형 디자인 적용
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      </header>

      {/* 메인 컨테이너 */}
      <div className="flex flex-1">
        {/* 좌측 사이드바 */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen
            w-64 bg-white shadow-lg
            transition-transform duration-300 ease-in-out
            overflow-y-auto z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* 사이드바 헤더 */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="text-2xl">🛠️</span>
              <span>ToolHub</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="p-4">
            {/* 홈 링크 */}
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center px-4 py-2.5 rounded-lg mb-2 transition-all
                ${location.pathname === '/'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              홈
            </Link>

            {/* 카테고리별 도구 목록 */}
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <div key={category} className="mb-6">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={tool.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-start px-4 py-2.5 rounded-lg transition-all
                          ${location.pathname === tool.path
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className="mr-3 mt-0.5">•</span>
                        <span className="flex-1 text-sm leading-tight">
                          {tool.title.split(' - ')[0]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 구분선 */}
            <div className="border-t border-gray-200 my-4"></div>

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
                개인정보처리방침
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
                      다양한 무료 온라인 도구를 제공합니다.
                      만나이 계산기, 글자수 세기 등 일상에서 유용한 도구들을 만나보세요.
                    </p>
                  </div>

                  {/* 빠른 링크 */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">도구 목록</h3>
                    <ul className="space-y-2 text-sm">
                      {siteConfig.tools.slice(0, 8).map((tool) => (
                        <li key={tool.id}>
                          <Link
                            to={tool.path}
                            className="hover:text-white transition-colors"
                          >
                            {tool.title.split(' - ')[0]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 법적 정보 */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">정보</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">
                          개인정보처리방침
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 저작권 */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                  <p>© {currentYear} ToolHub. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
