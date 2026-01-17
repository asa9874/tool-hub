import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

type TransactionType = 'sale' | 'lease' | 'monthly-rent';
type PropertyType = 'apartment' | 'officetel' | 'house' | 'land' | 'commercial';

interface FeeResult {
  transactionAmount: number;
  feeRate: number;
  maxFee: number;
  calculatedFee: number;
  finalFee: number;
  vat: number;
  totalWithVat: number;
  tier: string;
}

const i18n = {
  ko: {
    title: '부동산 중개수수료 계산기',
    subtitle: '2024년 기준 복비(중개보수) 계산',
    description: '매매, 전세, 월세 거래 시 부동산 중개수수료(복비)를 계산합니다.',
    transactionTypeLabel: '거래 유형',
    transactionTypes: {
      sale: '매매',
      lease: '전세 / 보증금',
      'monthly-rent': '월세',
    },
    propertyTypeLabel: '부동산 종류',
    propertyTypes: {
      apartment: '아파트 / 연립 / 다세대',
      officetel: '오피스텔 (주거용)',
      house: '단독 / 다가구',
      land: '토지',
      commercial: '상가 / 오피스',
    },
    priceLabel: '매매가',
    leasePriceLabel: '보증금',
    monthlyRentLabel: '월세',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    transactionAmount: '거래금액',
    feeRate: '수수료율',
    maxFee: '한도',
    brokerageFee: '중개수수료',
    vat: '부가세 (10%)',
    totalFee: '총 비용',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '중개수수료 상한요율은 법적으로 정해져 있나요?',
          answer: '네, 공인중개사법에 따라 거래 금액별 상한요율이 정해져 있습니다. 상한요율 이내에서 협의가 가능하며, 상한을 초과하면 불법입니다.',
        },
        {
          question: '부가세는 항상 내야 하나요?',
          answer: '부가가치세 과세사업자(법인 중개업소)의 경우 중개수수료에 10% 부가세가 추가됩니다. 간이과세자나 개인 중개사는 부가세가 없거나 적습니다.',
        },
        {
          question: '월세의 중개수수료는 어떻게 계산하나요?',
          answer: '월세는 "보증금 + (월세 × 100)"을 거래금액으로 환산하여 계산합니다. 단, 환산금액이 5천만원 미만이면 "보증금 + (월세 × 70)"을 적용합니다.',
        },
      ],
    },
  },
};

// 주택 매매 수수료 테이블 (2024년 기준)
const SALE_FEE_TABLE = [
  { max: 50000000, rate: 0.006, limit: 250000, tier: '5천만원 미만' },
  { max: 200000000, rate: 0.005, limit: 800000, tier: '5천만원~2억 미만' },
  { max: 900000000, rate: 0.004, limit: null, tier: '2억~9억 미만' },
  { max: 1200000000, rate: 0.005, limit: null, tier: '9억~12억 미만' },
  { max: 1500000000, rate: 0.006, limit: null, tier: '12억~15억 미만' },
  { max: Infinity, rate: 0.007, limit: null, tier: '15억 이상' },
];

// 주택 임대차 수수료 테이블
const LEASE_FEE_TABLE = [
  { max: 50000000, rate: 0.005, limit: 200000, tier: '5천만원 미만' },
  { max: 100000000, rate: 0.004, limit: 300000, tier: '5천만원~1억 미만' },
  { max: 600000000, rate: 0.003, limit: null, tier: '1억~6억 미만' },
  { max: 1200000000, rate: 0.004, limit: null, tier: '6억~12억 미만' },
  { max: 1500000000, rate: 0.005, limit: null, tier: '12억~15억 미만' },
  { max: Infinity, rate: 0.006, limit: null, tier: '15억 이상' },
];

// 오피스텔 (주거용) 수수료 - 매매/임대 동일
const OFFICETEL_FEE_TABLE = [
  { max: Infinity, rate: 0.005, limit: null, tier: '오피스텔 (주거용)' },
];

// 상가/토지 등 수수료 - 0.9% 이내 협의
const COMMERCIAL_FEE_TABLE = [
  { max: Infinity, rate: 0.009, limit: null, tier: '상가/토지 (0.9% 이내)' },
];

