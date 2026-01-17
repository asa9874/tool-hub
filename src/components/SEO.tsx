import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/siteConfig';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: object;
}

/**
 * SEO 컴포넌트 - 각 페이지의 메타 태그를 관리
 * 
 * 사용법:
 * <SEO 
 *   title="페이지 제목"
 *   description="페이지 설명 (150자 이내 권장)"
 *   keywords={['키워드1', '키워드2']}
 * />
 */
export default function SEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  const siteUrl = siteConfig.siteUrl;
  const fullTitle = `${title} | ${siteConfig.siteName}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const defaultOgImage = `${siteUrl}/og-image.png`;

  // 기본 구조화된 데이터 (Organization)
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteUrl,
    description: siteConfig.siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <html lang={siteConfig.defaultLanguage} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* 검색 엔진 크롤링 제어 */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph 메타 태그 (Facebook, LinkedIn 등) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* 구조화된 데이터 (JSON-LD) - 검색 결과 리치 스니펫 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
}
