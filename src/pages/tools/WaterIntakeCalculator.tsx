import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const i18n = {
  ko: {
    title: '하루 권장 음수량 계산기',
    subtitle: '체중과 활동량에 맞는 적정 물 섭취량을 확인하세요',
    description: '몸무게를 기반으로 하루에 마셔야 할 물의 양을 컵 단위로 알려드립니다.',
    weight: '체중 (kg)',
    activityLevel: '활동량',
    calculate: '계산하기',
    result: '권장 음수량',
    glasses: '컵',
    glassSize: '(200ml 기준)',
    liters: '리터',
    ml: 'ml',
    perDay: '/일',
    activityLevels: {
      sedentary: '앉아서 생활 (사무직)',
      light: '가벼운 활동 (주 1-2회 운동)',
      moderate: '보통 활동 (주 3-4회 운동)',
      active: '활발한 활동 (주 5-6회 운동)',
      'very-active': '매우 활발 (매일 운동/육체 노동)',
    },
    tips: '💧 물 마시기 팁',
    tipsList: [
      '아침에 일어나자마자 물 한 잔을 마시면 대사 활성화에 도움됩니다.',
      '식사 30분 전에 물을 마시면 포만감을 높여 과식을 예방합니다.',
      '커피나 술을 마신 후에는 같은 양의 물을 추가로 섭취하세요.',
      '갈증을 느끼기 전에 조금씩 자주 마시는 것이 좋습니다.',
      '운동 중에는 15-20분마다 150-200ml씩 섭취하세요.',
    ],
    schedule: '⏰ 물 마시기 일정 예시',
    warning: '⚠️ 주의사항',
    warningText: '신장 질환, 심장 질환 등이 있는 경우 의사와 상담 후 적정 수분 섭취량을 결정하세요.',
    benefits: '🌟 적정 수분 섭취의 효과',
    benefitsList: [
      { title: '피로 해소', desc: '탈수는 피로의 주요 원인 중 하나입니다.' },
      { title: '집중력 향상', desc: '뇌 기능 유지에 수분이 필수적입니다.' },
      { title: '피부 건강', desc: '피부 탄력과 촉촉함을 유지합니다.' },
      { title: '체중 관리', desc: '신진대사를 촉진하고 포만감을 줍니다.' },
      { title: '해독 작용', desc: '노폐물 배출을 도와줍니다.' },
    ],
    faq: {
      q1: '하루에 물 8잔(2리터)은 누구에게나 적용되나요?',
      a1: '아닙니다. 권장 수분량은 체중, 활동량, 기후, 건강 상태에 따라 달라집니다. 체중이 많이 나가거나 운동을 많이 하는 사람은 더 많은 수분이 필요합니다. 이 계산기는 개인의 체중과 활동량을 고려해 맞춤 권장량을 제안합니다.',
      q2: '물 대신 다른 음료도 괜찮나요?',
      a2: '물이 가장 좋지만, 무설탕 차, 우유 등도 수분 섭취에 포함됩니다. 단, 카페인 음료(커피, 에너지드링크)와 알코올은 이뇨 작용으로 오히려 수분을 배출시키므로 별도로 물을 더 마셔야 합니다.',
      q3: '물을 너무 많이 마시면 해로울 수 있나요?',
      a3: '드물지만 과도한 수분 섭취는 저나트륨혈증을 유발할 수 있습니다. 건강한 성인의 경우 하루 3-4리터 정도는 안전하지만, 신장이나 심장 질환이 있는 분은 의사와 상담하세요.',
    },
  },
};

// 시간대별 물 마시기 일정
const waterSchedule = [
  { time: '07:00', desc: '기상 직후', amount: '250ml', reason: '밤새 탈수 보충' },
  { time: '09:00', desc: '오전 업무 시작', amount: '250ml', reason: '집중력 향상' },
  { time: '11:00', desc: '점심 전', amount: '200ml', reason: '과식 예방' },
  { time: '13:00', desc: '점심 후', amount: '200ml', reason: '소화 촉진' },
  { time: '15:00', desc: '오후 간식 시간', amount: '250ml', reason: '오후 피로 예방' },
  { time: '17:00', desc: '퇴근 전', amount: '200ml', reason: '저녁 준비' },
  { time: '19:00', desc: '저녁 식사 후', amount: '200ml', reason: '소화 도움' },
  { time: '21:00', desc: '취침 1-2시간 전', amount: '150ml', reason: '적당히 (야간 화장실 방지)' },
];

