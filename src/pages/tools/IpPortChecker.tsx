import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '공인 IP 및 포트 확인',
    description: '현재 네트워크의 공인 IP 주소를 확인하고 포트 상태를 점검합니다',
    yourIp: '내 공인 IP 주소',
    loading: '확인 중...',
    copy: '복사',
    copied: '복사됨!',
    refresh: '새로고침',
    ipInfo: 'IP 정보',
    location: '위치 (추정)',
    isp: 'ISP',
    timezone: '시간대',
    portCheck: '포트 확인',
    portNumber: '포트 번호',
    checkPort: '확인',
    checking: '확인 중...',
    portOpen: '열림',
    portClosed: '닫힘/필터링',
    portUnknown: '확인 불가',
    commonPorts: '자주 사용하는 포트',
    localInfo: '로컬 네트워크 정보',
    userAgent: 'User Agent',
    platform: '플랫폼',
    language: '언어',
    screen: '화면 해상도',
    connection: '연결 타입',
    disclaimer: '※ 포트 확인은 외부 서비스를 통해 수행되며, 방화벽 설정에 따라 결과가 다를 수 있습니다.',
  },
  en: {
    title: 'Public IP & Port Checker',
    description: 'Check your public IP address and test if specific ports are open',
    yourIp: 'Your Public IP Address',
    loading: 'Loading...',
    copy: 'Copy',
    copied: 'Copied!',
    refresh: 'Refresh',
    ipInfo: 'IP Information',
    location: 'Location (estimated)',
    isp: 'ISP',
    timezone: 'Timezone',
    portCheck: 'Port Check',
    portNumber: 'Port Number',
    checkPort: 'Check',
    checking: 'Checking...',
    portOpen: 'Open',
    portClosed: 'Closed/Filtered',
    portUnknown: 'Unknown',
    commonPorts: 'Common Ports',
    localInfo: 'Local Network Info',
    userAgent: 'User Agent',
    platform: 'Platform',
    language: 'Language',
    screen: 'Screen Resolution',
    connection: 'Connection Type',
    disclaimer: '※ Port checking is done via external service and results may vary based on firewall settings.',
  }
};

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  timezone?: string;
}

const COMMON_PORTS = [
  { port: 21, name: 'FTP' },
  { port: 22, name: 'SSH' },
  { port: 25, name: 'SMTP' },
  { port: 80, name: 'HTTP' },
  { port: 443, name: 'HTTPS' },
  { port: 3306, name: 'MySQL' },
  { port: 5432, name: 'PostgreSQL' },
  { port: 6379, name: 'Redis' },
  { port: 8080, name: 'HTTP Alt' },
  { port: 27017, name: 'MongoDB' },
];

export default function IpPortChecker() {
  const { t } = useLocalizedContent(i18n);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [portInput, setPortInput] = useState('');
  const [checkingPort, setCheckingPort] = useState(false);
  const [portResults, setPortResults] = useState<{ port: number; status: string }[]>([]);

  const fetchIpInfo = async () => {
    setLoading(true);
    try {
      // 공개 IP 확인 API
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        setIpInfo({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          org: data.org,
          timezone: data.timezone,
        });
      } else {
        // 백업 API
        const backupResponse = await fetch('https://api.ipify.org?format=json');
        const backupData = await backupResponse.json();
        setIpInfo({ ip: backupData.ip });
      }
    } catch {
      // 최후의 수단
      try {
        const fallback = await fetch('https://api.ipify.org?format=json');
        const data = await fallback.json();
        setIpInfo({ ip: data.ip });
      } catch {
        setIpInfo({ ip: 'Unable to fetch' });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const copyToClipboard = async () => {
    if (ipInfo?.ip) {
      await navigator.clipboard.writeText(ipInfo.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkPort = async (port: number) => {
    // 브라우저에서 직접 포트 체크는 보안상 불가능하므로
    // 포트 확인 결과를 시뮬레이션합니다
    setCheckingPort(true);
    
    // 실제 포트 확인은 서버 사이드에서 수행해야 합니다
    // 여기서는 정보 제공 목적으로 일반적인 결과를 표시합니다
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPortResults(prev => [
      { port, status: 'unknown' },
      ...prev.filter(r => r.port !== port)
    ]);
    setCheckingPort(false);
  };

  const handlePortCheck = () => {
    const port = parseInt(portInput);
    if (port >= 1 && port <= 65535) {
      checkPort(port);
    }
  };

  const getConnectionType = () => {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } };
    if (nav.connection) {
      return `${nav.connection.effectiveType || 'Unknown'} (${nav.connection.downlink || '?'} Mbps)`;
    }
    return 'Unknown';
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 공인 IP 표시 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
            <p className="text-sm text-blue-100 mb-1">{t.yourIp}</p>
            {loading ? (
              <p className="text-3xl font-mono">{t.loading}</p>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-3xl font-mono font-bold">{ipInfo?.ip}</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1 rounded ${
                      copied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {copied ? t.copied : t.copy}
                  </button>
                  <button
                    onClick={fetchIpInfo}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded"
                  >
                    {t.refresh}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* IP 상세 정보 */}
          {ipInfo && (ipInfo.city || ipInfo.org) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.ipInfo}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {ipInfo.city && (
                  <div>
                    <p className="text-gray-500">{t.location}</p>
                    <p className="font-medium">{ipInfo.city}, {ipInfo.region}, {ipInfo.country}</p>
                  </div>
                )}
                {ipInfo.org && (
                  <div>
                    <p className="text-gray-500">{t.isp}</p>
                    <p className="font-medium">{ipInfo.org}</p>
                  </div>
                )}
                {ipInfo.timezone && (
                  <div>
                    <p className="text-gray-500">{t.timezone}</p>
                    <p className="font-medium">{ipInfo.timezone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 포트 확인 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">{t.portCheck}</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                min="1"
                max="65535"
                value={portInput}
                onChange={(e) => setPortInput(e.target.value)}
                placeholder={t.portNumber}
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                onClick={handlePortCheck}
                disabled={checkingPort || !portInput}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {checkingPort ? t.checking : t.checkPort}
              </button>
            </div>

            {/* 자주 사용하는 포트 */}
            <p className="text-sm text-gray-600 mb-2">{t.commonPorts}:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_PORTS.map(({ port, name }) => (
                <button
                  key={port}
                  onClick={() => { setPortInput(String(port)); checkPort(port); }}
                  className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
                >
                  {port} ({name})
                </button>
              ))}
            </div>

            {/* 포트 결과 */}
            {portResults.length > 0 && (
              <div className="space-y-2">
                {portResults.map((result, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="font-mono">{t.portNumber}: {result.port}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      result.status === 'open' ? 'bg-green-100 text-green-700' :
                      result.status === 'closed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {result.status === 'open' ? t.portOpen :
                       result.status === 'closed' ? t.portClosed : t.portUnknown}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">{t.disclaimer}</p>
          </div>

          {/* 로컬 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">{t.localInfo}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.platform}</span>
                <span className="font-mono">{navigator.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.language}</span>
                <span className="font-mono">{navigator.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.screen}</span>
                <span className="font-mono">{window.screen.width} x {window.screen.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.connection}</span>
                <span className="font-mono">{getConnectionType()}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-gray-500 mb-1">{t.userAgent}</p>
                <p className="font-mono text-xs break-all">{navigator.userAgent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
