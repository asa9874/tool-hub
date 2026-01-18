import { useState, useCallback } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface ColorPalette {
  id: number;
  colors: string[];
  name: string;
}

const i18n = {
  ko: {
    title: '랜덤 색상 조합 생성기',
    subtitle: '버튼을 누르면 어울리는 5가지 색상 조합을 제안합니다',
    description: '디자인, PPT, 웹사이트에 활용할 수 있는 색상 팔레트를 랜덤으로 생성합니다.',
    generate: '🎨 새로운 팔레트 생성',
    copy: '복사',
    copied: '복사됨!',
    copyAll: '전체 복사',
    lock: '잠금',
    unlock: '해제',
    save: '저장',
    savedPalettes: '저장된 팔레트',
    clearSaved: '전체 삭제',
    exportCSS: 'CSS 내보내기',
    paletteTypes: '팔레트 유형',
    types: {
      random: '🎲 완전 랜덤',
      analogous: '🌈 유사색',
      complementary: '⚡ 보색',
      triadic: '🔺 삼원색',
      monochromatic: '🎭 단색조',
      pastel: '🍬 파스텔',
      vibrant: '✨ 비비드',
      earth: '🌿 어스톤',
    },
    faq: {
      q1: '어떤 색상 조합이 좋은 건가요?',
      a1: '목적에 따라 다릅니다. 유사색 조합은 부드럽고 조화롭고, 보색 조합은 강렬한 대비를 줍니다. 파스텔 톤은 차분하고, 비비드 톤은 활기찹니다. 여러 팔레트를 생성해보고 프로젝트에 맞는 것을 선택하세요.',
      q2: 'HEX 코드란 무엇인가요?',
      a2: 'HEX 코드는 #으로 시작하는 6자리 색상 코드입니다. 예를 들어 #FF0000은 빨강, #00FF00은 초록입니다. 웹, 그래픽 디자인, PPT 등 대부분의 디지털 도구에서 이 코드로 정확한 색상을 지정할 수 있습니다.',
      q3: '잠금 기능은 어떻게 사용하나요?',
      a3: '마음에 드는 색상을 잠그면 새 팔레트 생성 시 해당 색상은 유지됩니다. 예를 들어 메인 색상을 정해두고 어울리는 서브 색상만 계속 바꿔볼 수 있습니다.',
    },
  },
};

type PaletteType = 'random' | 'analogous' | 'complementary' | 'triadic' | 'monochromatic' | 'pastel' | 'vibrant' | 'earth';