export default function WaterIntakeCalculator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<{ ml: number; liters: number; glasses: number } | null>(null);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'water-intake-calculator');

  // 활동량에 따른 배수
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 30,
    light: 33,
    moderate: 35,
    active: 38,
    'very-active': 40,
  };

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'HealthApplication',
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
    mainEntity: [
      {
        '@type': 'Question',
        name: t.faq.q1,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 },
      },
      {
        '@type': 'Question',
        name: t.faq.q2,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 },
      },
      {
        '@type': 'Question',
        name: t.faq.q3,
        acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 },
      },
    ],
  };

  const calculateWaterIntake = () => {
    const weightNum = parseFloat(weight);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      alert('체중을 올바르게 입력해주세요 (1-300kg)');
      return;
    }

    const multiplier = activityMultipliers[activityLevel];
    const totalMl = Math.round(weightNum * multiplier);
    const totalLiters = Math.round((totalMl / 1000) * 10) / 10;
    const totalGlasses = Math.round(totalMl / 200);

    setResult({
      ml: totalMl,
      liters: totalLiters,
      glasses: totalGlasses,
    });
  };

  // 물컵 시각화
  const glassVisualization = useMemo(() => {
    if (!result) return [];
    const fullGlasses = Math.floor(result.glasses);
    const partial = result.glasses - fullGlasses;
    const glasses = [];

    for (let i = 0; i < Math.min(fullGlasses, 12); i++) {
      glasses.push(1);
    }
    if (partial > 0 && glasses.length < 12) {
      glasses.push(partial);
    }
    if (fullGlasses > 12) {
      glasses.push(-1); // more indicator
    }

    return glasses;
  }, [result]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">💧 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 계산기 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="space-y-6">
            {/* 체중 입력 */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                {t.weight}
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="예: 65"
                min="1"
                max="300"
              />
            </div>

            {/* 활동량 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.activityLevel}</label>
              <div className="space-y-2">
                {(Object.keys(t.activityLevels) as ActivityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setActivityLevel(level)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activityLevel === level
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {t.activityLevels[level]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateWaterIntake}
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors"
            >
              {t.calculate}
            </button>
          </div>
        </section>

        {/* 결과 표시 */}
        {result && (
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.result}</h2>

            {/* 메인 결과 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-blue-600">{result.ml.toLocaleString()}</p>
                <p className="text-gray-600">{t.ml} {t.perDay}</p>
              </div>
              <div className="bg-white p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-cyan-600">{result.liters}</p>
                <p className="text-gray-600">{t.liters} {t.perDay}</p>
              </div>
              <div className="bg-blue-500 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-white">{result.glasses}</p>
                <p className="text-blue-100">{t.glasses} {t.glassSize}</p>
              </div>
            </div>

            {/* 컵 시각화 */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {glassVisualization.map((fill, index) => (
                <div key={index} className="relative w-10 h-14">
                  {fill === -1 ? (
                    <div className="w-full h-full flex items-center justify-center text-blue-500 font-bold">
                      +{result.glasses - 12}
                    </div>
                  ) : (
                    <svg viewBox="0 0 40 56" className="w-full h-full">
                      {/* 컵 외곽 */}
                      <path
                        d="M5 8 L7 48 C7 52 12 54 20 54 C28 54 33 52 33 48 L35 8 L5 8 Z"
                        fill="none"
                        stroke="#93C5FD"
                        strokeWidth="2"
                      />
                      {/* 물 채우기 */}
                      <clipPath id={`cup-${index}`}>
                        <path d="M7 10 L9 48 C9 50 12 52 20 52 C28 52 31 50 31 48 L33 10 L7 10 Z" />
                      </clipPath>
                      <rect
                        x="5"
                        y={10 + 42 * (1 - fill)}
                        width="30"
                        height={42 * fill}
                        fill="#3B82F6"
                        clipPath={`url(#cup-${index})`}
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600">
              하루 동안 200ml 컵으로 <span className="font-bold text-blue-600">{result.glasses}잔</span>을 마시세요
            </p>
          </section>
        )}

        {/* 물 마시기 일정 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.schedule}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waterSchedule.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{item.time}</p>
                  <p className="text-xs text-gray-500">{item.amount}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.desc}</p>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                </div>
                <span className="text-2xl">💧</span>
              </div>
            ))}
          </div>
        </section>

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* 팁 섹션 */}
        <section className="bg-cyan-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.tips}</h2>
          <ul className="space-y-3">
            {t.tipsList.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-cyan-500">💧</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 효과 섹션 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.benefits}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.benefitsList.map((benefit, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 주의사항 */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">{t.warning}</h2>
          <p className="text-yellow-700">{t.warningText}</p>
        </section>

        {/* FAQ 섹션 */}
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

        {/* 사용법 설명 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 물 섭취량 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>하루 권장 음수량 계산기</strong>는 체중과 활동량을 기반으로 개인에게 맞는 적정 수분 섭취량을 계산해드립니다. 흔히
              "하루 8잔"이라고 하지만, 실제로는 체중과 생활 패턴에 따라 크게 달라집니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              체중이 60kg인 사무직 직장인과 80kg인 운동선수가 같은 양의 물을 마실 필요는 없습니다. 이 계산기는 체중 1kg당 30~40ml를 기준으로,
              활동량에 따라 정밀하게 권장량을 산출합니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              충분한 수분 섭취는 피로 해소, 집중력 향상, 피부 건강, 체중 관리에 도움이 됩니다. 하지만 갈증을 느낄 때는 이미 1~2%의 탈수가
              진행된 상태입니다. 목이 마르기 전에 규칙적으로 물을 마시는 습관을 들이세요. 이 도구와 함께 건강한 물 마시기를 시작해보세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
