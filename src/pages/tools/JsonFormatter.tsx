import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: 'JSON 포맷터 & 검증기',
    description: 'JSON 코드를 예쁘게 정렬하고 문법 오류를 검사합니다. 개발자 필수 도구.',
    inputLabel: 'JSON 입력',
    outputLabel: '결과',
    formatButton: '포맷팅',
    minifyButton: '압축',
    validateButton: '검증',
    copyButton: '복사',
    clearButton: '지우기',
    copied: '복사됨!',
    valid: '✓ 유효한 JSON입니다',
    invalid: '✗ JSON 오류',
    placeholder: '{"name": "홍길동", "age": 25}',
    outputPlaceholder: '결과가 여기에 표시됩니다',
    howToUse: 'JSON 포맷터 사용법',
    howToUseDescription: '이 <strong>JSON 포맷터</strong>는 개발자들이 JSON 데이터를 쉽게 읽고 검증할 수 있도록 도와주는 도구입니다. 한 줄로 된 JSON을 예쁘게 들여쓰기(Pretty Print)하거나, 반대로 압축(Minify)할 수 있습니다.',
    keyFeatures: '주요 기능',
    feature1: '<strong>포맷팅:</strong> JSON을 2칸 들여쓰기로 예쁘게 정렬',
    feature2: '<strong>압축:</strong> 공백과 줄바꿈을 제거하여 한 줄로 압축',
    feature3: '<strong>검증:</strong> JSON 문법 오류 검사 및 오류 위치 표시',
    feature4: '<strong>복사:</strong> 결과를 클립보드에 복사',
    relatedTools: '🔗 관련 도구',
    base64Tool: 'Base64 인코더/디코더',
    base64Desc: '텍스트/이미지 Base64 변환',
    urlEncoderTool: 'URL 인코더/디코더',
    urlEncoderDesc: 'URL 특수문자 변환',
    loremIpsumTool: 'Lorem Ipsum 생성기',
    loremIpsumDesc: '테스트용 더미 텍스트',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'JSON이란 무엇인가요?',
          answer: 'JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하는 데 사용되는 가벼운 데이터 형식입니다. 사람이 읽기 쉽고 기계가 파싱하기 쉬운 구조로 되어 있습니다.',
        },
        {
          question: 'JSON 포맷팅은 왜 필요한가요?',
          answer: '한 줄로 된 JSON은 읽기 어렵습니다. 포맷팅(들여쓰기)을 하면 데이터 구조를 한눈에 파악할 수 있어 디버깅과 코드 리뷰가 쉬워집니다.',
        },
        {
          question: 'JSON 압축(Minify)은 언제 사용하나요?',
          answer: 'API 통신이나 저장 시 파일 크기를 줄이기 위해 사용합니다. 줄바꿈과 공백을 제거하여 데이터 전송량을 줄일 수 있습니다.',
        },
      ],
    },
  },
  en: {
    title: 'JSON Formatter & Validator',
    description: 'Format JSON code beautifully and check for syntax errors. Essential tool for developers.',
    inputLabel: 'JSON Input',
    outputLabel: 'Result',
    formatButton: 'Format',
    minifyButton: 'Minify',
    validateButton: 'Validate',
    copyButton: 'Copy',
    clearButton: 'Clear',
    copied: 'Copied!',
    valid: '✓ Valid JSON',
    invalid: '✗ JSON Error',
    placeholder: '{"name": "John Doe", "age": 25}',
    outputPlaceholder: 'Result will appear here',
    howToUse: 'How to Use JSON Formatter',
    howToUseDescription: 'This <strong>JSON Formatter</strong> helps developers easily read and validate JSON data. You can pretty print a single-line JSON with indentation, or conversely minify it.',
    keyFeatures: 'Key Features',
    feature1: '<strong>Format:</strong> Pretty print JSON with 2-space indentation',
    feature2: '<strong>Minify:</strong> Remove whitespace and line breaks to compress into one line',
    feature3: '<strong>Validate:</strong> Check JSON syntax errors and show error location',
    feature4: '<strong>Copy:</strong> Copy result to clipboard',
    relatedTools: '🔗 Related Tools',
    base64Tool: 'Base64 Encoder/Decoder',
    base64Desc: 'Text/Image Base64 conversion',
    urlEncoderTool: 'URL Encoder/Decoder',
    urlEncoderDesc: 'URL special character conversion',
    loremIpsumTool: 'Lorem Ipsum Generator',
    loremIpsumDesc: 'Dummy text for testing',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is JSON?',
          answer: 'JSON (JavaScript Object Notation) is a lightweight data format used to store and transmit data. It has a structure that is easy for humans to read and easy for machines to parse.',
        },
        {
          question: 'Why is JSON formatting necessary?',
          answer: 'Single-line JSON is hard to read. Formatting (indentation) allows you to see the data structure at a glance, making debugging and code review easier.',
        },
        {
          question: 'When should I use JSON Minify?',
          answer: 'Use it to reduce file size during API communication or storage. By removing line breaks and spaces, you can reduce the amount of data transmitted.',
        },
      ],
    },
  },
};

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'json-formatter');

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

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setStatus('valid');
      setErrorMessage('');
    } catch (e) {
      setStatus('invalid');
      setErrorMessage((e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus('valid');
      setErrorMessage('');
    } catch (e) {
      setStatus('invalid');
      setErrorMessage((e as Error).message);
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setStatus('valid');
      setErrorMessage('');
    } catch (e) {
      setStatus('invalid');
      setErrorMessage((e as Error).message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output || input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStatus('idle');
    setErrorMessage('');
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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        {/* 상태 표시 */}
        {status !== 'idle' && (
          <div className={`mb-4 p-3 rounded-lg ${status === 'valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status === 'valid' ? t.valid : `${t.invalid}: ${errorMessage}`}
          </div>
        )}

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 버튼들 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={formatJson}
              disabled={!input}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.formatButton}
            </button>
            <button
              onClick={minifyJson}
              disabled={!input}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.minifyButton}
            </button>
            <button
              onClick={validateJson}
              disabled={!input}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.validateButton}
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleCopy}
              disabled={!output && !input}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? t.copied : t.copyButton}
            </button>
            <button
              onClick={handleClear}
              disabled={!input && !output}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.clearButton}
            </button>
          </div>

          {/* 입력/출력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.inputLabel}</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.placeholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.outputLabel}</label>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg resize-none bg-gray-50"
                placeholder="결과가 여기에 표시됩니다"
              />
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON 포맷터 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>JSON 포맷터</strong>는 개발자들이 JSON 데이터를 쉽게 읽고 검증할 수 있도록 도와주는 도구입니다.
              한 줄로 된 JSON을 예쁘게 들여쓰기(Pretty Print)하거나, 반대로 압축(Minify)할 수 있습니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">주요 기능</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>포맷팅:</strong> JSON을 2칸 들여쓰기로 예쁘게 정렬</li>
              <li><strong>압축:</strong> 공백과 줄바꿈을 제거하여 한 줄로 압축</li>
              <li><strong>검증:</strong> JSON 문법 오류 검사 및 오류 위치 표시</li>
              <li><strong>복사:</strong> 결과를 클립보드에 복사</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/tools/base64" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">Base64 인코더/디코더</h3>
              <p className="text-sm text-gray-600 mt-1">텍스트/이미지 Base64 변환</p>
            </Link>
            <Link to="/tools/url-encoder" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">URL 인코더/디코더</h3>
              <p className="text-sm text-gray-600 mt-1">URL 특수문자 변환</p>
            </Link>
            <Link to="/tools/lorem-ipsum" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">Lorem Ipsum 생성기</h3>
              <p className="text-sm text-gray-600 mt-1">테스트용 더미 텍스트</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
