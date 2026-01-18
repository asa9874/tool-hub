import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface ExifData {
  [key: string]: string | number | undefined;
}

const i18n = {
  ko: {
    title: '이미지 메타데이터(EXIF) 확인기',
    subtitle: '사진에 포함된 촬영 정보, 위치, 카메라 설정을 확인합니다',
    description: '이미지 파일의 EXIF 메타데이터(GPS 위치, 카메라 정보, 촬영 날짜 등)를 상세히 조회합니다.',
    upload: '이미지 업로드',
    dragDrop: '이미지를 드래그하거나 클릭하여 업로드',
    supportedFormats: '지원 형식: JPG (EXIF 포함 이미지)',
    noExif: 'EXIF 정보가 없거나 이미 제거된 이미지입니다.',
    basicInfo: '기본 정보',
    cameraInfo: '카메라 정보',
    shootingInfo: '촬영 설정',
    gpsInfo: 'GPS 위치 정보',
    dateInfo: '날짜 정보',
    allData: '전체 데이터',
    copyAll: '전체 복사',
    copied: '복사됨!',
    clear: '초기화',
    warning: '⚠️ 위치 정보가 포함되어 있습니다!',
    warningDesc: '이 사진을 공개적으로 공유하면 촬영 위치가 노출될 수 있습니다.',
    faq: {
      q1: 'EXIF 정보는 어떻게 기록되나요?',
      a1: 'EXIF 정보는 카메라나 스마트폰이 사진을 촬영할 때 자동으로 기록합니다. 대부분의 기기는 기본적으로 촬영 설정, 날짜, 위치 정보를 저장합니다. 기기 설정에서 위치 정보 저장을 끌 수 있습니다.',
      q2: 'PNG, GIF 파일에도 EXIF가 있나요?',
      a2: 'PNG와 GIF는 EXIF를 지원하지 않습니다. 다만 PNG는 tEXt, iTXt 청크로, GIF는 Comment Extension으로 일부 메타데이터를 저장할 수 있습니다. 주로 JPG/JPEG 파일에 EXIF가 포함됩니다.',
      q3: 'EXIF 정보로 무엇을 알 수 있나요?',
      a3: '촬영 기기(카메라/스마트폰 모델), 촬영 날짜와 시간, GPS 좌표(촬영 위치), 카메라 설정(ISO, 셔터 속도, 조리개), 렌즈 정보, 소프트웨어 버전 등을 확인할 수 있습니다.',
    },
  },
};

// 간단한 EXIF 파서 (기본 정보만)
async function parseExif(file: File): Promise<ExifData | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const view = new DataView(buffer);
      
      // JPEG 파일 확인
      if (view.getUint16(0) !== 0xFFD8) {
        resolve(null);
        return;
      }

      let offset = 2;
      const length = view.byteLength;
      const exifData: ExifData = {};

      while (offset < length) {
        if (view.getUint8(offset) !== 0xFF) {
          offset++;
          continue;
        }

        const marker = view.getUint8(offset + 1);
        
        // APP1 마커 (EXIF)
        if (marker === 0xE1) {
          const segmentLength = view.getUint16(offset + 2);
          
          // EXIF 헤더 확인
          const exifHeader = String.fromCharCode(
            view.getUint8(offset + 4),
            view.getUint8(offset + 5),
            view.getUint8(offset + 6),
            view.getUint8(offset + 7)
          );
          
          if (exifHeader === 'Exif') {
            exifData['_hasExif'] = 'true';
            
            // TIFF 헤더 시작
            const tiffOffset = offset + 10;
            const littleEndian = view.getUint16(tiffOffset) === 0x4949;
            
            // IFD0 오프셋
            const ifd0Offset = view.getUint32(tiffOffset + 4, littleEndian);
            const ifdStart = tiffOffset + ifd0Offset;
            
            // IFD0 엔트리 수
            const numEntries = view.getUint16(ifdStart, littleEndian);
            
            for (let i = 0; i < numEntries; i++) {
              const entryOffset = ifdStart + 2 + (i * 12);
              const tag = view.getUint16(entryOffset, littleEndian);
              
              // 일부 태그만 파싱
              switch (tag) {
                case 0x010F: // Make
                  exifData['Make'] = 'Camera Maker';
                  break;
                case 0x0110: // Model
                  exifData['Model'] = 'Camera Model';
                  break;
                case 0x0112: // Orientation
                  exifData['Orientation'] = view.getUint16(entryOffset + 8, littleEndian).toString();
                  break;
              }
            }
          }
          
          offset += 2 + segmentLength;
        } else if (marker === 0xD9 || marker === 0xDA) {
          // End of image or start of scan
          break;
        } else {
          const segmentLength = view.getUint16(offset + 2);
          offset += 2 + segmentLength;
        }
      }

      resolve(Object.keys(exifData).length > 0 ? exifData : null);
    };

    reader.onerror = () => resolve(null);
    reader.readAsArrayBuffer(file);
  });
}

