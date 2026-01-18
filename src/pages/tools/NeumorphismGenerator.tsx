import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

type ShapeType = 'flat' | 'concave' | 'convex' | 'pressed';

export default function NeumorphismGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(50);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(60);
  const [shape, setShape] = useState<ShapeType>('flat');
  const [copied, setCopied] = useState(false);

  // 색상 조절 함수
  const adjustColor = (hex: string, amount: number) => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const lightColor = adjustColor(bgColor, intensity * 2.55);
  const darkColor = adjustColor(bgColor, -intensity * 2.55);

  const getBoxShadow = () => {
    const d = distance;
    const b = blur;

    switch (shape) {
      case 'flat':
        return `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}`;
      case 'concave':
        return `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}, inset ${d}px ${d}px ${b}px ${darkColor}, inset -${d}px -${d}px ${b}px ${lightColor}`;
      case 'convex':
        return `${d}px ${d}px ${b}px ${darkColor}, -${d}px -${d}px ${b}px ${lightColor}, inset -${d}px -${d}px ${b}px ${darkColor}, inset ${d}px ${d}px ${b}px ${lightColor}`;
      case 'pressed':
        return `inset ${d}px ${d}px ${b}px ${darkColor}, inset -${d}px -${d}px ${b}px ${lightColor}`;
      default:
        return '';
    }
  };

  const getBackground = () => {
    if (shape === 'concave') {
      return `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
    } else if (shape === 'convex') {
      return `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
    }
    return bgColor;
  };

  const generateCSS = () => {
    const bg = shape === 'concave' || shape === 'convex' 
      ? `background: ${getBackground()};`
      : `background: ${bgColor};`;
    
    return `/* Neumorphism Effect */
${bg}
border-radius: ${radius}px;
box-shadow: ${getBoxShadow()};`;
  };

  const cssCode = generateCSS();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shapeOptions: { value: ShapeType; label: string; labelKo: string }[] = [
    { value: 'flat', label: 'Flat', labelKo: '플랫' },
    { value: 'concave', label: 'Concave', labelKo: '오목' },
    { value: 'convex', label: 'Convex', labelKo: '볼록' },
    { value: 'pressed', label: 'Pressed', labelKo: '눌림' },
  ];

  const colorPresets = [
    { name: 'Light Gray', color: '#e0e5ec' },
    { name: 'Soft White', color: '#f0f0f3' },
    { name: 'Warm Beige', color: '#e8dfd5' },
    { name: 'Cool Blue', color: '#d1dce8' },
    { name: 'Mint', color: '#d5e8e3' },
    { name: 'Lavender', color: '#e5dff0' },
  ];

  return (
    <>
      <SEO
        title={isKorean ? '뉴모피즘 생성기' : 'Neumorphism Generator'}
        description={isKorean 
          ? '부드러운 입체감의 뉴모피즘 UI를 만들고 CSS 코드를 생성하세요.'
          : 'Create soft 3D neumorphism UI and generate CSS code.'
        }
        keywords={isKorean
          ? ['뉴모피즘', 'CSS 입체감', 'UI 디자인', 'soft UI']
          : ['neumorphism', 'CSS 3D', 'UI design', 'soft UI']
        }
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔘 {isKorean ? '뉴모피즘 생성기' : 'Neumorphism Generator'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isKorean 
            ? '부드러운 그림자로 입체감 있는 UI를 디자인하세요.'
            : 'Design UI with depth using soft shadows.'
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '미리보기' : 'Preview'}</h2>
            
            <div
              className="w-full min-h-[400px] rounded-xl flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="transition-all duration-300 flex items-center justify-center"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: getBackground(),
                  borderRadius: `${radius}px`,
                  boxShadow: getBoxShadow(),
                }}
              >
                <span className="text-4xl">🎨</span>
              </div>
            </div>

            {/* 예시 컴포넌트들 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {isKorean ? '예시 컴포넌트' : 'Example Components'}
              </h3>
              <div
                className="p-6 rounded-xl grid grid-cols-3 gap-4"
                style={{ backgroundColor: bgColor }}
              >
                {/* 버튼 */}
                <div
                  className="p-4 flex items-center justify-center cursor-pointer hover:scale-95 transition-transform"
                  style={{
                    borderRadius: '12px',
                    boxShadow: `8px 8px 24px ${darkColor}, -8px -8px 24px ${lightColor}`,
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: adjustColor(bgColor, -80) }}>
                    {isKorean ? '버튼' : 'Button'}
                  </span>
                </div>

                {/* 원형 */}
                <div
                  className="w-16 h-16 mx-auto flex items-center justify-center"
                  style={{
                    borderRadius: '50%',
                    boxShadow: `6px 6px 18px ${darkColor}, -6px -6px 18px ${lightColor}`,
                  }}
                >
                  <span>⚡</span>
                </div>

                {/* 눌린 입력 */}
                <div
                  className="p-3 flex items-center"
                  style={{
                    borderRadius: '10px',
                    boxShadow: `inset 4px 4px 12px ${darkColor}, inset -4px -4px 12px ${lightColor}`,
                  }}
                >
                  <span className="text-xs opacity-50">Input</span>
                </div>
              </div>
            </div>

            {/* CSS 출력 */}
            <div className="bg-gray-900 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">CSS</span>
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {copied ? (isKorean ? '복사됨!' : 'Copied!') : (isKorean ? '복사' : 'Copy')}
                </button>
              </div>
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                {cssCode}
              </pre>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6">{isKorean ? '설정' : 'Settings'}</h2>

            <div className="space-y-6">
              {/* 배경색 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '배경색' : 'Background Color'}
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setBgColor(preset.color)}
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-md transition-transform hover:scale-110"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* 모양 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '모양' : 'Shape'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {shapeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setShape(option.value)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        shape === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isKorean ? option.labelKo : option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '크기' : 'Size'}: {size}px
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 반경 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '모서리 반경' : 'Border Radius'}: {radius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 거리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '그림자 거리' : 'Shadow Distance'}: {distance}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 강도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '그림자 강도' : 'Shadow Intensity'}: {intensity}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 블러 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '블러' : 'Blur'}: {blur}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 팁 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                💡 {isKorean ? '디자인 팁' : 'Design Tips'}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {isKorean ? '밝은 배경색에서 가장 효과적입니다.' : 'Works best with light backgrounds.'}</li>
                <li>• {isKorean ? '채도가 낮은 색상을 사용하세요.' : 'Use colors with low saturation.'}</li>
                <li>• {isKorean ? '그림자 강도는 15% 전후가 적당합니다.' : 'Shadow intensity around 15% is ideal.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
