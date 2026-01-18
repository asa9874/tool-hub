import { useState } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface Product {
  id: number;
  name: string;
  amount: string;
  unit: string;
  price: string;
}

const i18n = {
  ko: {
    title: '마트 단위당 가격 비교기',
    subtitle: '용량과 가격이 다른 제품의 가성비를 비교하세요',
    description: '500ml vs 1.2L 등 용량이 다른 상품의 100ml/100g당 가격을 계산하여 어떤 것이 더 저렴한지 비교해드립니다.',
    productName: '제품명',
    amount: '용량/무게',
    unit: '단위',
    price: '가격',
    addProduct: '+ 상품 추가',
    compare: '가격 비교하기',
    result: '비교 결과',
    unitPrice: '단위당 가격',
    cheapest: '최저가!',
    savings: '절약 금액',
    placeholder: {
      name: '예: A마트 생수',
      amount: '예: 500',
      price: '예: 1200',
    },
    units: {
      ml: 'ml (밀리리터)',
      l: 'L (리터)',
      g: 'g (그램)',
      kg: 'kg (킬로그램)',
      ea: '개',
    },
    perUnit: {
      ml: '100ml당',
      l: '100ml당',
      g: '100g당',
      kg: '100g당',
      ea: '1개당',
    },
    faq: {
      q1: '단위당 가격이란 무엇인가요?',
      a1: '단위당 가격은 동일한 양(예: 100ml, 100g)을 기준으로 환산한 가격입니다. 용량이 다른 제품을 비교할 때 어떤 것이 실제로 저렴한지 정확하게 알 수 있습니다.',
      q2: '왜 단위당 가격을 비교해야 하나요?',
      a2: '같은 제품이라도 대용량이 항상 저렴한 것은 아닙니다. 마트에서 판촉 행사, 묶음 할인 등으로 오히려 소용량이 더 저렴한 경우도 있어, 정확한 비교가 필요합니다.',
      q3: '어떤 단위로 비교하는 게 좋나요?',
      a3: '음료, 화장품 등 액체류는 ml 또는 L로, 식품, 세제 등 고체류는 g 또는 kg으로 비교하는 것이 좋습니다. 계란 등 낱개로 파는 상품은 개 단위로 비교하세요.',
    },
  },
};

