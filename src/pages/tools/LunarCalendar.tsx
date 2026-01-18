import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 손 없는 날 계산 (음력 기준 9, 10, 19, 20, 29, 30일)
const SON_DAYS = [9, 10, 19, 20, 29, 30];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 간이 음력 계산 함수 (근사치)
function getLunarDate(year: number, month: number, day: number): { lunarMonth: number; lunarDay: number } {
  // 이것은 근사치입니다. 실제로는 천문학적 계산이나 데이터베이스 필요
  const date = new Date(year, month - 1, day);
  const baseDate = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 음력은 양력보다 약 1달 늦음 (근사치)
  let lunarMonth = month;
  let lunarDay = day;
  
  // 간단한 근사 계산 (실제로는 더 복잡함)
  const offset = Math.floor(dayOfYear * 0.97); // 음력 연도는 약 354일
  lunarMonth = Math.floor(offset / 29.5) + 1;
  lunarDay = (offset % 30) + 1;
  
  if (lunarMonth > 12) lunarMonth = 12;
  if (lunarDay > 30) lunarDay = 30;
  
  return { lunarMonth, lunarDay };
}

// 손 없는 날인지 확인
function isSonDay(lunarDay: number): boolean {
  return SON_DAYS.includes(lunarDay);
}

const i18n = {
  ko: {
    title: '음력/양력 변환 & 손 없는 날',
    subtitle: '이사, 개업, 결혼 등 중요한 날을 정할 때 손 없는 날을 확인하세요',
    description: '양력을 음력으로 변환하고, 이사나 결혼에 좋은 손 없는 날을 달력에서 확인합니다.',
    solarToLunar: '양력 → 음력 변환',
    lunarToSolar: '음력 → 양력 변환',
    sonDayCalendar: '손 없는 날 달력',
    inputDate: '날짜 입력',
    convert: '변환',
    result: '변환 결과',
    solarDate: '양력',
    lunarDate: '음력',
    isSonDay: '손 없는 날',
    yes: '예 ✓',
    no: '아니오',
    sonDayInfo: '손 없는 날이란?',
    prevMonth: '이전 달',
    nextMonth: '다음 달',
    today: '오늘',
    legend: '범례',
    sonDay: '손 없는 날',
    normalDay: '일반',
    faq: {
      q1: '손 없는 날이란 무엇인가요?',
      a1: '손 없는 날은 음력 기준으로 9, 10, 19, 20, 29, 30일을 말합니다. "손"은 악귀를 의미하며, 이 날들은 귀신이 하늘로 올라가 사람에게 해를 끼치지 않는다고 전해집니다. 그래서 이사, 개업, 결혼 등 중요한 일을 시작하기 좋은 날로 여겨집니다.',
      q2: '왜 이사할 때 손 없는 날을 선호하나요?',
      a2: '전통적으로 손 없는 날에 이사하면 탈 없이 새 보금자리에 정착할 수 있다고 믿습니다. 과학적 근거는 없지만, 한국에서는 오랜 관습으로 이사 날짜를 정할 때 손 없는 날을 확인하는 경우가 많습니다.',
      q3: '음력과 양력의 차이는 무엇인가요?',
      a3: '양력(그레고리력)은 태양의 공전을 기준으로 1년이 365일입니다. 음력은 달의 공전을 기준으로 1년이 약 354일이며, 윤달을 두어 계절과 맞춥니다. 한국의 설날, 추석 등 전통 명절은 음력을 기준으로 합니다.',
    },
  },
};

