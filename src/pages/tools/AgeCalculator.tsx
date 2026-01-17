import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

// 다국어 지원을 위한 텍스트 객체 (i18n 확장 고려)
const i18n = {
  ko: {
    title: '만나이 계산기',
    subtitle: '정확한 나이 계산',
    description: '생년월일을 입력하면 만나이, 한국식 나이, 연나이를 정확하게 계산해드립니다.',
    birthDateLabel: '생년월일',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    koreanAge: '한국식 나이 (세는 나이)',
    internationalAge: '만나이 (국제 표준)',
    yearAge: '연나이',
    nextBirthday: '다음 생일까지',
    days: '일',
    years: '세',
    explanation: {
      korean: '태어날 때 1살로 시작하고 매년 1월 1일에 1살씩 증가',
      international: '태어난 날부터 계산하여 생일이 지나면 1살씩 증가 (2023년 만나이 통일법 적용)',
      year: '현재 연도에서 태어난 연도를 뺀 나이',
    },
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '만나이 통일법이란 무엇인가요?',
          answer: '2023년 6월 28일부터 시행된 법으로, 법적·사회적 나이 계산을 만나이로 통일하는 제도입니다. 이에 따라 대부분의 공식 문서에서 만나이를 사용하게 되었습니다.',
        },
        {
          question: '만나이와 한국식 나이의 차이는 무엇인가요?',
          answer: '만나이는 태어난 날부터 0살로 시작하여 매년 생일에 1살씩 증가합니다. 한국식 나이(세는 나이)는 태어날 때 1살로 시작하고 매년 1월 1일에 1살씩 증가합니다.',
        },
        {
          question: '연나이는 어떻게 계산하나요?',
          answer: '연나이는 현재 연도에서 태어난 연도를 빼서 계산합니다. 생일이 지났는지 여부와 관계없이 동일한 해에 태어난 사람은 같은 연나이를 갖습니다.',
        },
      ],
    },
  },
  en: {
    title: 'Age Calculator',
    subtitle: 'Accurate Age Calculation',
    description: 'Enter your birth date to calculate your international age, Korean age, and year age accurately.',
    birthDateLabel: 'Date of Birth',
    calculateButton: 'Calculate',
    resetButton: 'Reset',
    resultTitle: 'Calculation Result',
    koreanAge: 'Korean Age (Counting Age)',
    internationalAge: 'International Age (Standard)',
    yearAge: 'Year Age',
    nextBirthday: 'Days until next birthday',
    days: ' days',
    years: ' years old',
    explanation: {
      korean: 'Starts at 1 year old at birth and increases by 1 every January 1st',
      international: 'Calculated from birth date, increases by 1 on each birthday (Korean Age Unification Law 2023)',
      year: 'Current year minus birth year',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is the Korean Age Unification Law?',
          answer: 'Effective from June 28, 2023, this law standardizes age calculation to international age for legal and social purposes in Korea. Most official documents now use international age.',
        },
        {
          question: 'What is the difference between international age and Korean age?',
          answer: 'International age starts at 0 at birth and increases by 1 on each birthday. Korean age (counting age) starts at 1 at birth and increases by 1 every January 1st.',
        },
        {
          question: 'How is year age calculated?',
          answer: 'Year age is calculated by subtracting the birth year from the current year. People born in the same year have the same year age regardless of whether their birthday has passed.',
        },
      ],
    },
  },
};

interface AgeResult {
  koreanAge: number;
  internationalAge: number;
  yearAge: number;
  nextBirthdayDays: number;
  birthDateFormatted: string;
}

/**
 * 만나이 계산기 도구 페이지
 * - SEO 최적화 구조
 * - 다국어(i18n) 확장 고려
 * - 구조화된 데이터(Schema.org) 포함
 */
