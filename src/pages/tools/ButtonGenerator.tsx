import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface ButtonStyle {
  text: string;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: string;
  bgColor: string;
  textColor: string;
  borderWidth: number;
  borderColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  hoverBgColor: string;
  hoverScale: number;
  transition: number;
}

const ButtonGenerator = () => {
  const { t } = useTranslation();
  const [style, setStyle] = useState<ButtonStyle>({
    text: '버튼',
    paddingX: 24,
    paddingY: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    bgColor: '#3b82f6',
    textColor: '#ffffff',
    borderWidth: 0,
    borderColor: '#3b82f6',
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 6,
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    hoverBgColor: '#2563eb',
    hoverScale: 1.02,
    transition: 200,
  });

  const [copied, setCopied] = useState(false);
  const [codeType, setCodeType] = useState<'tailwind' | 'css'>('tailwind');

  const presets = [
    {
      name: '기본',
      style: { bgColor: '#3b82f6', textColor: '#ffffff', borderRadius: 8, borderWidth: 0, shadowY: 4, shadowBlur: 6, shadowColor: 'rgba(59, 130, 246, 0.4)', hoverBgColor: '#2563eb' },
    },
    {
      name: '아웃라인',
      style: { bgColor: '#ffffff', textColor: '#3b82f6', borderRadius: 8, borderWidth: 2, borderColor: '#3b82f6', shadowY: 0, shadowBlur: 0, shadowColor: 'transparent', hoverBgColor: '#eff6ff' },
    },
    {
      name: '둥근',
      style: { bgColor: '#10b981', textColor: '#ffffff', borderRadius: 50, borderWidth: 0, shadowY: 4, shadowBlur: 6, shadowColor: 'rgba(16, 185, 129, 0.4)', hoverBgColor: '#059669' },
    },
    {
      name: '그라데이션',
      style: { bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#ffffff', borderRadius: 8, borderWidth: 0, shadowY: 4, shadowBlur: 10, shadowColor: 'rgba(102, 126, 234, 0.4)', hoverBgColor: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)' },
    },
    {
      name: '다크',
      style: { bgColor: '#1f2937', textColor: '#ffffff', borderRadius: 6, borderWidth: 0, shadowY: 2, shadowBlur: 4, shadowColor: 'rgba(0, 0, 0, 0.2)', hoverBgColor: '#374151' },
    },
    {
      name: '네온',
      style: { bgColor: '#000000', textColor: '#00ff88', borderRadius: 4, borderWidth: 2, borderColor: '#00ff88', shadowY: 0, shadowBlur: 15, shadowColor: 'rgba(0, 255, 136, 0.5)', hoverBgColor: '#0a0a0a' },
    },
  ];

  const handleStyleChange = (key: keyof ButtonStyle, value: number | string) => {
    setStyle((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setStyle((prev) => ({ ...prev, ...preset.style }));
  };

  const getButtonStyle = (): React.CSSProperties => {
    const isGradient = style.bgColor.includes('gradient');
    return {
      padding: `${style.paddingY}px ${style.paddingX}px`,
      borderRadius: `${style.borderRadius}px`,
      fontSize: `${style.fontSize}px`,
      fontWeight: style.fontWeight as React.CSSProperties['fontWeight'],
      background: isGradient ? style.bgColor : undefined,
      backgroundColor: isGradient ? undefined : style.bgColor,
      color: style.textColor,
      border: style.borderWidth > 0 ? `${style.borderWidth}px solid ${style.borderColor}` : 'none',
      boxShadow: `${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowColor}`,
      transition: `all ${style.transition}ms ease`,
      cursor: 'pointer',
    };
  };

  const getTailwindCode = (): string => {
    const classes: string[] = [];
    
    // Padding
    const pxMap: Record<number, string> = { 8: 'px-2', 12: 'px-3', 16: 'px-4', 20: 'px-5', 24: 'px-6', 32: 'px-8' };
    const pyMap: Record<number, string> = { 4: 'py-1', 8: 'py-2', 12: 'py-3', 16: 'py-4', 20: 'py-5' };
    classes.push(pxMap[style.paddingX] || `px-[${style.paddingX}px]`);
    classes.push(pyMap[style.paddingY] || `py-[${style.paddingY}px]`);
    
    // Border radius
    const roundedMap: Record<number, string> = { 0: 'rounded-none', 4: 'rounded', 6: 'rounded-md', 8: 'rounded-lg', 12: 'rounded-xl', 16: 'rounded-2xl', 50: 'rounded-full' };
    classes.push(roundedMap[style.borderRadius] || `rounded-[${style.borderRadius}px]`);
    
    // Font size
    const textMap: Record<number, string> = { 12: 'text-xs', 14: 'text-sm', 16: 'text-base', 18: 'text-lg', 20: 'text-xl' };
    classes.push(textMap[style.fontSize] || `text-[${style.fontSize}px]`);
    
    // Font weight
    const weightMap: Record<string, string> = { '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold', '700': 'font-bold' };
    classes.push(weightMap[style.fontWeight] || 'font-semibold');
    
    // Colors (using arbitrary values for custom colors)
    if (!style.bgColor.includes('gradient')) {
      classes.push(`bg-[${style.bgColor}]`);
      classes.push(`hover:bg-[${style.hoverBgColor}]`);
    }
    classes.push(`text-[${style.textColor}]`);
    
    // Border
    if (style.borderWidth > 0) {
      classes.push(`border-${style.borderWidth}`);
      classes.push(`border-[${style.borderColor}]`);
    }
    
    // Shadow (simplified)
    if (style.shadowBlur > 0) {
      classes.push('shadow-md');
    }
    
    // Transition
    classes.push('transition-all');
    classes.push(`duration-${Math.round(style.transition / 100) * 100}`);
    
    // Hover scale
    if (style.hoverScale > 1) {
      classes.push(`hover:scale-[${style.hoverScale}]`);
    }
    
    return `<button className="${classes.join(' ')}">\n  ${style.text}\n</button>`;
  };

  const getCssCode = (): string => {
    const isGradient = style.bgColor.includes('gradient');
    return `.button {
  padding: ${style.paddingY}px ${style.paddingX}px;
  border-radius: ${style.borderRadius}px;
  font-size: ${style.fontSize}px;
  font-weight: ${style.fontWeight};
  ${isGradient ? `background: ${style.bgColor};` : `background-color: ${style.bgColor};`}
  color: ${style.textColor};
  ${style.borderWidth > 0 ? `border: ${style.borderWidth}px solid ${style.borderColor};` : 'border: none;'}
  box-shadow: ${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowColor};
  transition: all ${style.transition}ms ease;
  cursor: pointer;
}

.button:hover {
  ${isGradient ? `background: ${style.hoverBgColor};` : `background-color: ${style.hoverBgColor};`}
  transform: scale(${style.hoverScale});
}`;
  };

  const copyCode = () => {
    const code = codeType === 'tailwind' ? getTailwindCode() : getCssCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO 
        title="버튼 디자인 팩토리 - Tailwind CSS 버튼 생성기"
        description="둥글기, 그림자, 호버 효과가 적용된 세련된 버튼을 만들고 Tailwind CSS 또는 CSS 코드로 내보냅니다."
        keywords={['버튼 생성기', 'Button Generator', 'Tailwind 버튼', 'CSS 버튼', '버튼 디자인']}
      />
      <div className="max-w-6xl mx-auto pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('tools.buttonGenerator.title', '버튼 디자인 팩토리')}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {t('tools.buttonGenerator.description', '세련된 버튼을 디자인하고 Tailwind CSS 또는 CSS 코드로 내보내세요')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 및 코드 */}
          <div className="space-y-4">
            {/* 버튼 미리보기 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">미리보기</h2>
              
              <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-lg mb-4">
                <button
                  style={getButtonStyle()}
                  onMouseEnter={(e) => {
                    const isGradient = style.hoverBgColor.includes('gradient');
                    if (isGradient) {
                      e.currentTarget.style.background = style.hoverBgColor;
                    } else {
                      e.currentTarget.style.backgroundColor = style.hoverBgColor;
                    }
                    e.currentTarget.style.transform = `scale(${style.hoverScale})`;
                  }}
                  onMouseLeave={(e) => {
                    const isGradient = style.bgColor.includes('gradient');
                    if (isGradient) {
                      e.currentTarget.style.background = style.bgColor;
                    } else {
                      e.currentTarget.style.backgroundColor = style.bgColor;
                    }
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {style.text}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">버튼 텍스트</label>
                <input
                  type="text"
                  value={style.text}
                  onChange={(e) => handleStyleChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 프리셋 */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">프리셋</h2>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 코드 출력 */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">코드</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCodeType('tailwind')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      codeType === 'tailwind' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tailwind
                  </button>
                  <button
                    onClick={() => setCodeType('css')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      codeType === 'css' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    CSS
                  </button>
                </div>
              </div>
              
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                <code>{codeType === 'tailwind' ? getTailwindCode() : getCssCode()}</code>
              </pre>
              
              <button
                onClick={copyCode}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {copied ? '✓ 복사됨!' : '코드 복사'}
              </button>
            </div>
          </div>

          {/* 설정 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">스타일 설정</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {/* 크기 */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">📐 크기</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">가로 패딩: {style.paddingX}px</label>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={style.paddingX}
                      onChange={(e) => handleStyleChange('paddingX', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">세로 패딩: {style.paddingY}px</label>
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={style.paddingY}
                      onChange={(e) => handleStyleChange('paddingY', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 모서리 & 폰트 */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">✨ 모양</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">모서리 둥글기: {style.borderRadius}px</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={style.borderRadius}
                      onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">폰트 크기: {style.fontSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={style.fontSize}
                        onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">폰트 굵기</label>
                      <select
                        value={style.fontWeight}
                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semibold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 색상 */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">🎨 색상</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">배경색</label>
                    <input
                      type="color"
                      value={style.bgColor.includes('gradient') ? '#3b82f6' : style.bgColor}
                      onChange={(e) => handleStyleChange('bgColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">텍스트색</label>
                    <input
                      type="color"
                      value={style.textColor}
                      onChange={(e) => handleStyleChange('textColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">호버 배경색</label>
                    <input
                      type="color"
                      value={style.hoverBgColor.includes('gradient') ? '#2563eb' : style.hoverBgColor}
                      onChange={(e) => handleStyleChange('hoverBgColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 테두리 */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">🔲 테두리</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">테두리 두께: {style.borderWidth}px</label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      value={style.borderWidth}
                      onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {style.borderWidth > 0 && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">테두리 색상</label>
                      <input
                        type="color"
                        value={style.borderColor}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 그림자 */}
              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">🌑 그림자</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">X 오프셋: {style.shadowX}px</label>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={style.shadowX}
                        onChange={(e) => handleStyleChange('shadowX', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Y 오프셋: {style.shadowY}px</label>
                      <input
                        type="range"
                        min="-10"
                        max="20"
                        value={style.shadowY}
                        onChange={(e) => handleStyleChange('shadowY', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">블러: {style.shadowBlur}px</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={style.shadowBlur}
                      onChange={(e) => handleStyleChange('shadowBlur', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 애니메이션 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">⚡ 애니메이션</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">호버 확대: {style.hoverScale}x</label>
                    <input
                      type="range"
                      min="1"
                      max="1.2"
                      step="0.01"
                      value={style.hoverScale}
                      onChange={(e) => handleStyleChange('hoverScale', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">전환 시간: {style.transition}ms</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="50"
                      value={style.transition}
                      onChange={(e) => handleStyleChange('transition', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonGenerator;
