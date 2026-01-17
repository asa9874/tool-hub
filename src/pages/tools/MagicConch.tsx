import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '마법의 소라고동',
    description: '고민을 입력하면 소라고동이 답을 내려줍니다',
    inputLabel: '소라고동에게 물어보세요',
    placeholder: '오늘 야근해야 할까요?',
    askButton: '소라고동님께 여쭤보기',
    asking: '소라고동이 생각 중...',
    tryAgain: '다시 물어보기',
    answers: [
      '그래',
      '아니',
      '다시 한 번 물어봐',
      '안 돼',
      '언젠간',
      '절대 안 돼',
      '그것도 안 돼',
      '둘 다 안 돼',
    ],
    disclaimer: '* 이 결과는 재미를 위한 것이며 실제 결정에 참고하지 마세요',
  },
  en: {
    title: 'Magic Conch Shell',
    description: 'Ask your question and the Magic Conch will give you an answer',
    inputLabel: 'Ask the Magic Conch',
    placeholder: 'Should I work overtime today?',
    askButton: 'Ask the Magic Conch',
    asking: 'Magic Conch is thinking...',
    tryAgain: 'Ask Again',
    answers: [
      'Yes',
      'No',
      'Ask again',
      "I don't think so",
      'Maybe someday',
      'Definitely not',
      'Neither',
      'Try asking tomorrow',
    ],
    disclaimer: '* This result is for fun only and should not be used for actual decisions',
  }
};

export default function MagicConch() {
  const { t } = useLocalizedContent(i18n);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [showConch, setShowConch] = useState(false);

  const ask = () => {
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    setAnswer(null);
    setShowConch(true);

    // 랜덤 딜레이 (1.5~3초)
    const delay = 1500 + Math.random() * 1500;

    setTimeout(() => {
      const randomAnswer = t.answers[Math.floor(Math.random() * t.answers.length)];
      setAnswer(randomAnswer);
      setIsAsking(false);
    }, delay);
  };

  const reset = () => {
    setQuestion('');
    setAnswer(null);
    setShowConch(false);
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['마법의 소라고동', '결정 도우미', '예스노 결정기', '랜덤 답변', 'magic conch']}
        canonical="/tools/magic-conch"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-b from-sky-100 to-blue-200 rounded-xl shadow-lg p-6 min-h-[500px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t.title}</h1>
          <p className="text-gray-600 mb-6 text-center">{t.description}</p>

          {/* 소라고동 */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={isAsking ? { 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              } : {}}
              transition={{ duration: 0.5, repeat: isAsking ? Infinity : 0 }}
              className="relative"
            >
              <div className="text-[120px] leading-none select-none">
                🐚
              </div>
              {showConch && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <span className="text-3xl">✨</span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* 질문 입력 */}
          {!answer && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                {t.inputLabel}
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask()}
                placeholder={t.placeholder}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg bg-white/80"
                disabled={isAsking}
              />
              <button
                onClick={ask}
                disabled={!question.trim() || isAsking}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {isAsking ? t.asking : t.askButton}
              </button>
            </div>
          )}

          {/* 답변 표시 */}
          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                {/* 질문 */}
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-1">Q.</p>
                  <p className="text-gray-800 font-medium">{question}</p>
                </div>

                {/* 답변 */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 shadow-lg"
                >
                  <p className="text-white text-sm mb-2">소라고동의 대답:</p>
                  <p className="text-white text-4xl font-bold">{answer}</p>
                </motion.div>

                {/* 다시 물어보기 */}
                <button
                  onClick={reset}
                  className="py-3 px-8 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {t.tryAgain}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 면책 조항 */}
          <p className="mt-8 text-center text-xs text-gray-500">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
