import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function GradientGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle');
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 });
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateGradientCSS = useCallback(() => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsString})`;
    } else {
      return `radial-gradient(${radialShape} at ${radialPosition.x}% ${radialPosition.y}%, ${stopsString})`;
    }
  }, [gradientType, angle, radialShape, radialPosition, colorStops]);

  const gradientCSS = generateGradientCSS();

  const addColorStop = () => {
    const newId = Date.now().toString();
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const positions = colorStops.map(s => s.position);
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const newPosition = Math.round((minPos + maxPos) / 2);

    setColorStops([...colorStops, { id: newId, color: randomColor, position: newPosition }]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(s => s.id !== id));
    }
  };

  const updateColorStop = (id: string, field: 'color' | 'position', value: string | number) => {
    setColorStops(colorStops.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const copyToClipboard = () => {
    const fullCSS = `background: ${gradientCSS};`;
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { name: 'Rainbow', stops: [
      { color: '#ff0000', position: 0 },
      { color: '#ff8000', position: 20 },
      { color: '#ffff00', position: 40 },
      { color: '#00ff00', position: 60 },
      { color: '#0080ff', position: 80 },
      { color: '#8000ff', position: 100 },
    ]},
    { name: 'Aurora', stops: [
      { color: '#00c9ff', position: 0 },
      { color: '#92fe9d', position: 50 },
      { color: '#00c9ff', position: 100 },
    ]},
  ];

  const applyPreset = (stops: { color: string; position: number }[]) => {
    setColorStops(stops.map((s, i) => ({ ...s, id: Date.now().toString() + i })));
  };

  return (
    <>
      <SEO
        title={isKorean ? 'CSS 그래디언트 생성기' : 'CSS Gradient Generator'}
        description={isKorean 
          ? '선형 및 방사형 CSS 그래디언트를 시각적으로 편집하고 코드를 즉시 복사하세요.'
          : 'Visually edit linear and radial CSS gradients and copy the code instantly.'
        }
        keywords={isKorean
          ? ['CSS 그래디언트', '그래디언트 생성기', 'CSS 배경', '색상 그라데이션']
          : ['CSS gradient', 'gradient generator', 'CSS background', 'color gradient']
        }
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎨 {isKorean ? 'CSS 그래디언트 생성기' : 'CSS Gradient Generator'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isKorean 
            ? '멀티 컬러 그래디언트를 시각적으로 만들고 CSS 코드를 복사하세요.'
            : 'Create multi-color gradients visually and copy the CSS code.'
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '미리보기' : 'Preview'}</h2>
            
            <div
              className="w-full h-64 rounded-xl shadow-inner mb-4 transition-all duration-300"
              style={{ background: gradientCSS }}
            />

            {/* 프리셋 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '프리셋' : 'Presets'}
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.stops)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CSS 출력 */}
            <div className="bg-gray-900 rounded-lg p-4">
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
                background: {gradientCSS};
              </code>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '설정' : 'Settings'}</h2>

            {/* 그래디언트 타입 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '그래디언트 타입' : 'Gradient Type'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    gradientType === 'linear'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    gradientType === 'radial'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Linear 옵션 */}
            {gradientType === 'linear' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '각도' : 'Angle'}: {angle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Radial 옵션 */}
            {gradientType === 'radial' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isKorean ? '모양' : 'Shape'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRadialShape('circle')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        radialShape === 'circle'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Circle
                    </button>
                    <button
                      onClick={() => setRadialShape('ellipse')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        radialShape === 'ellipse'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ellipse
                    </button>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      X: {radialPosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={radialPosition.x}
                      onChange={(e) => setRadialPosition({ ...radialPosition, x: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Y: {radialPosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={radialPosition.y}
                      onChange={(e) => setRadialPosition({ ...radialPosition, y: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 컬러 스탑 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {isKorean ? '색상 포인트' : 'Color Stops'}
                </label>
                <button
                  onClick={addColorStop}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  + {isKorean ? '추가' : 'Add'}
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {colorStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => updateColorStop(stop.id, 'position', Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded text-sm text-center"
                    />
                    <span className="text-sm text-gray-500">%</span>
                    {colorStops.length > 2 && (
                      <button
                        onClick={() => removeColorStop(stop.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 그래디언트 바 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '그래디언트 바' : 'Gradient Bar'}
              </label>
              <div
                className="h-8 rounded-lg shadow-inner"
                style={{ background: `linear-gradient(90deg, ${colorStops.sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
