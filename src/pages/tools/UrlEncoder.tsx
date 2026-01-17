import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: 'URL 인코더/디코더',
    description: 'URL에 포함된 한글, 특수문자를 안전하게 인코딩하거나 디코딩합니다.',
    encodeTab: '인코딩',
    decodeTab: '디코딩',
    inputLabel: '입력',
    outputLabel: '결과',
    encodeButton: 'URL 인코딩',
    decodeButton: 'URL 디코딩',
    copyButton: '복사',
    clearButton: '지우기',
    copied: '복사됨!',
    encodePlaceholder: '인코딩할 URL 또는 텍스트를 입력하세요\n예: https://example.com/검색?q=한글',
    decodePlaceholder: '디코딩할 URL을 입력하세요\n예: https://example.com/%EA%B2%80%EC%83%89',
    encodeUriButton: 'URL 인코딩 (encodeURI)',
    encodeComponentButton: '컴포넌트 인코딩',
    example: '📝 인코딩 예시',
    originalUrl: '원본 URL',
    encodedResult: '인코딩 결과',
    explanationTitle: 'URL 인코딩 설명',
    explanationDesc: '<strong>URL 인코딩</strong>(퍼센트 인코딩)은 URL에서 사용할 수 없는 문자를 %XX 형식으로 변환하는 것입니다. 웹 브라우저 주소창에 한글을 입력하면 자동으로 인코딩되어 전송됩니다.',
    twoEncodingMethods: '두 가지 인코딩 방식',
    encodeUriDesc: '<strong>encodeURI:</strong> 전체 URL 인코딩. :, /, ?, & 등은 유지',
    encodeComponentDesc: '<strong>encodeURIComponent:</strong> URL 파라미터 인코딩. 모든 특수문자 변환',
    relatedTools: '🔗 관련 도구',
    base64Tool: 'Base64 인코더/디코더',
    base64Desc: '텍스트 Base64 변환',
    jsonFormatterTool: 'JSON 포맷터',
    jsonFormatterDesc: 'JSON 정렬 및 검증',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'URL 인코딩은 왜 필요한가요?',
          answer: 'URL에는 영문, 숫자, 일부 특수문자만 사용할 수 있습니다. 한글, 공백 등은 %XX 형식으로 인코딩해야 웹 브라우저와 서버가 올바르게 처리할 수 있습니다.',
        },
        {
          question: '%20과 +의 차이는 무엇인가요?',
          answer: '%20과 +는 둘 다 공백을 의미합니다. URL 경로에서는 %20을, 쿼리 문자열에서는 +를 사용하는 것이 일반적입니다.',
        },
        {
          question: 'encodeURI와 encodeURIComponent의 차이는?',
          answer: 'encodeURI는 완전한 URL을 인코딩하며 :, /, ? 등은 유지합니다. encodeURIComponent는 URL의 일부분(파라미터 값)을 인코딩하며 모든 특수문자를 변환합니다.',
        },
      ],
    },
  },
  en: {
    title: 'URL Encoder/Decoder',
    description: 'Safely encode or decode Korean characters and special characters in URLs.',
    encodeTab: 'Encode',
    decodeTab: 'Decode',
    inputLabel: 'Input',
    outputLabel: 'Result',
    encodeButton: 'URL Encode',
    decodeButton: 'URL Decode',
    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied!',
    encodePlaceholder: 'Enter URL or text to encode\nExample: https://example.com/search?q=hello world',
    decodePlaceholder: 'Enter URL to decode\nExample: https://example.com/%E2%9C%93',
    encodeUriButton: 'URL Encode (encodeURI)',
    encodeComponentButton: 'Component Encode',
    example: '📝 Encoding Example',
    originalUrl: 'Original URL',
    encodedResult: 'Encoded Result',
    explanationTitle: 'URL Encoding Explained',
    explanationDesc: '<strong>URL encoding</strong> (percent encoding) converts characters that cannot be used in URLs to %XX format. When you enter non-ASCII characters in the browser address bar, they are automatically encoded before being sent.',
    twoEncodingMethods: 'Two Encoding Methods',
    encodeUriDesc: '<strong>encodeURI:</strong> Encodes full URL. Preserves :, /, ?, & etc.',
    encodeComponentDesc: '<strong>encodeURIComponent:</strong> Encodes URL parameters. Converts all special characters',
    relatedTools: '🔗 Related Tools',
    base64Tool: 'Base64 Encoder/Decoder',
    base64Desc: 'Text Base64 conversion',
    jsonFormatterTool: 'JSON Formatter',
    jsonFormatterDesc: 'JSON formatting and validation',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Why is URL encoding necessary?',
          answer: 'URLs can only use alphanumeric characters and some special characters. Non-ASCII characters and spaces must be encoded in %XX format for web browsers and servers to process correctly.',
        },
        {
          question: 'What is the difference between %20 and +?',
          answer: 'Both %20 and + represent spaces. It is common to use %20 in URL paths and + in query strings.',
        },
        {
          question: 'What is the difference between encodeURI and encodeURIComponent?',
          answer: 'encodeURI encodes complete URLs and preserves :, /, ?, etc. encodeURIComponent encodes parts of URLs (parameter values) and converts all special characters.',
        },
      ],
    },
  },
};

