import { useState, useCallback, useRef } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 모스 부호 매핑
const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/',
};

// 역방향 매핑
const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

const i18n = {
  ko: {
    title: '모스 부호 변환기',
    subtitle: '텍스트를 모스 부호로, 모스 부호를 텍스트로 변환합니다',
    description: '영문 텍스트와 모스 부호 간 상호 변환을 지원합니다.',
    textToMorse: '텍스트 → 모스 부호',
    morseToText: '모스 부호 → 텍스트',
    inputText: '텍스트 입력',
    inputMorse: '모스 부호 입력',
    outputMorse: '모스 부호 결과',
    outputText: '텍스트 결과',
    textPlaceholder: '영문, 숫자, 일부 특수문자를 입력하세요...',
    morsePlaceholder: '점(.)과 대시(-), 공백으로 구분된 모스 부호를 입력하세요...',
    copy: '복사',
    copied: '복사됨!',
    clear: '초기화',
    play: '▶ 소리 재생',
    stop: '■ 정지',
    playing: '재생 중...',
    speed: '속도',
    slow: '느림',
    normal: '보통',
    fast: '빠름',
    morseTable: '모스 부호표',
    letters: '알파벳',
    numbers: '숫자',
    punctuation: '구두점',
    faq: {
      q1: '모스 부호란 무엇인가요?',
      a1: '모스 부호는 1830년대 새뮤얼 모스가 발명한 통신 방식입니다. 짧은 신호(점, .)와 긴 신호(대시, -)의 조합으로 문자를 표현합니다. 전신, 해상 통신 등에 사용되었으며, 현재도 비상 통신이나 교육 목적으로 활용됩니다.',
      q2: '한글도 변환할 수 있나요?',
      a2: '현재는 영문 알파벳, 숫자, 일부 특수문자만 지원합니다. 한글을 변환하려면 먼저 영문으로 로마자 표기한 후 변환하세요. 예: "안녕" → "annyeong" → ".- -. -. -.-- . --- -. --."',
      q3: 'SOS 신호는 어떻게 표현하나요?',
      a3: 'SOS는 국제 조난 신호로, "... --- ..." (점 3개, 대시 3개, 점 3개)로 표현합니다. 이 조합은 기억하기 쉽고 구별하기 쉬워 비상 신호로 채택되었습니다.',
    },
  },
};