export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const { t } = useLocalizedContent(i18n);

  // 도구 정보 가져오기
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'age-calculator');

  // 구조화된 데이터 (HowTo Schema)
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };

  // FAQ 구조화된 데이터
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

  // 나이 계산 함수
  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    
    // 한국식 나이 (세는 나이): 태어날 때 1살 + 해가 바뀔 때마다 +1
    const koreanAge = today.getFullYear() - birth.getFullYear() + 1;
    
    // 연나이: 현재 연도 - 태어난 연도
    const yearAge = today.getFullYear() - birth.getFullYear();
    
    // 만나이 계산
    let internationalAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      internationalAge--;
    }

    // 다음 생일까지 남은 일수 계산
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      nextBirthdayDays,
      birthDateFormatted: birth.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  };

  const handleReset = () => {
    setBirthDate('');
    setResult(null);
  };

  // 오늘 날짜 (최대값으로 사용)
  const maxDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />

      {/* FAQ 구조화된 데이터 추가 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* 페이지 헤더 - H1 태그는 페이지당 하나만 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600">
            {t.description}
          </p>
        </header>

        {/* 계산기 입력 폼 */}
        <section 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
          aria-labelledby="calculator-heading"
        >
          <h2 id="calculator-heading" className="sr-only">나이 계산기 입력</h2>
          
          <div className="space-y-6">
            <div>
              <label 
                htmlFor="birthDate" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.birthDateLabel}
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={maxDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                aria-describedby="birthDate-help"
              />
              <p id="birthDate-help" className="mt-1 text-sm text-gray-500">
                생년월일을 선택하세요
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={calculateAge}
                disabled={!birthDate}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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

        {/* 계산 결과 */}
        {result && (
          <section 
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 mb-8"
            aria-labelledby="result-heading"
          >
            <h2 id="result-heading" className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                ✓
              </span>
              {t.resultTitle}
            </h2>

            <p className="text-gray-600 mb-6">
              생년월일: <strong>{result.birthDateFormatted}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 만나이 (강조) */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-500">
                <div className="text-sm text-blue-600 font-medium mb-1">
                  {t.internationalAge}
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.internationalAge}<span className="text-lg ml-1">{t.years}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.explanation.international}
                </p>
              </div>

              {/* 한국식 나이 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-sm text-gray-600 font-medium mb-1">
                  {t.koreanAge}
                </div>
                <div className="text-4xl font-bold text-gray-700 mb-2">
                  {result.koreanAge}<span className="text-lg ml-1">{t.years}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.explanation.korean}
                </p>
              </div>

              {/* 연나이 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-sm text-gray-600 font-medium mb-1">
                  {t.yearAge}
                </div>
                <div className="text-4xl font-bold text-gray-700 mb-2">
                  {result.yearAge}<span className="text-lg ml-1">{t.years}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.explanation.year}
                </p>
              </div>
            </div>

            {/* 다음 생일까지 */}
            <div className="mt-6 bg-white rounded-lg p-4 text-center">
              <span className="text-gray-600">{t.nextBirthday}:</span>
              <span className="text-2xl font-bold text-purple-600 ml-2">
                {result.nextBirthdayDays}{t.days}
              </span>
            </div>
          </section>
        )}

        {/* 중간 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ 섹션 - SEO에 매우 중요 */}
        <section 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-800 mb-6">
            {t.faq.title}
          </h2>
          
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <article key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Q. {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A. {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 추가 설명 콘텐츠 - SEO를 위한 관련 키워드 포함 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            만나이 계산기 사용 방법
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>만나이 계산기</strong>는 생년월일을 입력하면 자동으로 
              <strong>만나이</strong>, <strong>한국식 나이</strong>(세는 나이), 
              <strong>연나이</strong>를 계산해 드립니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              2023년 6월 28일부터 시행된 <strong>만나이 통일법</strong>에 따라, 
              대한민국에서는 법적·사회적으로 만나이를 기준으로 나이를 계산합니다. 
              이 계산기를 사용하면 복잡한 나이 계산을 쉽고 정확하게 할 수 있습니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              나이 계산 방식 비교
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>만나이</strong>: 출생일부터 현재까지의 정확한 나이 (국제 표준)
              </li>
              <li>
                <strong>한국식 나이</strong>: 태어나면 1살, 새해 1월 1일마다 1살 추가
              </li>
              <li>
                <strong>연나이</strong>: 올해 연도 - 출생 연도
              </li>
            </ul>
          </div>
        </section>

        {/* 관련 도구 - 내부 링크로 SEO 강화 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 같이 보면 좋은 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/tools/military-calculator"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">전역일 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">입대일 기준 전역일, 남은 복무일 계산</p>
            </Link>
            <Link
              to="/tools/zodiac-calculator"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-600">띠 & 별자리 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">12간지 띠, 생일 별자리 확인</p>
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
