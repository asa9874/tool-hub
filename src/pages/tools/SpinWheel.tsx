import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '복불복 룰렛 돌리기',
    description: '원판에 항목을 입력하고 회전시켜 랜덤하게 하나를 선정하세요',
    inputLabel: '항목 입력 (줄바꿈으로 구분)',
    placeholder: '항목 1\n항목 2\n항목 3\n항목 4',
    spinButton: '돌리기!',
    spinning: '돌아가는 중...',
    result: '결과',
    reset: '다시 하기',
    minItems: '최소 2개 이상의 항목을 입력하세요',
    example: '예시: 짜장면, 짬뽕, 볶음밥',
    winner: '당첨!',
  },
  en: {
    title: 'Spin the Wheel',
    description: 'Enter items on the wheel and spin to randomly select one',
    inputLabel: 'Enter items (one per line)',
    placeholder: 'Item 1\nItem 2\nItem 3\nItem 4',
    spinButton: 'Spin!',
    spinning: 'Spinning...',
    result: 'Result',
    reset: 'Try Again',
    minItems: 'Please enter at least 2 items',
    example: 'Example: Pizza, Burger, Pasta',
    winner: 'Winner!',
  }
};

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];

export default function SpinWheel() {
  const { t } = useLocalizedContent(i18n);
  const [items, setItems] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const newItems = text.split('\n').filter(item => item.trim() !== '');
    setItems(newItems);
    setWinner(null);
  };

  const spin = () => {
    if (items.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // 랜덤 회전 각도 (최소 5바퀴 + 랜덤)
    const minSpins = 5;
    const maxSpins = 10;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + extraDegrees;

    setRotation(totalRotation);

    // 결과 계산 (3초 후)
    setTimeout(() => {
      const finalAngle = totalRotation % 360;
      const sliceAngle = 360 / items.length;
      // 12시 방향(상단)에서 시작하여 시계 방향으로 계산
      const adjustedAngle = (360 - finalAngle + 90) % 360;
      const winnerIndex = Math.floor(adjustedAngle / sliceAngle) % items.length;
      setWinner(items[winnerIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const reset = () => {
    setRotation(0);
    setWinner(null);
  };

  const renderWheel = () => {
    if (items.length < 2) return null;

    const sliceAngle = 360 / items.length;
    const radius = 150;
    const centerX = 200;
    const centerY = 200;

    return (
      <svg 
        ref={wheelRef}
        width="400" 
        height="400" 
        viewBox="0 0 400 400"
        className="max-w-full h-auto"
      >
        {/* 휠 본체 */}
        <motion.g
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: '200px 200px' }}
        >
          {items.map((item, index) => {
            const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
            
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArc = sliceAngle > 180 ? 1 : 0;

            const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            // 텍스트 위치 계산
            const textAngle = ((index + 0.5) * sliceAngle - 90) * (Math.PI / 180);
            const textRadius = radius * 0.65;
            const textX = centerX + textRadius * Math.cos(textAngle);
            const textY = centerY + textRadius * Math.sin(textAngle);
            const textRotation = (index + 0.5) * sliceAngle;

            return (
              <g key={index}>
                <path
                  d={pathD}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {item.length > 8 ? item.substring(0, 8) + '...' : item}
                </text>
              </g>
            );
          })}
        </motion.g>

        {/* 중앙 원 */}
        <circle cx={centerX} cy={centerY} r="30" fill="#333" stroke="#fff" strokeWidth="3" />
        
        {/* 화살표 (상단 고정) */}
        <polygon 
          points="200,30 190,60 210,60" 
          fill="#FF4757" 
          stroke="#fff" 
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['복불복 룰렛', '룰렛 돌리기', '랜덤 선택', 'spin wheel', '랜덤 뽑기']}
        canonical="/tools/spin-wheel"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 입력 영역 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t.inputLabel}
              </label>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder={t.placeholder}
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500">{t.example}</p>
              
              {items.length < 2 && inputText && (
                <p className="text-red-500 text-sm">{t.minItems}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={spin}
                  disabled={items.length < 2 || isSpinning}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isSpinning ? t.spinning : t.spinButton}
                </button>
                <button
                  onClick={reset}
                  className="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t.reset}
                </button>
              </div>
            </div>

            {/* 룰렛 영역 */}
            <div className="flex flex-col items-center justify-center">
              {items.length >= 2 ? (
                renderWheel()
              ) : (
                <div className="w-[300px] h-[300px] rounded-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400 text-center px-8">{t.minItems}</p>
                </div>
              )}
            </div>
          </div>

          {/* 결과 표시 */}
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-center"
            >
              <p className="text-white text-lg font-medium mb-2">{t.winner}</p>
              <p className="text-white text-3xl font-bold">{winner}</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
