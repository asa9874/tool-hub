import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

// 띠 정보 (12간지)
const ZODIAC_ANIMALS = [
  { name: '원숭이', emoji: '🐵', years: [1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { name: '닭', emoji: '🐔', years: [1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { name: '개', emoji: '🐕', years: [1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { name: '돼지', emoji: '🐷', years: [1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] },
  { name: '쥐', emoji: '🐭', years: [1948, 1960, 1972, 1984, 1996, 2008, 2020, 2032] },
  { name: '소', emoji: '🐮', years: [1949, 1961, 1973, 1985, 1997, 2009, 2021, 2033] },
  { name: '호랑이', emoji: '🐯', years: [1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034] },
  { name: '토끼', emoji: '🐰', years: [1951, 1963, 1975, 1987, 1999, 2011, 2023, 2035] },
  { name: '용', emoji: '🐲', years: [1952, 1964, 1976, 1988, 2000, 2012, 2024, 2036] },
  { name: '뱀', emoji: '🐍', years: [1953, 1965, 1977, 1989, 2001, 2013, 2025, 2037] },
  { name: '말', emoji: '🐴', years: [1954, 1966, 1978, 1990, 2002, 2014, 2026, 2038] },
  { name: '양', emoji: '🐑', years: [1955, 1967, 1979, 1991, 2003, 2015, 2027, 2039] },
];

// 별자리 정보
const ZODIAC_SIGNS = [
  { name: '염소자리', emoji: '♑', start: [1, 1], end: [1, 19] },
  { name: '물병자리', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: '물고기자리', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: '양자리', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: '황소자리', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: '쌍둥이자리', emoji: '♊', start: [5, 21], end: [6, 21] },
  { name: '게자리', emoji: '♋', start: [6, 22], end: [7, 22] },
  { name: '사자자리', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: '처녀자리', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: '천칭자리', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: '전갈자리', emoji: '♏', start: [10, 23], end: [11, 22] },
  { name: '사수자리', emoji: '♐', start: [11, 23], end: [12, 21] },
  { name: '염소자리', emoji: '♑', start: [12, 22], end: [12, 31] },
];

const i18n = {
  ko: {
    title: '띠 & 별자리 계산기',
    description: '생년월일로 띠(12간지)와 별자리를 확인하세요. 다음 생일까지 며칠 남았는지도 알려드립니다.',
    birthDate: '생년월일',
    calculate: '계산하기',
    result: '계산 결과',
    zodiacAnimal: '띠 (12간지)',
    zodiacSign: '별자리',
    nextBirthday: '다음 생일까지',
    age: '나이',
    days: '일',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '띠는 어떻게 결정되나요?',
          answer: '띠는 태어난 해에 따라 12년 주기로 정해집니다. 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지 순으로 돌아갑니다.',
        },
        {
          question: '별자리는 어떻게 결정되나요?',
          answer: '별자리는 태어난 월일에 따라 결정됩니다. 황도 12궁을 기준으로 태양이 위치한 별자리가 해당인의 별자리가 됩니다.',
        },
        {
          question: '음력 생일도 계산할 수 있나요?',
          answer: '현재 이 계산기는 양력 기준으로만 계산합니다. 음력 생일은 양력으로 변환한 후 입력해 주세요.',
        },
      ],
    },
  },
  en: {
    title: 'Zodiac & Horoscope Calculator',
    description: 'Find your Chinese zodiac animal and Western zodiac sign by birth date. Also shows days until your next birthday.',
    birthDate: 'Date of Birth',
    calculate: 'Calculate',
    result: 'Calculation Result',
    zodiacAnimal: 'Chinese Zodiac',
    zodiacSign: 'Zodiac Sign',
    nextBirthday: 'Days until next birthday',
    age: 'Age',
    days: ' days',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How is the Chinese zodiac determined?',
          answer: 'The Chinese zodiac follows a 12-year cycle based on birth year. The animals are: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig.',
        },
        {
          question: 'How is the Western zodiac sign determined?',
          answer: 'Western zodiac signs are determined by birth month and day, based on the position of the sun in the 12 constellations of the ecliptic at the time of birth.',
        },
        {
          question: 'Can I calculate using lunar calendar dates?',
          answer: 'This calculator currently only supports solar (Gregorian) calendar dates. Please convert lunar dates to solar dates before entering.',
        },
      ],
    },
  },
};

export default function ZodiacCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'zodiac-calculator');

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
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const year = birth.getFullYear();
    const month = birth.getMonth() + 1;
    const day = birth.getDate();

    // 띠 계산
    const zodiacIndex = (year - 4) % 12; // 기준년도(쥐띠) = 4
    const zodiacAnimal = ZODIAC_ANIMALS[zodiacIndex];

    // 별자리 계산
    let zodiacSign = ZODIAC_SIGNS[0];
    for (const sign of ZODIAC_SIGNS) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        zodiacSign = sign;
        break;
      }
    }

    // 나이 계산
    const today = new Date();
    let age = today.getFullYear() - year;
    const birthThisYear = new Date(today.getFullYear(), month - 1, day);
    if (today < birthThisYear) age--;

    // 다음 생일까지 계산
    let nextBirthday = new Date(today.getFullYear(), month - 1, day);
    if (today > nextBirthday) {
      nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      zodiacAnimal,
      zodiacSign,
      age,
      daysUntilBirthday,
      nextBirthday,
    };
  }, [birthDate]);

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
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t.birthDate}
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 결과 */}
        {result && (
          <section className="mb-8 space-y-4">
            {/* 띠 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 md:p-8 text-center">
              <div className="text-sm text-red-600 font-medium mb-2">{t.zodiacAnimal}</div>
              <div className="text-7xl mb-3">{result.zodiacAnimal.emoji}</div>
              <div className="text-3xl font-bold text-gray-800">{result.zodiacAnimal.name}띠</div>
              <div className="text-sm text-gray-500 mt-2">
                같은 띠 해: {result.zodiacAnimal.years.slice(-4).join(', ')}
              </div>
            </div>

            {/* 별자리 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 text-center">
              <div className="text-sm text-purple-600 font-medium mb-2">{t.zodiacSign}</div>
              <div className="text-7xl mb-3">{result.zodiacSign.emoji}</div>
              <div className="text-3xl font-bold text-gray-800">{result.zodiacSign.name}</div>
            </div>

            {/* 나이 & 생일 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">{t.age}</div>
                <div className="text-4xl font-bold text-blue-600">만 {result.age}세</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">{t.nextBirthday}</div>
                <div className="text-4xl font-bold text-green-600">
                  {result.daysUntilBirthday === 0 ? '🎂 오늘!' : `${result.daysUntilBirthday}일`}
                </div>
              </div>
            </div>
          </section>
        )}

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* 12띠 참고표 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐲 12간지(띠) 참고표</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {ZODIAC_ANIMALS.map((animal, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">{animal.emoji}</div>
                <div className="text-sm font-medium">{animal.name}띠</div>
              </div>
            ))}
          </div>
        </section>

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

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/age-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">만나이 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">정확한 만나이 계산</p>
            </Link>
            <Link to="/tools/d-day-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">D-Day 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">특정 날짜까지 남은 일수</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
