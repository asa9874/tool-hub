import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

// 복무 유형 정보
const serviceTypes = [
  { id: 'army', name: '육군/해병대', days: 548 },
  { id: 'navy', name: '해군', days: 609 },
  { id: 'airforce', name: '공군', days: 639 },
  { id: 'social', name: '사회복무요원', days: 639 },
  { id: 'riot', name: '의무경찰/의무소방', days: 548 },
];

const i18n = {
  ko: {
    title: '전역일 계산기',
    description: '입대일을 입력하면 전역일, 복무한 일수, 남은 일수를 정확하게 계산해드립니다.',
    enlistDateLabel: '입대일',
    serviceTypeLabel: '복무 유형',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    dischargeDate: '전역일',
    totalDays: '총 복무일',
    servedDays: '복무한 일수',
    remainingDays: '남은 일수',
    progressLabel: '복무 진행률',
    days: '일',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '복무 기간은 어떻게 계산되나요?',
          answer: '복무 기간은 입대일을 1일차로 포함하여 계산됩니다. 육군/해병대는 18개월(548일), 해군은 20개월(609일), 공군은 21개월(639일)입니다.',
        },
        {
          question: '전역일이 공휴일이면 어떻게 되나요?',
          answer: '전역일이 토요일, 일요일 또는 공휴일인 경우 그 전날에 전역하게 됩니다. 이 계산기에서는 기본 전역일만 계산하며, 공휴일 조정은 별도로 확인해야 합니다.',
        },
        {
          question: '복무 기간이 변경되면 어떻게 되나요?',
          answer: '복무 기간은 정부 정책에 따라 변경될 수 있습니다. 현재 기준은 2024년 기준이며, 변경 시 계산기도 업데이트됩니다.',
        },
      ],
    },
  },
  en: {
    title: 'Military Discharge Calculator',
    description: 'Enter your enlistment date to calculate discharge date, days served, and remaining days.',
    enlistDateLabel: 'Enlistment Date',
    serviceTypeLabel: 'Service Type',
    calculateButton: 'Calculate',
    resetButton: 'Reset',
    resultTitle: 'Calculation Result',
    dischargeDate: 'Discharge Date',
    totalDays: 'Total Service Days',
    servedDays: 'Days Served',
    remainingDays: 'Days Remaining',
    progressLabel: 'Service Progress',
    days: ' days',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How is the service period calculated?',
          answer: 'Service period is calculated including the enlistment date as day 1. Army/Marines serve 18 months (548 days), Navy serves 20 months (609 days), and Air Force serves 21 months (639 days).',
        },
        {
          question: 'What happens if discharge date falls on a holiday?',
          answer: 'If the discharge date falls on Saturday, Sunday, or a public holiday, discharge occurs the day before. This calculator shows the basic discharge date; holiday adjustments should be checked separately.',
        },
        {
          question: 'What happens if service period changes?',
          answer: 'Service periods may change according to government policy. Current standards are based on 2024 guidelines, and the calculator will be updated accordingly.',
        },
      ],
    },
  },
};

interface DischargeResult {
  dischargeDate: Date;
  totalDays: number;
  servedDays: number;
  remainingDays: number;
  progress: number;
}

export default function MilitaryCalculator() {
  const [enlistDate, setEnlistDate] = useState('');
  const [serviceType, setServiceType] = useState('army');
  const [result, setResult] = useState<DischargeResult | null>(null);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'military-calculator');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
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
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const calculate = () => {
    if (!enlistDate) return;

    const enlist = new Date(enlistDate);
    const selectedService = serviceTypes.find((s) => s.id === serviceType);
    if (!selectedService) return;

    const totalDays = selectedService.days;
    const dischargeDate = new Date(enlist);
    dischargeDate.setDate(dischargeDate.getDate() + totalDays - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const servedDays = Math.max(0, Math.ceil((today.getTime() - enlist.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const remainingDays = Math.max(0, totalDays - servedDays);
    const progress = Math.min(100, Math.max(0, (servedDays / totalDays) * 100));

    setResult({
      dischargeDate,
      totalDays,
      servedDays: Math.min(servedDays, totalDays),
      remainingDays,
      progress,
    });
  };

  const handleReset = () => {
    setEnlistDate('');
    setServiceType('army');
    setResult(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                {t.serviceTypeLabel}
              </label>
              <select
                id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                {serviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.days}일)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="enlistDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t.enlistDateLabel}
              </label>
              <input
                type="date"
                id="enlistDate"
                value={enlistDate}
                onChange={(e) => setEnlistDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={calculate}
                disabled={!enlistDate}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {t.calculateButton}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.resetButton}
              </button>
            </div>
          </div>
        </section>

        {result && (
          <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                ✓
              </span>
              {t.resultTitle}
            </h2>

            {/* 전역일 강조 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-500 mb-6 text-center">
              <div className="text-sm text-green-600 font-medium mb-2">{t.dischargeDate}</div>
              <div className="text-3xl font-bold text-green-700">
                {formatDate(result.dischargeDate)}
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{t.progressLabel}</span>
                <span className="font-bold text-green-600">{result.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${result.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">{t.totalDays}</div>
                <div className="text-3xl font-bold text-gray-700">
                  {result.totalDays}<span className="text-lg ml-1">{t.days}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">{t.servedDays}</div>
                <div className="text-3xl font-bold text-blue-600">
                  {result.servedDays}<span className="text-lg ml-1">{t.days}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-1">{t.remainingDays}</div>
                <div className="text-3xl font-bold text-orange-600">
                  {result.remainingDays}<span className="text-lg ml-1">{t.days}</span>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">전역일 계산기 사용 방법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>전역일 계산기</strong>는 대한민국 국군 장병들의 전역일을 정확하게 계산해주는 도구입니다.
              복무 유형(육군, 해군, 공군, 사회복무요원 등)을 선택하고 입대일을 입력하면 자동으로 전역일, 
              복무한 일수, 남은 일수, 진행률을 계산해드립니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">복무 기간 안내 (2024년 기준)</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>육군/해병대:</strong> 18개월 (548일)</li>
              <li><strong>해군:</strong> 20개월 (609일)</li>
              <li><strong>공군:</strong> 21개월 (639일)</li>
              <li><strong>사회복무요원:</strong> 21개월 (639일)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              전역일이 주말이나 공휴일인 경우 실제로는 그 전날 전역하게 됩니다.
              또한, 휴가 일수나 복무 단축 등에 따라 실제 전역일이 달라질 수 있으니 참고용으로만 사용해 주세요.
            </p>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/tools/age-calculator"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">만나이 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">정확한 만나이, 한국식 나이 계산</p>
            </Link>
            <Link
              to="/tools/d-day-calculator"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">D-Day 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">특정 날짜까지 남은 일수 계산</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
