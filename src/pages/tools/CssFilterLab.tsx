import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

interface FilterSettings {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadowX: number;
  dropShadowY: number;
  dropShadowBlur: number;
  dropShadowColor: string;
}

interface Preset {
  name: string;
  nameKo: string;
  settings: Partial<FilterSettings>;
}

export default function CssFilterLab() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  const toolInfo = siteConfig.tools.find(tool => tool.id === 'css-filter-lab');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultSettings: FilterSettings = {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
    dropShadowX: 0,
    dropShadowY: 0,
    dropShadowBlur: 0,
    dropShadowColor: '#000000',
  };
  
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');
  const [copied, setCopied] = useState(false);
  
  // 프리셋
  const presets: Preset[] = [
    { name: 'Original', nameKo: '원본', settings: defaultSettings },
    { name: 'Grayscale', nameKo: '흑백', settings: { grayscale: 100 } },
    { name: 'Sepia', nameKo: '세피아', settings: { sepia: 100 } },
    { name: 'Vintage', nameKo: '빈티지', settings: { sepia: 50, contrast: 110, brightness: 90 } },
    { name: 'Dramatic', nameKo: '드라마틱', settings: { contrast: 150, saturate: 130 } },
    { name: 'Cool', nameKo: '쿨톤', settings: { hueRotate: 180, saturate: 80 } },
    { name: 'Warm', nameKo: '웜톤', settings: { hueRotate: 30, saturate: 120 } },
    { name: 'Faded', nameKo: '페이드', settings: { contrast: 80, brightness: 110, saturate: 80 } },
    { name: 'High Contrast', nameKo: '고대비', settings: { contrast: 200, brightness: 110 } },
    { name: 'Blur', nameKo: '블러', settings: { blur: 5 } },
    { name: 'Invert', nameKo: '반전', settings: { invert: 100 } },
    { name: 'Neon', nameKo: '네온', settings: { saturate: 300, contrast: 150, brightness: 120 } },
  ];
  
  // CSS 필터 문자열 생성
  const getCssFilter = useCallback(() => {
    const filters: string[] = [];
    
    if (settings.blur > 0) filters.push(`blur(${settings.blur}px)`);
    if (settings.brightness !== 100) filters.push(`brightness(${settings.brightness}%)`);
    if (settings.contrast !== 100) filters.push(`contrast(${settings.contrast}%)`);
    if (settings.grayscale > 0) filters.push(`grayscale(${settings.grayscale}%)`);
    if (settings.hueRotate !== 0) filters.push(`hue-rotate(${settings.hueRotate}deg)`);
    if (settings.invert > 0) filters.push(`invert(${settings.invert}%)`);
    if (settings.opacity !== 100) filters.push(`opacity(${settings.opacity}%)`);
    if (settings.saturate !== 100) filters.push(`saturate(${settings.saturate}%)`);
    if (settings.sepia > 0) filters.push(`sepia(${settings.sepia}%)`);
    
    if (settings.dropShadowX !== 0 || settings.dropShadowY !== 0 || settings.dropShadowBlur !== 0) {
      filters.push(`drop-shadow(${settings.dropShadowX}px ${settings.dropShadowY}px ${settings.dropShadowBlur}px ${settings.dropShadowColor})`);
    }
    
    return filters.length > 0 ? filters.join(' ') : 'none';
  }, [settings]);
  
  // CSS 코드 생성
  const getCssCode = () => {
    const filter = getCssFilter();
    return `filter: ${filter};
-webkit-filter: ${filter};`;
  };
  
  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  
  // 프리셋 적용
  const applyPreset = (preset: Preset) => {
    setSettings({ ...defaultSettings, ...preset.settings });
  };
  
  // 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCssCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // 리셋
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  // 이미지 다운로드
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // 필터 적용
      ctx.filter = getCssFilter();
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'filtered-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = imageUrl;
  };
  
  // 슬라이더 컴포넌트
  const FilterSlider = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    unit = '',
    defaultValue 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void; 
    min: number; 
    max: number; 
    unit?: string;
    defaultValue: number;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`${value !== defaultValue ? 'text-fuchsia-600 font-medium' : 'text-gray-500'}`}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
      />
    </div>
  );
  
  return (
    <>
      <SEO
        title={toolInfo?.title || 'CSS 필터 실험실'}
        description={toolInfo?.description || '이미지에 CSS 필터를 적용하고 코드를 복사하세요'}
        keywords={toolInfo?.keywords || []}
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isKorean ? '🎨 CSS 필터 실험실' : '🎨 CSS Filter Lab'}
          </h1>
          <p className="text-gray-600">
            {isKorean 
              ? '이미지에 다양한 CSS 필터를 적용하고 결과를 실시간으로 확인하세요.'
              : 'Apply various CSS filters to images and see results in real-time.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 미리보기 */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isKorean ? '👁️ 미리보기' : '👁️ Preview'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  {isKorean ? '📁 이미지 업로드' : '📁 Upload Image'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* 이미지 미리보기 */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt="Preview"
                style={{ filter: getCssFilter() }}
                className="w-full h-auto max-h-96 object-contain"
                crossOrigin="anonymous"
              />
            </div>
            
            {/* 프리셋 */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '프리셋' : 'Presets'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-fuchsia-100 hover:text-fuchsia-700 transition-colors"
                  >
                    {isKorean ? preset.nameKo : preset.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* CSS 코드 */}
            <div className="mt-4">
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
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {getCssCode()}
              </pre>
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={downloadImage}
                className="flex-1 py-2.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-medium hover:from-fuchsia-600 hover:to-purple-700 transition-all"
              >
                {isKorean ? '이미지 다운로드' : 'Download Image'}
              </button>
              <button
                onClick={resetSettings}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {isKorean ? '초기화' : 'Reset'}
              </button>
            </div>
          </div>
          
          {/* 필터 조절 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">
              {isKorean ? '🔧 필터 조절' : '🔧 Filter Controls'}
            </h3>
            
            <FilterSlider
              label={isKorean ? '블러 (Blur)' : 'Blur'}
              value={settings.blur}
              onChange={(v) => setSettings(s => ({ ...s, blur: v }))}
              min={0}
              max={20}
              unit="px"
              defaultValue={defaultSettings.blur}
            />
            
            <FilterSlider
              label={isKorean ? '밝기 (Brightness)' : 'Brightness'}
              value={settings.brightness}
              onChange={(v) => setSettings(s => ({ ...s, brightness: v }))}
              min={0}
              max={200}
              unit="%"
              defaultValue={defaultSettings.brightness}
            />
            
            <FilterSlider
              label={isKorean ? '대비 (Contrast)' : 'Contrast'}
              value={settings.contrast}
              onChange={(v) => setSettings(s => ({ ...s, contrast: v }))}
              min={0}
              max={200}
              unit="%"
              defaultValue={defaultSettings.contrast}
            />
            
            <FilterSlider
              label={isKorean ? '흑백 (Grayscale)' : 'Grayscale'}
              value={settings.grayscale}
              onChange={(v) => setSettings(s => ({ ...s, grayscale: v }))}
              min={0}
              max={100}
              unit="%"
              defaultValue={defaultSettings.grayscale}
            />
            
            <FilterSlider
              label={isKorean ? '색조 회전 (Hue Rotate)' : 'Hue Rotate'}
              value={settings.hueRotate}
              onChange={(v) => setSettings(s => ({ ...s, hueRotate: v }))}
              min={0}
              max={360}
              unit="°"
              defaultValue={defaultSettings.hueRotate}
            />
            
            <FilterSlider
              label={isKorean ? '반전 (Invert)' : 'Invert'}
              value={settings.invert}
              onChange={(v) => setSettings(s => ({ ...s, invert: v }))}
              min={0}
              max={100}
              unit="%"
              defaultValue={defaultSettings.invert}
            />
            
            <FilterSlider
              label={isKorean ? '불투명도 (Opacity)' : 'Opacity'}
              value={settings.opacity}
              onChange={(v) => setSettings(s => ({ ...s, opacity: v }))}
              min={0}
              max={100}
              unit="%"
              defaultValue={defaultSettings.opacity}
            />
            
            <FilterSlider
              label={isKorean ? '채도 (Saturate)' : 'Saturate'}
              value={settings.saturate}
              onChange={(v) => setSettings(s => ({ ...s, saturate: v }))}
              min={0}
              max={300}
              unit="%"
              defaultValue={defaultSettings.saturate}
            />
            
            <FilterSlider
              label={isKorean ? '세피아 (Sepia)' : 'Sepia'}
              value={settings.sepia}
              onChange={(v) => setSettings(s => ({ ...s, sepia: v }))}
              min={0}
              max={100}
              unit="%"
              defaultValue={defaultSettings.sepia}
            />
            
            {/* 드롭 섀도우 */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {isKorean ? '그림자 (Drop Shadow)' : 'Drop Shadow'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    value={settings.dropShadowX}
                    onChange={(e) => setSettings(s => ({ ...s, dropShadowX: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    value={settings.dropShadowY}
                    onChange={(e) => setSettings(s => ({ ...s, dropShadowY: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Blur</label>
                  <input
                    type="number"
                    value={settings.dropShadowBlur}
                    onChange={(e) => setSettings(s => ({ ...s, dropShadowBlur: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{isKorean ? '색상' : 'Color'}</label>
                  <input
                    type="color"
                    value={settings.dropShadowColor}
                    onChange={(e) => setSettings(s => ({ ...s, dropShadowColor: e.target.value }))}
                    className="w-full h-8 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 필터 설명 */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📖 {isKorean ? 'CSS 필터 가이드' : 'CSS Filter Guide'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>blur()</strong>: {isKorean ? '이미지를 흐리게 합니다.' : 'Applies blur to the image.'}
            </div>
            <div>
              <strong>brightness()</strong>: {isKorean ? '밝기를 조절합니다.' : 'Adjusts brightness.'}
            </div>
            <div>
              <strong>contrast()</strong>: {isKorean ? '명암 대비를 조절합니다.' : 'Adjusts contrast.'}
            </div>
            <div>
              <strong>grayscale()</strong>: {isKorean ? '흑백으로 변환합니다.' : 'Converts to grayscale.'}
            </div>
            <div>
              <strong>hue-rotate()</strong>: {isKorean ? '색조를 회전시킵니다.' : 'Rotates hue.'}
            </div>
            <div>
              <strong>saturate()</strong>: {isKorean ? '색상 채도를 조절합니다.' : 'Adjusts saturation.'}
            </div>
            <div>
              <strong>sepia()</strong>: {isKorean ? '세피아 톤을 적용합니다.' : 'Applies sepia tone.'}
            </div>
            <div>
              <strong>invert()</strong>: {isKorean ? '색상을 반전시킵니다.' : 'Inverts colors.'}
            </div>
            <div>
              <strong>drop-shadow()</strong>: {isKorean ? '그림자를 추가합니다.' : 'Adds drop shadow.'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
