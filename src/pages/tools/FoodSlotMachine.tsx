import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '음식 메뉴 슬롯머신',
    description: '오늘 뭐 먹지? 슬롯머신을 돌려 메뉴를 결정하세요!',
    spin: '레버 당기기!',
    spinning: '돌아가는 중...',
    result: '오늘의 메뉴는',
    tryAgain: '다시 돌리기',
    categories: {
      korean: '한식',
      chinese: '중식',
      japanese: '일식',
      western: '양식',
      snack: '분식',
      fast: '패스트푸드',
    },
    foods: {
      korean: ['김치찌개', '된장찌개', '불고기', '비빔밥', '삼겹살', '갈비탕', '냉면', '제육볶음'],
      chinese: ['짜장면', '짬뽕', '탕수육', '볶음밥', '마파두부', '깐풍기', '양장피', '유린기'],
      japanese: ['초밥', '라멘', '돈카츠', '우동', '덴푸라', '카레', '오므라이스', '규동'],
      western: ['파스타', '피자', '스테이크', '리조또', '햄버거', '샐러드', '수프', '샌드위치'],
      snack: ['떡볶이', '순대', '튀김', '김밥', '라면', '쫄면', '어묵탕', '만두'],
      fast: ['치킨', '버거', '감자튀김', '핫도그', '타코', '피자', '도넛', '아이스크림'],
    },
  },
  en: {
    title: 'Food Slot Machine',
    description: "What to eat today? Spin the slot machine to decide!",
    spin: 'Pull the Lever!',
    spinning: 'Spinning...',
    result: "Today's menu is",
    tryAgain: 'Spin Again',
    categories: {
      korean: 'Korean',
      chinese: 'Chinese',
      japanese: 'Japanese',
      western: 'Western',
      snack: 'Snacks',
      fast: 'Fast Food',
    },
    foods: {
      korean: ['Kimchi Stew', 'Doenjang Stew', 'Bulgogi', 'Bibimbap', 'Samgyeopsal', 'Galbitang', 'Naengmyeon', 'Jeyuk'],
      chinese: ['Jajangmyeon', 'Jjamppong', 'Sweet Sour Pork', 'Fried Rice', 'Mapo Tofu', 'Kung Pao', 'Yangjiang', 'Yuringi'],
      japanese: ['Sushi', 'Ramen', 'Tonkatsu', 'Udon', 'Tempura', 'Curry', 'Omurice', 'Gyudon'],
      western: ['Pasta', 'Pizza', 'Steak', 'Risotto', 'Burger', 'Salad', 'Soup', 'Sandwich'],
      snack: ['Tteokbokki', 'Sundae', 'Fried Food', 'Kimbap', 'Ramen', 'Jjolmyeon', 'Fish Cake', 'Dumpling'],
      fast: ['Chicken', 'Burger', 'Fries', 'Hot Dog', 'Taco', 'Pizza', 'Donut', 'Ice Cream'],
    },
  }
};

const EMOJIS: Record<string, string> = {
  korean: '🍚',
  chinese: '🥡',
  japanese: '🍣',
  western: '🍝',
  snack: '🍢',
  fast: '🍔',
};

type CategoryKey = 'korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'fast';

export default function FoodSlotMachine() {
  const { t } = useLocalizedContent(i18n);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState<CategoryKey[]>(['korean', 'chinese', 'japanese']);
  const [result, setResult] = useState<{ category: CategoryKey; food: string } | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categories = Object.keys(t.categories) as CategoryKey[];

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // 각 슬롯의 최종 결과를 미리 결정
    const finalSlots: CategoryKey[] = [
      categories[Math.floor(Math.random() * categories.length)],
      categories[Math.floor(Math.random() * categories.length)],
      categories[Math.floor(Math.random() * categories.length)],
    ];

    // 슬롯 애니메이션 시작
    const intervals: ReturnType<typeof setInterval>[] = [];
    const durations = [1500, 2000, 2500]; // 각 슬롯이 멈추는 시간

    slots.forEach((_, index) => {
      let counter = 0;
      const interval = setInterval(() => {
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = categories[counter % categories.length];
          return newSlots;
        });
        counter++;
      }, 100);
      intervals.push(interval);

      setTimeout(() => {
        clearInterval(interval);
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = finalSlots[index];
          return newSlots;
        });
      }, durations[index]);
    });

    // 모든 슬롯이 멈춘 후 결과 표시
    setTimeout(() => {
      setIsSpinning(false);
      // 가장 많이 나온 카테고리 선택 (또는 무작위)
      const categoryCount: Record<string, number> = {};
      finalSlots.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      let selectedCategory = finalSlots[1]; // 기본값: 중앙
      let maxCount = 0;
      for (const [cat, count] of Object.entries(categoryCount)) {
        if (count > maxCount) {
          maxCount = count;
          selectedCategory = cat as CategoryKey;
        }
      }

      const foods = t.foods[selectedCategory];
      const selectedFood = foods[Math.floor(Math.random() * foods.length)];
      
      setResult({ category: selectedCategory, food: selectedFood });
    }, 2700);
  };

  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['음식 추천', '메뉴 추천', '슬롯머신', '오늘 뭐먹지', '점심 메뉴', '랜덤 음식']}
        canonical="/tools/food-slot-machine"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 슬롯머신 */}
          <div className="bg-gradient-to-b from-red-600 to-red-800 rounded-2xl p-8 shadow-xl">
            {/* 상단 장식 */}
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 px-8 py-2 rounded-full shadow-lg">
                <span className="text-2xl font-bold text-red-800">🎰 JACKPOT 🎰</span>
              </div>
            </div>

            {/* 슬롯 윈도우 */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <div className="flex justify-center gap-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    ref={el => { slotRefs.current[index] = el; }}
                    className="w-28 h-32 bg-white rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-inner border-4 border-yellow-400"
                  >
                    <motion.div
                      animate={isSpinning ? { y: [-10, 10] } : { y: 0 }}
                      transition={isSpinning ? { duration: 0.1, repeat: Infinity, repeatType: 'reverse' } : {}}
                      className="text-center"
                    >
                      <span className="text-5xl block">{EMOJIS[slot]}</span>
                      <span className="text-xs font-bold text-gray-700 mt-1 block">
                        {t.categories[slot]}
                      </span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* 레버 버튼 */}
            <div className="flex justify-center">
              <motion.button
                onClick={spin}
                disabled={isSpinning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-b from-yellow-400 to-yellow-600 text-gray-900 font-bold text-xl px-12 py-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isSpinning ? t.spinning : t.spin}
                </span>
                <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-0 hover:opacity-20 transition-opacity" />
              </motion.button>
            </div>
          </div>

          {/* 결과 표시 */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl text-center text-white"
              >
                <p className="text-lg mb-2">{t.result}</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl">{EMOJIS[result.category]}</span>
                  <div className="text-left">
                    <p className="text-sm opacity-80">{t.categories[result.category]}</p>
                    <p className="text-4xl font-bold">{result.food}</p>
                  </div>
                </div>
                <button
                  onClick={spin}
                  className="mt-6 px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {t.tryAgain}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
