import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly';

interface ColorBlindnessInfo {
  id: ColorBlindnessType;
  name: string;
  nameKo: string;
  description: string;
  prevalence: string;
  matrix: number[];
}

const ColorBlindnessSimulator = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>('normal');
  const [showComparison, setShowComparison] = useState(false);

  const colorBlindnessTypes: ColorBlindnessInfo[] = [
    {
      id: 'normal',
      name: 'Normal Vision',
      nameKo: '정상 시력',
      description: '모든 색상을 정상적으로 인식합니다.',
      prevalence: '92%',
      matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'protanopia',
      name: 'Protanopia',
      nameKo: '적색맹 (제1색맹)',
      description: '빨간색을 인식하지 못합니다. 빨강-초록 구분이 어렵습니다.',
      prevalence: '남성 1%, 여성 0.01%',
      matrix: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia',
      nameKo: '녹색맹 (제2색맹)',
      description: '녹색을 인식하지 못합니다. 빨강-초록 구분이 어렵습니다.',
      prevalence: '남성 1%, 여성 0.01%',
      matrix: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia',
      nameKo: '청색맹 (제3색맹)',
      description: '파란색을 인식하지 못합니다. 파랑-노랑 구분이 어렵습니다.',
      prevalence: '0.01%',
      matrix: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'achromatopsia',
      name: 'Achromatopsia',
      nameKo: '전색맹',
      description: '모든 색상을 회색조로 인식합니다.',
      prevalence: '0.003%',
      matrix: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'protanomaly',
      name: 'Protanomaly',
      nameKo: '적색약 (제1색약)',
      description: '빨간색 인식이 약합니다.',
      prevalence: '남성 1%',
      matrix: [0.817, 0.183, 0, 0, 0, 0.333, 0.667, 0, 0, 0, 0, 0.125, 0.875, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'deuteranomaly',
      name: 'Deuteranomaly',
      nameKo: '녹색약 (제2색약)',
      description: '녹색 인식이 약합니다. 가장 흔한 색각 이상입니다.',
      prevalence: '남성 5%, 여성 0.35%',
      matrix: [0.8, 0.2, 0, 0, 0, 0.258, 0.742, 0, 0, 0, 0, 0.142, 0.858, 0, 0, 0, 0, 0, 1, 0],
    },
    {
      id: 'tritanomaly',
      name: 'Tritanomaly',
      nameKo: '청색약 (제3색약)',
      description: '파란색 인식이 약합니다.',
      prevalence: '0.01%',
      matrix: [0.967, 0.033, 0, 0, 0, 0, 0.733, 0.267, 0, 0, 0, 0.183, 0.817, 0, 0, 0, 0, 0, 1, 0],
    },
  ];

  const applyColorBlindnessFilter = useCallback((img: HTMLImageElement, type: ColorBlindnessType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    if (type === 'normal') return;

    const typeInfo = colorBlindnessTypes.find(t => t.id === type);
    if (!typeInfo) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const matrix = typeInfo.matrix;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r * matrix[0] + g * matrix[1] + b * matrix[2];
      data[i + 1] = r * matrix[5] + g * matrix[6] + b * matrix[7];
      data[i + 2] = r * matrix[10] + g * matrix[11] + b * matrix[12];
    }

    ctx.putImageData(imageData, 0, 0);
  }, [colorBlindnessTypes]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      applyColorBlindnessFilter(img, selectedType);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleTypeChange = (type: ColorBlindnessType) => {
    setSelectedType(type);
    if (image) {
      applyColorBlindnessFilter(image, type);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `color-blindness-${selectedType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const selectedInfo = colorBlindnessTypes.find(t => t.id === selectedType);

  return (
    <>
      <SEO 
        title="색약 시뮬레이터 - 웹 접근성 색각 이상 테스트"
        description="디자인이 색약(적록색맹, 청색맹 등) 사용자에게 어떻게 보이는지 필터를 씨워 확인합니다. 웹 접근성 필수 도구."
        keywords={['색약 시뮬레이터', 'Color Blindness', '색각 이상', '웹 접근성', '적록색맹', 'WCAG']}
      />
      <div className="max-w-6xl mx-auto pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('tools.colorBlindnessSimulator.title', '색약 시뮬레이터')}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {t('tools.colorBlindnessSimulator.description', '디자인이 색각 이상 사용자에게 어떻게 보이는지 확인하세요')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 이미지 업로드 및 미리보기 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">미리보기</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={!image}
                  />
                  <span className="text-sm text-gray-600">비교 모드</span>
                </label>
              </div>
              
              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500">디자인 이미지를 업로드하세요</span>
                  <span className="text-gray-400 text-sm mt-1">PNG, JPG, SVG 지원</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : showComparison ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 text-center">원본</p>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <img src={image.src} alt="Original" className="max-w-full h-auto rounded" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 text-center">{selectedInfo?.nameKo}</p>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
                    </div>
                  </div>
                </div>
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

            {/* 색상 테스트 팔레트 */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">색상 팔레트 테스트</h2>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4', '#a855f7'].map((color) => (
                  <div
                    key={color}
                    className="aspect-square rounded-lg shadow-sm"
                    style={{ 
                      backgroundColor: color,
                      filter: selectedType !== 'normal' ? `url(#${selectedType}-filter)` : 'none'
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                위 색상들이 선택한 색각 유형에서 어떻게 보이는지 확인하세요. 실제 필터 적용은 업로드된 이미지에만 적용됩니다.
              </p>
            </div>
          </div>

          {/* 색각 유형 선택 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">색각 유형</h2>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {colorBlindnessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedType === type.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{type.nameKo}</span>
                    {selectedType === type.id && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{type.name}</p>
                </button>
              ))}
            </div>

            {/* 선택된 유형 상세 정보 */}
            {selectedInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedInfo.nameKo}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedInfo.description}</p>
                <p className="text-xs text-gray-500">
                  <strong>발생률:</strong> {selectedInfo.prevalence}
                </p>
              </div>
            )}

            {/* 접근성 팁 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 접근성 디자인 팁</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 색상만으로 정보를 전달하지 마세요</li>
                <li>• 텍스트, 아이콘, 패턴을 함께 사용하세요</li>
                <li>• 충분한 명도 대비를 확보하세요</li>
                <li>• 빨강-초록 조합은 피하세요</li>
                <li>• WCAG 가이드라인을 참고하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorBlindnessSimulator;