type Mode = 'encode' | 'decode';

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'url-encoder');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const handleEncode = () => {
    try {
      // 전체 URL 인코딩 (URL 구조 유지)
      const encoded = encodeURI(input);
      setOutput(encoded);
    } catch {
      setOutput(encodeURIComponent(input));
    }
  };

  const handleEncodeComponent = () => {
    // 컴포넌트 인코딩 (모든 특수문자 변환)
    setOutput(encodeURIComponent(input));
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput(decodeURI(input));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        {/* 모드 선택 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.encodeTab}
          </button>
          <button
            onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.decodeTab}
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.inputLabel}</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                placeholder={mode === 'encode' ? t.encodePlaceholder : t.decodePlaceholder}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {mode === 'encode' ? (
                <>
                  <button
                    onClick={handleEncode}
                    disabled={!input}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    URL 인코딩 (encodeURI)
                  </button>
                  <button
                    onClick={handleEncodeComponent}
                    disabled={!input}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    컴포넌트 인코딩
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDecode}
                  disabled={!input}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {t.decodeButton}
                </button>
              )}
              <button
                onClick={handleClear}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.clearButton}
              </button>
            </div>

            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">{t.outputLabel}</label>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {copied ? t.copied : t.copyButton}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-32 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none bg-gray-50"
                />
              </div>
            )}
          </div>
        </section>

        {/* 예시 */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 인코딩 예시</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">원본 URL</div>
              <code className="text-sm break-all">https://example.com/검색?q=안녕 세상&lang=ko</code>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">인코딩 결과</div>
              <code className="text-sm break-all">https://example.com/%EA%B2%80%EC%83%89?q=%EC%95%88%EB%85%95%20%EC%84%B8%EC%83%81&lang=ko</code>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">URL 인코딩 설명</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>URL 인코딩</strong>(퍼센트 인코딩)은 URL에서 사용할 수 없는 문자를 %XX 형식으로 변환하는 것입니다.
              웹 브라우저 주소창에 한글을 입력하면 자동으로 인코딩되어 전송됩니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">두 가지 인코딩 방식</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>encodeURI:</strong> 전체 URL 인코딩. :, /, ?, & 등은 유지</li>
              <li><strong>encodeURIComponent:</strong> URL 파라미터 인코딩. 모든 특수문자 변환</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/base64" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">Base64 인코더/디코더</h3>
              <p className="text-sm text-gray-600 mt-1">텍스트 Base64 변환</p>
            </Link>
            <Link to="/tools/json-formatter" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">JSON 포맷터</h3>
              <p className="text-sm text-gray-600 mt-1">JSON 정렬 및 검증</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
