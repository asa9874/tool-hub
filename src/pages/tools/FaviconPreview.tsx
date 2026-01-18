import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

const FaviconPreview = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('My Website');
  const [pageTitle, setPageTitle] = useState('홈페이지 - My Website');
  const [siteUrl, setSiteUrl] = useState('www.mywebsite.com');
  const [darkMode, setDarkMode] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFavicon(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFavicon(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-gray-200' : 'text-gray-800';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <>
      <SEO 
        title="파비콘 미리보기 - 브라우저 탭 & 모바일 시뮬레이션"
        description="파비콘이 브라우저 탭, 즐겨찾기 바, 모바일 홈 화면에서 어떻게 보이는지 미리 확인합니다."
        keywords={['파비콘 미리보기', 'favicon preview', '브라우저 탭 아이콘', '웹사이트 아이콘', '모바일 아이콘']}
      />
      <div className="max-w-6xl mx-auto pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {t('tools.faviconPreview.title', '파비콘 미리보기')}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {t('tools.faviconPreview.description', '파비콘이 브라우저와 모바일에서 어떻게 보이는지 미리 확인하세요')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 업로드 및 설정 */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">파비콘 업로드</h2>
            
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors mb-4"
            >
              {favicon ? (
                <img src={favicon} alt="Favicon" className="w-16 h-16 object-contain" />
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500 text-sm">클릭 또는 드래그하여 업로드</span>
                  <span className="text-gray-400 text-xs mt-1">ICO, PNG, SVG (16x16 ~ 512x512)</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".ico,.png,.svg,image/*"
                onChange={handleFileUpload}
              />
            </div>

            {favicon && (
              <button
                onClick={() => setFavicon(null)}
                className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-4"
              >
                파비콘 제거
              </button>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">사이트 이름</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">페이지 제목</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">사이트 URL</label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">다크 모드 미리보기</span>
              </label>
            </div>

            {/* 권장 사이즈 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">📐 권장 파비콘 사이즈</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>16x16</strong> - 브라우저 탭</li>
                <li>• <strong>32x32</strong> - 작업 표시줄</li>
                <li>• <strong>180x180</strong> - Apple Touch Icon</li>
                <li>• <strong>192x192</strong> - Android Chrome</li>
                <li>• <strong>512x512</strong> - PWA 스플래시</li>
              </ul>
            </div>
          </div>

          {/* 브라우저 미리보기 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chrome 탭 미리보기 */}
            <div className={`${bgColor} rounded-xl shadow-md overflow-hidden`}>
              <div className={`flex items-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className={`text-xs ${mutedColor}`}>Chrome 브라우저 탭</span>
              </div>
              
              <div className={`flex items-end gap-0 px-2 pt-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {/* 활성 탭 */}
                <div className={`flex items-center gap-2 px-3 py-2 ${bgColor} rounded-t-lg max-w-[200px]`}>
                  {favicon ? (
                    <img src={favicon} alt="" className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0"></div>
                  )}
                  <span className={`text-xs ${textColor} truncate`}>{pageTitle}</span>
                  <svg className={`w-3 h-3 ${mutedColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* 비활성 탭 */}
                <div className={`flex items-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-t-lg max-w-[150px] ml-1`}>
                  <div className="w-4 h-4 bg-gray-400 rounded flex-shrink-0"></div>
                  <span className={`text-xs ${mutedColor} truncate`}>New Tab</span>
                </div>
              </div>

              {/* 주소창 */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b ${borderColor}`}>
                <div className="flex gap-2">
                  <svg className={`w-4 h-4 ${mutedColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className={`w-4 h-4 ${mutedColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className={`w-4 h-4 ${mutedColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full`}>
                  <svg className={`w-4 h-4 ${mutedColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className={`text-sm ${mutedColor}`}>{siteUrl}</span>
                </div>
              </div>
              
              <div className={`h-24 flex items-center justify-center ${mutedColor} text-sm`}>
                웹사이트 콘텐츠 영역
              </div>
            </div>

            {/* 북마크 바 미리보기 */}
            <div className={`${bgColor} rounded-xl shadow-md p-4`}>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>📌 북마크 바</h3>
              <div className={`flex items-center gap-4 px-3 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                <div className="flex items-center gap-2">
                  {favicon ? (
                    <img src={favicon} alt="" className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  )}
                  <span className={`text-sm ${textColor}`}>{siteName}</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className={`text-sm ${mutedColor}`}>Google</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className={`text-sm ${mutedColor}`}>YouTube</span>
                </div>
              </div>
            </div>

            {/* 모바일 홈 화면 미리보기 */}
            <div className="grid grid-cols-2 gap-4">
              {/* iOS */}
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-md p-5">
                <h3 className="text-sm font-medium text-white mb-3">📱 iOS 홈 화면</h3>
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-1">
                      {favicon ? (
                        <img src={favicon} alt="" className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                      )}
                    </div>
                    <span className="text-xs text-white truncate block max-w-[60px]">{siteName}</span>
                  </div>
                </div>
              </div>

              {/* Android */}
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-md p-5">
                <h3 className="text-sm font-medium text-white mb-3">🤖 Android 홈 화면</h3>
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mb-1">
                      {favicon ? (
                        <img src={favicon} alt="" className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-white truncate block max-w-[60px]">{siteName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 결과 미리보기 */}
            <div className={`${bgColor} rounded-xl shadow-md p-5`}>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>🔍 Google 검색 결과</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {favicon ? (
                    <img src={favicon} alt="" className="w-7 h-7 rounded-full object-contain bg-gray-100 p-1" />
                  ) : (
                    <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                  )}
                  <div>
                    <div className={`text-sm ${textColor}`}>{siteName}</div>
                    <div className={`text-xs ${mutedColor}`}>https://{siteUrl}</div>
                  </div>
                </div>
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">{pageTitle}</div>
                <div className={`text-sm ${mutedColor}`}>
                  이것은 검색 결과에 표시되는 메타 설명 예시입니다. 파비콘이 사이트 이름 옆에 어떻게 표시되는지 확인하세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaviconPreview;
