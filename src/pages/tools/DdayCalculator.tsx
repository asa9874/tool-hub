import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

const i18n = {
  ko: {
    title: 'D-Day 계산기',
    description: '특정 날짜까지 남은 일수를 계산합니다. 기념일, 시험일, 여행 등 중요한 날까지 D-Day를 확인하세요.',
    targetDate: '목표 날짜',
    eventName: '이벤트 이름 (선택)',
    today: '오늘',
    result: '계산 결과',
    daysLeft: '남은 일수',
    daysPassed: '지난 일수',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'D-Day는 어떻게 계산되나요?',
          answer: 'D-Day는 목표 날짜에서 오늘 날짜를 뺀 일수입니다. D-0은 당일, D-1은 하루 전, D+1은 하루 후입니다.',
        },
        {
          question: '100일은 어떻게 계산하나요?',
          answer: '시작일을 1일로 계산하면 100일째는 시작일로부터 99일 후입니다. 예: 1월 1일 시작 → 4월 10일이 100일째',
        },
        {
          question: 'D-Day 계산에 시작일을 포함하나요?',
          answer: '일반적으로 D-Day 계산은 시작일을 포함하지 않습니다. 예: 오늘이 1월 1일이고 목표일이 1월 2일이면 D-1입니다.',
        },
      ],
    },
  },
};

export default function DdayCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [eventName, setEventName] = useState('');
  const lang = 'ko';
  const t = i18n[lang];

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'd-day-calculator');

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

  const result = useMemo(() => {
    if (!targetDate) return null;

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      diffDays,
      targetDate: target,
      isFuture: diffDays > 0,
      isToday: diffDays === 0,
    };
  }, [targetDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  // 빠른 날짜 버튼
  const quickDates = [
    { label: '7일 후', days: 7 },
    { label: '30일 후', days: 30 },
    { label: '100일 후', days: 100 },
    { label: '1년 후', days: 365 },
  ];

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setTargetDate(date.toISOString().split('T')[0]);
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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                {t.eventName}
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="예: 졸업식, 시험, 여행"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t.targetDate}
              </label>
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 빠른 선택 버튼 */}
            <div className="flex flex-wrap gap-2">
              {quickDates.map((item) => (
                <button
                  key={item.days}
                  onClick={() => setQuickDate(item.days)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 결과 */}
        {result && (
          <section className="mb-8">
            <div className={`rounded-xl shadow-lg p-8 text-center ${
              result.isToday
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                : result.isFuture
                ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
              {eventName && (
                <div className="text-xl text-gray-700 mb-2">{eventName}</div>
              )}
              <div className="text-6xl md:text-8xl font-bold mb-4">
                {result.isToday ? (
                  <span className="text-yellow-600">D-Day!</span>
                ) : result.isFuture ? (
                  <span className="text-blue-600">D-{result.diffDays}</span>
                ) : (
                  <span className="text-gray-600">D+{Math.abs(result.diffDays)}</span>
                )}
              </div>
              <div className="text-lg text-gray-600">
                {formatDate(result.targetDate)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {result.isToday
                  ? '오늘이 그 날입니다!'
                  : result.isFuture
                  ? `${result.diffDays}일 남았습니다`
                  : `${Math.abs(result.diffDays)}일 지났습니다`}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">D-Day 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>D-Day 계산기</strong>는 특정 날짜까지 남은 일수를 계산하여 중요한 일정을 관리하는 데 도움을 줍니다.
              시험, 기념일, 여행, 이벤트 등 다양한 목적으로 활용할 수 있습니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">D-Day 표기 방법</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>D-Day:</strong> 목표 당일</li>
              <li><strong>D-1, D-2, ...:</strong> 목표일까지 남은 일수</li>
              <li><strong>D+1, D+2, ...:</strong> 목표일 이후 지난 일수</li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/age-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">만나이 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">정확한 만나이 계산</p>
            </Link>
            <Link to="/tools/military-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">전역일 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">군 복무 전역일 계산</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
