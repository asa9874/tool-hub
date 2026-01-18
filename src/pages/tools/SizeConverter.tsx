import { useState } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

type SizeType = 'shoes' | 'clothes-top' | 'clothes-bottom';
type Gender = 'men' | 'women' | 'kids';

interface SizeChart {
  kr: string;
  us: string;
  eu: string;
  uk: string;
  cm?: string;
}

const i18n = {
  ko: {
    title: '해외 사이즈 변환기',
    subtitle: '미국/유럽/영국 신발·의류 사이즈를 한국 사이즈로 변환하세요',
    description: 'US, EU, UK 등 해외 사이즈를 한국 사이즈로 쉽게 변환합니다. 해외직구 필수 도구.',
    selectType: '카테고리 선택',
    selectGender: '성별 선택',
    types: {
      shoes: '👟 신발',
      'clothes-top': '👕 상의 (티셔츠, 재킷 등)',
      'clothes-bottom': '👖 하의 (바지)',
    },
    genders: {
      men: '남성',
      women: '여성',
      kids: '아동',
    },
    sizeChart: '사이즈 변환표',
    yourSize: '나의 사이즈 찾기',
    inputSize: '사이즈 입력',
    selectCountry: '국가 선택',
    convert: '변환하기',
    result: '변환 결과',
    countries: {
      kr: '🇰🇷 한국',
      us: '🇺🇸 미국',
      eu: '🇪🇺 유럽',
      uk: '🇬🇧 영국',
    },
    tips: '💡 해외직구 사이즈 팁',
    tipsList: [
      '같은 브랜드라도 제품마다 핏이 다를 수 있으니 리뷰를 꼭 확인하세요.',
      '신발은 발 길이(cm)를 정확히 측정한 후 구매하는 것이 가장 확실합니다.',
      '의류는 실측 사이즈(가슴둘레, 어깨너비 등)를 비교하는 것이 좋습니다.',
      'EU 사이즈는 브랜드마다 약간씩 차이가 있을 수 있습니다.',
    ],
    faq: {
      q1: '해외 신발 사이즈가 맞지 않으면 어떻게 하나요?',
      a1: '대부분의 해외 쇼핑몰은 반품/교환 정책을 제공합니다. 구매 전 반품 정책을 확인하고, 무료 반품이 가능한 곳에서 구매하는 것을 추천합니다. 발볼이 넓은 분은 0.5~1 사이즈 업을 고려하세요.',
      q2: 'US 사이즈와 UK 사이즈의 차이는 무엇인가요?',
      a2: '같은 신발이라도 US와 UK 사이즈가 다릅니다. 일반적으로 남성화 기준 US = UK + 0.5~1, 여성화 기준 US = UK + 2 정도 차이가 납니다. 본 변환표를 참고하세요.',
      q3: '아동 사이즈는 어떻게 확인하나요?',
      a3: '아동 사이즈는 나이보다 발 길이를 기준으로 선택하는 것이 좋습니다. 성장을 고려해 0.5~1cm 여유 있는 사이즈를 추천합니다.',
    },
  },
};

// 신발 사이즈 차트
const shoeSizeCharts: Record<Gender, SizeChart[]> = {
  men: [
    { kr: '250', us: '7', eu: '40', uk: '6', cm: '25' },
    { kr: '255', us: '7.5', eu: '40.5', uk: '6.5', cm: '25.5' },
    { kr: '260', us: '8', eu: '41', uk: '7', cm: '26' },
    { kr: '265', us: '8.5', eu: '42', uk: '7.5', cm: '26.5' },
    { kr: '270', us: '9', eu: '42.5', uk: '8', cm: '27' },
    { kr: '275', us: '9.5', eu: '43', uk: '8.5', cm: '27.5' },
    { kr: '280', us: '10', eu: '44', uk: '9', cm: '28' },
    { kr: '285', us: '10.5', eu: '44.5', uk: '9.5', cm: '28.5' },
    { kr: '290', us: '11', eu: '45', uk: '10', cm: '29' },
    { kr: '295', us: '11.5', eu: '45.5', uk: '10.5', cm: '29.5' },
    { kr: '300', us: '12', eu: '46', uk: '11', cm: '30' },
  ],
  women: [
    { kr: '220', us: '5', eu: '35', uk: '2.5', cm: '22' },
    { kr: '225', us: '5.5', eu: '35.5', uk: '3', cm: '22.5' },
    { kr: '230', us: '6', eu: '36', uk: '3.5', cm: '23' },
    { kr: '235', us: '6.5', eu: '36.5', uk: '4', cm: '23.5' },
    { kr: '240', us: '7', eu: '37', uk: '4.5', cm: '24' },
    { kr: '245', us: '7.5', eu: '37.5', uk: '5', cm: '24.5' },
    { kr: '250', us: '8', eu: '38', uk: '5.5', cm: '25' },
    { kr: '255', us: '8.5', eu: '38.5', uk: '6', cm: '25.5' },
    { kr: '260', us: '9', eu: '39', uk: '6.5', cm: '26' },
    { kr: '265', us: '9.5', eu: '40', uk: '7', cm: '26.5' },
    { kr: '270', us: '10', eu: '41', uk: '7.5', cm: '27' },
  ],
  kids: [
    { kr: '140', us: '8C', eu: '24', uk: '7', cm: '14' },
    { kr: '150', us: '9C', eu: '25', uk: '8', cm: '15' },
    { kr: '160', us: '10C', eu: '27', uk: '9', cm: '16' },
    { kr: '170', us: '11C', eu: '28', uk: '10', cm: '17' },
    { kr: '180', us: '12C', eu: '30', uk: '11', cm: '18' },
    { kr: '190', us: '13C', eu: '31', uk: '12', cm: '19' },
    { kr: '200', us: '1Y', eu: '32', uk: '13', cm: '20' },
    { kr: '210', us: '2Y', eu: '33', uk: '1', cm: '21' },
    { kr: '220', us: '3Y', eu: '35', uk: '2', cm: '22' },
    { kr: '230', us: '4Y', eu: '36', uk: '3', cm: '23' },
  ],
};

