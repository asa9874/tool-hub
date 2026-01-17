import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '퍼센트 계산기',
    description: '퍼센트(%) 계산을 쉽게! 비율 계산, 할인율, 증감률을 한 번에 계산합니다.',
    modes: {
      basic: { label: '기본 계산', desc: 'A의 B%는?' },
      change: { label: '증감률', desc: 'A→B 변화율' },
      discount: { label: '할인 계산', desc: '할인가 계산' },
      reverse: { label: '비율 계산', desc: 'A는 B의 몇%?' },
    },
    basicCalc: {
      title: 'A의 B%는 얼마인가요?',
      placeholder1: '숫자 입력',
      placeholder2: '퍼센트',
      connector1: '의',
      connector2: '%는?',
      result: '결과',
    },
    reverseCalc: {
      title: 'A는 B의 몇 퍼센트인가요?',
      placeholder1: '부분값',
      placeholder2: '전체값',
      connector1: '은',
      connector2: '의 몇 %?',
      result: '결과',
    },
    changeCalc: {
      title: '증감률 계산',
      placeholder1: '이전 값',
      placeholder2: '이후 값',
      increase: '증가율',
      decrease: '감소율',
    },
    discountCalc: {
      title: '할인 금액 계산',
      placeholder1: '원래 가격',
      placeholder2: '할인율',
      connector1: '원의',
      connector2: '% 할인',
      discountedPrice: '할인된 가격',
      savedAmount: '절약 금액',
      currency: '원',
    },
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '퍼센트(%)는 어떻게 계산하나요?',
          answer: '퍼센트는 전체를 100으로 봤을 때의 비율입니다. 예를 들어, 50명 중 25명은 (25÷50)×100 = 50%입니다.',
        },
        {
          question: '증가율과 감소율은 어떻게 다른가요?',
          answer: '둘 다 ((변화값-원래값)÷원래값)×100으로 계산합니다. 결과가 양수면 증가율, 음수면 감소율입니다.',
        },
        {
          question: '할인율 계산은 어떻게 하나요?',
          answer: '할인율 = ((원가-할인가)÷원가)×100 입니다. 예: 10,000원에서 8,000원으로 할인 시 할인율은 20%입니다.',
        },
      ],
    },
  },
  en: {
    title: 'Percent Calculator',
    description: 'Easy percentage calculations! Calculate ratios, discounts, and percentage changes all in one place.',
    modes: {
      basic: { label: 'Basic', desc: 'What is B% of A?' },
      change: { label: 'Change', desc: 'A→B change rate' },
      discount: { label: 'Discount', desc: 'Calculate discount' },
      reverse: { label: 'Ratio', desc: 'A is what % of B?' },
    },
    basicCalc: {
      title: 'What is B% of A?',
      placeholder1: 'Enter number',
      placeholder2: 'Percent',
      connector1: '',
      connector2: '% of',
      result: 'Result',
    },
    reverseCalc: {
      title: 'A is what percent of B?',
      placeholder1: 'Part value',
      placeholder2: 'Total value',
      connector1: 'is',
      connector2: '% of what?',
      result: 'Result',
    },
    changeCalc: {
      title: 'Percentage Change',
      placeholder1: 'Original value',
      placeholder2: 'New value',
      increase: 'Increase',
      decrease: 'Decrease',
    },
    discountCalc: {
      title: 'Discount Calculator',
      placeholder1: 'Original price',
      placeholder2: 'Discount %',
      connector1: 'at',
      connector2: '% off',
      discountedPrice: 'Discounted Price',
      savedAmount: 'You Save',
      currency: '',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How do you calculate percentages?',
          answer: 'A percentage represents a ratio out of 100. For example, 25 out of 50 people is (25÷50)×100 = 50%.',
        },
        {
          question: 'What is the difference between increase and decrease rate?',
          answer: 'Both are calculated as ((new value - original value) ÷ original value) × 100. A positive result indicates an increase, while a negative result indicates a decrease.',
        },
        {
          question: 'How do you calculate a discount rate?',
          answer: 'Discount rate = ((original price - sale price) ÷ original price) × 100. For example, if an item goes from $100 to $80, the discount rate is 20%.',
        },
      ],
    },
  },
};

type CalculatorMode = 'basic' | 'change' | 'discount' | 'reverse';

