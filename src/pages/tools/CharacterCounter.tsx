import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

const i18n = {
  ko: {
    title: '글자수 세기',
    description: '텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 계산합니다. 자기소개서, 이력서 작성 시 유용합니다.',
    placeholder: '텍스트를 입력하세요...',
    totalChars: '전체 글자 수',
    charsNoSpace: '공백 제외',
    words: '단어 수',
    bytes: '바이트',
    lines: '줄 수',
    paragraphs: '문단 수',
    sentences: '문장 수',
    copyButton: '복사',
    clearButton: '지우기',
    copied: '복사됨!',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '공백 포함/제외 글자수 차이는 무엇인가요?',
          answer: '공백 포함은 띄어쓰기, 줄바꿈 등 모든 문자를 포함한 수입니다. 공백 제외는 순수하게 글자만 센 것으로, 대부분의 자기소개서나 지원서에서는 공백 포함 글자수를 기준으로 합니다.',
        },
        {
          question: '바이트(Byte)는 어떻게 계산되나요?',
          answer: '한글은 UTF-8 기준 글자당 3바이트, 영문/숫자/공백은 1바이트로 계산됩니다. SMS 문자나 일부 시스템에서 바이트 제한이 있을 때 참고하세요.',
        },
        {
          question: '자기소개서 글자수 제한은 보통 얼마인가요?',
          answer: '일반적으로 500자, 1000자, 1500자, 2000자 등의 제한이 많습니다. 대기업은 보통 항목당 500~1000자, 공기업은 1000~1500자가 많습니다.',
        },
      ],
    },
  },
};

interface TextStats {
  total: number;
  noSpace: number;
  words: number;
  bytes: number;
  lines: number;
  paragraphs: number;
  sentences: number;
}

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const lang = 'ko';
  const t = i18n[lang];

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'character-counter');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
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
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const stats: TextStats = useMemo(() => {
    const total = text.length;
    const noSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const bytes = new Blob([text]).size;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;

    return { total, noSpace, words, bytes, lines, paragraphs, sentences };
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleClear = () => {
    setText('');
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 실시간 통계 - 상단 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{t.totalChars}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{stats.noSpace.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{t.charsNoSpace}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.words.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{t.words}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.bytes.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{t.bytes}</div>
            </div>
          </div>

          {/* 텍스트 입력 */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base leading-relaxed"
            placeholder={t.placeholder}
          />

          {/* 추가 통계 */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span>{t.lines}: <strong className="text-gray-800">{stats.lines}</strong></span>
            <span>{t.paragraphs}: <strong className="text-gray-800">{stats.paragraphs}</strong></span>
            <span>{t.sentences}: <strong className="text-gray-800">{stats.sentences}</strong></span>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? t.copied : t.copyButton}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.clearButton}
            </button>
          </div>
        </section>

        {/* 글자수 제한 가이드 */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 자주 사용되는 글자수 제한</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`bg-white p-4 rounded-lg text-center ${stats.total <= 500 ? 'ring-2 ring-green-500' : ''}`}>
              <div className="text-2xl font-bold text-gray-700">500자</div>
              <div className="text-xs text-gray-500 mt-1">짧은 자기소개</div>
              {stats.total > 0 && (
                <div className={`text-sm mt-2 ${stats.total <= 500 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.total <= 500 ? `✓ ${500 - stats.total}자 여유` : `✗ ${stats.total - 500}자 초과`}
                </div>
              )}
            </div>
            <div className={`bg-white p-4 rounded-lg text-center ${stats.total <= 1000 ? 'ring-2 ring-green-500' : ''}`}>
              <div className="text-2xl font-bold text-gray-700">1,000자</div>
              <div className="text-xs text-gray-500 mt-1">대기업 자소서</div>
              {stats.total > 0 && (
                <div className={`text-sm mt-2 ${stats.total <= 1000 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.total <= 1000 ? `✓ ${1000 - stats.total}자 여유` : `✗ ${stats.total - 1000}자 초과`}
                </div>
              )}
            </div>
            <div className={`bg-white p-4 rounded-lg text-center ${stats.total <= 1500 ? 'ring-2 ring-green-500' : ''}`}>
              <div className="text-2xl font-bold text-gray-700">1,500자</div>
              <div className="text-xs text-gray-500 mt-1">공기업 자소서</div>
              {stats.total > 0 && (
                <div className={`text-sm mt-2 ${stats.total <= 1500 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.total <= 1500 ? `✓ ${1500 - stats.total}자 여유` : `✗ ${stats.total - 1500}자 초과`}
                </div>
              )}
            </div>
            <div className={`bg-white p-4 rounded-lg text-center ${stats.total <= 2000 ? 'ring-2 ring-green-500' : ''}`}>
              <div className="text-2xl font-bold text-gray-700">2,000자</div>
              <div className="text-xs text-gray-500 mt-1">긴 에세이</div>
              {stats.total > 0 && (
                <div className={`text-sm mt-2 ${stats.total <= 2000 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.total <= 2000 ? `✓ ${2000 - stats.total}자 여유` : `✗ ${stats.total - 2000}자 초과`}
                </div>
              )}
            </div>
          </div>
        </section>

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.faq.title}</h2>
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <article key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {item.question}</h3>
                <p className="text-gray-600 leading-relaxed">A. {item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 설명 콘텐츠 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">글자수 세기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>글자수 세기</strong> 도구는 자기소개서, 이력서, 에세이, SNS 게시글 등을 작성할 때
              글자 수를 실시간으로 확인할 수 있는 온라인 도구입니다. <strong>공백 포함 글자수</strong>와
              <strong>공백 제외 글자수</strong>를 동시에 보여주어 다양한 상황에서 활용할 수 있습니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">제공하는 정보</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>전체 글자 수:</strong> 공백, 줄바꿈 등 모든 문자 포함</li>
              <li><strong>공백 제외:</strong> 순수 글자 수만 계산</li>
              <li><strong>단어 수:</strong> 띄어쓰기로 구분된 단어의 개수</li>
              <li><strong>바이트:</strong> UTF-8 기준 용량 (한글 3바이트, 영문 1바이트)</li>
              <li><strong>줄 수:</strong> 줄바꿈 기준 라인 수</li>
              <li><strong>문단 수:</strong> 빈 줄로 구분된 문단의 개수</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              취업 시즌에는 자기소개서 글자수 제한을 정확히 맞추는 것이 중요합니다.
              대부분의 기업은 <strong>공백 포함</strong> 기준으로 글자수를 측정하니 참고하세요.
            </p>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/tools/percent-calculator"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">퍼센트 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">비율, 증감률 계산</p>
            </Link>
            <Link
              to="/tools/unit-converter"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">단위 변환기</h3>
              <p className="text-sm text-gray-600 mt-1">길이, 무게, 면적 변환</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
