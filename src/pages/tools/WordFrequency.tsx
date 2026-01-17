import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '단어 빈도수 분석기',
    description: '텍스트에서 가장 많이 사용된 단어를 분석합니다',
    inputLabel: '분석할 텍스트를 입력하세요',
    placeholder: '여기에 분석할 텍스트를 붙여넣으세요...',
    analyze: '분석하기',
    clear: '지우기',
    results: '분석 결과',
    rank: '순위',
    word: '단어',
    count: '빈도',
    percentage: '비율',
    totalWords: '총 단어 수',
    uniqueWords: '고유 단어 수',
    avgLength: '평균 단어 길이',
    characters: '자',
    minLength: '최소 단어 길이',
    showTop: '상위',
    words: '개 표시',
    noText: '텍스트를 입력해주세요',
    copyResult: '결과 복사',
    copied: '복사됨!',
    excludeCommon: '일반적인 단어 제외',
  },
  en: {
    title: 'Word Frequency Analyzer',
    description: 'Analyze the most frequently used words in text',
    inputLabel: 'Enter text to analyze',
    placeholder: 'Paste your text here to analyze...',
    analyze: 'Analyze',
    clear: 'Clear',
    results: 'Analysis Results',
    rank: 'Rank',
    word: 'Word',
    count: 'Count',
    percentage: 'Percentage',
    totalWords: 'Total Words',
    uniqueWords: 'Unique Words',
    avgLength: 'Avg Word Length',
    characters: 'chars',
    minLength: 'Min Word Length',
    showTop: 'Show Top',
    words: 'words',
    noText: 'Please enter text',
    copyResult: 'Copy Result',
    copied: 'Copied!',
    excludeCommon: 'Exclude common words',
  }
};

// 제외할 일반적인 단어 (불용어)
const STOP_WORDS_KO = new Set([
  '의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다',
  '것', '수', '등', '그', '저', '이런', '저런', '그런', '어떤', '무슨', '그냥', '있다', '없다', '되다', '하다',
  '에서', '으로', '에게', '까지', '부터', '만', '더', '또', '및', '또는', '그리고', '하지만', '그러나',
]);

const STOP_WORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was',
  'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
  'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their',
]);

interface WordData {
  word: string;
  count: number;
  percentage: number;
}

export default function WordFrequency() {
  const { t } = useLocalizedContent(i18n);
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState(2);
  const [showTop, setShowTop] = useState(20);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    // 단어 추출 (한글, 영문 모두 지원)
    const words = text.toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(word => word.length >= minLength);

    if (words.length === 0) return null;

    // 불용어 필터링
    const filteredWords = excludeCommon
      ? words.filter(word => !STOP_WORDS_KO.has(word) && !STOP_WORDS_EN.has(word))
      : words;

    // 빈도 계산
    const frequency: Record<string, number> = {};
    for (const word of filteredWords) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    // 정렬 및 상위 N개 추출
    const sorted: WordData[] = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, showTop)
      .map(([word, count]) => ({
        word,
        count,
        percentage: (count / filteredWords.length) * 100,
      }));

    // 통계
    const totalWords = filteredWords.length;
    const uniqueWords = Object.keys(frequency).length;
    const avgLength = filteredWords.reduce((sum, word) => sum + word.length, 0) / totalWords;

    return {
      words: sorted,
      totalWords,
      uniqueWords,
      avgLength: avgLength.toFixed(1),
      maxCount: sorted[0]?.count || 0,
    };
  }, [text, minLength, showTop, excludeCommon]);

  const copyResult = () => {
    if (!analysis) return;

    const resultText = analysis.words
      .map((item, index) => `${index + 1}. ${item.word}: ${item.count}회 (${item.percentage.toFixed(1)}%)`)
      .join('\n');

    const fullText = `${t.results}\n\n${t.totalWords}: ${analysis.totalWords}\n${t.uniqueWords}: ${analysis.uniqueWords}\n\n${resultText}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['단어 빈도수', '텍스트 분석', 'word frequency', '단어 카운터', '글 분석']}
        canonical="/tools/word-frequency"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 입력 영역 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t.inputLabel}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />

            {/* 옵션 */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">{t.minLength}:</label>
                <select
                  value={minLength}
                  onChange={(e) => setMinLength(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}{t.characters}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">{t.showTop}:</label>
                <select
                  value={showTop}
                  onChange={(e) => setShowTop(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[10, 20, 30, 50, 100].map(n => (
                    <option key={n} value={n}>{n}{t.words}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={excludeCommon}
                  onChange={(e) => setExcludeCommon(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{t.excludeCommon}</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setText('')}
                className="py-2 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t.clear}
              </button>
              {analysis && (
                <button
                  onClick={copyResult}
                  className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {copied ? t.copied : t.copyResult}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 결과 */}
        {analysis ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.results}</h2>

            {/* 통계 카드 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600">{t.totalWords}</p>
                <p className="text-2xl font-bold text-blue-800">{analysis.totalWords.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600">{t.uniqueWords}</p>
                <p className="text-2xl font-bold text-green-800">{analysis.uniqueWords.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-600">{t.avgLength}</p>
                <p className="text-2xl font-bold text-purple-800">{analysis.avgLength}</p>
              </div>
            </div>

            {/* 단어 목록 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">{t.rank}</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">{t.word}</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">{t.count}</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-1/3">{t.percentage}</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.words.map((item, index) => (
                    <tr key={item.word} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{item.word}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{item.count}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                              style={{ width: `${(item.count / analysis.maxCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : text.trim() ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
            {t.noText}
          </div>
        ) : null}
      </div>
    </>
  );
}