// 상의 사이즈 차트
const topSizeCharts: Record<Gender, SizeChart[]> = {
  men: [
    { kr: '90(S)', us: 'S', eu: '44', uk: '34' },
    { kr: '95(M)', us: 'M', eu: '46-48', uk: '36-38' },
    { kr: '100(L)', us: 'L', eu: '50-52', uk: '40-42' },
    { kr: '105(XL)', us: 'XL', eu: '54-56', uk: '44-46' },
    { kr: '110(2XL)', us: 'XXL', eu: '58-60', uk: '48-50' },
  ],
  women: [
    { kr: '85(S)', us: 'XS-S', eu: '34-36', uk: '6-8' },
    { kr: '90(M)', us: 'S-M', eu: '38', uk: '10' },
    { kr: '95(L)', us: 'M-L', eu: '40', uk: '12' },
    { kr: '100(XL)', us: 'L-XL', eu: '42', uk: '14' },
    { kr: '105(2XL)', us: 'XL-XXL', eu: '44', uk: '16' },
  ],
  kids: [
    { kr: '100', us: '3T', eu: '98', uk: '2-3Y' },
    { kr: '110', us: '4T', eu: '104', uk: '3-4Y' },
    { kr: '120', us: '5-6', eu: '116', uk: '5-6Y' },
    { kr: '130', us: '7-8', eu: '128', uk: '7-8Y' },
    { kr: '140', us: '10', eu: '140', uk: '9-10Y' },
    { kr: '150', us: '12', eu: '152', uk: '11-12Y' },
  ],
};

// 하의 사이즈 차트
const bottomSizeCharts: Record<Gender, SizeChart[]> = {
  men: [
    { kr: '28', us: '28', eu: '44', uk: '28' },
    { kr: '30', us: '30', eu: '46', uk: '30' },
    { kr: '32', us: '32', eu: '48', uk: '32' },
    { kr: '34', us: '34', eu: '50', uk: '34' },
    { kr: '36', us: '36', eu: '52', uk: '36' },
    { kr: '38', us: '38', eu: '54', uk: '38' },
  ],
  women: [
    { kr: '25', us: '0-2', eu: '34', uk: '6' },
    { kr: '26', us: '2-4', eu: '36', uk: '8' },
    { kr: '27', us: '4-6', eu: '38', uk: '10' },
    { kr: '28', us: '6-8', eu: '40', uk: '12' },
    { kr: '29', us: '8-10', eu: '42', uk: '14' },
    { kr: '30', us: '10-12', eu: '44', uk: '16' },
  ],
  kids: [
    { kr: '100', us: '3T', eu: '98', uk: '2-3Y' },
    { kr: '110', us: '4T', eu: '104', uk: '3-4Y' },
    { kr: '120', us: '5-6', eu: '116', uk: '5-6Y' },
    { kr: '130', us: '7-8', eu: '128', uk: '7-8Y' },
    { kr: '140', us: '10', eu: '140', uk: '9-10Y' },
  ],
};

