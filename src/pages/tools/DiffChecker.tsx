import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
}

const i18n = {
  ko: {
    title: '텍스트 차이 비교기',
    subtitle: '두 텍스트를 비교하여 다른 부분을 하이라이트로 표시합니다',
    description: '두 텍스트의 차이점을 줄 단위로 비교하고 변경된 부분을 시각적으로 보여주는 Diff Checker 도구입니다.',
    originalText: '원본 텍스트',
    modifiedText: '수정된 텍스트',
    compare: '🔍 비교하기',
    clear: '초기화',
    result: '비교 결과',
    added: '추가됨',
    removed: '삭제됨',
    unchanged: '변경없음',
    stats: '통계',
    totalLines: '전체 줄',
    addedLines: '추가된 줄',
    removedLines: '삭제된 줄',
    unchangedLines: '동일한 줄',
    noChanges: '두 텍스트가 동일합니다.',
    placeholder1: '원본 텍스트를 입력하세요...',
    placeholder2: '수정된 텍스트를 입력하세요...',
    sideBySide: '나란히 보기',
    unified: '통합 보기',
    ignoreCase: '대소문자 무시',
    ignoreWhitespace: '공백 무시',
    faq: {
      q1: 'Diff Checker란 무엇인가요?',
      a1: 'Diff Checker(차이 비교기)는 두 개의 텍스트를 비교하여 어떤 부분이 추가되고, 삭제되고, 변경되었는지를 시각적으로 보여주는 도구입니다. 프로그래머들이 코드 변경사항을 확인하거나, 문서 편집자가 수정 전후를 비교할 때 주로 사용합니다.',
      q2: '어떤 경우에 텍스트 비교 도구를 사용하나요?',
      a2: '코드 리뷰 시 변경사항 확인, 계약서나 문서의 수정 내역 추적, 번역 전후 비교, 이메일이나 메시지의 수정 확인, 데이터 파일 비교 등 다양한 상황에서 활용됩니다.',
      q3: '줄 단위 비교와 단어 단위 비교의 차이는?',
      a3: '줄 단위 비교는 전체 줄이 같은지 다른지를 판단합니다. 한 글자만 달라도 그 줄 전체가 "변경됨"으로 표시됩니다. 단어 단위 비교는 같은 줄 내에서 어떤 단어가 변경되었는지까지 세밀하게 보여줍니다.',
    },
  },
};