export default function MorseCode() {
  const lang = 'ko';
  const t = i18n[lang];

  const [mode, setMode] = useState<'toMorse' | 'toText'>('toMorse');
  const [textInput, setTextInput] = useState('');
  const [morseInput, setMorseInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const audioContextRef = useRef<AudioContext | null>(null);
  const isStoppedRef = useRef(false);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'morse-code');

  // 텍스트 → 모스 부호
  const textToMorse = useCallback((text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => MORSE_CODE[char] || char)
      .join(' ')
      .replace(/  +/g, ' / ');
  }, []);

  // 모스 부호 → 텍스트
  const morseToText = useCallback((morse: string): string => {
    return morse
      .split(' / ')
      .map((word) =>
        word
          .split(' ')
          .map((code) => REVERSE_MORSE[code] || code)
          .join('')
      )
      .join(' ');
  }, []);

  // 모스 부호 결과
  const morseResult = mode === 'toMorse' ? textToMorse(textInput) : '';
  const textResult = mode === 'toText' ? morseToText(morseInput) : '';

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
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

  const handleCopy = async () => {
    const text = mode === 'toMorse' ? morseResult : textResult;
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setTextInput('');
    setMorseInput('');
  };

  // 모스 부호 소리 재생
  const playMorse = async () => {
    const morse = mode === 'toMorse' ? morseResult : morseInput;
    if (!morse || isPlaying) return;

    setIsPlaying(true);
    isStoppedRef.current = false;

    const speedMultiplier = speed === 'slow' ? 1.5 : speed === 'fast' ? 0.6 : 1;
    const dotDuration = 100 * speedMultiplier;
    const dashDuration = dotDuration * 3;
    const gapDuration = dotDuration;
    const letterGap = dotDuration * 3;
    const wordGap = dotDuration * 7;

    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    const playTone = (duration: number): Promise<void> => {
      return new Promise((resolve) => {
        if (isStoppedRef.current || !audioContextRef.current) {
          resolve();
          return;
        }
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          resolve();
        }, duration);
      });
    };

    const wait = (ms: number): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    for (const char of morse) {
      if (isStoppedRef.current) break;
      if (char === '.') {
        await playTone(dotDuration);
        await wait(gapDuration);
      } else if (char === '-') {
        await playTone(dashDuration);
        await wait(gapDuration);
      } else if (char === ' ') {
        await wait(letterGap);
      } else if (char === '/') {
        await wait(wordGap);
      }
    }

    setIsPlaying(false);
    audioContextRef.current?.close();
  };

  const stopMorse = () => {
    isStoppedRef.current = true;
    setIsPlaying(false);
    audioContextRef.current?.close();
  };

  // 모스 부호표 데이터
  const morseTableData = {
    letters: Object.entries(MORSE_CODE).filter(([k]) => /^[A-Z]$/.test(k)),
    numbers: Object.entries(MORSE_CODE).filter(([k]) => /^[0-9]$/.test(k)),
    punctuation: Object.entries(MORSE_CODE).filter(([k]) => /^[^A-Z0-9 ]$/.test(k)),
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">📡 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 모드 선택 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('toMorse')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                mode === 'toMorse' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
              }`}
            >
              {t.textToMorse}
            </button>
            <button
              onClick={() => setMode('toText')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                mode === 'toText' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
              }`}
            >
              {t.morseToText}
            </button>
          </div>

          {mode === 'toMorse' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.inputText}
                </label>
                <textarea
                  id="textInput"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder={t.textPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.outputMorse}</label>
                <div className="w-full min-h-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg tracking-wider">
                  {morseResult || <span className="text-gray-400">...</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="morseInput" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.inputMorse}
                </label>
                <textarea
                  id="morseInput"
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder={t.morsePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.outputText}</label>
                <div className="w-full min-h-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-lg">
                  {textResult || <span className="text-gray-400">...</span>}
                </div>
              </div>
            </div>
          )}

          {/* 컨트롤 버튼 */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleCopy}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {copied ? '✓ ' + t.copied : t.copy}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t.clear}
            </button>

            {/* 재생 컨트롤 */}
            <div className="flex items-center gap-3 ml-auto">
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value as 'slow' | 'normal' | 'fast')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="slow">{t.slow}</option>
                <option value="normal">{t.normal}</option>
                <option value="fast">{t.fast}</option>
              </select>
              {isPlaying ? (
                <button
                  onClick={stopMorse}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  {t.stop}
                </button>
              ) : (
                <button
                  onClick={playMorse}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  {t.play}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 모스 부호표 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 {t.morseTable}</h2>

          <div className="space-y-6">
            {/* 알파벳 */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{t.letters}</h3>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {morseTableData.letters.map(([char, morse]) => (
                  <div key={char} className="p-2 bg-indigo-50 rounded text-center">
                    <span className="font-bold text-indigo-700">{char}</span>
                    <span className="block text-xs font-mono text-gray-600">{morse}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 숫자 */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{t.numbers}</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {morseTableData.numbers.map(([char, morse]) => (
                  <div key={char} className="p-2 bg-green-50 rounded text-center">
                    <span className="font-bold text-green-700">{char}</span>
                    <span className="block text-xs font-mono text-gray-600">{morse}</span>
                  </div>
                ))}
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 모스 부호 변환기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>모스 부호 변환기</strong>는 영문 텍스트를 모스 부호로 변환하거나, 반대로 모스 부호를 텍스트로 해석하는 도구입니다.
              영화나 게임에서 등장하는 암호를 풀거나, 모스 부호를 배우고 싶을 때 유용합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              변환된 모스 부호는 소리로도 재생할 수 있습니다. 재생 속도를 조절하여 천천히 들으며 학습하거나, 빠르게 들으며 익숙해질 수
              있습니다. 점(.)은 짧은 소리, 대시(-)는 긴 소리로 재생됩니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              모스 부호 입력 시에는 점(.)과 대시(-), 공백으로 문자를 구분하고, 슬래시(/)로 단어를 구분합니다. 예를 들어 "SOS"는 "... --- ..."로
              표현됩니다. 모스 부호표를 참고하여 직접 암호를 만들어보세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
