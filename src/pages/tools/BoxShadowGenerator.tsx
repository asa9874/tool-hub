import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export default function BoxShadowGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 10,
      blur: 30,
      spread: 0,
      color: '#000000',
      opacity: 25,
      inset: false,
    },
  ]);
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [borderRadius, setBorderRadius] = useState(16);
  const [copied, setCopied] = useState(false);

  const generateShadowCSS = () => {
    return shadows.map(s => {
      const rgba = hexToRgba(s.color, s.opacity / 100);
      return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`;
    }).join(', ');
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowCSS = generateShadowCSS();

  const addShadow = () => {
    setShadows([...shadows, {
      id: Date.now().toString(),
      offsetX: 0,
      offsetY: 5,
      blur: 15,
      spread: 0,
      color: '#000000',
      opacity: 15,
      inset: false,
    }]);
  };

  const removeShadow = (id: string) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(s => s.id !== id));
    }
  };

  const updateShadow = (id: string, field: keyof Shadow, value: number | string | boolean) => {
    setShadows(shadows.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const copyToClipboard = () => {
    const fullCSS = `box-shadow: ${shadowCSS};`;
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Soft', shadows: [{ offsetX: 0, offsetY: 10, blur: 40, spread: 0, color: '#000000', opacity: 15, inset: false }] },
    { name: 'Hard', shadows: [{ offsetX: 5, offsetY: 5, blur: 0, spread: 0, color: '#000000', opacity: 30, inset: false }] },
    { name: 'Float', shadows: [
      { offsetX: 0, offsetY: 20, blur: 40, spread: -10, color: '#000000', opacity: 20, inset: false },
    ]},
    { name: 'Layered', shadows: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 16, blur: 32, spread: 0, color: '#000000', opacity: 10, inset: false },
    ]},
    { name: 'Inset', shadows: [{ offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 20, inset: true }] },
    { name: 'Neon', shadows: [
      { offsetX: 0, offsetY: 0, blur: 20, spread: 5, color: '#00ffff', opacity: 80, inset: false },
    ]},
  ];

  const applyPreset = (presetShadows: Omit<Shadow, 'id'>[]) => {
    setShadows(presetShadows.map((s, i) => ({ ...s, id: Date.now().toString() + i })));
  };

  return (
    <>
      <SEO
        title={isKorean ? '박스 쉐도우 생성기' : 'Box Shadow Generator'}
        description={isKorean 
          ? 'CSS box-shadow를 시각적으로 편집하고 다중 레이어 그림자를 만들어보세요.'
          : 'Visually edit CSS box-shadow and create multi-layered shadows.'
        }
        keywords={isKorean
          ? ['박스 쉐도우', 'CSS 그림자', '그림자 생성기', 'box-shadow']
          : ['box shadow', 'CSS shadow', 'shadow generator', 'box-shadow']
        }
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌓 {isKorean ? '박스 쉐도우 생성기' : 'Box Shadow Generator'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isKorean 
            ? '다중 레이어 그림자로 입체감 있는 디자인을 만들어보세요.'
            : 'Create designs with depth using multi-layered shadows.'
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '미리보기' : 'Preview'}</h2>
            
            <div
              className="w-full h-72 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="w-40 h-40 transition-all duration-300"
                style={{
                  backgroundColor: boxColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: shadowCSS,
                }}
              />
            </div>

            {/* 박스/배경 색상 */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKorean ? '박스 색상' : 'Box Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKorean ? '배경 색상' : 'Background'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isKorean ? '모서리' : 'Radius'}
                </label>
                <input
                  type="number"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
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
                    onClick={() => applyPreset(preset.shadows)}
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
              <code className="text-green-400 text-sm break-all">
                box-shadow: {shadowCSS};
              </code>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isKorean ? '그림자 레이어' : 'Shadow Layers'} ({shadows.length})
              </h2>
              <button
                onClick={addShadow}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                + {isKorean ? '레이어 추가' : 'Add Layer'}
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {shadows.map((shadow, index) => (
                <div key={shadow.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">
                      {isKorean ? `레이어 ${index + 1}` : `Layer ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                          className="rounded"
                        />
                        Inset
                      </label>
                      {shadows.length > 1 && (
                        <button
                          onClick={() => removeShadow(shadow.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        X Offset: {shadow.offsetX}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetX}
                        onChange={(e) => updateShadow(shadow.id, 'offsetX', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Y Offset: {shadow.offsetY}px
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetY}
                        onChange={(e) => updateShadow(shadow.id, 'offsetY', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Blur: {shadow.blur}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadow.blur}
                        onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Spread: {shadow.spread}px
                      </label>
                      <input
                        type="range"
                        min="-30"
                        max="30"
                        value={shadow.spread}
                        onChange={(e) => updateShadow(shadow.id, 'spread', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {isKorean ? '색상' : 'Color'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {isKorean ? '투명도' : 'Opacity'}: {shadow.opacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadow.opacity}
                        onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
