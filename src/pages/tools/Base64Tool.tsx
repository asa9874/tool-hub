import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: 'Base64 인코더/디코더',
    description: '텍스트를 Base64로 인코딩하거나 Base64를 원본 텍스트로 디코딩합니다.',
    encodeTab: '인코딩',
    decodeTab: '디코딩',
    inputLabel: '입력',
    outputLabel: '결과',
    encodeButton: 'Base64로 인코딩',
    decodeButton: '텍스트로 디코딩',
    copyButton: '복사',
    clearButton: '지우기',
    copied: '복사됨!',
    encodePlaceholder: '인코딩할 텍스트를 입력하세요',
    decodePlaceholder: 'Base64 문자열을 입력하세요',
    error: '변환 오류: 유효하지 않은 입력입니다',
    example: '📝 예시',
    originalText: '원본 텍스트',
    base64Encoded: 'Base64 인코딩',
    explanationTitle: 'Base64 인코딩 설명',
    explanationDesc: '<strong>Base64</strong>는 바이너리 데이터를 64개의 ASCII 문자(A-Z, a-z, 0-9, +, /)로 변환하는 인코딩 방식입니다. 이 도구는 UTF-8을 지원하여 한글도 정확하게 인코딩/디코딩할 수 있습니다.',
    useCases: '활용 분야',
    useCase1: '<strong>Data URI:</strong> HTML/CSS에 이미지 직접 삽입',
    useCase2: '<strong>API 인증:</strong> HTTP Basic Authentication',
    useCase3: '<strong>이메일:</strong> 첨부 파일 인코딩',
    useCase4: '<strong>JWT:</strong> JSON Web Token 페이로드',
    relatedTools: '🔗 관련 도구',
    urlEncoderTool: 'URL 인코더/디코더',
    urlEncoderDesc: 'URL 특수문자 변환',
    jsonFormatterTool: 'JSON 포맷터',
    jsonFormatterDesc: 'JSON 정렬 및 검증',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'Base64란 무엇인가요?',
          answer: 'Base64는 바이너리 데이터를 ASCII 문자열로 변환하는 인코딩 방식입니다. 이메일 첨부파일, 이미지 데이터 URI, API 인증 등에서 널리 사용됩니다.',
        },
        {
          question: '왜 Base64를 사용하나요?',
          answer: 'HTML, JSON, XML 등 텍스트 기반 형식에서 바이너리 데이터(이미지, 파일 등)를 안전하게 포함시키기 위해 사용합니다.',
        },
        {
          question: 'Base64 인코딩하면 크기가 커지나요?',
          answer: '네, Base64로 인코딩하면 원본보다 약 33% 크기가 증가합니다. 3바이트를 4개의 ASCII 문자로 변환하기 때문입니다.',
        },
      ],
    },
  },
  en: {
    title: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to original text.',
    encodeTab: 'Encode',
    decodeTab: 'Decode',
    inputLabel: 'Input',
    outputLabel: 'Result',
    encodeButton: 'Encode to Base64',
    decodeButton: 'Decode to Text',
    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied!',
    encodePlaceholder: 'Enter text to encode',
    decodePlaceholder: 'Enter Base64 string',
    error: 'Conversion error: Invalid input',
    example: '📝 Example',
    originalText: 'Original Text',
    base64Encoded: 'Base64 Encoded',
    explanationTitle: 'Base64 Encoding Explained',
    explanationDesc: '<strong>Base64</strong> is an encoding method that converts binary data into 64 ASCII characters (A-Z, a-z, 0-9, +, /). This tool supports UTF-8, allowing accurate encoding/decoding of various characters including Korean.',
    useCases: 'Use Cases',
    useCase1: '<strong>Data URI:</strong> Embed images directly in HTML/CSS',
    useCase2: '<strong>API Authentication:</strong> HTTP Basic Authentication',
    useCase3: '<strong>Email:</strong> Attachment encoding',
    useCase4: '<strong>JWT:</strong> JSON Web Token payload',
    relatedTools: '🔗 Related Tools',
    urlEncoderTool: 'URL Encoder/Decoder',
    urlEncoderDesc: 'URL special character conversion',
    jsonFormatterTool: 'JSON Formatter',
    jsonFormatterDesc: 'JSON formatting and validation',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is Base64?',
          answer: 'Base64 is an encoding method that converts binary data to ASCII strings. It is widely used in email attachments, image data URIs, API authentication, and more.',
        },
        {
          question: 'Why use Base64?',
          answer: 'It is used to safely include binary data (images, files, etc.) in text-based formats like HTML, JSON, and XML.',
        },
        {
          question: 'Does Base64 encoding increase the size?',
          answer: 'Yes, Base64 encoding increases the size by about 33% compared to the original. This is because 3 bytes are converted to 4 ASCII characters.',
        },
      ],
    },
  },
};

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'base64');

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
      // UTF-8 지원 인코딩
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch {
      setError(t.error);
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      // UTF-8 지원 디코딩
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch {
      setError(t.error);
      setOutput('');
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
    setError('');
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
            onClick={() => { setMode('encode'); setInput(''); setOutput(''); setError(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.encodeTab}
          </button>
          <button
            onClick={() => { setMode('decode'); setInput(''); setOutput(''); setError(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.decodeTab}
          </button>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.inputLabel}</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                placeholder={mode === 'encode' ? t.encodePlaceholder : t.decodePlaceholder}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={mode === 'encode' ? handleEncode : handleDecode}
                disabled={!input}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {mode === 'encode' ? t.encodeButton : t.decodeButton}
              </button>
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
                  className="w-full h-40 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none bg-gray-50"
                />
              </div>
            )}
          </div>
        </section>

        {/* 예시 */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 예시</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">원본 텍스트</div>
              <code className="text-sm">Hello, 안녕하세요!</code>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Base64 인코딩</div>
              <code className="text-sm break-all">SGVsbG8sIOyViOuFlO2VmOyEuOyalCE=</code>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Base64 인코딩 설명</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Base64</strong>는 바이너리 데이터를 64개의 ASCII 문자(A-Z, a-z, 0-9, +, /)로 변환하는 인코딩 방식입니다.
              이 도구는 UTF-8을 지원하여 한글도 정확하게 인코딩/디코딩할 수 있습니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">활용 분야</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Data URI:</strong> HTML/CSS에 이미지 직접 삽입</li>
              <li><strong>API 인증:</strong> HTTP Basic Authentication</li>
              <li><strong>이메일:</strong> 첨부 파일 인코딩</li>
              <li><strong>JWT:</strong> JSON Web Token 페이로드</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/url-encoder" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">URL 인코더/디코더</h3>
              <p className="text-sm text-gray-600 mt-1">URL 특수문자 변환</p>
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
