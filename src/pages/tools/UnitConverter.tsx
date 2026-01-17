import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 단위 카테고리와 변환 정보
const categories = {
  length: {
    name: '길이',
    units: [
      { id: 'mm', name: '밀리미터 (mm)', ratio: 1 },
      { id: 'cm', name: '센티미터 (cm)', ratio: 10 },
      { id: 'm', name: '미터 (m)', ratio: 1000 },
      { id: 'km', name: '킬로미터 (km)', ratio: 1000000 },
      { id: 'in', name: '인치 (in)', ratio: 25.4 },
      { id: 'ft', name: '피트 (ft)', ratio: 304.8 },
      { id: 'yd', name: '야드 (yd)', ratio: 914.4 },
      { id: 'mi', name: '마일 (mi)', ratio: 1609344 },
    ],
  },
  area: {
    name: '면적',
    units: [
      { id: 'sqm', name: '제곱미터 (m²)', ratio: 1 },
      { id: 'sqkm', name: '제곱킬로미터 (km²)', ratio: 1000000 },
      { id: 'sqft', name: '제곱피트 (ft²)', ratio: 0.092903 },
      { id: 'pyeong', name: '평', ratio: 3.305785 },
      { id: 'acre', name: '에이커', ratio: 4046.86 },
      { id: 'ha', name: '헥타르 (ha)', ratio: 10000 },
    ],
  },
  weight: {
    name: '무게',
    units: [
      { id: 'mg', name: '밀리그램 (mg)', ratio: 1 },
      { id: 'g', name: '그램 (g)', ratio: 1000 },
      { id: 'kg', name: '킬로그램 (kg)', ratio: 1000000 },
      { id: 't', name: '톤 (t)', ratio: 1000000000 },
      { id: 'oz', name: '온스 (oz)', ratio: 28349.5 },
      { id: 'lb', name: '파운드 (lb)', ratio: 453592 },
      { id: 'geun', name: '근', ratio: 600000 },
    ],
  },
  temperature: {
    name: '온도',
    units: [
      { id: 'c', name: '섭씨 (°C)', ratio: 1 },
      { id: 'f', name: '화씨 (°F)', ratio: 1 },
      { id: 'k', name: '켈빈 (K)', ratio: 1 },
    ],
  },
  data: {
    name: '데이터',
    units: [
      { id: 'b', name: '바이트 (B)', ratio: 1 },
      { id: 'kb', name: '킬로바이트 (KB)', ratio: 1024 },
      { id: 'mb', name: '메가바이트 (MB)', ratio: 1048576 },
      { id: 'gb', name: '기가바이트 (GB)', ratio: 1073741824 },
      { id: 'tb', name: '테라바이트 (TB)', ratio: 1099511627776 },
    ],
  },
};

type CategoryKey = keyof typeof categories;

