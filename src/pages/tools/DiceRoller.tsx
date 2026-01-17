import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '디지털 주사위',
    description: '1개부터 여러 개의 주사위를 동시에 굴려 합계를 확인하세요',
    roll: '굴리기!',
    rolling: '굴리는 중...',
    diceCount: '주사위 개수',
    diceSides: '주사위 면 수',
    total: '합계',
    history: '기록',
    reset: '기록 초기화',
    clickToRoll: '버튼을 눌러 주사위를 굴리세요',
    each: '각각',
  },
  en: {
    title: 'Digital Dice Roller',
    description: 'Roll one or multiple dice simultaneously and see the total',
    roll: 'Roll!',
    rolling: 'Rolling...',
    diceCount: 'Number of Dice',
    diceSides: 'Dice Sides',
    total: 'Total',
    history: 'History',
    reset: 'Reset History',
    clickToRoll: 'Click to roll the dice',
    each: 'Each',
  }
};

const DICE_FACES: Record<number, string[]> = {
  6: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
};

export default function DiceRoller() {
  const { t } = useLocalizedContent(i18n);
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<{ results: number[]; total: number }[]>([]);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    // 애니메이션을 위한 중간 값들
    const interval = setInterval(() => {
      setResults(
        Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1)
      );
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      const finalResults = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * diceSides) + 1
      );
      setResults(finalResults);
      setHistory(prev => [
        { results: finalResults, total: finalResults.reduce((a, b) => a + b, 0) },
        ...prev.slice(0, 9)
      ]);
      setIsRolling(false);
    }, 800);
  };

  const total = results.reduce((a, b) => a + b, 0);

  const renderDice = (value: number, index: number) => {
    if (diceSides === 6 && DICE_FACES[6]) {
      return (
        <motion.div
          key={index}
          initial={{ rotateZ: 0 }}
          animate={isRolling ? { rotateZ: [0, 360, 720] } : { rotateZ: 0 }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-4xl"
        >
          {DICE_FACES[6][value - 1]}
        </motion.div>
      );
    }
    return (
      <motion.div
        key={index}
        initial={{ scale: 1 }}
        animate={isRolling ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0 }}
        className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center"
      >
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </motion.div>
    );
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-xl p-6 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">{t.title}</h1>
          <p className="text-red-100 text-center mb-6">{t.description}</p>

          {/* 설정 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-red-100 mb-1">{t.diceCount}</label>
              <select
                value={diceCount}
                onChange={(e) => {
                  setDiceCount(Number(e.target.value));
                  setResults([]);
                }}
                className="w-full p-2 rounded-lg text-gray-800"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-red-100 mb-1">{t.diceSides}</label>
              <select
                value={diceSides}
                onChange={(e) => {
                  setDiceSides(Number(e.target.value));
                  setResults([]);
                }}
                className="w-full p-2 rounded-lg text-gray-800"
              >
                {[4, 6, 8, 10, 12, 20, 100].map(n => (
                  <option key={n} value={n}>D{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 주사위 표시 영역 */}
          <div className="bg-green-800 rounded-xl p-6 mb-6 min-h-[120px]">
            {results.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {results.map((value, index) => renderDice(value, index))}
              </div>
            ) : (
              <p className="text-center text-green-200">{t.clickToRoll}</p>
            )}
          </div>

          {/* 합계 */}
          {results.length > 0 && (
            <div className="text-center mb-6">
              <p className="text-red-100 text-sm">{t.total}</p>
              <motion.p
                key={total}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-5xl font-bold"
              >
                {total}
              </motion.p>
              {diceCount > 1 && (
                <p className="text-red-200 text-sm mt-1">
                  {t.each}: {results.join(' + ')}
                </p>
              )}
            </div>
          )}

          {/* 굴리기 버튼 */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-lg shadow-lg"
          >
            {isRolling ? t.rolling : t.roll}
          </button>
        </div>

        {/* 기록 */}
        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t.history}</h2>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-red-500 hover:text-red-600"
              >
                {t.reset}
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">
                    {item.results.join(' + ')}
                  </span>
                  <span className="font-bold text-red-600">= {item.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
