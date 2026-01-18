import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface Beverage {
  id: string;
  name: string;
  caffeine: number; // mg
  icon: string;
}

interface ConsumedItem {
  beverage: Beverage;
  quantity: number;
  time: string;
}

const BEVERAGES: Beverage[] = [
  { id: 'espresso', name: '에스프레소 (1샷)', caffeine: 63, icon: '☕' },
  { id: 'americano', name: '아메리카노 (톨)', caffeine: 150, icon: '☕' },
  { id: 'americano-grande', name: '아메리카노 (그란데)', caffeine: 225, icon: '☕' },
  { id: 'latte', name: '카페라떼 (톨)', caffeine: 75, icon: '🥛' },
  { id: 'cappuccino', name: '카푸치노 (톨)', caffeine: 75, icon: '☕' },
  { id: 'cold-brew', name: '콜드브루 (톨)', caffeine: 200, icon: '🧊' },
  { id: 'instant', name: '인스턴트 커피 (1잔)', caffeine: 60, icon: '☕' },
  { id: 'drip', name: '드립 커피 (1잔)', caffeine: 95, icon: '☕' },
  { id: 'decaf', name: '디카페인 커피', caffeine: 5, icon: '☕' },
  { id: 'green-tea', name: '녹차 (1잔)', caffeine: 30, icon: '🍵' },
  { id: 'black-tea', name: '홍차 (1잔)', caffeine: 47, icon: '🍵' },
  { id: 'matcha', name: '말차 라떼', caffeine: 70, icon: '🍵' },
  { id: 'energy-drink', name: '에너지 드링크 (레드불 등)', caffeine: 80, icon: '⚡' },
  { id: 'monster', name: '몬스터 에너지', caffeine: 160, icon: '⚡' },
  { id: 'hot6', name: '핫식스', caffeine: 60, icon: '⚡' },
  { id: 'cola', name: '콜라 (355ml)', caffeine: 34, icon: '🥤' },
  { id: 'diet-cola', name: '다이어트 콜라 (355ml)', caffeine: 46, icon: '🥤' },
  { id: 'chocolate', name: '다크 초콜릿 (30g)', caffeine: 20, icon: '🍫' },
  { id: 'headache-pill', name: '두통약 (1정)', caffeine: 65, icon: '💊' },
];

const DAILY_LIMIT = 400; // mg (성인 기준)
const WARNING_LEVEL = 300; // mg

const i18n = {
  ko: {
    title: '일일 카페인 섭취량 계산기',
    subtitle: '오늘 마신 음료를 선택하고 건강한 카페인 섭취량을 확인하세요',
    description: '커피, 에너지 드링크 등 음료별 카페인 함량을 계산하여 하루 권장량 대비 섭취 수준을 확인합니다.',
    selectBeverage: '음료 선택',
    addBeverage: '추가',
    todayIntake: '오늘 섭취량',
    dailyLimit: '일일 권장 한도',
    remaining: '남은 섭취 가능량',
    consumed: '섭취한 음료',
    clear: '초기화',
    safe: '안전',
    warning: '주의',
    danger: '위험',
    overconsumption: '과다 섭취',
    caffeineInfo: '카페인 정보',
    symptoms: '과다 섭취 시 증상',
    tips: '건강한 카페인 섭취 팁',
    faq: {
      q1: '성인의 하루 카페인 권장량은 얼마인가요?',
      a1: 'FDA와 EFSA(유럽식품안전청)에서는 건강한 성인 기준 하루 400mg 이하를 권장합니다. 이는 아메리카노 약 2~3잔에 해당합니다. 임산부는 200mg 이하, 청소년은 체중 1kg당 2.5mg 이하가 권장됩니다.',
      q2: '카페인을 과다 섭취하면 어떤 증상이 나타나나요?',
      a2: '두통, 불면증, 심장 두근거림, 불안감, 소화불량, 손 떨림 등이 나타날 수 있습니다. 심한 경우 구토, 경련 등이 발생할 수 있으니 증상이 지속되면 의료 전문가와 상담하세요.',
      q3: '카페인 효과는 얼마나 지속되나요?',
      a3: '카페인의 반감기는 평균 5~6시간입니다. 즉, 오후 3시에 마신 커피의 절반은 밤 9시까지 체내에 남아있습니다. 수면에 영향을 받는 분은 오후 2시 이후 카페인 섭취를 피하는 것이 좋습니다.',
    },
  },
};

