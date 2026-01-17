import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '동전 던지기',
    description: '3D 애니메이션으로 동전을 던져 앞면/뒷면을 결정하세요',
    flip: '던지기!',
    flipping: '던지는 중...',
    heads: '앞면',
    tails: '뒷면',
    result: '결과',
    history: '기록',
    reset: '기록 초기화',
    stats: '통계',
    total: '총 횟수',
    headsCount: '앞면',
    tailsCount: '뒷면',
    clickToFlip: '버튼을 눌러 동전을 던지세요',
  },
  en: {
    title: 'Coin Flip',
    description: 'Flip a coin with 3D animation to decide heads or tails',
    flip: 'Flip!',
    flipping: 'Flipping...',
    heads: 'Heads',
    tails: 'Tails',
    result: 'Result',
    history: 'History',
    reset: 'Reset History',
    stats: 'Statistics',
    total: 'Total',
    headsCount: 'Heads',
    tailsCount: 'Tails',
    clickToFlip: 'Click the button to flip the coin',
  }
};

type CoinResult = 'heads' | 'tails';

export default function CoinFlip() {
  const { t } = useLocalizedContent(i18n);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinResult | null>(null);
  const [history, setHistory] = useState<CoinResult[]>([]);
  const [rotation, setRotation] = useState(0);

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    const newResult: CoinResult = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // 3D 회전: 앞면이면 짝수 바퀴, 뒷면이면 홀수 바퀴 + 180도
    const baseRotation = rotation + 1800; // 5바퀴
    const finalRotation = newResult === 'heads' 
      ? baseRotation 
      : baseRotation + 180;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 19)]);
      setIsFlipping(false);
    }, 1500);
  };

  const headsCount = history.filter(r => r === 'heads').length;
  const tailsCount = history.filter(r => r === 'tails').length;

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">{t.title}</h1>
          <p className="text-yellow-100 text-center mb-6">{t.description}</p>

          {/* 동전 */}
          <div className="flex justify-center mb-8" style={{ perspective: '1000px' }}>
            <motion.div
              animate={{ rotateX: rotation }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="relative w-40 h-40"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 앞면 */}
              <div
                className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-600 flex items-center justify-center shadow-lg"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <span className="text-5xl">👑</span>
                  <p className="text-yellow-800 font-bold mt-1">{t.heads}</p>
                </div>
              </div>
              {/* 뒷면 */}
              <div
                className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700 flex items-center justify-center shadow-lg"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              >
                <div className="text-center">
                  <span className="text-5xl">🌟</span>
                  <p className="text-yellow-800 font-bold mt-1">{t.tails}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 결과 */}
          {result && !isFlipping && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-6"
            >
              <p className="text-yellow-100 text-sm">{t.result}</p>
              <p className="text-4xl font-bold">
                {result === 'heads' ? `👑 ${t.heads}` : `🌟 ${t.tails}`}
              </p>
            </motion.div>
          )}

          {!result && !isFlipping && (
            <p className="text-center text-yellow-100 mb-6">{t.clickToFlip}</p>
          )}

          {/* 버튼 */}
          <button
            onClick={flipCoin}
            disabled={isFlipping}
            className="w-full py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-yellow-50 disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-lg shadow-lg"
          >
            {isFlipping ? t.flipping : t.flip}
          </button>
        </div>

        {/* 통계 및 기록 */}
        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t.stats}</h2>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-red-500 hover:text-red-600"
              >
                {t.reset}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{history.length}</p>
                <p className="text-sm text-gray-500">{t.total}</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{headsCount}</p>
                <p className="text-sm text-gray-500">{t.headsCount} ({history.length > 0 ? ((headsCount / history.length) * 100).toFixed(0) : 0}%)</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{tailsCount}</p>
                <p className="text-sm text-gray-500">{t.tailsCount} ({history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(0) : 0}%)</p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-2">{t.history}</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((r, i) => (
                <span
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    r === 'heads' ? 'bg-yellow-100' : 'bg-amber-100'
                  }`}
                >
                  {r === 'heads' ? '👑' : '🌟'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
