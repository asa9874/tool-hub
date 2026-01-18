import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

type ImageFormat = 'png' | 'svg' | 'webp';

interface PlaceholderSettings {
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
  text: string;
  fontSize: number;
  format: ImageFormat;
}

export default function PlaceholderImage() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  const toolInfo = siteConfig.tools.find(tool => tool.id === 'placeholder-image');
  
  const [settings, setSettings] = useState<PlaceholderSettings>({
    width: 400,
    height: 300,
    bgColor: '#CCCCCC',
    textColor: '#666666',
    text: '',
    fontSize: 24,
    format: 'png',
  });
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // 프리셋 크기
  const presets = [
    { name: 'Avatar', width: 150, height: 150 },
    { name: 'Thumbnail', width: 300, height: 200 },
    { name: 'Card', width: 400, height: 300 },
    { name: 'Banner', width: 728, height: 90 },
    { name: 'Hero', width: 1200, height: 600 },
    { name: 'Square', width: 500, height: 500 },
    { name: 'HD', width: 1920, height: 1080 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 820, height: 312 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Twitter Header', width: 1500, height: 500 },
  ];
  
  // 색상 프리셋
  const colorPresets = [
    { bg: '#CCCCCC', text: '#666666', name: 'Gray' },
    { bg: '#3B82F6', text: '#FFFFFF', name: 'Blue' },
    { bg: '#10B981', text: '#FFFFFF', name: 'Green' },
    { bg: '#F59E0B', text: '#FFFFFF', name: 'Orange' },
    { bg: '#EF4444', text: '#FFFFFF', name: 'Red' },
    { bg: '#8B5CF6', text: '#FFFFFF', name: 'Purple' },
    { bg: '#EC4899', text: '#FFFFFF', name: 'Pink' },
    { bg: '#1F2937', text: '#FFFFFF', name: 'Dark' },
    { bg: '#F3F4F6', text: '#374151', name: 'Light' },
  ];
  
  // 캔버스에서 이미지 생성
  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // 배경
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, settings.width, settings.height);
    
    // 텍스트
    const displayText = settings.text || `${settings.width} × ${settings.height}`;
    ctx.fillStyle = settings.textColor;
    ctx.font = `${settings.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, settings.width / 2, settings.height / 2);
    
    // URL 생성
    if (settings.format === 'svg') {
      const svgContent = generateSVG();
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      setPreviewUrl(URL.createObjectURL(blob));
    } else {
      const mimeType = settings.format === 'webp' ? 'image/webp' : 'image/png';
      setPreviewUrl(canvas.toDataURL(mimeType));
    }
  }, [settings]);
  
  // SVG 생성
  const generateSVG = useCallback(() => {
    const displayText = settings.text || `${settings.width} × ${settings.height}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${settings.width}" height="${settings.height}">
  <rect fill="${settings.bgColor}" width="100%" height="100%"/>
  <text fill="${settings.textColor}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="${settings.fontSize}" text-anchor="middle" dominant-baseline="middle" x="50%" y="50%">${displayText}</text>