const i18n = {
  ko: {
    title: '단위 변환기',
    description: '길이, 면적, 무게, 온도, 데이터 용량 등 다양한 단위를 쉽게 변환합니다.',
    from: '변환할 값',
    to: '변환 결과',
    swap: '↔️ 단위 바꾸기',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '평수를 제곱미터로 어떻게 변환하나요?',
          answer: '1평 = 약 3.305785 m²입니다. 예를 들어, 30평 아파트는 약 99.17m²입니다.',
        },
        {
          question: '인치를 센티미터로 변환하는 공식은?',
          answer: '1인치 = 2.54cm입니다. 인치 값에 2.54를 곱하면 센티미터가 됩니다.',
        },
        {
          question: '파운드와 킬로그램의 관계는?',
          answer: '1파운드(lb) = 약 0.4536kg입니다. 1kg = 약 2.205파운드입니다.',
        },
      ],
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>('length');
  const [fromUnit, setFromUnit] = useState('cm');
  const [toUnit, setToUnit] = useState('in');
  const [value, setValue] = useState('');
  const lang = 'ko';
  const t = i18n[lang];

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'unit-converter');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const currentCategory = categories[category];

  // 카테고리 변경 시 기본 단위 설정
  const handleCategoryChange = (newCategory: CategoryKey) => {
    setCategory(newCategory);
    const units = categories[newCategory].units;
    setFromUnit(units[0].id);
    setToUnit(units[1].id);
    setValue('');
  };

  // 단위 변환 계산
  const result = useMemo(() => {
    if (!value || isNaN(parseFloat(value))) return '';

    const numValue = parseFloat(value);

    // 온도는 특별 처리
    if (category === 'temperature') {
      let celsius: number;

      // 입력값을 섭씨로 변환
      if (fromUnit === 'c') celsius = numValue;
      else if (fromUnit === 'f') celsius = (numValue - 32) * 5 / 9;
      else celsius = numValue - 273.15; // kelvin

      // 섭씨를 목표 단위로 변환
      let result: number;
      if (toUnit === 'c') result = celsius;
      else if (toUnit === 'f') result = celsius * 9 / 5 + 32;
      else result = celsius + 273.15; // kelvin

      return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    // 일반 단위 변환
    const fromRatio = currentCategory.units.find((u) => u.id === fromUnit)?.ratio || 1;
    const toRatio = currentCategory.units.find((u) => u.id === toUnit)?.ratio || 1;

    const baseValue = numValue * fromRatio;
    const convertedValue = baseValue / toRatio;

    return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, fromUnit, toUnit, category, currentCategory]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        {/* 카테고리 선택 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categories[key].name}
            </button>
          ))}
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.from}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="숫자 입력"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 결과 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.to}</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg bg-blue-50 min-h-[52px] flex items-center font-semibold text-blue-700 mb-3">
                {result || '0'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 단위 교환 버튼 */}
          <button
            onClick={handleSwap}
            className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.swap}
          </button>
        </section>

        {/* 빠른 변환 예시 */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 자주 쓰는 변환</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {category === 'length' && (
              <>
                <div className="bg-white p-3 rounded-lg">1 인치 = 2.54 cm</div>
                <div className="bg-white p-3 rounded-lg">1 피트 = 30.48 cm</div>
                <div className="bg-white p-3 rounded-lg">1 마일 = 1.609 km</div>
                <div className="bg-white p-3 rounded-lg">1 야드 = 91.44 cm</div>
              </>
            )}
            {category === 'area' && (
              <>
                <div className="bg-white p-3 rounded-lg">1 평 = 3.3058 m²</div>
                <div className="bg-white p-3 rounded-lg">10평 = 33.058 m²</div>
                <div className="bg-white p-3 rounded-lg">30평 = 99.17 m² (약 100m²)</div>
                <div className="bg-white p-3 rounded-lg">1 에이커 = 4,047 m²</div>
              </>
            )}
            {category === 'weight' && (
              <>
                <div className="bg-white p-3 rounded-lg">1 파운드 = 453.6 g</div>
                <div className="bg-white p-3 rounded-lg">1 온스 = 28.35 g</div>
                <div className="bg-white p-3 rounded-lg">1 근 = 600 g</div>
                <div className="bg-white p-3 rounded-lg">1 kg = 2.205 파운드</div>
              </>
            )}
            {category === 'temperature' && (
              <>
                <div className="bg-white p-3 rounded-lg">0°C = 32°F = 273.15K</div>
                <div className="bg-white p-3 rounded-lg">100°C = 212°F = 373.15K</div>
                <div className="bg-white p-3 rounded-lg">체온 36.5°C = 97.7°F</div>
                <div className="bg-white p-3 rounded-lg">°F = °C × 9/5 + 32</div>
              </>
            )}
            {category === 'data' && (
              <>
                <div className="bg-white p-3 rounded-lg">1 KB = 1,024 바이트</div>
                <div className="bg-white p-3 rounded-lg">1 MB = 1,024 KB</div>
                <div className="bg-white p-3 rounded-lg">1 GB = 1,024 MB</div>
                <div className="bg-white p-3 rounded-lg">1 TB = 1,024 GB</div>
              </>
            )}
          </div>
        </section>

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.faq.title}</h2>
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <article key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {item.question}</h3>
                <p className="text-gray-600 leading-relaxed">A. {item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/percent-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">퍼센트 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">비율, 증감률 계산</p>
            </Link>
            <Link to="/tools/salary-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">실수령액 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">세후 급여 계산</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
