import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

interface PatternSettings {
  type: string;
  primaryColor: string;
  secondaryColor: string;
  size: number;
  opacity: number;
  rotation: number;
}

interface PatternTemplate {
  id: string;
  name: string;
  nameKo: string;
  generator: (settings: PatternSettings) => string;
}

export default function CssPatternGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  const toolInfo = siteConfig.tools.find(tool => tool.id === 'css-pattern-generator');
  
  const [settings, setSettings] = useState<PatternSettings>({
    type: 'dots',
    primaryColor: '#3B82F6',
    secondaryColor: '#FFFFFF',
    size: 20,
    opacity: 100,
    rotation: 0,
  });
  
  const [copied, setCopied] = useState(false);
  
  // 패턴 템플릿들
  const patterns: PatternTemplate[] = [
    {
      id: 'dots',
      name: 'Dots',
      nameKo: '도트',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image: radial-gradient(${s.primaryColor} 1px, transparent 1px);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'dots-large',
      name: 'Large Dots',
      nameKo: '큰 도트',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image: radial-gradient(${s.primaryColor} ${s.size / 5}px, transparent ${s.size / 5}px);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'stripes-horizontal',
      name: 'Horizontal Stripes',
      nameKo: '가로 줄무늬',
      generator: (s) => `
background: repeating-linear-gradient(
  0deg,
  ${s.primaryColor},
  ${s.primaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size}px
);`.trim(),
    },
    {
      id: 'stripes-vertical',
      name: 'Vertical Stripes',
      nameKo: '세로 줄무늬',
      generator: (s) => `
background: repeating-linear-gradient(
  90deg,
  ${s.primaryColor},
  ${s.primaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size}px
);`.trim(),
    },
    {
      id: 'stripes-diagonal',
      name: 'Diagonal Stripes',
      nameKo: '대각선 줄무늬',
      generator: (s) => `
background: repeating-linear-gradient(
  45deg,
  ${s.primaryColor},
  ${s.primaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size / 2}px,
  ${s.secondaryColor} ${s.size}px
);`.trim(),
    },
    {
      id: 'checkerboard',
      name: 'Checkerboard',
      nameKo: '체크무늬',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(45deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(-45deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${s.primaryColor} 75%),
  linear-gradient(-45deg, transparent 75%, ${s.primaryColor} 75%);
background-size: ${s.size}px ${s.size}px;
background-position: 0 0, 0 ${s.size / 2}px, ${s.size / 2}px -${s.size / 2}px, -${s.size / 2}px 0px;`.trim(),
    },
    {
      id: 'grid',
      name: 'Grid',
      nameKo: '그리드',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(${s.primaryColor} 1px, transparent 1px),
  linear-gradient(90deg, ${s.primaryColor} 1px, transparent 1px);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'grid-thick',
      name: 'Thick Grid',
      nameKo: '굵은 그리드',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(${s.primaryColor} 2px, transparent 2px),
  linear-gradient(90deg, ${s.primaryColor} 2px, transparent 2px);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'zigzag',
      name: 'Zigzag',
      nameKo: '지그재그',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(135deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(225deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(45deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(315deg, ${s.primaryColor} 25%, transparent 25%);
background-size: ${s.size}px ${s.size}px;
background-position: ${s.size / 2}px 0, ${s.size / 2}px 0, 0 0, 0 0;`.trim(),
    },
    {
      id: 'triangles',
      name: 'Triangles',
      nameKo: '삼각형',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(45deg, ${s.primaryColor} 50%, transparent 50%);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'diamonds',
      name: 'Diamonds',
      nameKo: '다이아몬드',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(45deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(-45deg, ${s.primaryColor} 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${s.primaryColor} 75%),
  linear-gradient(-45deg, transparent 75%, ${s.primaryColor} 75%);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'waves',
      name: 'Waves',
      nameKo: '물결',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  radial-gradient(circle at 100% 50%, transparent 20%, ${s.primaryColor} 21%, ${s.primaryColor} 34%, transparent 35%, transparent),
  radial-gradient(circle at 0% 50%, transparent 20%, ${s.primaryColor} 21%, ${s.primaryColor} 34%, transparent 35%, transparent);
background-size: ${s.size * 2}px ${s.size}px;`.trim(),
    },
    {
      id: 'circles',
      name: 'Circles',
      nameKo: '원',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  radial-gradient(circle, transparent 40%, ${s.primaryColor} 40%, ${s.primaryColor} 50%, transparent 50%);
background-size: ${s.size}px ${s.size}px;`.trim(),
    },
    {
      id: 'honeycomb',
      name: 'Honeycomb',
      nameKo: '벌집',
      generator: (s) => {
        const h = s.size * 0.866; // height of equilateral triangle
        return `
background-color: ${s.secondaryColor};
background-image:
  radial-gradient(circle farthest-side at 0% 50%, ${s.secondaryColor} 23.5%, transparent 0)${s.size / 2}px 0,
  radial-gradient(circle farthest-side at 0% 50%, ${s.primaryColor} 24%, transparent 0)${s.size / 4}px 0,
  linear-gradient(${s.secondaryColor} 14%, transparent 0, transparent 85%, ${s.secondaryColor} 0)0 0,
  linear-gradient(150deg, ${s.secondaryColor} 24%, ${s.primaryColor} 0, ${s.primaryColor} 26%, transparent 0, transparent 74%, ${s.primaryColor} 0, ${s.primaryColor} 76%, ${s.secondaryColor} 0)0 0,
  linear-gradient(30deg, ${s.secondaryColor} 24%, ${s.primaryColor} 0, ${s.primaryColor} 26%, transparent 0, transparent 74%, ${s.primaryColor} 0, ${s.primaryColor} 76%, ${s.secondaryColor} 0)0 0,
  linear-gradient(90deg, ${s.primaryColor} 2%, ${s.secondaryColor} 0, ${s.secondaryColor} 98%, ${s.primaryColor} 0%)0 0 ${s.secondaryColor};
background-size: ${s.size}px ${h * 2}px;`.trim();
      },
    },
    {
      id: 'cross',
      name: 'Cross',
      nameKo: '십자',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(${s.primaryColor} ${s.size / 10}px, transparent ${s.size / 10}px),
  linear-gradient(90deg, ${s.primaryColor} ${s.size / 10}px, transparent ${s.size / 10}px);
background-size: ${s.size}px ${s.size}px;
background-position: center center;`.trim(),
    },
    {
      id: 'paper',
      name: 'Paper',
      nameKo: '종이',
      generator: (s) => `
background-color: ${s.secondaryColor};
background-image:
  linear-gradient(90deg, transparent 79px, ${s.primaryColor}33 79px, ${s.primaryColor}33 81px, transparent 81px),
  linear-gradient(${s.primaryColor}11 1px, transparent 1px);
background-size: 100% ${s.size}px;`.trim(),
    },
  ];
  
  // 현재 패턴 찾기
  const currentPattern = patterns.find(p => p.id === settings.type) || patterns[0];
  
  // CSS 코드 생성
  const getCssCode = useCallback(() => {
    let css = currentPattern.generator(settings);
    
    // 투명도 적용
    if (settings.opacity < 100) {
      css += `\nopacity: ${settings.opacity / 100};`;
    }
    
    // 회전 적용
    if (settings.rotation !== 0) {
      css = `
position: relative;

&::before {
  content: '';
  position: absolute;
  inset: 0;
  ${css}
  transform: rotate(${settings.rotation}deg);
}`.trim();
    }
    
    return css;
  }, [settings, currentPattern]);
  
  // 인라인 스타일 생성 (미리보기용)
  const getPreviewStyle = useCallback((): React.CSSProperties => {
    const css = currentPattern.generator(settings);
    const styleObj: React.CSSProperties = {};
    
    // CSS 문자열을 파싱하여 객체로 변환
    css.split('\n').forEach(line => {
      const [prop, val] = line.split(':').map(s => s.trim());
      if (prop && val) {
        const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
        (styleObj as Record<string, string>)[camelProp] = val.replace(';', '');
      }
    });
    
    if (settings.opacity < 100) {
      styleObj.opacity = settings.opacity / 100;
    }
    
    if (settings.rotation !== 0) {
      styleObj.transform = `rotate(${settings.rotation}deg)`;
    }
    
    return styleObj;
  }, [settings, currentPattern]);
  
  // 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCssCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // 색상 스왑
  const swapColors = () => {
    setSettings(s => ({
      ...s,
      primaryColor: s.secondaryColor,
      secondaryColor: s.primaryColor,
    }));
  };
  
  // 색상 프리셋
  const colorPresets = [
    { primary: '#3B82F6', secondary: '#FFFFFF', name: 'Blue/White' },
    { primary: '#10B981', secondary: '#F0FDF4', name: 'Green' },
    { primary: '#F59E0B', secondary: '#FFFBEB', name: 'Amber' },
    { primary: '#EF4444', secondary: '#FEF2F2', name: 'Red' },
    { primary: '#8B5CF6', secondary: '#F5F3FF', name: 'Purple' },
    { primary: '#EC4899', secondary: '#FDF2F8', name: 'Pink' },
    { primary: '#1F2937', secondary: '#F9FAFB', name: 'Gray' },
    { primary: '#000000', secondary: '#FFFFFF', name: 'B&W' },
  ];
  
  return (
    <>
      <SEO
        title={toolInfo?.title || 'CSS 배경 패턴 생성기'}
        description={toolInfo?.description || 'CSS만으로 다양한 배경 패턴을 생성하세요'}
        keywords={toolInfo?.keywords || []}
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isKorean ? '🎨 CSS 배경 패턴 생성기' : '🎨 CSS Pattern Generator'}
          </h1>
          <p className="text-gray-600">
            {isKorean 
              ? '이미지 없이 CSS만으로 다양한 배경 패턴을 생성하세요. 웹 성능 최적화에 완벽합니다.'
              : 'Generate various background patterns with pure CSS. Perfect for web performance optimization.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isKorean ? '👁️ 미리보기' : '👁️ Preview'}
            </h3>
            
            <div 
              className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden"
              style={getPreviewStyle()}
            />
            
            {/* 패턴 선택 */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '패턴 선택' : 'Select Pattern'}
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => setSettings(s => ({ ...s, type: pattern.id }))}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      settings.type === pattern.id
                        ? 'border-fuchsia-500 bg-fuchsia-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={isKorean ? pattern.nameKo : pattern.name}
                  >
                    <div 
                      className="w-full aspect-square rounded"
                      style={(() => {
                        const previewSettings = { ...settings, type: pattern.id, size: 10 };
                        const css = pattern.generator(previewSettings);
                        const styleObj: React.CSSProperties = {};
                        css.split('\n').forEach(line => {
                          const [prop, val] = line.split(':').map(s => s.trim());
                          if (prop && val) {
                            const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
                            (styleObj as Record<string, string>)[camelProp] = val.replace(';', '');
                          }
                        });
                        return styleObj;
                      })()}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* 현재 패턴 이름 */}
            <p className="text-center text-gray-600 mt-3">
              {isKorean ? currentPattern.nameKo : currentPattern.name}
            </p>
          </div>
          
          {/* 설정 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {isKorean ? '🔧 설정' : '🔧 Settings'}
            </h3>
            
            {/* 색상 설정 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {isKorean ? '색상' : 'Colors'}
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    {isKorean ? '패턴 색상' : 'Pattern'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
                
                <button
                  onClick={swapColors}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title={isKorean ? '색상 교체' : 'Swap Colors'}
                >
                  ⇄
                </button>
                
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    {isKorean ? '배경 색상' : 'Background'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(s => ({ ...s, secondaryColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(s => ({ ...s, secondaryColor: e.target.value }))}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
              
              {/* 색상 프리셋 */}
              <div className="flex flex-wrap gap-2 mt-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSettings(s => ({ 
                      ...s, 
                      primaryColor: preset.primary, 
                      secondaryColor: preset.secondary 
                    }))}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    title={preset.name}
                  >
                    <span 
                      className="w-4 h-4 rounded-sm border border-gray-200"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span 
                      className="w-4 h-4 rounded-sm border border-gray-200"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* 크기 설정 */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{isKorean ? '크기' : 'Size'}</span>
                <span>{settings.size}px</span>
              </label>
              <input
                type="range"
                value={settings.size}
                onChange={(e) => setSettings(s => ({ ...s, size: parseInt(e.target.value) }))}
                min="5"
                max="100"
                className="w-full"
              />
            </div>
            
            {/* 투명도 설정 */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{isKorean ? '투명도' : 'Opacity'}</span>
                <span>{settings.opacity}%</span>
              </label>
              <input
                type="range"
                value={settings.opacity}
                onChange={(e) => setSettings(s => ({ ...s, opacity: parseInt(e.target.value) }))}
                min="10"
                max="100"
                className="w-full"
              />
            </div>
            
            {/* 회전 설정 */}
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
            
            {/* CSS 코드 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">CSS {isKorean ? '코드' : 'Code'}</h4>
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? '✓ Copied!' : isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-48">
                {getCssCode()}
              </pre>
            </div>
          </div>
        </div>
        
        {/* 팁 */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 {isKorean ? 'CSS 패턴 활용 팁' : 'CSS Pattern Tips'}
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {isKorean 
              ? 'CSS 패턴은 이미지보다 용량이 훨씬 작아 페이지 로딩 속도를 개선합니다.'
              : 'CSS patterns are much smaller than images, improving page load speed.'}
            </li>
            <li>• {isKorean 
              ? '벡터 기반이라 모든 해상도에서 선명하게 표시됩니다.'
              : 'Vector-based, so they look sharp at any resolution.'}
            </li>
            <li>• {isKorean 
              ? 'Hero 섹션, 카드 배경, 섹션 구분선 등에 활용하면 효과적입니다.'
              : 'Effective for hero sections, card backgrounds, and section dividers.'}
            </li>
            <li>• {isKorean 
              ? 'background-attachment: fixed를 추가하면 스크롤 시 패럴렉스 효과를 줄 수 있습니다.'
              : 'Add background-attachment: fixed for parallax effect on scroll.'}
            </li>
            <li>• {isKorean 
              ? '투명도를 낮추고 오버레이로 사용하면 텍스트 가독성을 유지할 수 있습니다.'
              : 'Lower opacity and use as overlay to maintain text readability.'}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