</svg>`;
  }, [settings]);
  
  useEffect(() => {
    generateImage();
  }, [generateImage]);
  
  // URL 생성 (외부 서비스 형식)
  const getPlaceholderUrl = () => {
    const textParam = settings.text ? `?text=${encodeURIComponent(settings.text)}` : '';
    return `https://via.placeholder.com/${settings.width}x${settings.height}/${settings.bgColor.slice(1)}/${settings.textColor.slice(1)}${textParam}`;
  };
  
  // URL 복사
  const copyUrl = () => {
    navigator.clipboard.writeText(getPlaceholderUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // 이미지 다운로드
  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `placeholder-${settings.width}x${settings.height}.${settings.format}`;
    
    if (settings.format === 'svg') {
      const svgContent = generateSVG();
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = previewUrl;
    }
    
    link.click();
  };
  
  return (
    <>
      <SEO
        title={toolInfo?.title || '플레이스홀더 이미지 생성기'}
        description={toolInfo?.description || '특정 크기와 색상의 임시 이미지를 생성합니다'}
        keywords={toolInfo?.keywords || []}
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isKorean ? '🖼️ 플레이스홀더 이미지 생성기' : '🖼️ Placeholder Image Generator'}
          </h1>
          <p className="text-gray-600">
            {isKorean 
              ? '웹 개발에 필요한 임시 이미지를 원하는 크기와 색상으로 생성하세요.'
              : 'Generate placeholder images with custom size and colors for web development.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 설정 패널 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* 크기 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '📐 크기 설정' : '📐 Size Settings'}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '너비 (px)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    value={settings.width}
                    onChange={(e) => setSettings(s => ({ ...s, width: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    min="1"
                    max="4000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '높이 (px)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    value={settings.height}
                    onChange={(e) => setSettings(s => ({ ...s, height: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    min="1"
                    max="4000"
                  />
                </div>
              </div>
              
              {/* 크기 프리셋 */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSettings(s => ({ ...s, width: preset.width, height: preset.height }))}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      settings.width === preset.width && settings.height === preset.height
                        ? 'bg-fuchsia-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 색상 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '🎨 색상 설정' : '🎨 Color Settings'}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '배경색' : 'Background'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.bgColor}
                      onChange={(e) => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.bgColor}
                      onChange={(e) => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '텍스트색' : 'Text Color'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings(s => ({ ...s, textColor: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.textColor}
                      onChange={(e) => setSettings(s => ({ ...s, textColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
              
              {/* 색상 프리셋 */}
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSettings(s => ({ ...s, bgColor: preset.bg, textColor: preset.text }))}
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-md transition-transform hover:scale-110"
                    style={{ backgroundColor: preset.bg }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
            
            {/* 텍스트 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '📝 텍스트 설정' : '📝 Text Settings'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '표시 텍스트 (비우면 크기 표시)' : 'Display Text (empty for size)'}
                  </label>
                  <input
                    type="text"
                    value={settings.text}
                    onChange={(e) => setSettings(s => ({ ...s, text: e.target.value }))}
                    placeholder={`${settings.width} × ${settings.height}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '폰트 크기' : 'Font Size'}: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    value={settings.fontSize}
                    onChange={(e) => setSettings(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
                    min="8"
                    max="72"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* 포맷 설정 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '📦 출력 포맷' : '📦 Output Format'}
              </h3>
              <div className="flex gap-2">
                {(['png', 'svg', 'webp'] as ImageFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSettings(s => ({ ...s, format }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      settings.format === format
                        ? 'bg-fuchsia-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 미리보기 & 출력 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* 미리보기 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '👁️ 미리보기' : '👁️ Preview'}
              </h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center overflow-hidden"
                style={{ 
                  minHeight: '200px',
                  maxHeight: '400px',
                }}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Placeholder Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '350px',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {settings.width} × {settings.height} px
              </p>
            </div>
            
            {/* URL */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '🔗 이미지 URL' : '🔗 Image URL'}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getPlaceholderUrl()}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={copyUrl}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? '✓' : isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isKorean 
                  ? '* via.placeholder.com 형식의 URL입니다. 실제 이미지는 아래 버튼으로 다운로드하세요.'
                  : '* URL in via.placeholder.com format. Download actual image with button below.'}
              </p>
            </div>
            
            {/* 다운로드 버튼 */}
            <button
              onClick={downloadImage}
              className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {isKorean ? `${settings.format.toUpperCase()} 다운로드` : `Download ${settings.format.toUpperCase()}`}
            </button>
            
            {/* HTML 코드 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {isKorean ? '💻 HTML 코드' : '💻 HTML Code'}
              </h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<img 
  src="${getPlaceholderUrl()}" 
  alt="Placeholder"
  width="${settings.width}" 
  height="${settings.height}"
/>`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* 사용 팁 */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 {isKorean ? '사용 팁' : 'Tips'}
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {isKorean 
              ? 'SVG 포맷은 벡터 형식으로 모든 크기에서 선명합니다.'
              : 'SVG format is vector-based and looks sharp at any size.'}
            </li>
            <li>• {isKorean 
              ? 'WebP 포맷은 PNG보다 파일 크기가 작습니다.'
              : 'WebP format has smaller file size than PNG.'}
            </li>
            <li>• {isKorean 
              ? '소셜 미디어 프리셋으로 각 플랫폼에 맞는 이미지를 쉽게 생성하세요.'
              : 'Use social media presets to easily create images for each platform.'}
            </li>
            <li>• {isKorean 
              ? '개발 단계에서 실제 이미지 대신 사용하면 레이아웃 테스트가 편리합니다.'
              : 'Use instead of real images during development for convenient layout testing.'}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
