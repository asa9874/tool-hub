import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '반응 속도 테스트',
    description: '화면 색상이 변하면 최대한 빨리 클릭하세요!',
    instructions: '아래 영역을 클릭하여 시작하세요',
    waiting: '초록색이 되면 클릭하세요!',
    ready: '기다리세요...',
    click: '지금 클릭!',
    tooSoon: '너무 일찍 클릭했습니다!',
    tryAgain: '다시 시도',
    yourTime: '반응 속도',
    ms: 'ms',
    average: '평균',
    best: '최고 기록',
    attempts: '시도 횟수',
    ranking: '등급',
    rankings: {
      excellent: '⚡ 번개',
      great: '🚀 초고속',
      good: '🏃 빠름',
      average: '👍 보통',
      slow: '🐢 느림',
    },
    share: '결과 공유',
    copied: '복사됨!',
    reset: '기록 초기화',
  },
  en: {
    title: 'Reaction Time Test',
    description: 'Click as fast as you can when the screen turns green!',
    instructions: 'Click the area below to start',
    waiting: 'Click when it turns green!',
    ready: 'Wait...',
    click: 'Click now!',
    tooSoon: 'Too soon!',
    tryAgain: 'Try Again',
    yourTime: 'Reaction Time',
    ms: 'ms',
    average: 'Average',
    best: 'Best',
    attempts: 'Attempts',
    ranking: 'Rank',
    rankings: {
      excellent: '⚡ Lightning',
      great: '🚀 Super Fast',
      good: '🏃 Fast',
      average: '👍 Average',
      slow: '🐢 Slow',
    },
    share: 'Share Result',
    copied: 'Copied!',
    reset: 'Reset Records',
  }
};

type GameState = 'idle' | 'waiting' | 'ready' | 'tooSoon' | 'result';

export default function ReactionTest() {
  const { t } = useLocalizedContent(i18n);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRanking = useCallback((time: number) => {
    if (time < 200) return t.rankings.excellent;
    if (time < 250) return t.rankings.great;
    if (time < 300) return t.rankings.good;
    if (time < 400) return t.rankings.average;
    return t.rankings.slow;
  }, [t.rankings]);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);

    // 랜덤 대기 시간 (1~4초)
    const delay = 1000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'tooSoon' || gameState === 'result') {
      startGame();
    } else if (gameState === 'waiting') {
      // 너무 일찍 클릭
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState('tooSoon');
    } else if (gameState === 'ready') {
      // 반응 시간 측정
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setReactionTime(time);
      setResults(prev => [...prev, time]);
      setGameState('result');
    }
  };

  const resetRecords = () => {
    setResults([]);
    setReactionTime(null);
    setGameState('idle');
  };

  const shareResult = () => {
    if (!reactionTime) return;
    
    const text = `🎮 ${t.title}\n\n⏱️ ${t.yourTime}: ${reactionTime}${t.ms}\n🏆 ${t.ranking}: ${getRanking(reactionTime)}\n\nToolHub에서 테스트해보세요!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const average = results.length > 0 
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : 0;
  const best = results.length > 0 ? Math.min(...results) : 0;

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'idle': return 'bg-blue-500';
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'tooSoon': return 'bg-orange-500';
      case 'result': return 'bg-blue-600';
      default: return 'bg-blue-500';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'idle': return t.instructions;
      case 'waiting': return t.ready;
      case 'ready': return t.click;
      case 'tooSoon': return t.tooSoon;
      case 'result': return `${reactionTime}${t.ms}`;
      default: return '';
    }
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['반응 속도 테스트', '반응 시간', 'reaction test', '클릭 속도', '인간 벤치마크']}
        canonical="/tools/reaction-test"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 게임 영역 */}
          <motion.div
            onClick={handleClick}
            className={`${getBackgroundColor()} rounded-xl p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer select-none transition-colors duration-100`}
            whileTap={{ scale: 0.98 }}
          >
            {gameState === 'result' && reactionTime ? (
              <div className="text-center text-white">
                <p className="text-lg mb-2">{t.yourTime}</p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-7xl font-bold mb-4"
                >
                  {reactionTime}<span className="text-3xl">{t.ms}</span>
                </motion.p>
                <p className="text-2xl">{getRanking(reactionTime)}</p>
                <p className="mt-4 text-white/70">{t.tryAgain}</p>
              </div>
            ) : (
              <motion.p
                key={gameState}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white text-3xl font-bold text-center"
              >
                {getMessage()}
              </motion.p>
            )}
          </motion.div>

          {/* 통계 */}
          {results.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">{t.attempts}</p>
                <p className="text-2xl font-bold text-gray-800">{results.length}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600">{t.best}</p>
                <p className="text-2xl font-bold text-green-700">{best}{t.ms}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600">{t.average}</p>
                <p className="text-2xl font-bold text-blue-700">{average}{t.ms}</p>
              </div>
            </div>
          )}

          {/* 버튼들 */}
          {results.length > 0 && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={shareResult}
                disabled={!reactionTime}
                className="flex-1 py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {copied ? t.copied : t.share}
              </button>
              <button
                onClick={resetRecords}
                className="py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t.reset}
              </button>
            </div>
          )}

          {/* 등급표 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">{t.ranking}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div className="text-center p-2 bg-purple-100 rounded">
                <p>{t.rankings.excellent}</p>
                <p className="text-gray-500">&lt; 200ms</p>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded">
                <p>{t.rankings.great}</p>
                <p className="text-gray-500">200-250ms</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p>{t.rankings.good}</p>
                <p className="text-gray-500">250-300ms</p>
              </div>
              <div className="text-center p-2 bg-yellow-100 rounded">
                <p>{t.rankings.average}</p>
                <p className="text-gray-500">300-400ms</p>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded">
                <p>{t.rankings.slow}</p>
                <p className="text-gray-500">&gt; 400ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
