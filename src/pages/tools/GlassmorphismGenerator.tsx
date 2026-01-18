import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

export default function GlassmorphismGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const [blur, setBlur] = useState(16);
  const [transparency, setTransparency] = useState(25);
  const [saturation, setSaturation] = useState(180);
  const [borderRadius, setBorderRadius] = useState(16);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [glassColor, setGlassColor] = useState('#ffffff');
  const [selectedBg, setSelectedBg] = useState(0);
  const [copied, setCopied] = useState(false);

  const backgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800") center/cover',
    'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800") center/cover',
  ];

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgb = hexToRgb(glassColor);

  const generateCSS = () => {
    return `/* Glassmorphism Effect */
background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency / 100});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${borderRadius}px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});`;
  };

  const cssCode = generateCSS();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Subtle', blur: 10, transparency: 15, saturation: 150, borderOpacity: 20 },
    { name: 'Classic', blur: 16, transparency: 25, saturation: 180, borderOpacity: 30 },
    { name: 'Bold', blur: 24, transparency: 35, saturation: 200, borderOpacity: 40 },
    { name: 'Frosted', blur: 40, transparency: 20, saturation: 120, borderOpacity: 50 },
    { name: 'Light', blur: 12, transparency: 10, saturation: 160, borderOpacity: 25 },
    { name: 'Dark', blur: 20, transparency: 40, saturation: 140, borderOpacity: 15 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setBlur(preset.blur);
    setTransparency(preset.transparency);
    setSaturation(preset.saturation);
    setBorderOpacity(preset.borderOpacity);
  };

  return (
    <>
      <SEO
        title={isKorean ? '글래스모피즘 생성기' : 'Glassmorphism Generator'}
        description={isKorean 
          ? '트렌디한 유리 효과 UI를 만들고 CSS 코드를 생성하세요.'
          : 'Create trendy glass effect UI and generate CSS code.'
        }
        keywords={isKorean
          ? ['글래스모피즘', '유리 효과', 'CSS 효과', 'backdrop-filter']
          : ['glassmorphism', 'glass effect', 'CSS effect', 'backdrop-filter']
        }
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🪟 {isKorean ? '글래스모피즘 생성기' : 'Glassmorphism Generator'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isKorean 
            ? '모던한 유리 효과 UI를 디자인하고 CSS 코드를 복사하세요.'
            : 'Design modern glass effect UI and copy the CSS code.'
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '미리보기' : 'Preview'}</h2>
            
            <div
              className="w-full h-80 rounded-xl flex items-center justify-center p-8 transition-all duration-300"
              style={{ background: backgrounds[selectedBg] }}
            >
              <div
                className="w-full max-w-xs p-6 transition-all duration-300"
                style={{
                  background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency / 100})`,
                  backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  borderRadius: `${borderRadius}px`,
                  border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
                }}
              >
                <h3 className="text-white text-xl font-bold mb-2 drop-shadow">Glass Card</h3>
                <p className="text-white/90 text-sm drop-shadow">
                  {isKorean 
                    ? '이것은 글래스모피즘 효과가 적용된 카드입니다. 배경 이미지와 함께 아름다운 유리 효과를 확인해보세요.'
                    : 'This is a card with glassmorphism effect. Check out the beautiful glass effect with background images.'
                  }
                </p>
                <button className="mt-4 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg text-sm transition-colors">
                  {isKorean ? '버튼' : 'Button'}
                </button>
              </div>
            </div>

            {/* 배경 선택 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '배경 선택' : 'Select Background'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {backgrounds.map((bg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBg(index)}
                    className={`h-12 rounded-lg transition-all ${
                      selectedBg === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ background: bg }}
                  />
                ))}
              </div>
            </div>

            {/* 프리셋 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '프리셋' : 'Presets'}
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
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
              {/* 유리 색상 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '유리 색상' : 'Glass Color'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={glassColor}
                    onChange={(e) => setGlassColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={glassColor}
                    onChange={(e) => setGlassColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* 블러 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '블러 (흐림)' : 'Blur'}: {blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0px</span>
                  <span>25px</span>
                  <span>50px</span>
                </div>
              </div>

              {/* 투명도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '투명도' : 'Transparency'}: {transparency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={transparency}
                  onChange={(e) => setTransparency(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{isKorean ? '투명' : 'Clear'}</span>
                  <span>{isKorean ? '불투명' : 'Opaque'}</span>
                </div>
              </div>

              {/* 채도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '채도' : 'Saturation'}: {saturation}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100%</span>
                  <span>200%</span>
                  <span>300%</span>
                </div>
              </div>

              {/* 테두리 반경 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '테두리 반경' : 'Border Radius'}: {borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 테두리 투명도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '테두리 투명도' : 'Border Opacity'}: {borderOpacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 브라우저 지원 */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ {isKorean ? '브라우저 지원' : 'Browser Support'}
              </h3>
              <p className="text-sm text-yellow-700">
                {isKorean 
                  ? 'backdrop-filter는 대부분의 최신 브라우저에서 지원되지만, Firefox에서는 설정을 활성화해야 할 수 있습니다.'
                  : 'backdrop-filter is supported in most modern browsers, but may require enabling in Firefox settings.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
