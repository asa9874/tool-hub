import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

type SavingsType = 'installment' | 'deposit';
type TaxType = 'normal' | 'preferential' | 'tax-free';

interface SavingsResult {
  principal: number;
  totalInterest: number;
  taxAmount: number;
  netInterest: number;
  totalAmount: number;
  monthlyDetails?: { month: number; principal: number; interest: number; }[];
}

const i18n = {
  ko: {
    title: '예적금 이자 계산기',
    subtitle: '세전/세후 이자 및 만기 수령액 계산',
    description: '예금/적금의 원금, 금리, 기간을 입력하면 세금을 반영한 실제 이자와 만기 수령액을 계산합니다.',
    savingsTypeLabel: '상품 유형',
    savingsTypes: {
      installment: '적금 (매월 납입)',
      deposit: '예금 (목돈 예치)',
    },
    principalLabel: '월 납입금',
    depositLabel: '예치 금액',
    interestRateLabel: '연 이자율 (%)',
    termLabel: '가입 기간',
    taxTypeLabel: '과세 유형',
    taxTypes: {
      normal: '일반 과세 (15.4%)',
      preferential: '세금 우대 (9.5%)',
      'tax-free': '비과세',
    },
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    totalPrincipal: '원금 합계',
    grossInterest: '세전 이자',
    taxAmount: '세금',
    netInterest: '세후 이자',
    totalAmount: '만기 수령액',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '예금과 적금의 이자 계산 방식은 어떻게 다른가요?',
          answer: '예금은 목돈을 한 번에 예치하여 이자가 붙습니다. 적금은 매월 일정 금액을 납입하므로, 첫 달 납입금은 전체 기간 동안, 마지막 달 납입금은 1개월만 이자가 붙어 평균적으로 예금보다 이자가 적습니다.',
        },
        {
          question: '세금 우대와 비과세 혜택은 누가 받을 수 있나요?',
          answer: '세금 우대(9.5%)는 조합원 출자금, 농협·신협·새마을금고 등에서 가입 가능합니다. 비과세는 청년희망적금, ISA 계좌, 장병내일준비적금 등 특정 상품에서 제공됩니다.',
        },
        {
          question: '단리와 복리의 차이는 무엇인가요?',
          answer: '단리는 원금에만 이자가 붙고, 복리는 원금+이자에 이자가 붙습니다. 대부분의 예적금은 단리 방식이며, 이 계산기도 단리 기준으로 계산합니다.',
        },
      ],
    },
  },
};

