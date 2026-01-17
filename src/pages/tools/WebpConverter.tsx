import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '이미지 WebP 변환기',
    description: 'PNG, JPG 이미지를 용량이 작고 웹에 최적화된 WebP 포맷으로 변환합니다',
    dropzone: '이미지를 드래그하거나 클릭하여 업로드',
    supported: '지원 형식: PNG, JPG, JPEG, GIF',
    quality: '품질',
    convert: '변환하기',
    download: '다운로드',
    downloadAll: '모두 다운로드',
    original: '원본',
    converted: '변환됨',
    size: '크기',
    reduction: '절감',
    clear: '초기화',
    processing: '변환 중...',
    tip: '💡 품질 80-85%가 용량과 화질의 균형이 좋습니다',
  },
  en: {
    title: 'Image to WebP Converter',
    description: 'Convert PNG, JPG images to WebP format for smaller file sizes and web optimization',
    dropzone: 'Drag & drop images or click to upload',
    supported: 'Supported: PNG, JPG, JPEG, GIF',
    quality: 'Quality',
    convert: 'Convert',
    download: 'Download',
    downloadAll: 'Download All',
    original: 'Original',
    converted: 'Converted',
    size: 'Size',
    reduction: 'Reduction',
    clear: 'Clear',
    processing: 'Converting...',
    tip: '💡 Quality 80-85% offers good balance between size and quality',
  }
};

interface ConvertedImage {
  original: {
    name: string;
    size: number;
    url: string;
  };
  converted: {
    blob: Blob;
    url: string;
    size: number;
  };
}

export default function WebpConverter() {
  const { t } = useLocalizedContent(i18n);
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(85);
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const convertToWebp = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const results: ConvertedImage[] = [];

    for (const file of files) {
      const img = new Image();
      const originalUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  results.push({
                    original: {
                      name: file.name,
                      size: file.size,
                      url: originalUrl,
                    },
                    converted: {
                      blob,
                      url: URL.createObjectURL(blob),
                      size: blob.size,
                    },
                  });
                }
                resolve();
              },
              'image/webp',
              quality / 100
            );
          } else {
            resolve();
          }
        };
        img.src = originalUrl;
      });
    }

    setConverted(results);
    setProcessing(false);
  };

  const downloadImage = (item: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = item.converted.url;
    link.download = item.original.name.replace(/\.[^.]+$/, '.webp');
    link.click();
  };

  const downloadAll = () => {
    converted.forEach(item => downloadImage(item));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const clear = () => {
    converted.forEach(item => {
      URL.revokeObjectURL(item.original.url);
      URL.revokeObjectURL(item.converted.url);
    });
    setFiles([]);
    setConverted([]);
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 드롭존 */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors mb-6"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-gray-600">{t.dropzone}</p>
            <p className="text-sm text-gray-400 mt-1">{t.supported}</p>
          </div>

          {/* 선택된 파일 */}
          {files.length > 0 && converted.length === 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {files.map((file, i) => (
                  <div key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    <span>{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* 품질 설정 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quality}: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-blue-600 mt-1">{t.tip}</p>
              </div>

              <button
                onClick={convertToWebp}
                disabled={processing}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {processing ? t.processing : t.convert}
              </button>
            </div>
          )}

          {/* 변환 결과 */}
          {converted.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {converted.length}개 이미지 변환 완료
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={downloadAll}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {t.downloadAll}
                  </button>
                  <button
                    onClick={clear}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    {t.clear}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {converted.map((item, i) => {
                  const reduction = ((1 - item.converted.size / item.original.size) * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.converted.url}
                          alt={item.original.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.original.name.replace(/\.[^.]+$/, '.webp')}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span>{t.original}: {formatSize(item.original.size)}</span>
                          <span>→</span>
                          <span className="text-green-600">{t.converted}: {formatSize(item.converted.size)}</span>
                          <span className={`font-medium ${Number(reduction) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({reduction}% {t.reduction})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadImage(item)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {t.download}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
