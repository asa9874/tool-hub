import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '웹 브라우저 정보 확인',
    description: '현재 사용 중인 브라우저와 시스템 정보를 확인하세요',
    userAgent: 'User Agent',
    browser: '브라우저',
    os: '운영체제',
    device: '기기 유형',
    screenResolution: '화면 해상도',
    windowSize: '창 크기',
    colorDepth: '색상 깊이',
    pixelRatio: '픽셀 비율',
    language: '언어',
    timezone: '시간대',
    cookiesEnabled: '쿠키 허용',
    doNotTrack: 'Do Not Track',
    online: '온라인 상태',
    yes: '예',
    no: '아니오',
    enabled: '활성화',
    disabled: '비활성화',
    copy: '복사',
    copied: '복사됨!',
    copyAll: '전체 복사',
    desktop: '데스크탑',
    mobile: '모바일',
    tablet: '태블릿',
    unknown: '알 수 없음',
    bits: '비트',
    connection: '네트워크',
    connectionType: '연결 유형',
    effectiveType: '유효 연결',
    downlink: '다운링크',
    rtt: 'RTT',
    platform: '플랫폼',
    vendor: '벤더',
    hardwareConcurrency: 'CPU 코어',
    memory: '메모리',
    touchSupport: '터치 지원',
    webGL: 'WebGL',
  },
  en: {
    title: 'Browser Information',
    description: 'Check your current browser and system information',
    userAgent: 'User Agent',
    browser: 'Browser',
    os: 'Operating System',
    device: 'Device Type',
    screenResolution: 'Screen Resolution',
    windowSize: 'Window Size',
    colorDepth: 'Color Depth',
    pixelRatio: 'Pixel Ratio',
    language: 'Language',
    timezone: 'Timezone',
    cookiesEnabled: 'Cookies',
    doNotTrack: 'Do Not Track',
    online: 'Online Status',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled',
    copy: 'Copy',
    copied: 'Copied!',
    copyAll: 'Copy All',
    desktop: 'Desktop',
    mobile: 'Mobile',
    tablet: 'Tablet',
    unknown: 'Unknown',
    bits: 'bits',
    connection: 'Network',
    connectionType: 'Connection Type',
    effectiveType: 'Effective Type',
    downlink: 'Downlink',
    rtt: 'RTT',
    platform: 'Platform',
    vendor: 'Vendor',
    hardwareConcurrency: 'CPU Cores',
    memory: 'Memory',
    touchSupport: 'Touch Support',
    webGL: 'WebGL',
  }
};