export default function PaletteGenerator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [colors, setColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']);
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [paletteType, setPaletteType] = useState<PaletteType>('random');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'palette-generator');

  // HSL to HEX 변환
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // 랜덤 색상 생성
  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  // 팔레트 타입별 색상 생성
  const generatePalette = useCallback(() => {
    const newColors = [...colors];
    const baseHue = Math.random() * 360;

    for (let i = 0; i < 5; i++) {
      if (locked[i]) continue;

      switch (paletteType) {
        case 'random':
          newColors[i] = generateRandomColor();
          break;

        case 'analogous': {
          const hue = (baseHue + i * 30) % 360;
          const sat = 60 + Math.random() * 20;
          const light = 50 + Math.random() * 20;
          newColors[i] = hslToHex(hue, sat, light);
          break;
        }

        case 'complementary': {
          const hue = i < 3 ? baseHue : (baseHue + 180) % 360;
          const sat = 60 + Math.random() * 25;
          const light = 40 + i * 10;
          newColors[i] = hslToHex(hue + (i % 3) * 10, sat, light);
          break;
        }

        case 'triadic': {
          const hue = (baseHue + (i % 3) * 120) % 360;
          const sat = 60 + Math.random() * 20;
          const light = 45 + (i % 2) * 20;
          newColors[i] = hslToHex(hue, sat, light);
          break;
        }

        case 'monochromatic': {
          const sat = 50 + Math.random() * 30;
          const light = 20 + i * 15;
          newColors[i] = hslToHex(baseHue, sat, light);
          break;
        }

        case 'pastel': {
          const hue = (baseHue + i * 50) % 360;
          const sat = 40 + Math.random() * 20;
          const light = 80 + Math.random() * 10;
          newColors[i] = hslToHex(hue, sat, light);
          break;
        }

        case 'vibrant': {
          const hue = (baseHue + i * 60) % 360;
          const sat = 80 + Math.random() * 20;
          const light = 50 + Math.random() * 10;
          newColors[i] = hslToHex(hue, sat, light);
          break;
        }

        case 'earth': {
          const hue = 20 + Math.random() * 40; // 갈색-녹색 범위
          const sat = 30 + Math.random() * 40;
          const light = 30 + i * 12;
          newColors[i] = hslToHex(hue, sat, light);
          break;
        }
      }
    }

    setColors(newColors);
  }, [colors, locked, paletteType]);

  // 복사
  const copyColor = async (color: string, index: number) => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // 전체 복사
  const copyAll = async () => {
    const text = colors.join(', ');
    await navigator.clipboard.writeText(text);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // 잠금 토글
  const toggleLock = (index: number) => {
    const newLocked = [...locked];
    newLocked[index] = !newLocked[index];
    setLocked(newLocked);
  };

  // 저장
  const savePalette = () => {
    const newPalette: ColorPalette = {
      id: Date.now(),
      colors: [...colors],
      name: `팔레트 ${savedPalettes.length + 1}`,
    };
    setSavedPalettes([...savedPalettes, newPalette]);
  };

  // CSS 내보내기
  const exportCSS = () => {
    const css = `:root {
  --color-primary: ${colors[0]};
  --color-secondary: ${colors[1]};
  --color-accent: ${colors[2]};
  --color-background: ${colors[3]};
  --color-text: ${colors[4]};
}`;
    navigator.clipboard.writeText(css);
    alert('CSS 코드가 클립보드에 복사되었습니다!');
  };

  // 텍스트 대비 색상 계산
  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'DesignApplication',
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🎨 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 팔레트 타입 선택 */}
        <section className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">{t.paletteTypes}</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(t.types) as PaletteType[]).map((type) => (
              <button
                key={type}
                onClick={() => setPaletteType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  paletteType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                }`}
              >
                {t.types[type]}
              </button>
            ))}
          </div>
        </section>

        {/* 메인 팔레트 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 색상 바 */}
          <div className="flex h-40 md:h-52 rounded-xl overflow-hidden mb-6">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end p-2 md:p-4 cursor-pointer transition-all hover:flex-[1.2] group relative"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color, index)}
              >
                {/* 잠금 아이콘 */}
                {locked[index] && (
                  <div className="absolute top-2 right-2 text-lg" style={{ color: getContrastColor(color) }}>
                    🔒
                  </div>
                )}

                {/* HEX 코드 */}
                <div
                  className="font-mono text-sm md:text-base font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getContrastColor(color) }}
                >
                  {copiedIndex === index ? t.copied : color}
                </div>

                {/* 잠금 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  className="mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: getContrastColor(color),
                    color: color,
                  }}
                >
                  {locked[index] ? t.unlock : t.lock}
                </button>
              </div>
            ))}
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={generatePalette}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t.generate}
            </button>
            <button
              onClick={copyAll}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {copiedIndex === -1 ? t.copied : t.copyAll}
            </button>
            <button
              onClick={savePalette}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {t.save}
            </button>
            <button
              onClick={exportCSS}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {t.exportCSS}
            </button>
          </div>
        </section>

        {/* 저장된 팔레트 */}
        {savedPalettes.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t.savedPalettes}</h2>
              <button
                onClick={() => setSavedPalettes([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t.clearSaved}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="flex h-16 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-indigo-500"
                  onClick={() => setColors(palette.colors)}
                >
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ 섹션 */}
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

        {/* 사용법 설명 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 색상 조합 생성기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>랜덤 색상 조합 생성기</strong>는 어울리는 5가지 색상 조합을 제안하는 디자인 도구입니다.
              PPT, 웹사이트, 포스터, 인스타그램 피드 등 다양한 디자인 작업에 활용하세요.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              완전 랜덤부터 유사색, 보색, 파스텔 등 8가지 팔레트 유형을 제공합니다.
              마음에 드는 색상은 잠금 기능으로 고정하고 나머지만 새로 생성할 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              색상을 클릭하면 HEX 코드가 복사되고, CSS 내보내기로 웹 개발에 바로 활용할 수 있습니다.
              좋은 팔레트는 저장해두고 나중에 다시 불러와 사용하세요. 디자인 영감이 필요할 때, 이 도구를 활용해보세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
