import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

interface SeveranceResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  averageDailyWage: number;
  severancePay: number;
  taxableAmount: number;
  incomeTax: number;
  localTax: number;
  netSeverance: number;
}

const i18n = {
  ko: {
    title: '퇴직금 계산기',
    subtitle: '근속연수와 평균임금 기준 퇴직금 계산',
    description: '입사일, 퇴사일, 월 평균임금을 입력하면 퇴직금과 세금을 계산합니다.',
    startDateLabel: '입사일',
    endDateLabel: '퇴사일',
    monthlySalaryLabel: '월 평균임금 (세전)',
    bonusLabel: '연간 상여금 (선택)',
    annualLeaveLabel: '미사용 연차수당 (선택)',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    workPeriod: '근속기간',
    averageDailyWage: '1일 평균임금',
    grossSeverance: '퇴직금 (세전)',
    incomeTax: '퇴직소득세',
    localTax: '지방소득세',
    netSeverance: '실수령액',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '퇴직금 계산 공식은 무엇인가요?',
          answer: '퇴직금 = (1일 평균임금 × 30일) × (총 근속일수 ÷ 365)입니다. 1일 평균임금은 퇴직 전 3개월간 총 임금을 해당 기간 총 일수로 나눈 금액입니다.',
        },
        {
          question: '퇴직금을 받으려면 최소 몇 년을 근무해야 하나요?',
          answer: '1년 이상 근무해야 퇴직금을 받을 수 있습니다. 근로기준법상 계속 근로기간이 1년 미만인 경우 퇴직금 지급 의무가 없습니다.',
        },
        {
          question: '퇴직금에도 세금이 붙나요?',
          answer: '네, 퇴직소득세가 부과됩니다. 다만 근속연수공제, 환산급여공제 등으로 일반 소득세보다 세율이 낮습니다. 퇴직금이 적으면 세금이 0원일 수도 있습니다.',
        },
        {
          question: '평균임금에 상여금도 포함되나요?',
          answer: '네, 정기적으로 지급되는 상여금은 평균임금 산정에 포함됩니다. 연간 상여금을 12로 나누어 월 평균임금에 합산합니다.',
        },
      ],
    },
  },
};

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [monthlySalary, setMonthlySalary] = useState<string>('3000000');
  const [annualBonus, setAnnualBonus] = useState<string>('');
  const [unusedLeave, setUnusedLeave] = useState<string>('');
  const [result, setResult] = useState<SeveranceResult | null>(null);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'severance-calculator');

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

  const calculateSeverance = () => {
    if (!startDate || !endDate || !monthlySalary) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const salary = parseFloat(monthlySalary);
    const bonus = parseFloat(annualBonus) || 0;
    const leave = parseFloat(unusedLeave) || 0;

    if (isNaN(salary) || salary <= 0 || end <= start) return;

    // 근속일수 계산
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    // 1년 미만 근속 시 퇴직금 없음
    if (totalDays < 365) {
      setResult({
        totalDays,
        years: 0,
        months,
        days: totalDays,
        averageDailyWage: 0,
        severancePay: 0,
        taxableAmount: 0,
        incomeTax: 0,
        localTax: 0,
        netSeverance: 0,
      });
      return;
    }

    // 월 평균임금 (상여금 포함)
    const monthlyAverage = salary + bonus / 12;
    
    // 1일 평균임금 (3개월 기준)
    const averageDailyWage = (monthlyAverage * 3) / 91; // 3개월 = 약 91일

    // 퇴직금 = (1일 평균임금 × 30일) × (총 근속일수 / 365)
    const severancePay = (averageDailyWage * 30) * (totalDays / 365) + leave;

    // 퇴직소득세 계산 (간이 계산)
    // 근속연수공제: 5년 이하 30만원×연수, 10년 이하 150만원+50만원×(연수-5), 20년 이하 400만원+80만원×(연수-10)
    let workYearsDeduction = 0;
    if (years <= 5) {
      workYearsDeduction = 300000 * years;
    } else if (years <= 10) {
      workYearsDeduction = 1500000 + 500000 * (years - 5);
    } else if (years <= 20) {
      workYearsDeduction = 4000000 + 800000 * (years - 10);
    } else {
      workYearsDeduction = 12000000 + 1200000 * (years - 20);
    }

    // 환산급여 = (퇴직금 - 근속연수공제) × 12 / 근속연수
    const deductedAmount = Math.max(0, severancePay - workYearsDeduction);
    const convertedIncome = (deductedAmount * 12) / Math.max(years, 1);

    // 환산급여공제 (2024년 기준 간이)
    let convertedDeduction = 0;
    if (convertedIncome <= 8000000) {
      convertedDeduction = convertedIncome;
    } else if (convertedIncome <= 70000000) {
      convertedDeduction = 8000000 + (convertedIncome - 8000000) * 0.6;
    } else if (convertedIncome <= 100000000) {
      convertedDeduction = 45200000 + (convertedIncome - 70000000) * 0.55;
    } else {
      convertedDeduction = 61700000 + (convertedIncome - 100000000) * 0.45;
    }

    // 과세표준 = 환산급여 - 환산급여공제
    const taxBase = Math.max(0, convertedIncome - convertedDeduction);

    // 산출세액 계산 (기본세율 적용)
    let tax = 0;
    if (taxBase <= 14000000) {
      tax = taxBase * 0.06;
    } else if (taxBase <= 50000000) {
      tax = 840000 + (taxBase - 14000000) * 0.15;
    } else if (taxBase <= 88000000) {
      tax = 6240000 + (taxBase - 50000000) * 0.24;
    } else if (taxBase <= 150000000) {
      tax = 15360000 + (taxBase - 88000000) * 0.35;
    } else if (taxBase <= 300000000) {
      tax = 37060000 + (taxBase - 150000000) * 0.38;
    } else if (taxBase <= 500000000) {
      tax = 94060000 + (taxBase - 300000000) * 0.40;
    } else if (taxBase <= 1000000000) {
      tax = 174060000 + (taxBase - 500000000) * 0.42;
    } else {
      tax = 384060000 + (taxBase - 1000000000) * 0.45;
    }

    // 실제 퇴직소득세 = 산출세액 × 근속연수 / 12
    const actualTax = (tax * Math.max(years, 1)) / 12;
    const incomeTax = Math.round(actualTax);
    const localTax = Math.round(incomeTax * 0.1);

    setResult({
      totalDays,
      years,
      months,
      days,
      averageDailyWage,
      severancePay,
      taxableAmount: taxBase,
      incomeTax,
      localTax,
      netSeverance: severancePay - incomeTax - localTax,
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
      return `${formatNumber(Math.floor(num / 10000))}만 ${formatNumber(Math.round(num % 10000))}원`;
    }
    return `${formatNumber(num)}원`;
  };

  const reset = () => {
    setStartDate('');
    setEndDate('');
    setMonthlySalary('3000000');
    setAnnualBonus('');
    setUnusedLeave('');
    setResult(null);
  };

  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['salary-calculator', 'loan-calculator', 'savings-calculator', 'percent-calculator'].includes(tool.id)
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
              💼 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.startDateLabel}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.endDateLabel}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.monthlySalaryLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="3000000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {monthlySalary && formatWon(parseFloat(monthlySalary))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.bonusLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={annualBonus}
                  onChange={(e) => setAnnualBonus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.annualLeaveLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={unusedLeave}
                  onChange={(e) => setUnusedLeave(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateSeverance}
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
              
              {result.totalDays < 365 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <p className="text-yellow-800 font-semibold text-lg mb-2">
                    ⚠️ 1년 미만 근속
                  </p>
                  <p className="text-yellow-700">
                    근속기간이 {result.months}개월 {result.days}일로, 1년 미만입니다.<br />
                    근로기준법상 1년 이상 근무해야 퇴직금을 받을 수 있습니다.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{t.workPeriod}</p>
                        <p className="text-lg font-semibold">
                          {result.years}년 {result.months}개월 {result.days}일
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">총 일수</p>
                        <p className="text-lg font-semibold">{formatNumber(result.totalDays)}일</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{t.averageDailyWage}</p>
                        <p className="text-lg font-semibold">{formatNumber(result.averageDailyWage)}원</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{t.grossSeverance}</p>
                        <p className="text-lg font-semibold">{formatWon(result.severancePay)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-600 mb-1">{t.incomeTax}</p>
                      <p className="text-xl font-bold text-red-600">
                        -{formatNumber(result.incomeTax)}원
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-600 mb-1">{t.localTax}</p>
                      <p className="text-xl font-bold text-orange-600">
                        -{formatNumber(result.localTax)}원
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-600 mb-1">{t.netSeverance}</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatWon(result.netSeverance)}
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    ※ 퇴직소득세는 간이 계산이며, 실제 세금과 다를 수 있습니다.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <AdBanner slot="severance-calculator-bottom" />

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 퇴직금 계산 알아보기</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              퇴직금은 1년 이상 근무한 근로자가 퇴직할 때 받는 급여입니다. 
              근로기준법에 따라 사용자는 퇴직하는 근로자에게 계속 근로기간 1년에 대해 
              30일분 이상의 평균임금을 퇴직금으로 지급해야 합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 퇴직금 계산 공식</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm">
                퇴직금 = (1일 평균임금 × 30일) × (총 근속일수 ÷ 365)
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 평균임금이란?</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              평균임금은 퇴직 전 3개월간 받은 총 임금을 그 기간의 총 일수로 나눈 금액입니다. 
              기본급 외에도 정기적으로 지급되는 상여금, 연차수당 등이 포함됩니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 퇴직금 지급 기한</h3>
            <p className="text-gray-600 leading-relaxed">
              퇴직금은 퇴직일로부터 14일 이내에 지급해야 합니다. 
              다만, 당사자 간 합의가 있으면 지급 기일을 연장할 수 있습니다.
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
