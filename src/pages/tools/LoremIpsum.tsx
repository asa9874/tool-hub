import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

// Lorem Ipsum 기본 텍스트
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

const LOREM_FIRST = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const i18n = {
  ko: {
    title: 'Lorem Ipsum 생성기',
    description: '웹사이트, 앱, 문서 디자인에 사용할 더미 텍스트(Lorem Ipsum)를 생성합니다.',
    paragraphs: '문단',
    sentences: '문장',
    words: '단어',
    generate: '생성하기',
    copyButton: '복사',
    copied: '복사됨!',
    startWithLorem: '"Lorem ipsum..."으로 시작',
    amount: '개수',
    generateUnit: '생성 단위',
    generatedText: '생성된 텍스트',
    charCount: '글자 수',
    wordCount: '단어 수',
    howToUse: 'Lorem Ipsum 사용법',
    howToUseDescription: '<strong>Lorem Ipsum</strong> 생성기는 웹사이트, 앱, 인쇄물 등의 디자인 작업 시 실제 콘텐츠가 준비되기 전에 레이아웃을 미리보기 위한 더미 텍스트를 생성합니다.',
    useCases: '활용 분야',
    useCase1: '<strong>웹 디자인:</strong> 웹페이지 레이아웃 목업 제작',
    useCase2: '<strong>앱 디자인:</strong> UI/UX 프로토타입 테스트',
    useCase3: '<strong>인쇄물:</strong> 브로셔, 포스터 레이아웃',
    useCase4: '<strong>프레젠테이션:</strong> 슬라이드 템플릿 미리보기',
    relatedTools: '🔗 관련 도구',
    characterCounterTool: '글자수 세기',
    characterCounterDesc: '텍스트 글자 수 계산',
    jsonFormatterTool: 'JSON 포맷터',
    jsonFormatterDesc: 'JSON 정렬 및 검증',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'Lorem Ipsum이란 무엇인가요?',
          answer: 'Lorem Ipsum은 출판 및 디자인 업계에서 사용하는 표준 더미 텍스트입니다. 1500년대부터 사용되어 왔으며, 실제 텍스트 대신 레이아웃과 폰트를 미리보기 위해 사용됩니다.',
        },
        {
          question: '왜 의미 없는 텍스트를 사용하나요?',
          answer: '읽을 수 있는 텍스트를 사용하면 사람들이 내용에 집중하여 디자인 평가가 어려워집니다. Lorem Ipsum은 실제 텍스트처럼 보이지만 의미가 없어 디자인에 집중할 수 있게 해줍니다.',
        },
        {
          question: 'Lorem Ipsum의 출처는 어디인가요?',
          answer: '기원전 45년 키케로가 쓴 "de Finibus Bonorum et Malorum"(선과 악의 끝에 대하여)에서 유래했습니다. 원문의 라틴어 단어들을 변형하여 만들어졌습니다.',
        },
      ],
    },
  },
  en: {
    title: 'Lorem Ipsum Generator',
    description: 'Generate dummy text (Lorem Ipsum) for website, app, and document design.',
    paragraphs: 'Paragraphs',
    sentences: 'Sentences',
    words: 'Words',
    generate: 'Generate',
    copyButton: 'Copy',
    copied: 'Copied!',
    startWithLorem: 'Start with "Lorem ipsum..."',
    amount: 'Amount',
    generateUnit: 'Generation Unit',
    generatedText: 'Generated Text',
    charCount: 'Characters',
    wordCount: 'Words',
    howToUse: 'How to Use Lorem Ipsum',
    howToUseDescription: 'The <strong>Lorem Ipsum</strong> generator creates dummy text for previewing layouts before actual content is ready for design work on websites, apps, print materials, etc.',
    useCases: 'Use Cases',
    useCase1: '<strong>Web Design:</strong> Creating webpage layout mockups',
    useCase2: '<strong>App Design:</strong> UI/UX prototype testing',
    useCase3: '<strong>Print Materials:</strong> Brochure, poster layouts',
    useCase4: '<strong>Presentations:</strong> Slide template preview',
    relatedTools: '🔗 Related Tools',
    characterCounterTool: 'Character Counter',
    characterCounterDesc: 'Count text characters',
    jsonFormatterTool: 'JSON Formatter',
    jsonFormatterDesc: 'JSON formatting and validation',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is Lorem Ipsum?',
          answer: 'Lorem Ipsum is standard dummy text used in the publishing and design industry. It has been used since the 1500s to preview layouts and fonts instead of actual text.',
        },
        {
          question: 'Why use meaningless text?',
          answer: 'When using readable text, people focus on the content making design evaluation difficult. Lorem Ipsum looks like real text but has no meaning, allowing focus on the design.',
        },
        {
          question: 'Where does Lorem Ipsum come from?',
          answer: 'It originated from "de Finibus Bonorum et Malorum" (On the Ends of Good and Evil) written by Cicero in 45 BC. It was created by modifying Latin words from the original text.',
        },
      ],
    },
  },
};

