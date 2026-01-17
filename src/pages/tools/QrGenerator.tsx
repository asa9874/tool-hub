import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: 'QR 코드 생성기',
    description: '텍스트나 URL을 입력하면 즉시 QR 코드를 생성하고 이미지로 저장할 수 있습니다',
    inputLabel: '텍스트 또는 URL 입력',
    placeholder: 'https://example.com',
    generate: 'QR 코드 생성',
    download: 'PNG로 다운로드',
    downloadSvg: 'SVG로 다운로드',
    size: '크기',
    bgColor: '배경색',
    fgColor: 'QR 색상',
    preview: '미리보기',
    copy: '클립보드에 복사',
    copied: '복사됨!',
    empty: '텍스트를 입력하세요',
  },
  en: {
    title: 'QR Code Generator',
    description: 'Enter text or URL to instantly generate a QR code and save it as an image',
    inputLabel: 'Enter text or URL',
    placeholder: 'https://example.com',
    generate: 'Generate QR Code',
    download: 'Download PNG',
    downloadSvg: 'Download SVG',
    size: 'Size',
    bgColor: 'Background Color',
    fgColor: 'QR Color',
    preview: 'Preview',
    copy: 'Copy to Clipboard',
    copied: 'Copied!',
    empty: 'Please enter text',
  }
};

export default function QrGenerator() {
  const { t } = useLocalizedContent(i18n);
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadPng = () => {
    if (!qrRef.current || !text) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadSvg = () => {
    if (!qrRef.current || !text) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrRef.current || !text) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = async () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
      />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.inputLabel}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full p-3 border rounded-lg resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.size}: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.bgColor}
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fgColor}
                  </label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={downloadPng}
                  disabled={!text}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t.download}
                </button>
                <button
                  onClick={downloadSvg}
                  disabled={!text}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t.downloadSvg}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!text}
                  className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t.preview}</h3>
              <div
                ref={qrRef}
                className="p-4 rounded-lg border-2 border-dashed border-gray-300"
                style={{ backgroundColor: bgColor }}
              >
                {text ? (
                  <QRCodeSVG
                    value={text}
                    size={size > 300 ? 300 : size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                    {t.empty}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
