import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  physicalWidth: number;
  physicalHeight: number;
  colorDepth: number;
  orientation: string;
  touchSupport: boolean;
  platform: string;
  userAgent: string;
}

interface CommonResolution {
  name: string;
  width: number;
  height: number;
  aspect: string;
  type: string;
}

const ScreenResolution = () => {
  const { t } = useTranslation();
  const [screenInfo, setScreenInfo] = useState<ScreenInfo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const commonResolutions: CommonResolution[] = [
    { name: 'HD', width: 1280, height: 720, aspect: '16:9', type: 'desktop' },
    { name: 'Full HD', width: 1920, height: 1080, aspect: '16:9', type: 'desktop' },
    { name: 'QHD (2K)', width: 2560, height: 1440, aspect: '16:9', type: 'desktop' },
    { name: '4K UHD', width: 3840, height: 2160, aspect: '16:9', type: 'desktop' },
    { name: '5K', width: 5120, height: 2880, aspect: '16:9', type: 'desktop' },
    { name: 'MacBook Air 13"', width: 2560, height: 1664, aspect: '3:2', type: 'laptop' },
    { name: 'MacBook Pro 14"', width: 3024, height: 1964, aspect: '3:2', type: 'laptop' },
    { name: 'MacBook Pro 16"', width: 3456, height: 2234, aspect: '3:2', type: 'laptop' },
    { name: 'iPhone 15 Pro', width: 1179, height: 2556, aspect: '9:19.5', type: 'mobile' },
    { name: 'iPhone 15 Pro Max', width: 1290, height: 2796, aspect: '9:19.5', type: 'mobile' },
    { name: 'Samsung Galaxy S24', width: 1080, height: 2340, aspect: '9:19.5', type: 'mobile' },
    { name: 'iPad Pro 12.9"', width: 2048, height: 2732, aspect: '3:4', type: 'tablet' },
    { name: 'iPad Air', width: 1640, height: 2360, aspect: '3:4', type: 'tablet' },
  ];

  useEffect(() => {
    const updateScreenInfo = () => {
      const info: ScreenInfo = {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        physicalWidth: Math.round(window.screen.width * (window.devicePixelRatio || 1)),
        physicalHeight: Math.round(window.screen.height * (window.devicePixelRatio || 1)),
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation?.type || 'unknown',
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
      };
      setScreenInfo(info);
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const copyInfo = () => {
    if (!screenInfo) return;
    const text = `화면 해상도: ${screenInfo.screenWidth} x ${screenInfo.screenHeight}
물리적 해상도: ${screenInfo.physicalWidth} x ${screenInfo.physicalHeight}
뷰포트 크기: ${screenInfo.viewportWidth} x ${screenInfo.viewportHeight}
픽셀 밀도: ${screenInfo.devicePixelRatio}x
색상 깊이: ${screenInfo.colorDepth}bit
방향: ${screenInfo.orientation}
터치 지원: ${screenInfo.touchSupport ? '예' : '아니오'}
플랫폼: ${screenInfo.platform}`;
    navigator.clipboard.writeText(text);
  };

  const getDeviceType = () => {
    if (!screenInfo) return 'unknown';
    const width = screenInfo.screenWidth;
    if (width < 768) return '📱 모바일';
    if (width < 1024) return '📲 태블릿';
    if (width < 1440) return '💻 노트북';
    return '🖥️ 데스크탑';
  };

  const getAspectRatio = () => {
    if (!screenInfo) return '';
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(screenInfo.screenWidth, screenInfo.screenHeight);
    return `${screenInfo.screenWidth / divisor}:${screenInfo.screenHeight / divisor}`;
  };

  const getPPI = () => {
    if (!screenInfo) return 'N/A';
    // 대략적인 PPI 계산 (정확한 물리적 크기를 알 수 없으므로 추정치)
    const diagonalPixels = Math.sqrt(
      Math.pow(screenInfo.physicalWidth, 2) + Math.pow(screenInfo.physicalHeight, 2)
    );
    // 일반적인 노트북 화면 크기 (15인치) 기준 추정
    const estimatedInches = screenInfo.screenWidth > 1920 ? 27 : screenInfo.screenWidth > 1440 ? 24 : 15;
    return Math.round(diagonalPixels / estimatedInches);
  };

  const isMatchingResolution = (res: CommonResolution) => {
    if (!screenInfo) return false;
    return (
      (screenInfo.screenWidth === res.width && screenInfo.screenHeight === res.height) ||
      (screenInfo.physicalWidth === res.width && screenInfo.physicalHeight === res.height)
    );
  };

  if (!screenInfo) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>;
  }

  return (
    <>
      <SEO 
        title="화면 해상도 확인기 - 내 모니터 해상도 & PPI 확인"
        description="현재 기기의 논리적/물리적 해상도, 픽셀 밀도(DPR), PPI를 즉시 확인합니다."
        keywords={['해상도 확인', '내 해상도', '모니터 해상도', 'PPI 확인', '화면 크기', 'DPR']}
      />
      <div className="max-w-6xl mx-auto pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('tools.screenResolution.title', '화면 해상도 확인기')}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {t('tools.screenResolution.description', '현재 기기의 화면 해상도와 디스플레이 정보를 확인하세요')}
        </p>

        {/* 메인 해상도 표시 */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg opacity-80">{getDeviceType()}</span>
            <button
              onClick={copyInfo}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              정보 복사
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2">
              {screenInfo.screenWidth} × {screenInfo.screenHeight}
            </div>
            <div className="text-xl opacity-80">논리적 해상도 (CSS 픽셀)</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{screenInfo.physicalWidth} × {screenInfo.physicalHeight}</div>
              <div className="text-sm opacity-70">물리적 해상도</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{screenInfo.devicePixelRatio}x</div>
              <div className="text-sm opacity-70">픽셀 밀도 (DPR)</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{getAspectRatio()}</div>
              <div className="text-sm opacity-70">화면 비율</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">~{getPPI()}</div>
              <div className="text-sm opacity-70">추정 PPI</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 상세 정보 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 상세 정보</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">뷰포트 크기</span>
                <span className="font-mono font-medium">{screenInfo.viewportWidth} × {screenInfo.viewportHeight}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">색상 깊이</span>
                <span className="font-mono font-medium">{screenInfo.colorDepth}bit</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">화면 방향</span>
                <span className="font-mono font-medium">{screenInfo.orientation.replace('-primary', '')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">터치 지원</span>
                <span className={`font-medium ${screenInfo.touchSupport ? 'text-green-600' : 'text-gray-400'}`}>
                  {screenInfo.touchSupport ? '✓ 예' : '✗ 아니오'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">플랫폼</span>
                <span className="font-mono font-medium text-sm">{screenInfo.platform}</span>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isFullscreen ? '전체 화면 종료' : '전체 화면으로 측정'}
            </button>
          </div>

          {/* 일반적인 해상도 비교 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📐 일반 해상도 비교</h2>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {commonResolutions.map((res) => {
                const isMatch = isMatchingResolution(res);
                return (
                  <div
                    key={res.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isMatch ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {res.type === 'mobile' ? '📱' : res.type === 'tablet' ? '📲' : res.type === 'laptop' ? '💻' : '🖥️'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-800">{res.name}</div>
                        <div className="text-xs text-gray-500">{res.aspect}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{res.width} × {res.height}</div>
                      {isMatch && (
                        <span className="text-xs text-green-600 font-medium">✓ 현재 해상도</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 브라우저 정보 */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">🌐 브라우저 정보</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-mono break-all">{screenInfo.userAgent}</p>
          </div>
        </div>

        {/* 해상도 관련 팁 */}
        <div className="mt-6 bg-gray-50 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">💡 알아두면 좋은 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">논리적 해상도 vs 물리적 해상도</h3>
              <p>논리적 해상도는 CSS에서 사용하는 픽셀 단위이고, 물리적 해상도는 실제 디스플레이의 픽셀 수입니다. Retina 디스플레이는 DPR이 2 이상입니다.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">PPI (Pixels Per Inch)</h3>
              <p>인치당 픽셀 수를 나타내며, 값이 높을수록 더 선명한 화면을 의미합니다. 일반 모니터는 약 100 PPI, 스마트폰은 300-500 PPI 정도입니다.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">뷰포트 크기</h3>
              <p>브라우저에서 실제로 콘텐츠가 표시되는 영역의 크기입니다. 스크롤바, 주소창 등을 제외한 크기입니다.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">반응형 디자인 브레이크포인트</h3>
              <p>일반적으로 768px(태블릿), 1024px(노트북), 1440px(데스크탑)을 기준으로 레이아웃을 변경합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenResolution;