export default function PercentCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const { t } = useLocalizedContent(i18n);

  // 기본 퍼센트 계산: A의 B%는?
  const [basicValue, setBasicValue] = useState('');
  const [basicPercent, setBasicPercent] = useState('');

  // 비율 계산: A는 B의 몇 %?
  const [partValue, setPartValue] = useState('');
  const [totalValue, setTotalValue] = useState('');

  // 증감률 계산
  const [originalValue, setOriginalValue] = useState('');
  const [newValue, setNewValue] = useState('');

  // 할인 계산
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'percent-calculator');

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

  // 계산 결과들
  const basicResult = basicValue && basicPercent
    ? (parseFloat(basicValue) * parseFloat(basicPercent) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : null;

  const ratioResult = partValue && totalValue && parseFloat(totalValue) !== 0
    ? ((parseFloat(partValue) / parseFloat(totalValue)) * 100).toFixed(2)
    : null;

  const changeResult = originalValue && newValue && parseFloat(originalValue) !== 0
    ? (((parseFloat(newValue) - parseFloat(originalValue)) / parseFloat(originalValue)) * 100).toFixed(2)
    : null;

  const discountResult = originalPrice && discountPercent
    ? {
        discounted: (parseFloat(originalPrice) * (1 - parseFloat(discountPercent) / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 }),
        saved: (parseFloat(originalPrice) * parseFloat(discountPercent) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 }),
      }
    : null;

  const modes = [
    { id: 'basic', label: t.modes.basic.label, desc: t.modes.basic.desc },
    { id: 'change', label: t.modes.change.label, desc: t.modes.change.desc },
    { id: 'discount', label: t.modes.discount.label, desc: t.modes.discount.desc },
    { id: 'reverse', label: t.modes.reverse.label, desc: t.modes.reverse.desc },
  ] as const;

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

        {/* 모드 선택 탭 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === m.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm">{m.label}</div>
              <div className="text-xs opacity-80">{m.desc}</div>
            </button>
          ))}
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 기본 계산: A의 B%는? */}
          {mode === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">{t.basicCalc.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={basicValue}
                  onChange={(e) => setBasicValue(e.target.value)}
                  placeholder={t.basicCalc.placeholder1}
                  className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.basicCalc.connector1}</span>
                <input
                  type="number"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value)}
                  placeholder={t.basicCalc.placeholder2}
                  className="w-28 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.basicCalc.connector2}</span>
              </div>
              {basicResult && (
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="text-sm text-blue-600 mb-1">{t.basicCalc.result}</div>
                  <div className="text-4xl font-bold text-blue-700">{basicResult}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {basicValue} × {basicPercent}% = {basicResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 비율 계산: A는 B의 몇%? */}
          {mode === 'reverse' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">{t.reverseCalc.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={partValue}
                  onChange={(e) => setPartValue(e.target.value)}
                  placeholder={t.reverseCalc.placeholder1}
                  className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.reverseCalc.connector1}</span>
                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder={t.reverseCalc.placeholder2}
                  className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.reverseCalc.connector2}</span>
              </div>
              {ratioResult && (
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-sm text-purple-600 mb-1">{t.reverseCalc.result}</div>
                  <div className="text-4xl font-bold text-purple-700">{ratioResult}%</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {partValue} ÷ {totalValue} × 100 = {ratioResult}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 증감률 계산 */}
          {mode === 'change' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">{t.changeCalc.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={originalValue}
                  onChange={(e) => setOriginalValue(e.target.value)}
                  placeholder={t.changeCalc.placeholder1}
                  className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">→</span>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={t.changeCalc.placeholder2}
                  className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {changeResult && (
                <div className={`p-6 rounded-xl text-center ${parseFloat(changeResult) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className={`text-sm mb-1 ${parseFloat(changeResult) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(changeResult) >= 0 ? t.changeCalc.increase : t.changeCalc.decrease}
                  </div>
                  <div className={`text-4xl font-bold ${parseFloat(changeResult) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {parseFloat(changeResult) >= 0 ? '+' : ''}{changeResult}%
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    ({newValue} - {originalValue}) ÷ {originalValue} × 100
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 할인 계산 */}
          {mode === 'discount' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">{t.discountCalc.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder={t.discountCalc.placeholder1}
                  className="w-40 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.discountCalc.connector1}</span>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder={t.discountCalc.placeholder2}
                  className="w-28 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-600">{t.discountCalc.connector2}</span>
              </div>
              {discountResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-6 rounded-xl text-center">
                    <div className="text-sm text-green-600 mb-1">{t.discountCalc.discountedPrice}</div>
                    <div className="text-4xl font-bold text-green-700">{discountResult.discounted}{t.discountCalc.currency}</div>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl text-center">
                    <div className="text-sm text-orange-600 mb-1">{t.discountCalc.savedAmount}</div>
                    <div className="text-4xl font-bold text-orange-700">{discountResult.saved}{t.discountCalc.currency}</div>
                  </div>
                </div>
              )}
            </div>
          )}
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

        {/* 설명 콘텐츠 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">퍼센트 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>퍼센트 계산기</strong>는 일상생활에서 자주 필요한 퍼센트(%) 관련 계산을 
              쉽고 빠르게 해결해주는 도구입니다. 할인율 계산, 증감률 계산, 비율 계산 등 
              다양한 퍼센트 계산을 지원합니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">퍼센트 계산 공식</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>A의 B%:</strong> A × (B/100)</li>
              <li><strong>A는 B의 몇%:</strong> (A/B) × 100</li>
              <li><strong>증감률:</strong> ((새값-원래값)/원래값) × 100</li>
              <li><strong>할인가:</strong> 원가 × (1 - 할인율/100)</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/salary-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">실수령액 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">연봉에서 세금 제외한 월급 계산</p>
            </Link>
            <Link to="/tools/unit-converter" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">단위 변환기</h3>
              <p className="text-sm text-gray-600 mt-1">길이, 무게, 면적 단위 변환</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
