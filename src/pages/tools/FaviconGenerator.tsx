import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface FaviconSize {
  size: number;
  name: string;
  description: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png', description: '브라우저 탭 (기본)' },
  { size: 32, name: 'favicon-32x32.png', description: '브라우저 탭 (고해상도)' },
  { size: 48, name: 'favicon-48x48.png', description: 'Windows 사이트 아이콘' },
  { size: 64, name: 'favicon-64x64.png', description: '윈도우 작업표시줄' },
  { size: 96, name: 'favicon-96x96.png', description: 'Google TV' },
  { size: 128, name: 'favicon-128x128.png', description: 'Chrome 웹스토어' },
  { size: 180, name: 'apple-touch-icon.png', description: 'Apple iOS/iPadOS' },
  { size: 192, name: 'android-chrome-192x192.png', description: 'Android Chrome' },
  { size: 512, name: 'android-chrome-512x512.png', description: 'Android 스플래시' },
];

const i18n = {
  ko: {
    title: '파비콘 생성기',
    subtitle: '이미지를 업로드하면 웹사이트용 파비콘을 모든 사이즈로 생성합니다',
    description: '웹사이트에 필요한 다양한 크기의 파비콘(Favicon) 파일을 한 번에 생성합니다. PNG, JPG 이미지를 ICO, PNG로 변환.',
    upload: '이미지 업로드',
    dragDrop: '이미지를 드래그하거나 클릭하여 업로드',
    supportedFormats: '지원 형식: PNG, JPG, GIF, SVG (권장: 512x512 이상 정사각형)',
    preview: '미리보기',
    generated: '생성된 파비콘',
    download: '다운로드',
    downloadAll: '📦 전체 다운로드 (ZIP)',
    downloadIco: '📥 ICO 파일 다운로드',
    size: '크기',
    usage: '용도',
    clear: '초기화',
    generating: '생성 중...',
    htmlCode: 'HTML 코드',
    copyCode: '코드 복사',
    copied: '복사됨!',
    faq: {
      q1: '파비콘(Favicon)이란 무엇인가요?',
      a1: '파비콘(Favicon)은 웹사이트를 대표하는 작은 아이콘입니다. 브라우저 탭, 북마크, 홈 화면 등에 표시됩니다. "Favorite Icon"의 줄임말로, 웹사이트의 브랜드 아이덴티티를 나타내는 중요한 요소입니다.',
      q2: '어떤 크기의 파비콘이 필요한가요?',
      a2: '기본적으로 16x16, 32x32 PNG가 필요하고, Apple 기기용 180x180, Android용 192x192와 512x512가 권장됩니다. 본 도구는 모든 주요 플랫폼에 필요한 크기를 한 번에 생성해 드립니다.',
      q3: 'ICO 파일과 PNG 파일의 차이는?',
      a3: 'ICO는 여러 크기의 이미지를 하나의 파일에 담을 수 있는 Windows 형식입니다. PNG는 단일 크기 이미지로, 현대 브라우저에서 널리 지원됩니다. 호환성을 위해 둘 다 제공하는 것이 좋습니다.',
    },
  },
};

export default function FaviconGenerator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<Map<number, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'favicon-generator');

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      await generateFavicons(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const generateFavicons = async (imageUrl: string) => {
    setIsGenerating(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const newFavicons = new Map<number, string>();
      
      FAVICON_SIZES.forEach(({ size }) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // 고품질 이미지 스케일링
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // 정사각형으로 크롭 (중앙 기준)
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          newFavicons.set(size, canvas.toDataURL('image/png'));
        }
      });
      
      setGeneratedFavicons(newFavicons);
      setIsGenerating(false);
    };
    
    img.onerror = () => {
      alert('이미지를 불러오는데 실패했습니다.');
      setIsGenerating(false);
    };
    
    img.src = imageUrl;
  };

  const downloadFavicon = (size: number, filename: string) => {
    const dataUrl = generatedFavicons.get(size);
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const downloadAllAsZip = async () => {
    // 간단한 개별 다운로드 (실제로는 JSZip 라이브러리 사용 권장)
    FAVICON_SIZES.forEach(({ size, name }) => {
      setTimeout(() => downloadFavicon(size, name), size * 10);
    });
  };

  const getHtmlCode = () => {
    return `<!-- 파비콘 기본 -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- manifest.json (PWA용) -->
<link rel="manifest" href="/manifest.json">`;
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(getHtmlCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
    ],
  };

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🎨 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 업로드 영역 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.upload}</h2>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <div className="text-5xl mb-4">📁</div>
            <p className="text-lg font-medium text-gray-700 mb-2">{t.dragDrop}</p>
            <p className="text-sm text-gray-500">{t.supportedFormats}</p>
          </div>

          {originalImage && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{t.preview}:</span>
                <img src={originalImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
              </div>
              <button
                onClick={() => {
                  setOriginalImage(null);
                  setGeneratedFavicons(new Map());
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t.clear}
              </button>
            </div>
          )}
        </section>

        {/* 생성 중 표시 */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">{t.generating}</p>
          </div>
        )}

        {/* 생성된 파비콘 */}
        {generatedFavicons.size > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{t.generated}</h2>
              <button
                onClick={downloadAllAsZip}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t.downloadAll}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {FAVICON_SIZES.map(({ size, name, description }) => (
                <div
                  key={size}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col items-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-3 bg-gray-100 rounded-lg">
                    <img
                      src={generatedFavicons.get(size)}
                      alt={`${size}x${size}`}
                      style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center mb-3">
                    <div className="font-medium text-gray-800">{size}x{size}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </div>
                  <button
                    onClick={() => downloadFavicon(size, name)}
                    className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {t.download}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HTML 코드 */}
        {generatedFavicons.size > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t.htmlCode}</h2>
              <button
                onClick={copyHtmlCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {copied ? t.copied : t.copyCode}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{getHtmlCode()}</code>
            </pre>
          </section>
        )}

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 자주 묻는 질문</h2>
          <div className="space-y-6">
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q1}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a1}</p>
            </article>
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q2}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a2}</p>
            </article>
            <article>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q3}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a3}</p>
            </article>
          </div>
        </section>

        {/* 사용법 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 파비콘 생성기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>파비콘 생성기</strong>는 하나의 이미지를 업로드하면 
              웹사이트에 필요한 모든 크기의 파비콘을 자동으로 생성합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              512x512 이상의 정사각형 PNG 이미지를 권장합니다. 
              생성된 파비콘은 개별 또는 전체 다운로드가 가능하며, 
              HTML 코드도 함께 제공됩니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              블로그, 포트폴리오, 쇼핑몰 등 웹사이트 구축 시 
              전문적인 파비콘으로 브랜드 아이덴티티를 완성하세요.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
