import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '오늘의 포춘 쿠키',
    description: '매일 쿠키를 깨뜨려 오늘의 운세를 확인하세요',
    clickToOpen: '쿠키를 클릭하세요!',
    yourFortune: '오늘의 메시지',
    comeBackTomorrow: '내일 다시 방문해 새로운 메시지를 받아보세요!',
    newCookie: '새 쿠키 열기',
    share: '공유하기',
    copied: '복사됨!',
    fortunes: [
      '오늘 작은 친절이 큰 행운을 가져올 것입니다.',
      '기다리던 좋은 소식이 곧 도착합니다.',
      '새로운 인연이 당신을 기다리고 있습니다.',
      '용기를 내면 원하는 것을 얻을 수 있습니다.',
      '오늘의 노력이 내일의 성공이 됩니다.',
      '예상치 못한 곳에서 행운을 발견할 것입니다.',
      '마음의 평화가 모든 것을 해결합니다.',
      '오늘은 중요한 결정을 내리기 좋은 날입니다.',
      '당신의 미소가 누군가에게 희망이 됩니다.',
      '꿈을 향해 한 걸음 더 나아가세요.',
      '진정한 행복은 이미 당신 곁에 있습니다.',
      '오늘 시작한 일이 큰 결실을 맺을 것입니다.',
      '좋은 습관 하나가 인생을 바꿉니다.',
      '기회는 준비된 자에게 찾아옵니다.',
      '당신의 장점을 믿으세요.',
      '오늘의 실패는 내일의 지혜가 됩니다.',
      '감사하는 마음이 더 많은 행운을 끌어옵니다.',
      '당신은 생각보다 강합니다.',
      '작은 변화가 큰 차이를 만듭니다.',
      '오늘 하루도 충분히 잘 해내고 있습니다.',
    ],
    luckyNumbers: '행운의 숫자',
  },
  en: {
    title: "Today's Fortune Cookie",
    description: 'Break the cookie to reveal your fortune for today',
    clickToOpen: 'Click the cookie!',
    yourFortune: "Today's Message",
    comeBackTomorrow: 'Come back tomorrow for a new message!',
    newCookie: 'Open New Cookie',
    share: 'Share',
    copied: 'Copied!',
    fortunes: [
      'A small kindness today will bring great fortune.',
      'Good news you have been waiting for is coming soon.',
      'A new connection awaits you.',
      'Courage will help you achieve what you want.',
      "Today's effort becomes tomorrow's success.",
      'You will find luck in an unexpected place.',
      'Peace of mind solves everything.',
      'Today is a good day for important decisions.',
      'Your smile gives hope to someone.',
      'Take one more step toward your dream.',
      'True happiness is already beside you.',
      'What you start today will bear great fruit.',
      'One good habit can change your life.',
      'Opportunity comes to those who are prepared.',
      'Believe in your strengths.',
      "Today's failure becomes tomorrow's wisdom.",
      'A grateful heart attracts more luck.',
      'You are stronger than you think.',
      'Small changes make big differences.',
      'You are doing well enough today.',
    ],
    luckyNumbers: 'Lucky Numbers',
  }
};

export default function FortuneCookie() {
  const { t } = useLocalizedContent(i18n);
  const [isOpened, setIsOpened] = useState(false);
  const [fortune, setFortune] = useState<string>('');
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  // 오늘의 운세를 로컬 스토리지에서 확인
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('fortuneCookie');
    
    if (saved) {
      const { date, fortune: savedFortune, numbers } = JSON.parse(saved);
      if (date === today) {
        setFortune(savedFortune);
        setLuckyNumbers(numbers);
        setIsOpened(true);
      }
    }
  }, []);

  const openCookie = () => {
    if (isAnimating || isOpened) return;

    setIsAnimating(true);

    setTimeout(() => {
      // 랜덤 운세 선택
      const randomFortune = t.fortunes[Math.floor(Math.random() * t.fortunes.length)];
      
      // 행운의 숫자 생성 (1-45 중 6개)
      const numbers: number[] = [];
      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      numbers.sort((a, b) => a - b);

      setFortune(randomFortune);
      setLuckyNumbers(numbers);
      setIsOpened(true);
      setIsAnimating(false);

      // 로컬 스토리지에 저장
      const today = new Date().toDateString();
      localStorage.setItem('fortuneCookie', JSON.stringify({
        date: today,
        fortune: randomFortune,
        numbers,
      }));
    }, 800);
  };

  const resetCookie = () => {
    localStorage.removeItem('fortuneCookie');
    setIsOpened(false);
    setFortune('');
    setLuckyNumbers([]);
  };

  const shareFortune = () => {
    const text = `🥠 ${t.yourFortune}\n\n"${fortune}"\n\n${t.luckyNumbers}: ${luckyNumbers.join(', ')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['포춘쿠키', '오늘의 운세', '행운', '격언', 'fortune cookie', '운세']}
        canonical="/tools/fortune-cookie"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-xl shadow-lg p-6 min-h-[500px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t.title}</h1>
          <p className="text-gray-600 mb-8 text-center">{t.description}</p>

          <div className="flex flex-col items-center">
            {/* 쿠키 */}
            <AnimatePresence mode="wait">
              {!isOpened ? (
                <motion.div
                  key="cookie"
                  initial={{ scale: 1 }}
                  animate={isAnimating ? { 
                    scale: [1, 1.2, 0.8, 1.5, 0],
                    rotate: [0, -10, 10, -20, 20, 0],
                  } : { scale: 1 }}
                  transition={{ duration: 0.8 }}
                  onClick={openCookie}
                  className="cursor-pointer select-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <span className="text-[150px] block filter drop-shadow-lg">🥠</span>
                    {!isAnimating && (
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                      >
                        <span className="text-2xl">👆</span>
                      </motion.div>
                    )}
                  </motion.div>
                  <p className="text-center text-gray-600 font-medium mt-4">
                    {t.clickToOpen}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="fortune"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md"
                >
                  {/* 깨진 쿠키 */}
                  <div className="flex justify-center mb-6">
                    <motion.span
                      initial={{ rotate: -30, x: 20 }}
                      animate={{ rotate: -30, x: -10 }}
                      className="text-6xl"
                    >
                      🥠
                    </motion.span>
                    <motion.span
                      initial={{ rotate: 30, x: -20 }}
                      animate={{ rotate: 30, x: 10 }}
                      className="text-6xl transform scale-x-[-1]"
                    >
                      🥠
                    </motion.span>
                  </div>

                  {/* 운세 메시지 */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200"
                  >
                    <div className="text-center mb-4">
                      <span className="text-4xl">✨</span>
                      <h2 className="text-lg font-bold text-amber-800 mt-2">
                        {t.yourFortune}
                      </h2>
                    </div>

                    <p className="text-xl text-gray-800 text-center font-medium leading-relaxed mb-6">
                      "{fortune}"
                    </p>

                    {/* 행운의 숫자 */}
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-sm text-amber-700 text-center mb-2">
                        {t.luckyNumbers}
                      </p>
                      <div className="flex justify-center gap-2">
                        {luckyNumbers.map((num, index) => (
                          <motion.span
                            key={num}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                          >
                            {num}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* 버튼들 */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={shareFortune}
                      className="flex-1 py-3 px-6 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      {copied ? t.copied : t.share}
                    </button>
                    <button
                      onClick={resetCookie}
                      className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t.newCookie}
                    </button>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    {t.comeBackTomorrow}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