type GenerateType = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsum() {
  const [type, setType] = useState<GenerateType>('paragraphs');
  const [amount, setAmount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'lorem-ipsum');

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

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = (minWords = 5, maxWords = 15): string => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({ length: wordCount }, getRandomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const generateParagraph = (minSentences = 3, maxSentences = 7): string => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
  };

  const generate = () => {
    let result = '';

    if (type === 'words') {
      const words = Array.from({ length: amount }, getRandomWord);
      if (startWithLorem && amount >= 2) {
        words[0] = 'Lorem';
        words[1] = 'ipsum';
      }
      result = words.join(' ');
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: amount }, () => generateSentence());
      if (startWithLorem) {
        sentences[0] = LOREM_FIRST;
      }
      result = sentences.join(' ');
    } else {
      const paragraphs = Array.from({ length: amount }, () => generateParagraph());
      if (startWithLorem) {
        paragraphs[0] = LOREM_FIRST + ' ' + generateParagraph(2, 5);
      }
      result = paragraphs.join('\n\n');
    }

    setOutput(result);
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

  const types = [
    { id: 'paragraphs', label: t.paragraphs },
    { id: 'sentences', label: t.sentences },
    { id: 'words', label: t.words },
  ] as const;

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

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-6">
            {/* 타입 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">생성 단위</label>
              <div className="flex gap-2">
                {types.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setType(item.id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      type === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 개수 입력 */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                {t.amount}
              </label>
              <input
                type="number"
                id="amount"
                min={1}
                max={100}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 옵션 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{t.startWithLorem}</span>
            </label>

            {/* 생성 버튼 */}
            <button
              onClick={generate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t.generate}
            </button>
          </div>
        </section>

        {/* 결과 */}
        {output && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">생성된 텍스트</h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copied ? t.copied : t.copyButton}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{output}</p>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              글자 수: {output.length.toLocaleString()} | 단어 수: {output.split(/\s+/).length.toLocaleString()}
            </div>
          </section>
        )}

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lorem Ipsum 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Lorem Ipsum</strong> 생성기는 웹사이트, 앱, 인쇄물 등의 디자인 작업 시 
              실제 콘텐츠가 준비되기 전에 레이아웃을 미리보기 위한 더미 텍스트를 생성합니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">활용 분야</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>웹 디자인:</strong> 웹페이지 레이아웃 목업 제작</li>
              <li><strong>앱 디자인:</strong> UI/UX 프로토타입 테스트</li>
              <li><strong>인쇄물:</strong> 브로셔, 포스터 레이아웃</li>
              <li><strong>프레젠테이션:</strong> 슬라이드 템플릿 미리보기</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/character-counter" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">글자수 세기</h3>
              <p className="text-sm text-gray-600 mt-1">텍스트 글자 수 계산</p>
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