export default function CaffeineCalculator() {
  const lang = 'ko';
  const t = i18n[lang];

  const [consumed, setConsumed] = useState<ConsumedItem[]>([]);
  const [selectedBeverage, setSelectedBeverage] = useState<string>(BEVERAGES[1].id);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'caffeine-calculator');

  const totalCaffeine = useMemo(() => {
    return consumed.reduce((sum, item) => sum + item.beverage.caffeine * item.quantity, 0);
  }, [consumed]);

  const percentage = Math.min((totalCaffeine / DAILY_LIMIT) * 100, 100);
  const remaining = Math.max(DAILY_LIMIT - totalCaffeine, 0);

  const getStatus = () => {
    if (totalCaffeine >= DAILY_LIMIT) return { label: t.danger, color: 'text-red-600', bg: 'bg-red-500' };
    if (totalCaffeine >= WARNING_LEVEL) return { label: t.warning, color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { label: t.safe, color: 'text-green-600', bg: 'bg-green-500' };
  };

  const status = getStatus();

  const addBeverage = () => {
    const beverage = BEVERAGES.find(b => b.id === selectedBeverage);
    if (!beverage) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setConsumed([...consumed, { beverage, quantity: 1, time }]);
  };

  const removeBeverage = (index: number) => {
    setConsumed(consumed.filter((_, i) => i !== index));
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'HealthApplication',
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">☕ {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 현재 섭취량 표시 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {totalCaffeine}<span className="text-2xl text-gray-500">mg</span>
            </div>
            <div className="text-gray-500">/ {DAILY_LIMIT}mg {t.dailyLimit}</div>
            <div className={`text-lg font-semibold mt-2 ${status.color}`}>
              {status.label}
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 ${status.bg}`}
              style={{ width: `${percentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
              {percentage.toFixed(0)}%
            </div>
          </div>

          {/* 남은 섭취 가능량 */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t.todayIntake}: {totalCaffeine}mg</span>
            <span>{t.remaining}: {remaining}mg</span>
          </div>
        </section>

        {/* 음료 추가 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.selectBeverage}</h2>
          
          <div className="flex gap-3 mb-4">
            <select
              value={selectedBeverage}
              onChange={(e) => setSelectedBeverage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {BEVERAGES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.icon} {b.name} ({b.caffeine}mg)
                </option>
              ))}
            </select>
            <button
              onClick={addBeverage}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              {t.addBeverage}
            </button>
          </div>

          {/* 음료 버튼 그리드 */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {BEVERAGES.slice(0, 10).map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBeverage(b.id);
                  const now = new Date();
                  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                  setConsumed([...consumed, { beverage: b, quantity: 1, time }]);
                }}
                className="p-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-xs text-gray-600 truncate">{b.name.split(' (')[0]}</div>
                <div className="text-xs text-amber-600 font-medium">{b.caffeine}mg</div>
              </button>
            ))}
          </div>
        </section>

        {/* 섭취한 음료 목록 */}
        {consumed.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t.consumed}</h2>
              <button
                onClick={() => setConsumed([])}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t.clear}
              </button>
            </div>
            <div className="space-y-3">
              {consumed.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.beverage.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{item.beverage.name}</div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-600 font-medium">{item.beverage.caffeine}mg</span>
                    <button
                      onClick={() => removeBeverage(index)}
                      className="text-gray-400 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 과다 섭취 경고 */}
        {totalCaffeine >= WARNING_LEVEL && (
          <section className={`rounded-xl p-6 mb-6 ${totalCaffeine >= DAILY_LIMIT ? 'bg-red-50 border-2 border-red-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
            <h2 className={`text-lg font-bold mb-3 ${totalCaffeine >= DAILY_LIMIT ? 'text-red-700' : 'text-yellow-700'}`}>
              ⚠️ {totalCaffeine >= DAILY_LIMIT ? t.overconsumption : t.warning}
            </h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>{t.symptoms}:</strong> 두근거림, 불안감, 수면 장애, 소화불량, 두통, 손 떨림</p>
              <p><strong>대처법:</strong></p>
              <ul className="list-disc list-inside ml-2 text-sm">
                <li>물을 충분히 마셔 카페인 배출을 돕습니다</li>
                <li>가벼운 산책으로 긴장을 풀어줍니다</li>
                <li>오늘은 추가 카페인 섭취를 피하세요</li>
                <li>증상이 심하면 의료 전문가와 상담하세요</li>
              </ul>
            </div>
          </section>
        )}

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* 카페인 정보 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 {t.caffeineInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">권장 섭취량 (하루)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 건강한 성인: <strong>400mg 이하</strong></li>
                <li>• 임산부: <strong>200mg 이하</strong></li>
                <li>• 청소년: <strong>체중 1kg당 2.5mg</strong></li>
                <li>• 어린이: <strong>섭취 자제 권장</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">{t.tips}</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 오후 2시 이후 카페인 섭취 자제</li>
                <li>• 카페인과 함께 물 충분히 마시기</li>
                <li>• 공복에 커피 마시지 않기</li>
                <li>• 디카페인으로 대체하기</li>
              </ul>
            </div>
          </div>
        </section>

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

        {/* 사용법 설명 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 카페인 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>일일 카페인 섭취량 계산기</strong>는 오늘 마신 커피, 에너지 드링크, 차 등의 카페인을 
              합산하여 성인 하루 권장량(400mg) 대비 섭취 수준을 보여줍니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              음료를 선택하거나 버튼을 클릭하면 자동으로 추가됩니다. 
              권장량의 75% 이상 섭취 시 주의 경고, 100% 초과 시 위험 경고와 함께 대처법을 안내합니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              카페인은 적당량 섭취 시 집중력 향상에 도움이 되지만, 과다 섭취는 수면 장애와 건강 문제를 유발할 수 있습니다.
              본 계산기로 매일 카페인 섭취량을 체크하고 건강한 습관을 만들어보세요.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
