import { useState } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '리스트 순서 뒤섞기',
    description: '목록의 순서를 무작위로 섞어주는 간단한 도구입니다',
    inputLabel: '항목 입력 (줄바꿈으로 구분)',
    placeholder: '항목 1\n항목 2\n항목 3\n항목 4\n항목 5',
    shuffle: '섞기!',
    shuffleAgain: '다시 섞기',
    result: '결과',
    copy: '복사하기',
    copied: '복사됨!',
    clear: '지우기',
    count: '개 항목',
    numbered: '번호 붙이기',
    animation: '애니메이션',
    examples: '예시',
    example1: '발표 순서 정하기',
    example2: '경품 추첨',
    example3: '식사 메뉴 순위',
  },
  en: {
    title: 'List Shuffler',
    description: 'A simple tool to randomly shuffle the order of your list',
    inputLabel: 'Enter items (one per line)',
    placeholder: 'Item 1\nItem 2\nItem 3\nItem 4\nItem 5',
    shuffle: 'Shuffle!',
    shuffleAgain: 'Shuffle Again',
    result: 'Result',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    count: ' items',
    numbered: 'Add Numbers',
    animation: 'Animation',
    examples: 'Examples',
    example1: 'Presentation order',
    example2: 'Prize drawing',
    example3: 'Food menu ranking',
  }
};

export default function ListShuffler() {
  const { t } = useLocalizedContent(i18n);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [numbered, setNumbered] = useState(true);
  const [animate, setAnimate] = useState(true);

  const items = input.split('\n').filter(item => item.trim());

  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffle = () => {
    if (items.length < 2) return;

    if (animate) {
      setIsShuffling(true);
      let count = 0;
      const interval = setInterval(() => {
        setResult(shuffleArray(items));
        count++;
        if (count >= 10) {
          clearInterval(interval);
          setIsShuffling(false);
        }
      }, 100);
    } else {
      setResult(shuffleArray(items));
    }
  };

  const copyResult = async () => {
    const text = result
      .map((item, i) => numbered ? `${i + 1}. ${item}` : item)
      .join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 입력 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  {t.inputLabel}
                </label>
                <span className="text-xs text-gray-500">
                  {items.length}{t.count}
                </span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full p-3 border rounded-lg resize-none h-64 font-mono text-sm"
              />
              <button
                onClick={() => setInput('')}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                {t.clear}
              </button>
            </div>

            {/* 결과 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  {t.result}
                </label>
                {result.length > 0 && (
                  <button
                    onClick={copyResult}
                    className={`text-xs px-2 py-1 rounded ${
                      copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {copied ? t.copied : t.copy}
                  </button>
                )}
              </div>
              <div className={`w-full p-3 border rounded-lg h-64 overflow-auto font-mono text-sm bg-gray-50 ${
                isShuffling ? 'animate-pulse' : ''
              }`}>
                {result.length > 0 ? (
                  result.map((item, i) => (
                    <div
                      key={i}
                      className={`py-1 ${i === 0 ? 'text-yellow-600 font-bold' : ''}`}
                    >
                      {numbered ? `${i + 1}. ` : ''}{item}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">{t.placeholder}</p>
                )}
              </div>
            </div>
          </div>

          {/* 옵션 */}
          <div className="flex gap-4 my-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={numbered}
                onChange={(e) => setNumbered(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{t.numbered}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{t.animation}</span>
            </label>
          </div>

          {/* 버튼 */}
          <button
            onClick={handleShuffle}
            disabled={items.length < 2 || isShuffling}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
          >
            🎲 {result.length > 0 ? t.shuffleAgain : t.shuffle}
          </button>

          {/* 예시 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t.examples}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { text: t.example1, items: '김철수\n이영희\n박민수\n최지현\n정대현' },
                { text: t.example2, items: 'A등급 상품\nB등급 상품\nC등급 상품\n참가상' },
                { text: t.example3, items: '치킨\n피자\n햄버거\n초밥\n짜장면\n떡볶이' },
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example.items)}
                  className="px-3 py-1 text-sm bg-white border rounded-full hover:bg-gray-100"
                >
                  {example.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
