import { useState } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

const i18n = {
  ko: {
    title: '할인율 계산기',
    subtitle: '정가와 할인율을 입력하면 최종 결제 금액을 계산해드립니다',
    description: '세일 시즌에 실제 할인 금액과 최종 가격을 빠르게 확인하세요.',
    originalPrice: '정가 (원)',
    discountRate: '할인율 (%)',
    additionalDiscount: '추가 할인 (쿠폰 등)',
    calculate: '계산하기',
    result: '계산 결과',
    discountAmount: '할인 금액',
    finalPrice: '최종 결제 금액',
    youSave: '절약 금액',
    discountHistory: '할인 히스토리',
    clear: '초기화',
    placeholder: {
      price: '예: 50000',
      rate: '예: 30',
      additional: '예: 5000',
    },
    presets: [10, 20, 30, 40, 50, 60, 70],
    faq: {
      q1: '할인율과 할인 금액의 차이는 무엇인가요?',
      a1: '할인율은 정가 대비 할인되는 비율(%)을 말하고, 할인 금액은 실제로 깎이는 원화 금액입니다. 예를 들어 10만원 상품의 30% 할인은 할인 금액 3만원, 최종 가격 7만원이 됩니다.',
      q2: '중복 할인은 어떻게 계산되나요?',
      a2: '대부분의 쇼핑몰에서는 할인율 적용 후 쿠폰 할인이 추가로 적용됩니다. 본 계산기는 정가에서 할인율을 먼저 적용한 후, 추가 할인 금액을 차감하는 방식으로 계산합니다.',
      q3: '세일 기간에 이 계산기가 왜 유용한가요?',
      a3: '"최대 70% 세일" 같은 문구를 보면 실제 얼마나 저렴해지는지 헷갈릴 수 있습니다. 이 계산기로 정확한 최종 가격을 확인하고 현명한 쇼핑을 하세요.',
    },
  },
};

interface CalculationHistory {
  id: number;
  originalPrice: number;
  discountRate: number;
  additionalDiscount: number;
  finalPrice: number;
  timestamp: Date;
}

export default function DiscountCalculator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('');
  const [additionalDiscount, setAdditionalDiscount] = useState<string>('');
  const [result, setResult] = useState<{ discountAmount: number; finalPrice: number } | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'discount-calculator');

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

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const rate = parseFloat(discountRate);
    const additional = parseFloat(additionalDiscount) || 0;

    if (isNaN(price) || isNaN(rate) || price <= 0 || rate < 0 || rate > 100) {
      alert('정가와 할인율을 올바르게 입력해주세요.');
      return;
    }

    const discountAmount = Math.round(price * (rate / 100));
    const afterRateDiscount = price - discountAmount;
    const finalPrice = Math.max(0, afterRateDiscount - additional);

    setResult({
      discountAmount: discountAmount + additional,
      finalPrice,
    });

    // 히스토리 추가
    setHistory((prev) => [
      {
        id: Date.now(),
        originalPrice: price,
        discountRate: rate,
        additionalDiscount: additional,
        finalPrice,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9), // 최근 10개만 유지
    ]);
  };

  const handlePresetClick = (rate: number) => {
    setDiscountRate(rate.toString());
  };

  const clearAll = () => {
    setOriginalPrice('');
    setDiscountRate('');
    setAdditionalDiscount('');
    setResult(null);
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🏷️ {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 계산기 입력 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8" aria-labelledby="calculator-heading">
          <h2 id="calculator-heading" className="sr-only">할인율 계산</h2>

          <div className="space-y-6">
            {/* 정가 입력 */}
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                {t.originalPrice}
              </label>
              <input
                type="number"
                id="originalPrice"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                placeholder={t.placeholder.price}
                min="0"
              />
            </div>

            {/* 할인율 입력 */}
            <div>
              <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700 mb-2">
                {t.discountRate}
              </label>
              <input
                type="number"
                id="discountRate"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                placeholder={t.placeholder.rate}
                min="0"
                max="100"
              />

              {/* 프리셋 버튼 */}
              <div className="flex flex-wrap gap-2 mt-3">
                {t.presets.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePresetClick(rate)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      discountRate === rate.toString()
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* 추가 할인 */}
            <div>
              <label htmlFor="additionalDiscount" className="block text-sm font-medium text-gray-700 mb-2">
                {t.additionalDiscount} (선택)
              </label>
              <input
                type="number"
                id="additionalDiscount"
                value={additionalDiscount}
                onChange={(e) => setAdditionalDiscount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                placeholder={t.placeholder.additional}
                min="0"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={calculateDiscount}
                className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
              >
                {t.calculate}
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.clear}
              </button>
            </div>
          </div>
        </section>

        {/* 결과 표시 */}
        {result && (
          <section className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 {t.result}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-2">정가</p>
                <p className="text-2xl font-bold text-gray-400 line-through">{parseInt(originalPrice).toLocaleString()}원</p>
              </div>

              <div className="bg-white p-6 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-2">{t.discountAmount}</p>
                <p className="text-2xl font-bold text-red-500">-{result.discountAmount.toLocaleString()}원</p>
              </div>

              <div className="bg-orange-500 p-6 rounded-xl text-center">
                <p className="text-sm text-orange-100 mb-2">{t.finalPrice}</p>
                <p className="text-3xl font-bold text-white">{result.finalPrice.toLocaleString()}원</p>
              </div>
            </div>

            {/* 절약 정보 */}
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                <span className="font-semibold">{discountRate}% 할인</span>으로{' '}
                <span className="text-red-500 font-bold text-xl">{result.discountAmount.toLocaleString()}원</span> 절약!
              </p>
            </div>
          </section>
        )}

        {/* 계산 히스토리 */}
        {history.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 {t.discountHistory}</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <span className="text-gray-500 line-through">{item.originalPrice.toLocaleString()}원</span>
                    <span className="mx-2 text-orange-500 font-medium">→ {item.discountRate}% 할인</span>
                    <span className="text-green-600 font-bold">{item.finalPrice.toLocaleString()}원</span>
                  </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 할인율 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>할인율 계산기</strong>는 쇼핑할 때 실제로 얼마를 절약하는지 빠르게 확인할 수 있는 도구입니다. 백화점 세일, 온라인
              쇼핑몰 할인 행사, 블랙프라이데이 등 다양한 세일 시즌에 유용하게 활용하세요.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              사용 방법은 간단합니다. 정가를 입력하고, 할인율을 선택하거나 직접 입력하면 됩니다. 쿠폰이나 적립금 등 추가 할인이 있다면 추가 할인
              금액도 입력할 수 있습니다. 계산 결과로 할인 금액과 최종 결제 금액을 바로 확인할 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              "최대 70% 세일", "반값 할인" 같은 마케팅 문구에 현혹되지 않고 정확한 가격을 계산해보세요. 특히 여러 상품을 비교할 때 히스토리
              기능을 활용하면 어떤 상품이 가장 저렴한지 쉽게 파악할 수 있습니다. 현명한 쇼핑의 시작, 할인율 계산기와 함께하세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
