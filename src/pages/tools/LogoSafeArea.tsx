import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface GridSettings {
  padding: number;
  gridSize: number;
  showCenterLines: boolean;
  showDiagonals: boolean;
  showCircle: boolean;
  gridColor: string;
  safeAreaColor: string;
  backgroundColor: string;
}

const LogoSafeArea = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<GridSettings>({
    padding: 15,
    gridSize: 8,
    showCenterLines: true,
    showDiagonals: false,
    showCircle: true,
    gridColor: '#e5e7eb',
    safeAreaColor: '#ef4444',
    backgroundColor: '#ffffff',
  });

  const presets = [
    { name: '기본', padding: 15, gridSize: 8 },
    { name: '넓은 여백', padding: 25, gridSize: 8 },
    { name: '좁은 여백', padding: 10, gridSize: 8 },
    { name: '상세 그리드', padding: 15, gridSize: 16 },
    { name: '간단 그리드', padding: 15, gridSize: 4 },
  ];

  const drawCanvas = useCallback((img: HTMLImageElement, gridSettings: GridSettings) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.max(img.width, img.height);
    const canvasSize = 600;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // 배경
    ctx.fillStyle = gridSettings.backgroundColor;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 이미지 중앙 배치
    const scale = (canvasSize * (100 - gridSettings.padding * 2) / 100) / size;
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    const imgX = (canvasSize - imgWidth) / 2;
    const imgY = (canvasSize - imgHeight) / 2;

    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // 그리드 그리기
    ctx.strokeStyle = gridSettings.gridColor;
    ctx.lineWidth = 1;

    const cellSize = canvasSize / gridSettings.gridSize;
    for (let i = 1; i < gridSettings.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // 안전 영역 표시
    const safeAreaPadding = canvasSize * gridSettings.padding / 100;
    ctx.strokeStyle = gridSettings.safeAreaColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(
      safeAreaPadding,
      safeAreaPadding,
      canvasSize - safeAreaPadding * 2,
      canvasSize - safeAreaPadding * 2
    );
    ctx.setLineDash([]);

    // 중앙선
    if (gridSettings.showCenterLines) {
      ctx.strokeStyle = gridSettings.safeAreaColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(canvasSize / 2, 0);
      ctx.lineTo(canvasSize / 2, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, canvasSize / 2);
      ctx.lineTo(canvasSize, canvasSize / 2);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // 대각선
    if (gridSettings.showDiagonals) {
      ctx.strokeStyle = gridSettings.gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasSize, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasSize, 0);
      ctx.lineTo(0, canvasSize);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // 중앙 원
    if (gridSettings.showCircle) {
      ctx.strokeStyle = gridSettings.gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      const radius = (canvasSize - safeAreaPadding * 2) / 2;
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // 패딩 표시 텍스트
    ctx.fillStyle = gridSettings.safeAreaColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${gridSettings.padding}%`, canvasSize / 2, safeAreaPadding / 2 + 4);
    ctx.fillText(`${gridSettings.padding}%`, canvasSize / 2, canvasSize - safeAreaPadding / 2 + 4);

  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      drawCanvas(img, settings);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSettingChange = (key: keyof GridSettings, value: number | boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (image) {
      drawCanvas(image, newSettings);
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    const newSettings = { ...settings, padding: preset.padding, gridSize: preset.gridSize };
    setSettings(newSettings);
    if (image) {
      drawCanvas(image, newSettings);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'logo-safe-area.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <>
      <SEO 
        title="로고 안전 영역 생성기 - 브랜드 가이드라인 그리드"
        description="로고 파일에 상하좌우 여백과 그리드를 그려 브랜드 가이드라인 준수를 돕습니다. 브랜딩 디자이너 필수 도구."
        keywords={['로고 안전 영역', 'Safe Area', '브랜드 가이드라인', '로고 그리드', '로고 여백', '브랜딩']}
      />
      <div className="max-w-6xl mx-auto pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('tools.logoSafeArea.title', '로고 안전 영역 생성기')}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {t('tools.logoSafeArea.description', '로고 파일에 안전 영역 그리드를 추가하여 브랜드 가이드라인을 준수하세요')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리보기 영역 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">미리보기</h2>
            
            {!image ? (
              <label className="flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500">로고 이미지를 업로드하세요</span>
                <span className="text-gray-400 text-sm mt-1">PNG, JPG, SVG 지원</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                  <canvas 
                    ref={canvasRef} 
                    className="max-w-full h-auto rounded shadow"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                <div className="flex gap-2">
                  <label className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-center transition-colors">
                    이미지 변경
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <button
                    onClick={downloadImage}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    다운로드
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 설정 영역 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">설정</h2>
            
            {/* 프리셋 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">프리셋</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 안전 영역 패딩 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                안전 영역 패딩: {settings.padding}%
              </label>
              <input
                type="range"
                min="5"
                max="40"
                value={settings.padding}
                onChange={(e) => handleSettingChange('padding', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 그리드 크기 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                그리드 분할: {settings.gridSize} x {settings.gridSize}
              </label>
              <input
                type="range"
                min="2"
                max="24"
                step="2"
                value={settings.gridSize}
                onChange={(e) => handleSettingChange('gridSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 표시 옵션 */}
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">표시 옵션</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCenterLines}
                  onChange={(e) => handleSettingChange('showCenterLines', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">중앙선 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showDiagonals}
                  onChange={(e) => handleSettingChange('showDiagonals', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">대각선 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCircle}
                  onChange={(e) => handleSettingChange('showCircle', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">중앙 원 표시</span>
              </label>
            </div>

            {/* 색상 설정 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">배경색</label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">그리드색</label>
                <input
                  type="color"
                  value={settings.gridColor}
                  onChange={(e) => handleSettingChange('gridColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">영역색</label>
                <input
                  type="color"
                  value={settings.safeAreaColor}
                  onChange={(e) => handleSettingChange('safeAreaColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* 가이드 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 브랜드 가이드라인 팁</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 일반적으로 로고 주변에 10-25%의 안전 영역을 권장합니다</li>
                <li>• 안전 영역 내에는 다른 요소가 들어가면 안 됩니다</li>
                <li>• 그리드는 로고의 비율과 정렬을 확인하는 데 유용합니다</li>
                <li>• 다양한 배경색에서 로고가 잘 보이는지 테스트하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoSafeArea;