export default function DiffChecker() {
  const lang = 'ko';
  const t = i18n[lang];

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'unified'>('sideBySide');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'diff-checker');

  // 텍스트 전처리
  const preprocessText = (text: string): string => {
    let processed = text;
    if (ignoreCase) processed = processed.toLowerCase();
    if (ignoreWhitespace) processed = processed.replace(/\s+/g, ' ').trim();
    return processed;
  };

  // 줄 단위 Diff 계산 (LCS 알고리즘 간소화 버전)
  const diffResult = useMemo(() => {
    if (!text1 && !text2) return { lines1: [], lines2: [], stats: { total: 0, added: 0, removed: 0, unchanged: 0 } };

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const processed1 = lines1.map(preprocessText);
    const processed2 = lines2.map(preprocessText);

    const result1: DiffLine[] = [];
    const result2: DiffLine[] = [];

    let i = 0, j = 0;
    let stats = { total: 0, added: 0, removed: 0, unchanged: 0 };

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // 남은 lines2는 모두 추가됨
        result2.push({ type: 'added', content: lines2[j], lineNumber: j + 1 });
        stats.added++;
        j++;
      } else if (j >= lines2.length) {
        // 남은 lines1은 모두 삭제됨
        result1.push({ type: 'removed', content: lines1[i], lineNumber: i + 1 });
        stats.removed++;
        i++;
      } else if (processed1[i] === processed2[j]) {
        // 같은 줄
        result1.push({ type: 'unchanged', content: lines1[i], lineNumber: i + 1 });
        result2.push({ type: 'unchanged', content: lines2[j], lineNumber: j + 1 });
        stats.unchanged++;
        i++;
        j++;
      } else {
        // 다른 줄 - 가장 가까운 매칭 찾기
        let foundInLines2 = processed2.indexOf(processed1[i], j);
        let foundInLines1 = processed1.indexOf(processed2[j], i);

        if (foundInLines2 === -1 && foundInLines1 === -1) {
          // 둘 다 매칭 없음 - 둘 다 변경
          result1.push({ type: 'removed', content: lines1[i], lineNumber: i + 1 });
          result2.push({ type: 'added', content: lines2[j], lineNumber: j + 1 });
          stats.removed++;
          stats.added++;
          i++;
          j++;
        } else if (foundInLines2 === -1 || (foundInLines1 !== -1 && foundInLines1 - i < foundInLines2 - j)) {
          // lines2[j]가 lines1에서 더 가까움 - lines1[i] 삭제
          result1.push({ type: 'removed', content: lines1[i], lineNumber: i + 1 });
          stats.removed++;
          i++;
        } else {
          // lines1[i]가 lines2에서 더 가까움 - lines2[j] 추가
          result2.push({ type: 'added', content: lines2[j], lineNumber: j + 1 });
          stats.added++;
          j++;
        }
      }
      stats.total++;
    }

    return { lines1: result1, lines2: result2, stats };
  }, [text1, text2, ignoreCase, ignoreWhitespace]);

  const getLineStyle = (type: DiffLine['type']) => {
    switch (type) {
      case 'added': return 'bg-green-100 border-l-4 border-green-500';
      case 'removed': return 'bg-red-100 border-l-4 border-red-500';
      default: return 'bg-white';
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
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

      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🔍 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 입력 영역 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.originalText}</label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder={t.placeholder1}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.modifiedText}</label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder={t.placeholder2}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* 옵션 및 버튼 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.ignoreCase}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.ignoreWhitespace}</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'sideBySide' ? 'unified' : 'sideBySide')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {viewMode === 'sideBySide' ? t.unified : t.sideBySide}
              </button>
              <button
                onClick={() => { setText1(''); setText2(''); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {t.clear}
              </button>
            </div>
          </div>
        </section>

        {/* 통계 */}
        {(text1 || text2) && (
          <section className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{t.totalLines}:</span>
                <span className="font-bold text-gray-800">{diffResult.stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded"></span>
                <span className="text-gray-600">{t.addedLines}:</span>
                <span className="font-bold text-green-600">{diffResult.stats.added}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded"></span>
                <span className="text-gray-600">{t.removedLines}:</span>
                <span className="font-bold text-red-600">{diffResult.stats.removed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded"></span>
                <span className="text-gray-600">{t.unchangedLines}:</span>
                <span className="font-bold text-gray-600">{diffResult.stats.unchanged}</span>
              </div>
            </div>
          </section>
        )}

        {/* 비교 결과 */}
        {(text1 || text2) && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.result}</h2>
            
            {diffResult.stats.added === 0 && diffResult.stats.removed === 0 && text1 === text2 ? (
              <div className="text-center py-8 text-gray-500">
                ✅ {t.noChanges}
              </div>
            ) : viewMode === 'sideBySide' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-4 py-2 font-medium text-red-700 border-b">
                    {t.originalText}
                  </div>
                  <div className="font-mono text-sm max-h-96 overflow-auto">
                    {diffResult.lines1.map((line, index) => (
                      <div key={index} className={`px-4 py-1 ${getLineStyle(line.type)}`}>
                        <span className="text-gray-400 mr-3 select-none">{line.lineNumber}</span>
                        <span className={line.type === 'removed' ? 'text-red-700' : ''}>
                          {line.content || ' '}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-2 font-medium text-green-700 border-b">
                    {t.modifiedText}
                  </div>
                  <div className="font-mono text-sm max-h-96 overflow-auto">
                    {diffResult.lines2.map((line, index) => (
                      <div key={index} className={`px-4 py-1 ${getLineStyle(line.type)}`}>
                        <span className="text-gray-400 mr-3 select-none">{line.lineNumber}</span>
                        <span className={line.type === 'added' ? 'text-green-700' : ''}>
                          {line.content || ' '}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="font-mono text-sm max-h-96 overflow-auto">
                  {[...diffResult.lines1, ...diffResult.lines2]
                    .sort((a, b) => a.lineNumber - b.lineNumber)
                    .map((line, index) => (
                      <div key={index} className={`px-4 py-1 ${getLineStyle(line.type)}`}>
                        <span className="text-gray-400 mr-2 select-none w-8 inline-block">
                          {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '}
                        </span>
                        <span className="text-gray-400 mr-3 select-none">{line.lineNumber}</span>
                        <span className={
                          line.type === 'added' ? 'text-green-700' : 
                          line.type === 'removed' ? 'text-red-700' : ''
                        }>
                          {line.content || ' '}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
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

        {/* 사용법 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 텍스트 비교 도구 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>텍스트 차이 비교기(Diff Checker)</strong>는 두 텍스트의 차이점을 
              줄 단위로 분석하여 시각적으로 보여줍니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              왼쪽에 원본 텍스트, 오른쪽에 수정된 텍스트를 입력하면 자동으로 비교됩니다.
              빨간색은 삭제된 줄, 초록색은 추가된 줄을 나타냅니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              코드 리뷰, 문서 수정 확인, 번역 비교 등 다양한 작업에 활용하세요.
              대소문자 무시, 공백 무시 옵션으로 더 유연한 비교가 가능합니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
