import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

type RepaymentType = 'equal-principal-interest' | 'equal-principal' | 'bullet';

interface LoanResult {
  monthlyPayments: number[];
  totalInterest: number;
  totalPayment: number;
  principalPayments: number[];
  interestPayments: number[];
}

const i18n = {
  ko: {
    title: '대출 이자 계산기',
    subtitle: '원리금 균등 / 원금 균등 상환 계산',
    description: '대출 원금, 금리, 기간을 입력하면 월 상환금과 총 이자를 계산합니다.',
    principalLabel: '대출 원금',
    interestRateLabel: '연 이자율 (%)',
    termLabel: '대출 기간',
    repaymentTypeLabel: '상환 방식',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    monthlyPayment: '월 상환금',
    totalInterest: '총 이자',
    totalPayment: '총 상환금액',
    repaymentTypes: {
      'equal-principal-interest': '원리금 균등 상환',
      'equal-principal': '원금 균등 상환',
      'bullet': '만기 일시 상환',
    },
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '원리금 균등 상환과 원금 균등 상환의 차이점은 무엇인가요?',
          answer: '원리금 균등 상환은 매월 같은 금액을 상환하여 초기 부담이 적지만 총 이자가 많습니다. 원금 균등 상환은 매월 같은 원금을 상환하여 초기 부담이 크지만 총 이자가 적습니다.',
        },
        {
          question: '만기 일시 상환은 언제 유리한가요?',
          answer: '만기 일시 상환은 대출 기간 동안 이자만 납부하다가 만기에 원금을 한꺼번에 상환하는 방식입니다. 단기 자금이 필요하거나 중도상환 계획이 있을 때 유리합니다.',
        },
        {
          question: '대출 이자 계산 시 중도상환수수료도 고려해야 하나요?',
          answer: '네, 대출 조기 상환 시 중도상환수수료가 발생할 수 있습니다. 보통 대출 후 3년 이내 상환 시 잔여 원금의 1~2% 수준입니다. 정확한 수수료는 금융기관에 확인하세요.',
        },
      ],
    },
  },
};

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>('100000000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [termYears, setTermYears] = useState<string>('30');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal-principal-interest');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'loan-calculator');

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

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // 월 이자율
    const n = parseInt(termYears) * 12; // 총 개월 수

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) {
      return;
    }

    const monthlyPayments: number[] = [];
    const principalPayments: number[] = [];
    const interestPayments: number[] = [];
    let totalInterest = 0;
    let remainingPrincipal = p;

    if (repaymentType === 'equal-principal-interest') {
      // 원리금 균등 상환
      const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      for (let i = 0; i < n; i++) {
        const interestPayment = remainingPrincipal * r;
        const principalPayment = monthlyPayment - interestPayment;
        
        monthlyPayments.push(monthlyPayment);
        interestPayments.push(interestPayment);
        principalPayments.push(principalPayment);
        totalInterest += interestPayment;
        remainingPrincipal -= principalPayment;
      }
    } else if (repaymentType === 'equal-principal') {
      // 원금 균등 상환
      const monthlyPrincipal = p / n;
      
      for (let i = 0; i < n; i++) {
        const interestPayment = remainingPrincipal * r;
        const monthlyPayment = monthlyPrincipal + interestPayment;
        
        monthlyPayments.push(monthlyPayment);
        interestPayments.push(interestPayment);
        principalPayments.push(monthlyPrincipal);
        totalInterest += interestPayment;
        remainingPrincipal -= monthlyPrincipal;
      }
    } else {
      // 만기 일시 상환
      const monthlyInterest = p * r;
      
      for (let i = 0; i < n - 1; i++) {
        monthlyPayments.push(monthlyInterest);
        interestPayments.push(monthlyInterest);
        principalPayments.push(0);
        totalInterest += monthlyInterest;
      }
      // 마지막 달: 원금 + 이자
      monthlyPayments.push(p + monthlyInterest);
      interestPayments.push(monthlyInterest);
      principalPayments.push(p);
      totalInterest += monthlyInterest;
    }

    setResult({
      monthlyPayments,
      totalInterest,
      totalPayment: p + totalInterest,
      principalPayments,
      interestPayments,
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
    setPrincipal('100000000');
    setInterestRate('4.5');
    setTermYears('30');
    setRepaymentType('equal-principal-interest');
    setResult(null);
    setShowSchedule(false);
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['salary-calculator', 'percent-calculator', 'savings-calculator', 'brokerage-fee-calculator'].includes(tool.id)
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
              💰 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.principalLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100000000"
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
                placeholder="4.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.termLabel}
              </label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 3, 5, 10, 15, 20, 25, 30, 35, 40].map((year) => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.repaymentTypeLabel}
              </label>
              <select
                value={repaymentType}
                onChange={(e) => setRepaymentType(e.target.value as RepaymentType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(t.repaymentTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateLoan}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.monthlyPayment} (첫 달)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(result.monthlyPayments[0])}원
                  </p>
                  {repaymentType === 'equal-principal' && (
                    <p className="text-xs text-gray-500 mt-1">
                      마지막 달: {formatNumber(result.monthlyPayments[result.monthlyPayments.length - 1])}원
                    </p>
                  )}
                </div>
                <div className="bg-red-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.totalInterest}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatWon(result.totalInterest)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.totalPayment}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatWon(result.totalPayment)}
                  </p>
                </div>
              </div>

              {/* 상환 스케줄 토글 */}
              <div className="text-center mb-4">
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showSchedule ? '상환 스케줄 숨기기 ▲' : '상환 스케줄 보기 ▼'}
                </button>
              </div>

              {/* 상환 스케줄 테이블 */}
              {showSchedule && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">회차</th>
                        <th className="px-4 py-2 text-right">상환금</th>
                        <th className="px-4 py-2 text-right">원금</th>
                        <th className="px-4 py-2 text-right">이자</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlyPayments.slice(0, 36).map((payment, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{idx + 1}회</td>
                          <td className="px-4 py-2 text-right">{formatNumber(payment)}원</td>
                          <td className="px-4 py-2 text-right">{formatNumber(result.principalPayments[idx])}원</td>
                          <td className="px-4 py-2 text-right">{formatNumber(result.interestPayments[idx])}원</td>
                        </tr>
                      ))}
                      {result.monthlyPayments.length > 36 && (
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                            ... 이하 {result.monthlyPayments.length - 36}개월 생략 ...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <AdBanner slot="loan-calculator-bottom" />

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 대출 상환 방식 비교</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              대출 이자 계산기는 주택담보대출, 전세자금대출, 신용대출 등 다양한 대출 상품의 월 상환금과 
              총 이자를 계산하는 도구입니다. 상환 방식에 따라 총 부담 이자가 크게 달라지므로 
              자신의 상황에 맞는 상환 방식을 선택하는 것이 중요합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 원리금 균등 상환</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              매월 동일한 금액(원금 + 이자)을 상환하는 방식입니다. 초기에는 이자 비중이 높고 
              점차 원금 비중이 높아집니다. 월 상환금이 일정하여 재정 계획을 세우기 쉽지만, 
              원금 균등 방식보다 총 이자가 많습니다. 대부분의 주택담보대출에서 이 방식을 사용합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 원금 균등 상환</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              매월 동일한 원금을 상환하고, 남은 원금에 대한 이자를 추가로 납부하는 방식입니다. 
              초기 상환금이 가장 크고 점차 줄어듭니다. 총 이자 부담이 가장 적지만, 
              초기 상환 부담이 큰 편입니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 만기 일시 상환</h3>
            <p className="text-gray-600 leading-relaxed">
              대출 기간 동안 이자만 납부하다가 만기에 원금을 한 번에 상환하는 방식입니다. 
              월 부담금이 가장 적지만 총 이자가 가장 많습니다. 전세자금대출이나 
              단기 자금 운용 시 주로 사용됩니다.
            </p>
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