export default function LunarCalendar() {
  const lang = 'ko';
  const t = i18n[lang];

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [inputDate, setInputDate] = useState(today.toISOString().split('T')[0]);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'lunar-calendar');

  // 선택한 날짜의 음력 변환
  const convertedDate = useMemo(() => {
    const [year, month, day] = inputDate.split('-').map(Number);
    const lunar = getLunarDate(year, month, day);
    const isSon = isSonDay(lunar.lunarDay);
    return { year, month, day, ...lunar, isSonDay: isSon };
  }, [inputDate]);

  // 달력 데이터 생성
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ day: number; lunarDay: number; isSonDay: boolean } | null> = [];

    // 앞쪽 빈칸
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const lunar = getLunarDate(currentYear, currentMonth, day);
      days.push({
        day,
        lunarDay: lunar.lunarDay,
        isSonDay: isSonDay(lunar.lunarDay),
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
    ],
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🌙 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 양력 → 음력 변환 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.solarToLunar}</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* 변환 결과 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 mb-1">{t.solarDate}</div>
              <div className="text-xl font-bold text-blue-800">
                {convertedDate.year}년 {convertedDate.month}월 {convertedDate.day}일
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-600 mb-1">{t.lunarDate}</div>
              <div className="text-xl font-bold text-purple-800">
                {convertedDate.lunarMonth}월 {convertedDate.lunarDay}일
              </div>
            </div>
            <div className={`rounded-lg p-4 text-center ${convertedDate.isSonDay ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`text-sm mb-1 ${convertedDate.isSonDay ? 'text-green-600' : 'text-gray-600'}`}>{t.isSonDay}</div>
              <div className={`text-xl font-bold ${convertedDate.isSonDay ? 'text-green-800' : 'text-gray-800'}`}>
                {convertedDate.isSonDay ? t.yes : t.no}
              </div>
            </div>
          </div>
        </section>

        {/* 손 없는 날 달력 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📅 {t.sonDayCalendar}</h2>
          
          {/* 달력 네비게이션 */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← {t.prevMonth}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-gray-800">
                {currentYear}년 {MONTHS[currentMonth - 1]}
              </span>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                {t.today}
              </button>
            </div>
            <button
              onClick={goToNextMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t.nextMonth} →
            </button>
          </div>

          {/* 범례 */}
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>{t.sonDay}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>{t.normalDay}</span>
            </div>
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 요일 헤더 */}
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className={`text-center py-2 font-medium text-sm ${
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
            
            {/* 날짜 */}
            {calendarData.map((data, index) => (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                  data === null
                    ? ''
                    : data.isSonDay
                    ? 'bg-green-100 border-2 border-green-400'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${
                  data && data.day === today.getDate() && 
                  currentMonth === today.getMonth() + 1 && 
                  currentYear === today.getFullYear()
                    ? 'ring-2 ring-purple-500'
                    : ''
                }`}
              >
                {data && (
                  <>
                    <span className={`font-medium ${data.isSonDay ? 'text-green-800' : 'text-gray-800'}`}>
                      {data.day}
                    </span>
                    <span className={`text-xs ${data.isSonDay ? 'text-green-600' : 'text-gray-400'}`}>
                      {data.lunarDay}일
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 손 없는 날 설명 */}
        <section className="bg-purple-50 rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">🔮 {t.sonDayInfo}</h2>
          <div className="text-gray-700 space-y-3">
            <p>
              <strong>손 없는 날</strong>은 음력 기준으로 <strong>9, 10, 19, 20, 29, 30일</strong>을 말합니다.
            </p>
            <p>
              "손(損)"은 해로운 기운이나 악귀를 뜻하며, 이 날들은 손이 하늘로 올라가 
              인간 세상에 해를 끼치지 않는다고 전해집니다.
            </p>
            <p>
              그래서 <strong>이사, 개업, 결혼, 입학</strong> 등 새로운 시작을 하기에 좋은 길일로 여겨집니다.
              특히 이사할 때 손 없는 날을 선호하는 한국의 오랜 전통이 있습니다.
            </p>
          </div>
        </section>

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
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

        {/* 사용법 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 음력 변환기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>음력/양력 변환기</strong>는 양력 날짜를 음력으로 변환하고, 
              해당 날짜가 손 없는 날인지 확인해 드립니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              달력에서 초록색으로 표시된 날이 손 없는 날입니다. 
              이사, 개업, 결혼 등 중요한 일정을 잡을 때 참고하세요.
            </p>
            <p className="text-gray-600 leading-relaxed">
              * 본 음력 변환은 근사치 계산을 사용하며, 정확한 음력 날짜는 
              만세력이나 공인 기관의 자료를 확인하시기 바랍니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
