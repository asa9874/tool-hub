import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

interface BlobSettings {
  complexity: number;
  contrast: number;
  size: number;
  color1: string;
  color2: string;
  useGradient: boolean;
  rotation: number;
}

export default function SvgBlobGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  const toolInfo = siteConfig.tools.find(tool => tool.id === 'svg-blob-generator');
  
  const [settings, setSettings] = useState<BlobSettings>({
    complexity: 6,
    contrast: 50,
    size: 400,
    color1: '#8B5CF6',
    color2: '#EC4899',
    useGradient: true,
    rotation: 0,
  });
  
  const [svgPath, setSvgPath] = useState<string>('');
  const [copied, setCopied] = useState<'svg' | 'css' | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  
  // 블롭 경로 생성 (유기적인 곡선)
  const generateBlobPath = useCallback(() => {
    const points = settings.complexity;
    const center = settings.size / 2;
    const baseRadius = settings.size * 0.35;
    const variance = (settings.contrast / 100) * baseRadius * 0.5;
    
    const angles: number[] = [];
    const radii: number[] = [];
    
    // 각 포인트의 각도와 반지름 생성
    for (let i = 0; i < points; i++) {
      angles.push((i / points) * Math.PI * 2);
      radii.push(baseRadius + (Math.random() - 0.5) * variance * 2);
    }
    
    // 베지어 곡선으로 부드러운 블롭 생성
    let path = '';
    
    for (let i = 0; i < points; i++) {
      const current = i;
      const next = (i + 1) % points;
      
      const x1 = center + radii[current] * Math.cos(angles[current]);
      const y1 = center + radii[current] * Math.sin(angles[current]);
      const x2 = center + radii[next] * Math.cos(angles[next]);
      const y2 = center + radii[next] * Math.sin(angles[next]);
      
      // 컨트롤 포인트 계산
      const tension = 0.3;
      const prev = (i - 1 + points) % points;
      const nextNext = (i + 2) % points;
      
      const xPrev = center + radii[prev] * Math.cos(angles[prev]);
      const yPrev = center + radii[prev] * Math.sin(angles[prev]);
      const xNextNext = center + radii[nextNext] * Math.cos(angles[nextNext]);
      const yNextNext = center + radii[nextNext] * Math.sin(angles[nextNext]);
      
      const cp1x = x1 + (x2 - xPrev) * tension;
      const cp1y = y1 + (y2 - yPrev) * tension;
      const cp2x = x2 - (xNextNext - x1) * tension;
      const cp2y = y2 - (yNextNext - y1) * tension;
      
      if (i === 0) {
        path = `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;
      }
      
      path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}`;
    }
    
    path += ' Z';
    setSvgPath(path);
    
    // 히스토리에 추가 (최대 10개)
    setHistory(prev => [path, ...prev.slice(0, 9)]);
  }, [settings.complexity, settings.contrast, settings.size]);
  
  // 초기 블롭 생성
  useEffect(() => {
    generateBlobPath();
  }, []);
  
  // SVG 코드 생성
  const getSvgCode = () => {
    const gradientId = 'blobGradient';
    const fill = settings.useGradient ? `url(#${gradientId})` : settings.color1;
    
    return `<svg viewBox="0 0 ${settings.size} ${settings.size}" xmlns="http://www.w3.org/2000/svg">
  ${settings.useGradient ? `<defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${settings.color1}" />
      <stop offset="100%" style="stop-color:${settings.color2}" />
    </linearGradient>
  </defs>` : ''}
  <g transform="rotate(${settings.rotation} ${settings.size / 2} ${settings.size / 2})">
    <path d="${svgPath}" fill="${fill}" />
  </g>
</svg>`;
  };
  
  // CSS Background 코드 생성
  const getCssCode = () => {
    const encodedSvg = encodeURIComponent(getSvgCode().replace(/\n/g, '').replace(/\s+/g, ' '));
    return `background-image: url("data:image/svg+xml,${encodedSvg}");
background-repeat: no-repeat;
background-position: center;
background-size: contain;`;
  };
  
  // 복사 기능
  const copyToClipboard = (type: 'svg' | 'css') => {
    const text = type === 'svg' ? getSvgCode() : getCssCode();
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // SVG 다운로드
  const downloadSvg = () => {
    const svgContent = getSvgCode();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blob.svg';
    link.click();
    URL.revokeObjectURL(url);
  };
  
  // PNG 다운로드
  const downloadPng = () => {
    const svgContent = getSvgCode();
    const canvas = document.createElement('canvas');
    canvas.width = settings.size * 2;
    canvas.height = settings.size * 2;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = 'blob.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };
  
  // 색상 프리셋
  const colorPresets = [
    { c1: '#8B5CF6', c2: '#EC4899', name: 'Purple Pink' },
    { c1: '#3B82F6', c2: '#06B6D4', name: 'Blue Cyan' },
    { c1: '#10B981', c2: '#34D399', name: 'Green Emerald' },
    { c1: '#F59E0B', c2: '#EF4444', name: 'Orange Red' },
    { c1: '#EC4899', c2: '#F97316', name: 'Pink Orange' },
    { c1: '#6366F1', c2: '#8B5CF6', name: 'Indigo Violet' },
    { c1: '#14B8A6', c2: '#22D3EE', name: 'Teal Cyan' },
    { c1: '#F43F5E', c2: '#FB7185', name: 'Rose' },
  ];
  
  return (
    <>
      <SEO
        title={toolInfo?.title || 'SVG 블롭 생성기'}
        description={toolInfo?.description || '유기적인 곡선의 SVG 블롭을 생성합니다'}
        keywords={toolInfo?.keywords || []}
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isKorean ? '🫧 SVG 블롭 생성기' : '🫧 SVG Blob Generator'}
          </h1>
          <p className="text-gray-600">
            {isKorean 
              ? '웹 디자인에 사용할 부드럽고 유기적인 블롭 형태의 SVG를 생성하세요.'
              : 'Generate smooth, organic blob shapes in SVG for web design.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isKorean ? '👁️ 미리보기' : '👁️ Preview'}
              </h3>
              <button
                onClick={generateBlobPath}
                className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium hover:from-fuchsia-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                🎲 {isKorean ? '새로 생성' : 'Regenerate'}
              </button>
            </div>
            
            <div 
              className="flex items-center justify-center p-8 rounded-xl"
              style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, #fff 0% 50%) 50% / 20px 20px' }}
            >
              <svg
                viewBox={`0 0 ${settings.size} ${settings.size}`}
                style={{ 
                  width: '100%', 
                  maxWidth: '350px',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
                }}
              >
                {settings.useGradient && (
                  <defs>
                    <linearGradient id="previewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: settings.color1 }} />
                      <stop offset="100%" style={{ stopColor: settings.color2 }} />
                    </linearGradient>
                  </defs>
                )}
                <g transform={`rotate(${settings.rotation} ${settings.size / 2} ${settings.size / 2})`}>
                  <path
                    d={svgPath}
                    fill={settings.useGradient ? 'url(#previewGradient)' : settings.color1}
                  />
                </g>
              </svg>
            </div>
            
            {/* 히스토리 */}
            {history.length > 1 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  {isKorean ? '최근 생성' : 'Recent'}
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {history.slice(1).map((path, index) => (
                    <button
                      key={index}
                      onClick={() => setSvgPath(path)}
                      className="flex-shrink-0 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg viewBox={`0 0 ${settings.size} ${settings.size}`} style={{ width: '40px', height: '40px' }}>
                        <path d={path} fill={settings.color1} opacity="0.6" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 설정 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* 형태 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '🔧 형태 설정' : '🔧 Shape Settings'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{isKorean ? '복잡도' : 'Complexity'}</span>
                    <span>{settings.complexity}</span>
                  </label>
                  <input
                    type="range"
                    value={settings.complexity}
                    onChange={(e) => setSettings(s => ({ ...s, complexity: parseInt(e.target.value) }))}
                    min="3"
                    max="12"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{isKorean ? '대비 (변형도)' : 'Contrast'}</span>
                    <span>{settings.contrast}%</span>
                  </label>
                  <input
                    type="range"
                    value={settings.contrast}
                    onChange={(e) => setSettings(s => ({ ...s, contrast: parseInt(e.target.value) }))}
                    min="10"
                    max="100"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{isKorean ? '회전' : 'Rotation'}</span>
                    <span>{settings.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    value={settings.rotation}
                    onChange={(e) => setSettings(s => ({ ...s, rotation: parseInt(e.target.value) }))}
                    min="0"
                    max="360"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{isKorean ? '크기' : 'Size'}</span>
                    <span>{settings.size}px</span>
                  </label>
                  <input
                    type="range"
                    value={settings.size}
                    onChange={(e) => setSettings(s => ({ ...s, size: parseInt(e.target.value) }))}
                    min="100"
                    max="800"
                    step="50"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* 색상 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '🎨 색상 설정' : '🎨 Color Settings'}
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.useGradient}
                    onChange={(e) => setSettings(s => ({ ...s, useGradient: e.target.checked }))}
                    className="w-5 h-5 text-fuchsia-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isKorean ? '그래디언트 사용' : 'Use Gradient'}
                  </span>
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isKorean ? '색상 1' : 'Color 1'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.color1}
                        onChange={(e) => setSettings(s => ({ ...s, color1: e.target.value }))}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.color1}
                        onChange={(e) => setSettings(s => ({ ...s, color1: e.target.value }))}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                  {settings.useGradient && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isKorean ? '색상 2' : 'Color 2'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.color2}
                          onChange={(e) => setSettings(s => ({ ...s, color2: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.color2}
                          onChange={(e) => setSettings(s => ({ ...s, color2: e.target.value }))}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 색상 프리셋 */}
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSettings(s => ({ ...s, color1: preset.c1, color2: preset.c2, useGradient: true }))}
                      className="w-10 h-10 rounded-lg border-2 border-white shadow-md transition-transform hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})` }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* 다운로드 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={downloadSvg}
                className="flex-1 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition-all"
              >
                SVG {isKorean ? '다운로드' : 'Download'}
              </button>
              <button
                onClick={downloadPng}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                PNG {isKorean ? '다운로드' : 'Download'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 코드 출력 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SVG 코드 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  📄 SVG {isKorean ? '코드' : 'Code'}
                </h3>
                <button
                  onClick={() => copyToClipboard('svg')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === 'svg'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied === 'svg' ? '✓ Copied!' : isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-48">
                {getSvgCode()}
              </pre>
            </div>
            
            {/* CSS 코드 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  🎨 CSS Background
                </h3>
                <button
                  onClick={() => copyToClipboard('css')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === 'css'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied === 'css' ? '✓ Copied!' : isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-48">
                {getCssCode()}
              </pre>
            </div>
          </div>
        </div>
        
        {/* 사용 팁 */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 {isKorean ? '활용 팁' : 'Tips'}
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {isKorean 
              ? '블롭은 히어로 섹션, 카드 배경, 장식 요소로 활용하면 모던한 느낌을 줍니다.'
              : 'Use blobs in hero sections, card backgrounds, or decorative elements for a modern feel.'}
            </li>
            <li>• {isKorean 
              ? 'SVG는 벡터 형식이라 크기를 변경해도 선명합니다.'
              : 'SVG is vector format, so it stays sharp at any size.'}
            </li>
            <li>• {isKorean 
              ? '여러 블롭을 겹치면 더 복잡하고 흥미로운 디자인을 만들 수 있습니다.'
              : 'Layer multiple blobs for more complex and interesting designs.'}
            </li>
            <li>• {isKorean 
              ? 'CSS filter나 mix-blend-mode와 함께 사용하면 효과가 배가됩니다.'
              : 'Combine with CSS filters or mix-blend-mode for enhanced effects.'}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
