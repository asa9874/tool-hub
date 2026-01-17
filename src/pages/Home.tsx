import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

/**
 * 홈페이지 컴포넌트
 * - 모든 도구 목록을 카드 형태로 표시
 * - SEO 최적화된 구조
 */
export default function Home() {
  // 홈페이지용 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription,
    publisher: {
      '@type': 'Organization',
      name: 'ToolHub',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
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

  return (
    <>
      <SEO
        title="무료 온라인 도구 모음"
        description={siteConfig.siteDescription}
        keywords={['온라인 도구', '무료 계산기', '만나이 계산기', '글자수 세기', '단위 변환']}
        canonical="/"
        structuredData={structuredData}
      />

      {/* 히어로 섹션 */}
      <section className="text-center py-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ToolHub
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-2">
          무료 온라인 도구 모음
        </p>
        <p className="text-lg opacity-80 max-w-2xl mx-auto px-4">
          만나이 계산기, 글자수 세기 등 일상에서 필요한 다양한 도구들을 
          무료로 이용하세요.
        </p>
      </section>

      {/* 도구 목록 */}
      {Object.entries(toolsByCategory).map(([category, tools]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
              {category}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <article className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                    {tool.title.split(' - ')[0]}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.keywords.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                    사용하기
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* SEO를 위한 추가 콘텐츠 섹션 */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ToolHub 소개
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed mb-4">
            ToolHub는 일상생활에서 자주 필요한 다양한 온라인 도구들을 무료로 제공하는 서비스입니다. 
            복잡한 계산이나 변환 작업을 간단하고 빠르게 처리할 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>만나이 계산기</strong>를 사용하면 2023년 시행된 만나이 통일법에 따라 
            정확한 만나이를 계산할 수 있습니다. 생년월일만 입력하면 만나이, 한국식 나이, 
            연나이를 한 번에 확인할 수 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed">
            모든 도구는 회원가입 없이 무료로 사용할 수 있으며, 
            개인정보를 수집하거나 저장하지 않습니다.
          </p>
        </div>
      </section>
    </>
  );
}
