import { useState, useRef, useEffect, useCallback } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '벌칙 복권 긁기',
    description: '마우스로 화면을 긁어 숨겨진 벌칙이나 당첨 결과를 확인하세요!',
    inputLabel: '벌칙/상품 목록 (줄바꿈으로 구분)',
    placeholder: '물마시기\n노래 부르기\n춤추기\n박수 치기\n셀카 찍기',
    generate: '복권 생성',
    scratchHere: '여기를 긁어주세요!',
    revealed: '결과가 공개되었습니다!',
    newCard: '새 복권 만들기',
    progress: '긁은 정도',
    minItems: '최소 1개 이상의 항목을 입력하세요',
    hint: '모바일: 터치로 긁기 / PC: 마우스로 긁기',
  },
  en: {
    title: 'Scratch Card',
    description: 'Scratch the screen to reveal hidden penalties or prizes!',
    inputLabel: 'Penalty/Prize list (one per line)',
    placeholder: 'Drink water\nSing a song\nDance\nClap hands\nTake a selfie',
    generate: 'Generate Card',
    scratchHere: 'Scratch Here!',
    revealed: 'Result revealed!',
    newCard: 'New Card',
    progress: 'Progress',
    minItems: 'Please enter at least 1 item',
    hint: 'Mobile: Touch to scratch / PC: Mouse to scratch',
  }
};

export default function ScratchCard() {
  const { t } = useLocalizedContent(i18n);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [items, setItems] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isScratching, setIsScratching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 그라데이션 스크래치 레이어
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#A8A8A8');
    gradient.addColorStop(1, '#C0C0C0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 스크래치 패턴 추가
    ctx.fillStyle = '#B0B0B0';
    for (let i = 0; i < canvas.width; i += 10) {
      for (let j = 0; j < canvas.height; j += 10) {
        if ((i + j) % 20 === 0) {
          ctx.fillRect(i, j, 5, 5);
        }
      }
    }

    // 텍스트
    ctx.fillStyle = '#888';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.scratchHere, canvas.width / 2, canvas.height / 2);

    setProgress(0);
    setIsRevealed(false);
  }, [t.scratchHere]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const newItems = text.split('\n').filter(item => item.trim() !== '');
    setItems(newItems);
  };

  const generateCard = () => {
    if (items.length < 1) return;
    
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setSelectedItem(randomItem);
    setCardGenerated(true);
    setIsRevealed(false);
    
    // Canvas 초기화는 다음 렌더 사이클에서
    setTimeout(initCanvas, 0);
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // 진행도 계산
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }
    const totalPixels = canvas.width * canvas.height;
    const newProgress = Math.round((transparentPixels / totalPixels) * 100);
    setProgress(newProgress);

    if (newProgress >= 60 && !isRevealed) {
      setIsRevealed(true);
      // 전체 공개
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    const coords = getCanvasCoords(e);
    if (coords) scratch(coords.x, coords.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    const coords = getCanvasCoords(e);
    if (coords) scratch(coords.x, coords.y);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const coords = getCanvasCoords(e);
    if (coords) scratch(coords.x, coords.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isScratching) return;
    const coords = getCanvasCoords(e);
    if (coords) scratch(coords.x, coords.y);
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  const resetCard = () => {
    setCardGenerated(false);
    setSelectedItem('');
    setProgress(0);
    setIsRevealed(false);
  };

  useEffect(() => {
    if (cardGenerated) {
      initCanvas();
    }
  }, [cardGenerated, initCanvas]);

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['벌칙 게임', '복권 긁기', '스크래치 카드', '술자리 게임', '파티 게임']}
        canonical="/tools/scratch-card"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {!cardGenerated ? (
            /* 입력 영역 */
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
              
              {items.length < 1 && inputText && (
                <p className="text-red-500 text-sm">{t.minItems}</p>
              )}

              <button
                onClick={generateCard}
                disabled={items.length < 1}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t.generate}
              </button>
            </div>
          ) : (
            /* 스크래치 카드 */
            <div className="space-y-6">
              {/* 카드 */}
              <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                {/* 배경 (결과) */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center p-8">
                  <div className="text-center">
                    <span className="text-6xl block mb-4">🎉</span>
                    <p className="text-white text-3xl font-bold break-keep">
                      {selectedItem}
                    </p>
                  </div>
                </div>

                {/* 스크래치 레이어 */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={250}
                  className="relative rounded-xl cursor-crosshair touch-none"
                  style={{ width: '100%', height: 'auto' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              </div>

              {/* 진행도 */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{t.progress}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 힌트 */}
              <p className="text-center text-sm text-gray-500">{t.hint}</p>

              {/* 공개 메시지 */}
              {isRevealed && (
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600 mb-4">{t.revealed}</p>
                  <button
                    onClick={resetCard}
                    className="py-3 px-8 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    {t.newCard}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