export default function SavingsCalculator() {
  const [savingsType, setSavingsType] = useState<SavingsType>('installment');
  const [principal, setPrincipal] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('4.0');
  const [termMonths, setTermMonths] = useState<string>('12');
  const [taxType, setTaxType] = useState<TaxType>('normal');
  const [result, setResult] = useState<SavingsResult | null>(null);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'savings-calculator');

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

  const getTaxRate = (type: TaxType): number => {
    switch (type) {
      case 'normal': return 0.154; // 15.4% (이자소득세 14% + 지방소득세 1.4%)
      case 'preferential': return 0.095; // 9.5%
      case 'tax-free': return 0;
    }
  };

  const calculateSavings = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const n = parseInt(termMonths);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) {
      return;
    }

    const taxRate = getTaxRate(taxType);
    let totalPrincipal = 0;
    let totalInterest = 0;
    const monthlyDetails: { month: number; principal: number; interest: number; }[] = [];

    if (savingsType === 'deposit') {
      // 예금: 목돈 예치
      totalPrincipal = p;
      totalInterest = p * r * (n / 12);
    } else {
      // 적금: 매월 납입 (단리 계산)
      totalPrincipal = p * n;
      // 적금 이자 공식: 월납입금 × 이자율 × (기간 × (기간 + 1) / 2) / 12
      totalInterest = p * r * (n * (n + 1) / 2) / 12;

      // 월별 상세
      for (let i = 1; i <= n; i++) {
        const monthsRemaining = n - i + 1;
        const monthInterest = p * r * monthsRemaining / 12;
        monthlyDetails.push({
          month: i,
          principal: p,
          interest: monthInterest,
        });
      }
    }

    const taxAmount = totalInterest * taxRate;
    const netInterest = totalInterest - taxAmount;

    setResult({
      principal: totalPrincipal,
      totalInterest,
      taxAmount,
      netInterest,
      totalAmount: totalPrincipal + netInterest,
      monthlyDetails: savingsType === 'installment' ? monthlyDetails : undefined,
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
      return `${formatNumber(Math.floor(num / 10000))}만 ${formatNumber(num % 10000)}원`;
    }
    return `${formatNumber(num)}원`;
  };

  const reset = () => {
    setSavingsType('installment');
    setPrincipal('500000');
    setInterestRate('4.0');
    setTermMonths('12');
    setTaxType('normal');
    setResult(null);
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['loan-calculator', 'salary-calculator', 'percent-calculator', 'severance-calculator'].includes(tool.id)
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
              🏦 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.savingsTypeLabel}
              </label>
              <div className="flex gap-4">
                {Object.entries(t.savingsTypes).map(([key, label]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="radio"
                      name="savingsType"
                      value={key}
                      checked={savingsType === key}
                      onChange={(e) => setSavingsType(e.target.value as SavingsType)}
                      className="mr-2"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {savingsType === 'installment' ? t.principalLabel : t.depositLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {principal && formatWon(parseFloat(principal))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.interestRateLabel}
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.termLabel}
              </label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 3, 6, 12, 18, 24, 36].map((month) => (
                  <option key={month} value={month}>{month}개월</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.taxTypeLabel}
              </label>
              <div className="flex flex-wrap gap-4">
                {Object.entries(t.taxTypes).map(([key, label]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="radio"
                      name="taxType"
                      value={key}
                      checked={taxType === key}
                      onChange={(e) => setTaxType(e.target.value as TaxType)}
                      className="mr-2"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateSavings}
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.totalPrincipal}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatNumber(result.principal)}원
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.grossInterest}</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatNumber(result.totalInterest)}원
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.taxAmount}</p>
                  <p className="text-xl font-bold text-red-600">
                    -{formatNumber(result.taxAmount)}원
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.netInterest}</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatNumber(result.netInterest)}원
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">{t.totalAmount}</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatWon(result.totalAmount)}
                  </p>
                </div>
              </div>

              {/* 세율 비교 */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">📌 과세 유형별 비교</h3>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  {(['normal', 'preferential', 'tax-free'] as TaxType[]).map((type) => {
                    const rate = getTaxRate(type);
                    const tax = result.totalInterest * rate;
                    const net = result.totalInterest - tax;
                    return (
                      <div key={type} className={`p-3 rounded-lg ${taxType === type ? 'bg-yellow-200' : 'bg-white'}`}>
                        <p className="font-medium text-gray-700">{t.taxTypes[type]}</p>
                        <p className="text-xs text-gray-500">세금: {formatNumber(tax)}원</p>
                        <p className="font-semibold text-gray-800">실수령: {formatNumber(result.principal + net)}원</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <AdBanner slot="savings-calculator-bottom" />

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 예적금 이자 계산 알아보기</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              예적금 이자 계산기는 정기예금, 정기적금의 만기 수령액을 계산하는 도구입니다. 
              세금(이자소득세 15.4%)을 제외한 실제 수령 이자를 확인할 수 있어, 
              여러 금융 상품을 비교할 때 유용합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 이자소득세 안내</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>일반 과세 (15.4%)</strong>: 이자소득세 14% + 지방소득세 1.4%</li>
              <li><strong>세금 우대 (9.5%)</strong>: 농협·신협·새마을금고 조합원 등</li>
              <li><strong>비과세</strong>: 청년희망적금, ISA, 장병내일준비적금 등</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 적금 이자 계산 공식</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              적금은 매월 납입하므로 첫 달 납입금은 12개월, 마지막 달 납입금은 1개월만 이자가 붙습니다.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
              이자 = 월납입금 × 연이율 × (기간 × (기간+1) ÷ 2) ÷ 12
            </div>
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
