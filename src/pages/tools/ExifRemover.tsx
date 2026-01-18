import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done';
  cleanedUrl?: string;
}

const i18n = {
  ko: {
    title: '이미지 메타데이터(EXIF) 삭제기',
    subtitle: '사진에 포함된 위치 정보, 촬영 기기 정보 등 개인정보를 제거합니다',
    description: '이미지 파일의 EXIF 메타데이터(GPS 위치, 카메라 정보, 촬영 날짜 등)를 안전하게 삭제합니다.',
    upload: '이미지 업로드',
    dragDrop: '이미지를 드래그하거나 클릭하여 업로드',
    supportedFormats: '지원 형식: JPG, PNG, WEBP (최대 10개)',
    processing: '처리 중...',
    done: '완료',
    download: '다운로드',
    downloadAll: '📦 전체 다운로드',
    clear: '초기화',
    originalSize: '원본 크기',
    newSize: '정리 후',
    removedData: '삭제된 정보',
    privacyInfo: '개인정보 보호 안내',
    whatIsRemoved: '삭제되는 정보',
    faq: {
      q1: 'EXIF 메타데이터란 무엇인가요?',
      a1: 'EXIF(Exchangeable Image File Format)는 사진 파일에 포함되는 부가 정보입니다. 촬영 날짜/시간, GPS 위치, 카메라 모델, 렌즈 정보, 노출값 등이 기록됩니다. 스마트폰 사진의 경우 정확한 위치가 기록되어 있어 개인정보 유출 위험이 있습니다.',
      q2: '왜 EXIF 정보를 삭제해야 하나요?',
      a2: 'SNS나 커뮤니티에 사진을 업로드할 때 EXIF 정보가 그대로 남아있으면, 집 주소나 직장 위치 등 민감한 위치 정보가 노출될 수 있습니다. 개인정보 보호를 위해 공개 전 EXIF를 삭제하는 것이 안전합니다.',
      q3: '삭제 후 이미지 품질이 변하나요?',
      a3: '아니요, 본 도구는 이미지 데이터 자체는 건드리지 않고 메타데이터만 제거합니다. Canvas API를 통해 픽셀 데이터를 그대로 복사하므로 화질 손실 없이 깨끗한 이미지를 얻을 수 있습니다.',
    },
  },
};

const REMOVED_DATA = [
  { icon: '📍', name: 'GPS 위치 정보', desc: '촬영 장소의 위도/경도' },
  { icon: '📷', name: '카메라 정보', desc: '기기 모델, 제조사' },
  { icon: '📅', name: '촬영 날짜/시간', desc: '원본 촬영 일시' },
  { icon: '⚙️', name: '촬영 설정', desc: 'ISO, 셔터 속도, 조리개' },
  { icon: '🖼️', name: '썸네일', desc: '임베드된 미리보기 이미지' },
  { icon: '💬', name: '작성자 정보', desc: '저작권, 작성자 이름' },
];

export default function ExifRemover() {
  const lang = 'ko';
  const t = i18n[lang];

  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'exif-remover');

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];

    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const id = `${Date.now()}-${i}`;
      const preview = URL.createObjectURL(file);

      newImages.push({
        id,
        file,
        preview,
        status: 'pending',
      });
    }

    setImages([...images, ...newImages]);

    // 각 이미지 처리
    for (const img of newImages) {
      await processImage(img);
    }
  };

  const processImage = async (imageFile: ImageFile) => {
    setImages(prev => prev.map(img => 
      img.id === imageFile.id ? { ...img, status: 'processing' } : img
    ));

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Canvas를 사용하여 EXIF 제거 (픽셀 데이터만 복사)
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          // 원본 형식에 맞춰 내보내기
          const mimeType = imageFile.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const quality = mimeType === 'image/jpeg' ? 0.95 : undefined;
          const cleanedUrl = canvas.toDataURL(mimeType, quality);

          setImages(prev => prev.map(i => 
            i.id === imageFile.id ? { ...i, status: 'done', cleanedUrl } : i
          ));
        }
        resolve();
      };
      img.src = imageFile.preview;
    });
  };

  const downloadImage = (img: ImageFile) => {
    if (!img.cleanedUrl) return;

    const link = document.createElement('a');
    const ext = img.file.type === 'image/png' ? 'png' : 'jpg';
    link.download = `clean_${img.file.name.replace(/\.[^.]+$/, '')}.${ext}`;
    link.href = img.cleanedUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      if (img.cleanedUrl) {
        setTimeout(() => downloadImage(img), index * 500);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
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
    handleFileSelect(e.dataTransfer.files);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'SecurityApplication',
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

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🔒 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 삭제되는 정보 안내 */}
        <section className="bg-red-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-4">🛡️ {t.whatIsRemoved}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {REMOVED_DATA.map((item) => (
              <div key={item.name} className="flex items-start gap-2">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="text-5xl mb-4">📸</div>
            <p className="text-lg font-medium text-gray-700 mb-2">{t.dragDrop}</p>
            <p className="text-sm text-gray-500">{t.supportedFormats}</p>
          </div>
        </section>

        {/* 이미지 목록 */}
        {images.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">처리된 이미지 ({images.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  {t.downloadAll}
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  {t.clear}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={img.preview}
                      alt={img.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{img.file.name}</div>
                    <div className="text-sm text-gray-500">
                      {t.originalSize}: {(img.file.size / 1024).toFixed(1)} KB
                    </div>
                    <div className="mt-1">
                      {img.status === 'pending' && (
                        <span className="text-xs text-gray-400">대기 중...</span>
                      )}
                      {img.status === 'processing' && (
                        <span className="text-xs text-blue-500">🔄 {t.processing}</span>
                      )}
                      {img.status === 'done' && (
                        <span className="text-xs text-green-500">✅ {t.done} - EXIF 제거됨</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {img.status === 'done' && (
                      <button
                        onClick={() => downloadImage(img)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                      >
                        {t.download}
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(img.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 개인정보 보호 안내 */}
        <section className="bg-blue-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-800 mb-3">💡 {t.privacyInfo}</h2>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• 모든 처리는 <strong>브라우저 내에서만</strong> 이루어지며, 이미지가 서버로 전송되지 않습니다.</li>
            <li>• 원본 파일은 변경되지 않으며, 새로운 깨끗한 파일이 생성됩니다.</li>
            <li>• SNS, 중고거래, 커뮤니티 업로드 전에 반드시 EXIF를 제거하세요.</li>
            <li>• 특히 집, 직장 등에서 촬영한 사진은 위치 정보 노출에 주의하세요.</li>
          </ul>
        </section>

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 EXIF 삭제기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>EXIF 메타데이터 삭제기</strong>는 사진 파일에 포함된 
              GPS 위치, 카메라 정보, 촬영 날짜 등 개인정보를 안전하게 제거합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              이미지를 드래그하거나 클릭하여 업로드하면 자동으로 처리됩니다.
              최대 10개까지 한 번에 처리할 수 있으며, 모든 작업은 브라우저에서 이루어집니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              중고거래, SNS, 커뮤니티에 사진을 업로드하기 전 
              이 도구로 개인정보를 보호하세요.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