export default function UnitPriceCalculator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '', amount: '', unit: 'ml', price: '' },
    { id: 2, name: '', amount: '', unit: 'ml', price: '' },
  ]);
  const [results, setResults] = useState<{ id: number; name: string; unitPrice: number; per: string; isCheapest: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'unit-price-calculator');

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

  // 단위를 기본 단위로 변환 (ml, g, 개)
  const convertToBaseUnit = (amount: number, unit: string): number => {
    switch (unit) {
      case 'l':
        return amount * 1000; // L -> ml
      case 'kg':
        return amount * 1000; // kg -> g
      default:
        return amount;
    }
  };

  // 단위 그룹 확인 (ml/L는 같은 그룹, g/kg은 같은 그룹)
  const getUnitGroup = (unit: string): string => {
    if (unit === 'ml' || unit === 'l') return 'volume';
    if (unit === 'g' || unit === 'kg') return 'weight';
    return 'count';
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setShowResult(false);
  };

  const addProduct = () => {
    const newId = Math.max(...products.map((p) => p.id)) + 1;
    setProducts([...products, { id: newId, name: '', amount: '', unit: 'ml', price: '' }]);
  };

  const removeProduct = (id: number) => {
    if (products.length > 2) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const calculateUnitPrice = () => {
    const validProducts = products.filter((p) => p.amount && p.price && parseFloat(p.amount) > 0 && parseFloat(p.price) > 0);

    if (validProducts.length < 2) {
      alert('최소 2개의 상품 정보를 입력해주세요.');
      return;
    }

    const calculatedResults = validProducts.map((p) => {
      const amount = parseFloat(p.amount);
      const price = parseFloat(p.price);
      const baseAmount = convertToBaseUnit(amount, p.unit);
      const unitGroup = getUnitGroup(p.unit);

      let unitPrice: number;
      let per: string;

      if (unitGroup === 'volume') {
        unitPrice = (price / baseAmount) * 100; // 100ml당
        per = t.perUnit.ml;
      } else if (unitGroup === 'weight') {
        unitPrice = (price / baseAmount) * 100; // 100g당
        per = t.perUnit.g;
      } else {
        unitPrice = price / baseAmount; // 1개당
        per = t.perUnit.ea;
      }

      return {
        id: p.id,
        name: p.name || `상품 ${p.id}`,
        unitPrice: Math.round(unitPrice * 100) / 100,
        per,
        isCheapest: false,
      };
    });

    // 최저가 표시
    const minPrice = Math.min(...calculatedResults.map((r) => r.unitPrice));
    calculatedResults.forEach((r) => {
      if (r.unitPrice === minPrice) r.isCheapest = true;
    });

    setResults(calculatedResults);
    setShowResult(true);
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🛒 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 상품 입력 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8" aria-labelledby="input-heading">
          <h2 id="input-heading" className="sr-only">상품 정보 입력</h2>

          <div className="space-y-6">
            {products.map((product, index) => (
              <div key={product.id} className="p-4 bg-gray-50 rounded-lg relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">상품 {index + 1}</span>
                  {products.length > 2 && (
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      aria-label="상품 삭제"
                    >
                      ✕ 삭제
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor={`name-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {t.productName}
                    </label>
                    <input
                      type="text"
                      id={`name-${product.id}`}
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={t.placeholder.name}
                    />
                  </div>

                  <div>
                    <label htmlFor={`amount-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {t.amount}
                    </label>
                    <input
                      type="number"
                      id={`amount-${product.id}`}
                      value={product.amount}
                      onChange={(e) => updateProduct(product.id, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={t.placeholder.amount}
                      min="0"
                      step="any"
                    />
                  </div>

                  <div>
                    <label htmlFor={`unit-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {t.unit}
                    </label>
                    <select
                      id={`unit-${product.id}`}
                      value={product.unit}
                      onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="ml">{t.units.ml}</option>
                      <option value="l">{t.units.l}</option>
                      <option value="g">{t.units.g}</option>
                      <option value="kg">{t.units.kg}</option>
                      <option value="ea">{t.units.ea}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`price-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {t.price} (원)
                    </label>
                    <input
                      type="number"
                      id={`price-${product.id}`}
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={t.placeholder.price}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addProduct}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              {t.addProduct}
            </button>

            <button
              onClick={calculateUnitPrice}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
            >
              {t.compare}
            </button>
          </div>
        </section>

        {/* 결과 표시 */}
        {showResult && results.length > 0 && (
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 {t.result}</h2>

            <div className="space-y-4">
              {results
                .sort((a, b) => a.unitPrice - b.unitPrice)
                .map((result, index) => (
                  <div
                    key={result.id}
                    className={`p-4 rounded-lg ${result.isCheapest ? 'bg-green-100 border-2 border-green-500' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${result.isCheapest ? 'text-green-600' : 'text-gray-500'}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{result.name}</p>
                          <p className="text-sm text-gray-600">
                            {result.per}: <span className="font-bold text-lg">{result.unitPrice.toLocaleString()}원</span>
                          </p>
                        </div>
                      </div>
                      {result.isCheapest && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          🏆 {t.cheapest}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* 절약 금액 */}
            {results.length >= 2 && (
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-center text-gray-700">
                  <span className="font-semibold">{results.find((r) => r.isCheapest)?.name}</span>를 선택하면{' '}
                  <span className="text-green-600 font-bold text-xl">
                    {(Math.max(...results.map((r) => r.unitPrice)) - Math.min(...results.map((r) => r.unitPrice))).toLocaleString()}원
                  </span>{' '}
                  더 저렴합니다! (100단위당)
                </p>
              </div>
            )}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 마트 가성비 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>마트 단위당 가격 비교기</strong>는 장을 볼 때 가장 가성비 좋은 상품을 찾는 데 도움을 드립니다. 같은 품목이라도 용량에
              따라 가격이 천차만별인데, 대용량이 항상 저렴한 것은 아닙니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              예를 들어 생수 500ml가 800원이고, 2L가 2,500원이라면 어떤 것이 더 저렴할까요? 500ml는 100ml당 160원, 2L는 100ml당 125원으로
              대용량이 더 저렴합니다. 하지만 할인 행사 중이라면 결과가 달라질 수 있죠.
            </p>
            <p className="text-gray-600 leading-relaxed">
              스마트폰으로 마트에서 바로 비교해보세요. 식료품, 음료, 세제, 화장품 등 용량이 다른 모든 상품의 가성비를 쉽게 비교할 수 있습니다.
              알뜰 쇼핑의 필수 도구, 단위당 가격 계산기로 현명한 소비를 시작하세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