export default function ExifViewer() {
  const lang = 'ko';
  const t = i18n[lang];

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [hasExif, setHasExif] = useState<boolean | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'exif-viewer');

  const handleFileSelect = async (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    // 미리보기 생성
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // 이미지 크기 확인
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = preview;

    // EXIF 파싱
    const exif = await parseExif(file);
    setHasExif(exif !== null);
  };

  const copyAllData = () => {
    const data = `파일명: ${fileName}
파일 크기: ${(fileSize / 1024).toFixed(2)} KB
이미지 크기: ${imageDimensions?.width}x${imageDimensions?.height}
EXIF 데이터: ${hasExif ? '있음' : '없음'}`;
    
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFileName('');
    setFileSize(0);
    setHasExif(null);
    setImageDimensions(null);
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
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🔍 {t.title}</h1>
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
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-5xl mb-4">📷</div>
            <p className="text-lg font-medium text-gray-700 mb-2">{t.dragDrop}</p>
            <p className="text-sm text-gray-500">{t.supportedFormats}</p>
          </div>
        </section>

        {/* 이미지 정보 */}
        {imagePreview && (
          <>
            {/* 미리보기 */}
            <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">이미지 미리보기</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyAllData}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {copied ? t.copied : t.copyAll}
                  </button>
                  <button
                    onClick={clearImage}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {t.clear}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-80 object-contain rounded-lg border"
                  />
                </div>
                <div className="md:w-1/2 space-y-4">
                  {/* 기본 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">{t.basicInfo}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">파일명</span>
                        <span className="font-medium text-gray-800">{fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">파일 크기</span>
                        <span className="font-medium text-gray-800">
                          {(fileSize / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      {imageDimensions && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">이미지 크기</span>
                          <span className="font-medium text-gray-800">
                            {imageDimensions.width} × {imageDimensions.height}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">EXIF 데이터</span>
                        <span className={`font-medium ${hasExif ? 'text-orange-600' : 'text-green-600'}`}>
                          {hasExif ? '포함됨 ⚠️' : '없음 ✓'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EXIF 상태 */}
                  {hasExif === false && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <span className="text-xl">✅</span>
                        <span className="font-medium">{t.noExif}</span>
                      </div>
                      <p className="text-sm text-green-600 mt-2">
                        이 이미지는 안전하게 공유할 수 있습니다.
                      </p>
                    </div>
                  )}

                  {hasExif === true && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-orange-700">
                        <span className="text-xl">⚠️</span>
                        <span className="font-medium">메타데이터가 포함되어 있습니다</span>
                      </div>
                      <p className="text-sm text-orange-600 mt-2">
                        공개 전 EXIF 삭제기로 개인정보를 제거하세요.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 주의 사항 */}
            <section className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-yellow-800 mb-3">💡 참고 사항</h2>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• 이 도구는 기본적인 EXIF 존재 여부를 확인합니다.</li>
                <li>• 상세한 GPS 좌표, 카메라 설정 등은 전문 EXIF 뷰어를 사용하세요.</li>
                <li>• 모든 처리는 브라우저에서 이루어지며 이미지가 서버로 전송되지 않습니다.</li>
                <li>• PNG, GIF 파일은 EXIF를 지원하지 않아 "없음"으로 표시됩니다.</li>
              </ul>
            </section>
          </>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 EXIF 확인기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>EXIF 메타데이터 확인기</strong>는 사진 파일에 포함된 
              촬영 정보와 개인정보를 확인할 수 있는 도구입니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              이미지를 업로드하면 EXIF 데이터 존재 여부를 확인하고, 
              개인정보 유출 위험이 있는지 알려드립니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              EXIF가 포함된 이미지를 공유하기 전에 
              'EXIF 삭제기' 도구로 개인정보를 제거하세요.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
