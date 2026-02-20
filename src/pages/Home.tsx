import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';
import { getToolIcon } from '../config/toolIcons';
import useLangPath from '../hooks/useLangPath';

// 카테고리별 색상 매핑
const categoryColors: Record<string, { bg: string; text: string; hover: string; border: string }> = {
  '금융/부동산': { bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:bg-emerald-100', border: 'border-emerald-200' },
  '건강/라이프스타일': { bg: 'bg-rose-50', text: 'text-rose-700', hover: 'hover:bg-rose-100', border: 'border-rose-200' },
  '생활/사회': { bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
  '업무/생산성': { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
  '개발/IT': { bg: 'bg-violet-50', text: 'text-violet-700', hover: 'hover:bg-violet-100', border: 'border-violet-200' },
  '게임/재미': { bg: 'bg-pink-50', text: 'text-pink-700', hover: 'hover:bg-pink-100', border: 'border-pink-200' },
  '유틸리티': { bg: 'bg-cyan-50', text: 'text-cyan-700', hover: 'hover:bg-cyan-100', border: 'border-cyan-200' },
  '쇼핑/실생활': { bg: 'bg-orange-50', text: 'text-orange-700', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
  '음악/창작': { bg: 'bg-indigo-50', text: 'text-indigo-700', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' },
  '디자인': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', hover: 'hover:bg-fuchsia-100', border: 'border-fuchsia-200' },
};

const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', hover: 'hover:bg-gray-100', border: 'border-gray-200' };

// 카테고리 아이콘
const categoryIcons: Record<string, string> = {
  '금융/부동산': '💰',
  '건강/라이프스타일': '💪',
  '생활/사회': '🏠',
  '업무/생산성': '📊',
  '개발/IT': '💻',
  '게임/재미': '🎮',
  '유틸리티': '🔧',
  '쇼핑/실생활': '🛒',
  '음악/창작': '🎵',
  '디자인': '🎨',
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  const [searchQuery, setSearchQuery] = useState('');
  const { toLangPath } = useLangPath();

  // 홈페이지용 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('common.siteName'),
    url: siteConfig.siteUrl,
    description: t('common.siteDescription'),
    publisher: {
      '@type': 'Organization',
      name: 'ToolHub',
    },
  };

  // 카테고리별 도구 그룹화
  const toolsByCategory = siteConfig.tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof siteConfig.tools>);

  // 검색 필터링
  const filteredToolsByCategory = Object.entries(toolsByCategory).reduce((acc, [category, tools]) => {
    if (!searchQuery) {
      acc[category] = tools;
      return acc;
    }
    
    const filtered = tools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof siteConfig.tools>);

  // 도구 제목에서 짧은 이름 추출
  const getShortTitle = (title: string): string => {
    const mainTitle = title.split(' - ')[0];
    return mainTitle.replace(/\d{4}년\s*/g, '').trim();
  };

  return (
    <>
      <SEO
        title={isKorean ? '무료 온라인 도구 모음' : 'Free Online Tools'}
        description={t('common.siteDescription')}
        keywords={isKorean 
          ? ['온라인 도구', '무료 계산기', '만나이 계산기', '글자수 세기', '단위 변환']
          : ['online tools', 'free calculator', 'age calculator', 'character counter', 'unit converter']
        }
        canonical="/"
        structuredData={structuredData}
      />

      {/* 히어로 섹션 - 컴팩트하게 */}
      <section className="text-center py-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">🛠️ ToolHub</h1>
        <p className="text-lg opacity-90">
          {isKorean ? '무료 온라인 도구 모음' : 'Free Online Tools'}
        </p>
      </section>

      {/* 검색창 */}
      <section className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKorean ? '🔍 도구 검색 (예: 계산기, 변환기, BMI...)' : '🔍 Search tools...'}
            className="w-full px-4 py-3 pl-5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* 도구 목록 - 그리드 형태 */}
      {Object.entries(filteredToolsByCategory).map(([category, tools]) => {
        const colors = categoryColors[category] || defaultColor;
        const icon = categoryIcons[category] || '📦';
        
        return (
          <section key={category} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>{icon}</span>
              <span>{category}</span>
              <span className="text-sm font-normal text-gray-400">({tools.length})</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={toLangPath(tool.path)}
                  className={`group flex flex-col items-center p-4 rounded-xl border ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div className={`${colors.text} mb-2 group-hover:scale-110 transition-transform`}>
                    <span className="[&>svg]:w-6 [&>svg]:h-6">{getToolIcon(tool.id)}</span>
                  </div>
                  <span className={`text-xs md:text-sm font-medium ${colors.text} text-center leading-tight line-clamp-2`}>
                    {getShortTitle(tool.title)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* 검색 결과 없음 */}
      {searchQuery && Object.keys(filteredToolsByCategory).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">😅</p>
          <p>{isKorean ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : `No results for "${searchQuery}"`}</p>
        </div>
      )}

      {/* 통계 */}
      <section className="mt-8 text-center text-sm text-gray-500">
        <p>
          {isKorean 
            ? `총 ${siteConfig.tools.length}개의 무료 도구 제공 중`
            : `${siteConfig.tools.length} free tools available`
          }
        </p>
      </section>
    </>
  );
}
