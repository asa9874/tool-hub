import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '색상 코드 변환기',
    description: 'HEX, RGB, HSL 색상 코드를 상호 변환하고 보색, 유사색을 확인하세요',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    copy: '복사',
    copied: '복사됨!',
    preview: '미리보기',
    complementary: '보색',
    analogous: '유사색',
    triadic: '삼각 색상',
    splitComplementary: '분할 보색',
    colorPicker: '색상 선택',
    invalidColor: '유효하지 않은 색상',
    recentColors: '최근 사용',
  },
  en: {
    title: 'Color Code Converter',
    description: 'Convert between HEX, RGB, HSL color codes and find complementary colors',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    copy: 'Copy',
    copied: 'Copied!',
    preview: 'Preview',
    complementary: 'Complementary',
    analogous: 'Analogous',
    triadic: 'Triadic',
    splitComplementary: 'Split Complementary',
    colorPicker: 'Color Picker',
    invalidColor: 'Invalid color',
    recentColors: 'Recent Colors',
  }
};

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }

export default function ColorConverter() {
  const { t } = useLocalizedContent(i18n);
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentColors');
    if (saved) setRecentColors(JSON.parse(saved));
  }, []);

  const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const updateFromHex = (newHex: string) => {
    const clean = newHex.startsWith('#') ? newHex : '#' + newHex;
    setHex(clean);
    const rgbVal = hexToRgb(clean);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
      addRecentColor(clean);
    }
  };

  const updateFromRgb = (newRgb: RGB) => {
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    addRecentColor(newHex);
  };

  const updateFromHsl = (newHsl: HSL) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    addRecentColor(newHex);
  };

  const addRecentColor = (color: string) => {
    const updated = [color, ...recentColors.filter(c => c !== color)].slice(0, 10);
    setRecentColors(updated);
    localStorage.setItem('recentColors', JSON.stringify(updated));
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getComplementary = (): string => {
    const newH = (hsl.h + 180) % 360;
    const newRgb = hslToRgb(newH, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };

  const getAnalogous = (): string[] => {
    return [-30, 30].map(offset => {
      const newH = (hsl.h + offset + 360) % 360;
      const newRgb = hslToRgb(newH, hsl.s, hsl.l);
      return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    });
  };

  const getTriadic = (): string[] => {
    return [120, 240].map(offset => {
      const newH = (hsl.h + offset) % 360;
      const newRgb = hslToRgb(newH, hsl.s, hsl.l);
      return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    });
  };

  const ColorSwatch = ({ color, label }: { color: string; label?: string }) => (
    <button
      onClick={() => updateFromHex(color)}
      className="flex flex-col items-center gap-1"
    >
      <div
        className="w-12 h-12 rounded-lg border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
        style={{ backgroundColor: color }}
      />
      {label && <span className="text-xs text-gray-500">{color}</span>}
    </button>
  );

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 미리보기 & 컬러피커 */}
          <div className="flex items-center gap-6 mb-8">
            <div
              className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
              style={{ backgroundColor: hex }}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.colorPicker}
              </label>
              <input
                type="color"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-20 h-10 cursor-pointer rounded"
              />
            </div>
          </div>

          {/* 색상 코드 입력 */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* HEX */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.hex}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="flex-1 p-2 border rounded font-mono uppercase"
                  maxLength={7}
                />
                <button
                  onClick={() => copyToClipboard(hex, 'hex')}
                  className={`px-2 rounded ${copied === 'hex' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  {copied === 'hex' ? '✓' : t.copy}
                </button>
              </div>
            </div>

            {/* RGB */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.rgb}</label>
              <div className="flex gap-1">
                {(['r', 'g', 'b'] as const).map(channel => (
                  <input
                    key={channel}
                    type="number"
                    min="0"
                    max="255"
                    value={rgb[channel]}
                    onChange={(e) => updateFromRgb({ ...rgb, [channel]: Number(e.target.value) })}
                    className="w-16 p-2 border rounded text-center"
                  />
                ))}
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  className={`px-2 rounded ${copied === 'rgb' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  {copied === 'rgb' ? '✓' : t.copy}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
            </div>

            {/* HSL */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.hsl}</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                  className="w-16 p-2 border rounded text-center"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                  className="w-16 p-2 border rounded text-center"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                  className="w-16 p-2 border rounded text-center"
                />
                <button
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  className={`px-2 rounded ${copied === 'hsl' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  {copied === 'hsl' ? '✓' : t.copy}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
            </div>
          </div>

          {/* 색상 조합 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t.complementary}</h3>
              <div className="flex gap-2">
                <ColorSwatch color={hex} />
                <span className="self-center text-gray-400">↔</span>
                <ColorSwatch color={getComplementary()} label={getComplementary()} />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t.analogous}</h3>
              <div className="flex gap-2">
                <ColorSwatch color={getAnalogous()[0]} />
                <ColorSwatch color={hex} />
                <ColorSwatch color={getAnalogous()[1]} />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t.triadic}</h3>
              <div className="flex gap-2">
                <ColorSwatch color={hex} />
                <ColorSwatch color={getTriadic()[0]} />
                <ColorSwatch color={getTriadic()[1]} />
              </div>
            </div>

            {recentColors.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{t.recentColors}</h3>
                <div className="flex flex-wrap gap-2">
                  {recentColors.map((color, i) => (
                    <ColorSwatch key={i} color={color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