export default function BrokerageFeeCalculator() {
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [price, setPrice] = useState<string>('500000000');
  const [monthlyRent, setMonthlyRent] = useState<string>('500000');
  const [includeVat, setIncludeVat] = useState(true);
  const [result, setResult] = useState<FeeResult | null>(null);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'brokerage-fee-calculator');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'FinanceApplication',
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
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const getFeeTable = () => {
    if (propertyType === 'officetel') return OFFICETEL_FEE_TABLE;
    if (propertyType === 'commercial' || propertyType === 'land') return COMMERCIAL_FEE_TABLE;
    return transactionType === 'sale' ? SALE_FEE_TABLE : LEASE_FEE_TABLE;
  };

  const calculateFee = () => {
    const p = parseFloat(price);
    const rent = parseFloat(monthlyRent) || 0;

    if (isNaN(p) || p <= 0) return;

    let transactionAmount = p;

    // 월세인 경우 환산보증금 계산
    if (transactionType === 'monthly-rent') {
      // 5천만원 기준 환산액 적용
      const converted100 = p + rent * 100;
      const converted70 = p + rent * 70;
      transactionAmount = converted100 < 50000000 ? converted70 : converted100;
    }

    const feeTable = getFeeTable();
    const tier = feeTable.find((t) => transactionAmount < t.max) || feeTable[feeTable.length - 1];
    
    const calculatedFee = transactionAmount * tier.rate;
    const finalFee = tier.limit ? Math.min(calculatedFee, tier.limit) : calculatedFee;
    const vat = includeVat ? finalFee * 0.1 : 0;

    setResult({
      transactionAmount,
      feeRate: tier.rate,
      maxFee: tier.limit || 0,
      calculatedFee,
      finalFee,
      vat,
      totalWithVat: finalFee + vat,
      tier: tier.tier,
    });
  };

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const formatWon = (num: number) => {
    if (num >= 100000000) {
      const uk = Math.floor(num / 100000000);
      const man = Math.floor((num % 100000000) / 10000);
      return man > 0 ? `${uk}억 ${formatNumber(man)}만원` : `${uk}억원`;
    } else if (num >= 10000) {
      return `${formatNumber(Math.floor(num / 10000))}만원`;
    }
    return `${formatNumber(num)}원`;
  };

  const reset = () => {
    setTransactionType('sale');
    setPropertyType('apartment');
    setPrice('500000000');
    setMonthlyRent('500000');
    setIncludeVat(true);
    setResult(null);
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['loan-calculator', 'percent-calculator', 'unit-converter', 'salary-calculator'].includes(tool.id)
  );

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={[structuredData, faqStructuredData]}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🏠 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.transactionTypeLabel}
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(t.transactionTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.propertyTypeLabel}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(t.propertyTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {transactionType === 'sale' ? t.priceLabel : t.leasePriceLabel}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500000000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {price && formatWon(parseFloat(price))}
                </p>
              </div>

              {transactionType === 'monthly-rent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.monthlyRentLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="500000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeVat}
                  onChange={(e) => setIncludeVat(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">부가세(10%) 포함 계산 (법인 중개업소)</span>
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateFee}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.calculateButton}
            </button>
            <button
              onClick={reset}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t.resetButton}
            </button>
          </div>

          {/* 결과 */}
          {result && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 {t.resultTitle}
              </h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.transactionAmount}</p>
                    <p className="text-lg font-semibold">{formatWon(result.transactionAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">적용 구간</p>
                    <p className="text-lg font-semibold">{result.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.feeRate}</p>
                    <p className="text-lg font-semibold">{(result.feeRate * 100).toFixed(1)}%</p>
                  </div>
                  {result.maxFee > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">{t.maxFee}</p>
                      <p className="text-lg font-semibold">{formatNumber(result.maxFee)}원</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.brokerageFee}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(result.finalFee)}원
                  </p>
                </div>
                {includeVat && (
                  <div className="bg-orange-50 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-600 mb-1">{t.vat}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatNumber(result.vat)}원
                    </p>
                  </div>
                )}
                <div className={`bg-green-50 rounded-xl p-6 text-center ${!includeVat && 'md:col-span-2'}`}>
                  <p className="text-sm text-gray-600 mb-1">{t.totalFee}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(result.totalWithVat)}원
                  </p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                ※ 위 금액은 상한 요율 기준이며, 실제 수수료는 중개사와 협의 가능합니다.
              </p>
            </div>
          )}
        </div>

        <AdBanner slot="brokerage-fee-bottom" />

        {/* 수수료율 표 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 중개수수료 요율표 (2024년 기준)</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">주택 매매</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">거래금액</th>
                  <th className="px-4 py-2 text-center">상한요율</th>
                  <th className="px-4 py-2 text-center">한도</th>
                </tr>
              </thead>
              <tbody>
                {SALE_FEE_TABLE.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{row.tier}</td>
                    <td className="px-4 py-2 text-center">{(row.rate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-center">{row.limit ? formatNumber(row.limit) + '원' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">주택 임대차 (전세/월세)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">거래금액</th>
                  <th className="px-4 py-2 text-center">상한요율</th>
                  <th className="px-4 py-2 text-center">한도</th>
                </tr>
              </thead>
              <tbody>
                {LEASE_FEE_TABLE.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{row.tier}</td>
                    <td className="px-4 py-2 text-center">{(row.rate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-center">{row.limit ? formatNumber(row.limit) + '원' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ {t.faq.title}</h2>
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Q. {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A. {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 관련 도구 */}
        {relatedTools.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 관련 도구</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{tool.title.split(' - ')[0]}</h3>
                    <p className="text-sm text-gray-600">{tool.description.slice(0, 50)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