export default function SizeConverter() {
  const lang = 'ko';
  const t = i18n[lang];

  const [sizeType, setSizeType] = useState<SizeType>('shoes');
  const [gender, setGender] = useState<Gender>('men');
  const [inputCountry, setInputCountry] = useState<'kr' | 'us' | 'eu' | 'uk'>('us');
  const [inputSize, setInputSize] = useState<string>('');
  const [convertedResult, setConvertedResult] = useState<SizeChart | null>(null);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'size-converter');

  // 현재 선택된 사이즈 차트
  const getCurrentChart = (): SizeChart[] => {
    switch (sizeType) {
      case 'shoes':
        return shoeSizeCharts[gender];
      case 'clothes-top':
        return topSizeCharts[gender];
      case 'clothes-bottom':
        return bottomSizeCharts[gender];
      default:
        return shoeSizeCharts[gender];
    }
  };

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t.faq.q1,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 },
      },
      {
        '@type': 'Question',
        name: t.faq.q2,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 },
      },
      {
        '@type': 'Question',
        name: t.faq.q3,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 },
      },
    ],
  };

  // 사이즈 변환
  const convertSize = () => {
    const chart = getCurrentChart();
    const normalizedInput = inputSize.trim().toUpperCase();

    const found = chart.find((item) => {
      const countrySize = item[inputCountry].toUpperCase();
      return countrySize === normalizedInput || countrySize.includes(normalizedInput);
    });

    if (found) {
      setConvertedResult(found);
    } else {
      alert('해당 사이즈를 찾을 수 없습니다. 변환표를 참고해주세요.');
    }
  };

  const currentChart = getCurrentChart();

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">👗 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 카테고리/성별 선택 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.selectType}</label>
              <div className="space-y-2">
                {(Object.keys(t.types) as SizeType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSizeType(type);
                      setConvertedResult(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      sizeType === type ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    {t.types[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* 성별 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.selectGender}</label>
              <div className="flex gap-2">
                {(Object.keys(t.genders) as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      setConvertedResult(null);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      gender === g ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    {t.genders[g]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 사이즈 변환 입력 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 {t.yourSize}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                {t.selectCountry}
              </label>
              <select
                id="country"
                value={inputCountry}
                onChange={(e) => setInputCountry(e.target.value as 'kr' | 'us' | 'eu' | 'uk')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="us">{t.countries.us}</option>
                <option value="eu">{t.countries.eu}</option>
                <option value="uk">{t.countries.uk}</option>
                <option value="kr">{t.countries.kr}</option>
              </select>
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                {t.inputSize}
              </label>
              <input
                type="text"
                id="size"
                value={inputSize}
                onChange={(e) => setInputSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="예: 9, M, 42"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={convertSize}
                className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                {t.convert}
              </button>
            </div>
          </div>

          {/* 변환 결과 */}
          {convertedResult && (
            <div className="mt-6 p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t.result}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">🇰🇷 한국</p>
                  <p className="text-2xl font-bold text-purple-600">{convertedResult.kr}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">🇺🇸 미국</p>
                  <p className="text-2xl font-bold text-blue-600">{convertedResult.us}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">🇪🇺 유럽</p>
                  <p className="text-2xl font-bold text-green-600">{convertedResult.eu}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">🇬🇧 영국</p>
                  <p className="text-2xl font-bold text-red-600">{convertedResult.uk}</p>
                </div>
              </div>
              {convertedResult.cm && (
                <p className="text-center mt-4 text-gray-600">
                  발 길이: <span className="font-bold">{convertedResult.cm}cm</span>
                </p>
              )}
            </div>
          )}
        </section>

        {/* 사이즈 차트 테이블 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📏 {t.sizeChart}</h2>

          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold">🇰🇷 한국</th>
                <th className="px-4 py-3 text-left font-semibold">🇺🇸 미국</th>
                <th className="px-4 py-3 text-left font-semibold">🇪🇺 유럽</th>
                <th className="px-4 py-3 text-left font-semibold">🇬🇧 영국</th>
                {sizeType === 'shoes' && <th className="px-4 py-3 text-left font-semibold">📏 cm</th>}
              </tr>
            </thead>
            <tbody>
              {currentChart.map((size, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium">{size.kr}</td>
                  <td className="px-4 py-3">{size.us}</td>
                  <td className="px-4 py-3">{size.eu}</td>
                  <td className="px-4 py-3">{size.uk}</td>
                  {sizeType === 'shoes' && <td className="px-4 py-3">{size.cm}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* 팁 섹션 */}
        <section className="bg-yellow-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.tips}</h2>
          <ul className="space-y-3">
            {t.tipsList.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-500">✓</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 해외 사이즈 변환기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>해외 사이즈 변환기</strong>는 해외 직구 시 가장 큰 고민인 사이즈 문제를 해결해드립니다. 미국(US), 유럽(EU), 영국(UK)
              사이즈를 한국 사이즈로 쉽게 변환할 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              나이키, 아디다스, 자라, H&M 등 해외 브랜드 쇼핑 시 사이즈 때문에 망설이셨나요? 신발 사이즈는 발 길이(cm)를 기준으로, 의류는 가슴둘레나
              허리둘레를 기준으로 변환표를 확인하세요.
            </p>
            <p className="text-gray-600 leading-relaxed">
              해외 직구의 핵심은 정확한 사이즈 선택입니다. 브랜드마다 핏이 다를 수 있으므로 구매 전 해당 브랜드의 사이즈 가이드와 리뷰를 함께
              확인하는 것을 추천합니다. 이 도구와 함께 실패 없는 해외 쇼핑을 즐기세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
