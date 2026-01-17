import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 2024년 기준 세율 정보 (간이 계산용)
const TAX_RATES = {
  nationalPension: 0.045, // 국민연금 4.5%
  healthInsurance: 0.03545, // 건강보험 3.545%
  longTermCare: 0.1281, // 장기요양보험 (건강보험의 12.81%)
  employmentInsurance: 0.009, // 고용보험 0.9%
};

// 소득세 구간별 세율 (2024년 기준)
const INCOME_TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

const i18n = {
  ko: {
    title: '실수령액 계산기',
    description: '연봉 입력 시 4대 보험과 소득세를 제외한 실제 월급(실수령액)을 계산합니다. 2024년 기준.',
    annualSalary: '연봉 (세전)',
    calculateButton: '계산하기',
    resultTitle: '예상 실수령액',
    monthly: '월 실수령액',
    yearly: '연간 실수령액',
    deductions: '공제 내역',
    nationalPension: '국민연금',
    healthInsurance: '건강보험',
    longTermCare: '장기요양보험',
    employmentInsurance: '고용보험',
    incomeTax: '소득세',
    localIncomeTax: '지방소득세',
    totalDeduction: '월 공제 합계',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '4대 보험은 어떻게 계산되나요?',
          answer: '국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험의 12.81%), 고용보험(0.9%)을 합산합니다. 산재보험은 회사 전액 부담이라 제외됩니다.',
        },
        {
          question: '소득세는 어떻게 계산되나요?',
          answer: '연간 과세표준에 따라 6%~45%의 누진세율이 적용됩니다. 지방소득세는 소득세의 10%입니다.',
        },
        {
          question: '실제 급여와 차이가 나는 이유는?',
          answer: '이 계산기는 간이 계산입니다. 실제로는 부양가족 수, 비과세 항목(식대, 차량유지비 등), 연말정산 등에 따라 달라질 수 있습니다.',
        },
      ],
    },
  },
};

interface SalaryResult {
  grossMonthly: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  netMonthly: number;
  netYearly: number;
}

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [result, setResult] = useState<SalaryResult | null>(null);
  const lang = 'ko';
  const t = i18n[lang];

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'salary-calculator');

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

  const calculate = () => {
    if (!annualSalary) return;

    const annual = parseFloat(annualSalary.replace(/,/g, ''));
    const grossMonthly = annual / 12;

    // 4대 보험 계산 (월급 기준)
    const nationalPension = Math.min(grossMonthly * TAX_RATES.nationalPension, 265500); // 상한선 있음
    const healthInsurance = grossMonthly * TAX_RATES.healthInsurance;
    const longTermCare = healthInsurance * TAX_RATES.longTermCare;
    const employmentInsurance = grossMonthly * TAX_RATES.employmentInsurance;

    // 소득세 계산 (간이세액표 기준, 대략적 계산)
    // 과세표준 = 연봉 - 근로소득공제 (간이 계산)
    const taxableIncome = annual * 0.85; // 간이로 15% 공제 가정
    let incomeTaxYearly = 0;
    for (const bracket of INCOME_TAX_BRACKETS) {
      if (taxableIncome <= bracket.limit) {
        incomeTaxYearly = taxableIncome * bracket.rate - bracket.deduction;
        break;
      }
    }
    const incomeTax = Math.max(0, incomeTaxYearly / 12);
    const localIncomeTax = incomeTax * 0.1;

    const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
    const netMonthly = grossMonthly - totalDeduction;

    setResult({
      grossMonthly,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      totalDeduction,
      netMonthly,
      netYearly: netMonthly * 12,
    });
  };

  const formatMoney = (value: number) => {
    return Math.round(value).toLocaleString();
  };

  // 빠른 연봉 버튼
  const quickAmounts = [3000, 4000, 5000, 6000, 7000, 8000, 10000];

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

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-2">
                {t.annualSalary} (만원)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="annualSalary"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  placeholder="예: 5000"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex items-center text-gray-600 text-lg">만원</span>
              </div>
            </div>

            {/* 빠른 선택 버튼 */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setAnnualSalary(amount.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    annualSalary === amount.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amount.toLocaleString()}만원
                </button>
              ))}
            </div>

            <button
              onClick={calculate}
              disabled={!annualSalary}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.calculateButton}
            </button>
          </div>
        </section>

        {result && (
          <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{t.resultTitle}</h2>

            {/* 핵심 결과 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-500 text-center">
                <div className="text-sm text-green-600 font-medium mb-1">{t.monthly}</div>
                <div className="text-4xl font-bold text-green-700">
                  {formatMoney(result.netMonthly)}원
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  (세전 {formatMoney(result.grossMonthly)}원)
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-sm text-blue-600 font-medium mb-1">{t.yearly}</div>
                <div className="text-4xl font-bold text-blue-700">
                  {formatMoney(result.netYearly)}원
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  (약 {(result.netYearly / 10000).toFixed(0)}만원)
                </div>
              </div>
            </div>

            {/* 공제 내역 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">{t.deductions} (월 기준)</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{t.nationalPension} (4.5%)</span>
                  <span className="text-red-600">-{formatMoney(result.nationalPension)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.healthInsurance} (3.545%)</span>
                  <span className="text-red-600">-{formatMoney(result.healthInsurance)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.longTermCare}</span>
                  <span className="text-red-600">-{formatMoney(result.longTermCare)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.employmentInsurance} (0.9%)</span>
                  <span className="text-red-600">-{formatMoney(result.employmentInsurance)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.incomeTax}</span>
                  <span className="text-red-600">-{formatMoney(result.incomeTax)}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.localIncomeTax}</span>
                  <span className="text-red-600">-{formatMoney(result.localIncomeTax)}원</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-800">
                  <span>{t.totalDeduction}</span>
                  <span className="text-red-600">-{formatMoney(result.totalDeduction)}원</span>
                </div>
              </div>
            </div>
          </section>
        )}

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">실수령액 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>실수령액 계산기</strong>는 연봉(세전 급여)을 입력하면 <strong>4대 보험</strong>과
              <strong>소득세</strong>를 공제한 실제 월급(실수령액)을 계산해주는 도구입니다.
              연봉 협상이나 이직 시 예상 급여를 확인할 때 유용합니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4대 보험료율 (2024년 기준)</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>국민연금:</strong> 9% (근로자 4.5% + 회사 4.5%)</li>
              <li><strong>건강보험:</strong> 7.09% (근로자 3.545% + 회사 3.545%)</li>
              <li><strong>장기요양보험:</strong> 건강보험료의 12.81%</li>
              <li><strong>고용보험:</strong> 1.8% (근로자 0.9% + 회사 0.9%)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4 text-sm">
              ※ 이 계산기는 간이 계산 결과입니다. 실제 급여는 부양가족 수, 비과세 항목, 
              연말정산 결과 등에 따라 달라질 수 있습니다.
            </p>
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
            <Link to="/tools/gpa-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">학점 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">대학 평균 학점 계산</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