interface BrowserInfo {
  userAgent: string;
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  colorDepth: number;
  pixelRatio: number;
  language: string;
  languages: string[];
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  online: boolean;
  platform: string;
  vendor: string;
  hardwareConcurrency: number;
  memory?: number;
  touchSupport: boolean;
  maxTouchPoints: number;
  webGLRenderer?: string;
  connection?: {
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

function getBrowserInfo(): BrowserInfo {
  const ua = navigator.userAgent;
  
  // 브라우저 감지
  let browser = 'Unknown';
  let browserVersion = '';
  
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Opera') || ua.includes('OPR/')) {
    browser = 'Opera';
    browserVersion = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || '';
  }

  // OS 감지
  let os = 'Unknown';
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // 기기 타입 감지
  let deviceType = 'desktop';
  if (/Mobi|Android/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  // WebGL 정보
  let webGLRenderer = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && 'getParameter' in gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        webGLRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch {
    // WebGL not supported
  }

  // Network Information API
  const nav = navigator as Navigator & { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number } };
  const connection = nav.connection ? {
    type: nav.connection.type,
    effectiveType: nav.connection.effectiveType,
    downlink: nav.connection.downlink,
    rtt: nav.connection.rtt,
  } : undefined;

  return {
    userAgent: ua,
    browser,
    browserVersion,
    os,
    deviceType,
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    language: navigator.language,
    languages: [...navigator.languages],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1',
    online: navigator.onLine,
    platform: navigator.platform,
    vendor: navigator.vendor,
    hardwareConcurrency: navigator.hardwareConcurrency,
    memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    touchSupport: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints,
    webGLRenderer,
    connection,
  };
}

export default function BrowserInfo() {
  const { t } = useLocalizedContent(i18n);
  const [info, setInfo] = useState<BrowserInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setInfo(getBrowserInfo());

    const handleResize = () => {
      setInfo(prev => prev ? {
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      } : null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const copyAll = () => {
    if (!info) return;

    const text = `Browser Information
==================
User Agent: ${info.userAgent}
Browser: ${info.browser} ${info.browserVersion}
OS: ${info.os}
Device: ${info.deviceType}
Screen: ${info.screenWidth}x${info.screenHeight}
Window: ${info.windowWidth}x${info.windowHeight}
Color Depth: ${info.colorDepth} bits
Pixel Ratio: ${info.pixelRatio}
Language: ${info.language}
Timezone: ${info.timezone}
Platform: ${info.platform}
CPU Cores: ${info.hardwareConcurrency}
Memory: ${info.memory ? info.memory + ' GB' : 'N/A'}
Touch: ${info.touchSupport ? 'Yes' : 'No'}
WebGL: ${info.webGLRenderer || 'N/A'}
    `;
    copyToClipboard(text, 'all');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '🖥️';
    }
  };

  const getDeviceLabel = (type: string) => {
    switch (type) {
      case 'mobile': return t.mobile;
      case 'tablet': return t.tablet;
      default: return t.desktop;
    }
  };

  if (!info) return null;

  const InfoRow = ({ label, value, copyValue }: { label: string; value: string | number | boolean; copyValue?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800">
          {typeof value === 'boolean' ? (value ? t.yes : t.no) : value}
        </span>
        {copyValue && (
          <button
            onClick={() => copyToClipboard(copyValue, label)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedField === label ? t.copied : t.copy}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['브라우저 정보', 'user agent', '내 IP', '시스템 정보', 'browser info']}
        canonical="/tools/browser-info"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
            <button
              onClick={copyAll}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              {copiedField === 'all' ? t.copied : t.copyAll}
            </button>
          </div>

          {/* User Agent */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500">{t.userAgent}</span>
              <button
                onClick={() => copyToClipboard(info.userAgent, 'ua')}
                className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                {copiedField === 'ua' ? t.copied : t.copy}
              </button>
            </div>
            <p className="text-sm text-gray-700 break-all font-mono">{info.userAgent}</p>
          </div>

          {/* 기본 정보 카드 */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">{t.browser}</p>
              <p className="text-2xl font-bold">{info.browser}</p>
              <p className="text-sm opacity-80">{info.browserVersion}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">{t.os}</p>
              <p className="text-2xl font-bold">{info.os}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">{t.device}</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <span>{getDeviceIcon(info.deviceType)}</span>
                {getDeviceLabel(info.deviceType)}
              </p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 디스플레이 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">🖥️ Display</h3>
              <InfoRow label={t.screenResolution} value={`${info.screenWidth} × ${info.screenHeight}`} />
              <InfoRow label={t.windowSize} value={`${info.windowWidth} × ${info.windowHeight}`} />
              <InfoRow label={t.colorDepth} value={`${info.colorDepth} ${t.bits}`} />
              <InfoRow label={t.pixelRatio} value={info.pixelRatio} />
            </div>

            {/* 시스템 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">⚙️ System</h3>
              <InfoRow label={t.platform} value={info.platform} />
              <InfoRow label={t.hardwareConcurrency} value={info.hardwareConcurrency} />
              {info.memory && <InfoRow label={t.memory} value={`${info.memory} GB`} />}
              <InfoRow label={t.touchSupport} value={info.touchSupport ? `${t.yes} (${info.maxTouchPoints})` : t.no} />
            </div>

            {/* 지역/언어 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">🌐 Locale</h3>
              <InfoRow label={t.language} value={info.language} />
              <InfoRow label={t.timezone} value={info.timezone} />
              <InfoRow label={t.online} value={info.online} />
            </div>

            {/* 개인정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">🔒 Privacy</h3>
              <InfoRow label={t.cookiesEnabled} value={info.cookiesEnabled ? t.enabled : t.disabled} />
              <InfoRow label={t.doNotTrack} value={info.doNotTrack ? t.enabled : t.disabled} />
            </div>
          </div>

          {/* WebGL */}
          {info.webGLRenderer && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">{t.webGL}</h3>
              <p className="text-sm text-gray-600 break-all">{info.webGLRenderer}</p>
            </div>
          )}

          {/* Network */}
          {info.connection && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">📡 {t.connection}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {info.connection.type && (
                  <div>
                    <p className="text-sm text-gray-500">{t.connectionType}</p>
                    <p className="font-medium">{info.connection.type}</p>
                  </div>
                )}
                {info.connection.effectiveType && (
                  <div>
                    <p className="text-sm text-gray-500">{t.effectiveType}</p>
                    <p className="font-medium">{info.connection.effectiveType}</p>
                  </div>
                )}
                {info.connection.downlink && (
                  <div>
                    <p className="text-sm text-gray-500">{t.downlink}</p>
                    <p className="font-medium">{info.connection.downlink} Mbps</p>
                  </div>
                )}
                {info.connection.rtt && (
                  <div>
                    <p className="text-sm text-gray-500">{t.rtt}</p>
                    <p className="font-medium">{info.connection.rtt} ms</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
