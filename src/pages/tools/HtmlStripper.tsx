import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

const i18n = {
  ko: {
    title: 'HTML 태그 제거기',
    subtitle: '웹페이지에서 복사한 글에서 HTML 태그를 제거하고 순수 텍스트만 추출합니다',
    description: 'HTML 코드에서 태그를 제거하고 깔끔한 텍스트만 남기는 도구입니다.',
    inputLabel: 'HTML 코드 또는 텍스트 입력',
    inputPlaceholder: '<p>안녕하세요!</p> <strong>HTML 태그</strong>가 포함된 텍스트를 붙여넣으세요...',
    outputLabel: '추출된 순수 텍스트',
    options: '옵션',
    removeLineBreaks: '줄바꿈 제거',
    removeExtraSpaces: '연속 공백 제거',
    preserveLinks: '링크 URL 보존',
    copy: '복사',
    copied: '복사됨!',
    clear: '초기화',
    stats: '통계',
    originalLength: '원본 길이',
    resultLength: '결과 길이',
    tagsRemoved: '제거된 태그',
    characters: '자',
    tags: '개',
    faq: {
      q1: 'HTML 태그란 무엇인가요?',
      a1: 'HTML 태그는 웹페이지의 구조를 정의하는 코드입니다. <p>, <div>, <strong> 등이 있으며, 웹페이지에서 텍스트를 복사할 때 함께 딸려오는 경우가 많습니다. 이 도구로 태그를 제거하면 순수한 텍스트만 얻을 수 있습니다.',
      q2: '어떤 경우에 이 도구가 유용한가요?',
      a2: '블로그 글 정리, 웹페이지 텍스트 추출, 데이터 정제, 이메일 템플릿에서 텍스트 추출, 코드 내 텍스트 확인 등 다양한 상황에서 유용합니다. 특히 마케터, 블로거, 개발자들이 자주 사용합니다.',
      q3: '스크립트나 스타일 태그도 제거되나요?',
      a3: '네, <script>, <style> 태그와 그 내용까지 모두 제거됩니다. HTML 주석(<!-- -->)도 함께 제거되어 순수한 텍스트 콘텐츠만 남습니다.',
    },
  },
};

export default function HtmlStripper() {
  const lang = 'ko';
  const t = i18n[lang];

  const [input, setInput] = useState('');
  const [removeLineBreaks, setRemoveLineBreaks] = useState(false);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [preserveLinks, setPreserveLinks] = useState(false);
  const [copied, setCopied] = useState(false);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'html-stripper');

  // HTML 태그 제거 로직
  const result = useMemo(() => {
    if (!input.trim()) return { text: '', tagsRemoved: 0 };

    let text = input;
    let tagsRemoved = 0;

    // 태그 개수 카운트
    const tagMatches = text.match(/<[^>]+>/g);
    tagsRemoved = tagMatches ? tagMatches.length : 0;

    // 링크 URL 보존 옵션
    if (preserveLinks) {
      text = text.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)');
    }

    // script, style 태그와 내용 제거
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // HTML 주석 제거
    text = text.replace(/<!--[\s\S]*?-->/g, '');

    // br 태그를 줄바꿈으로 변환
    text = text.replace(/<br\s*\/?>/gi, '\n');

    // p, div 등 블록 태그를 줄바꿈으로 변환
    text = text.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');

    // 나머지 모든 태그 제거
    text = text.replace(/<[^>]+>/g, '');

    // HTML 엔티티 디코딩
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    text = textarea.value;

    // 연속 공백 제거 옵션
    if (removeExtraSpaces) {
      text = text.replace(/[ \t]+/g, ' ');
    }

    // 줄바꿈 제거 옵션
    if (removeLineBreaks) {
      text = text.replace(/\n+/g, ' ');
    } else {
      // 연속 줄바꿈을 하나로
      text = text.replace(/\n{3,}/g, '\n\n');
    }

    return { text: text.trim(), tagsRemoved };
  }, [input, removeLineBreaks, removeExtraSpaces, preserveLinks]);

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
    ],
  };

  const handleCopy = async () => {
    if (result.text) {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🧹 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 메인 도구 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 옵션 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-medium text-gray-700 mb-3">⚙️ {t.options}</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeExtraSpaces}
                  onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.removeExtraSpaces}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeLineBreaks}
                  onChange={(e) => setRemoveLineBreaks(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.removeLineBreaks}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveLinks}
                  onChange={(e) => setPreserveLinks(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.preserveLinks}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 */}
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                {t.inputLabel}
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
                placeholder={t.inputPlaceholder}
              />
            </div>

            {/* 출력 */}
            <div>
              <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-2">
                {t.outputLabel}
              </label>
              <textarea
                id="output"
                value={result.text}
                readOnly
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* 버튼 & 통계 */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={!result.text}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? '✓ ' + t.copied : t.copy}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.clear}
              </button>
            </div>

            {input && (
              <div className="flex gap-6 text-sm text-gray-600">
                <span>
                  {t.originalLength}: <strong>{input.length.toLocaleString()}{t.characters}</strong>
                </span>
                <span>
                  {t.resultLength}: <strong>{result.text.length.toLocaleString()}{t.characters}</strong>
                </span>
                <span>
                  {t.tagsRemoved}: <strong>{result.tagsRemoved}{t.tags}</strong>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ 섹션 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 자주 묻는 질문</h2>

          <div className="space-y-6">
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q1}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a1}</p>
            </article>
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q2}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a2}</p>
            </article>
            <article>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q3}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a3}</p>
            </article>
          </div>
        </section>

        {/* 사용법 설명 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 HTML 태그 제거기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>HTML 태그 제거기</strong>는 웹페이지에서 복사한 텍스트나 HTML 코드에서 불필요한 태그를 제거하고 순수한 텍스트만
              추출하는 도구입니다. 블로그 글 정리, 데이터 정제, 콘텐츠 마이그레이션 등 다양한 작업에 활용할 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              사용 방법은 간단합니다. 왼쪽 입력창에 HTML 코드나 웹에서 복사한 텍스트를 붙여넣으면, 오른쪽에 태그가 제거된 깔끔한 텍스트가
              실시간으로 표시됩니다. 옵션을 통해 줄바꿈 제거, 연속 공백 제거, 링크 URL 보존 등을 선택할 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              &lt;script&gt;, &lt;style&gt; 태그와 그 내용, HTML 주석까지 모두 제거되며, HTML 엔티티(&amp;nbsp;, &amp;amp; 등)도 자동으로
              디코딩됩니다. 마케터, 블로거, 개발자 모두에게 유용한 텍스트 정리 도구입니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
