import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

interface Activity {
  id: string;
  name: string;
  category: string;
  met: number; // Metabolic Equivalent of Task
}

interface CalorieResult {
  activity: Activity;
  duration: number;
  weight: number;
  caloriesBurned: number;
  fatBurned: number; // 그램
}

const ACTIVITIES: Activity[] = [
  // 유산소 운동
  { id: 'walking-slow', name: '걷기 (느리게, 3km/h)', category: '유산소', met: 2.3 },
  { id: 'walking-normal', name: '걷기 (보통, 5km/h)', category: '유산소', met: 3.5 },
  { id: 'walking-fast', name: '빠르게 걷기 (6.5km/h)', category: '유산소', met: 5.0 },
  { id: 'jogging', name: '조깅 (8km/h)', category: '유산소', met: 8.0 },
  { id: 'running', name: '달리기 (10km/h)', category: '유산소', met: 10.0 },
  { id: 'running-fast', name: '빠르게 달리기 (12km/h)', category: '유산소', met: 12.5 },
  { id: 'cycling-leisure', name: '자전거 (여가, 15km/h)', category: '유산소', met: 4.0 },
  { id: 'cycling-moderate', name: '자전거 (보통, 20km/h)', category: '유산소', met: 6.8 },
  { id: 'cycling-fast', name: '자전거 (빠름, 25km/h)', category: '유산소', met: 10.0 },
  { id: 'swimming-leisure', name: '수영 (여가)', category: '유산소', met: 6.0 },
  { id: 'swimming-moderate', name: '수영 (보통)', category: '유산소', met: 8.0 },
  { id: 'swimming-fast', name: '수영 (빠름/경영)', category: '유산소', met: 10.0 },
  { id: 'jump-rope', name: '줄넘기', category: '유산소', met: 11.0 },
  { id: 'aerobics', name: '에어로빅', category: '유산소', met: 6.5 },
  { id: 'dancing', name: '댄스 (일반)', category: '유산소', met: 5.0 },
  { id: 'dancing-intense', name: '댄스 (격렬)', category: '유산소', met: 7.5 },
  
  // 근력 운동
  { id: 'weight-light', name: '웨이트 트레이닝 (가벼움)', category: '근력', met: 3.5 },
  { id: 'weight-moderate', name: '웨이트 트레이닝 (보통)', category: '근력', met: 5.0 },
  { id: 'weight-vigorous', name: '웨이트 트레이닝 (고강도)', category: '근력', met: 6.0 },
  { id: 'circuit-training', name: '서킷 트레이닝', category: '근력', met: 8.0 },
  { id: 'crossfit', name: '크로스핏', category: '근력', met: 9.0 },
  
  // 스포츠
  { id: 'basketball', name: '농구', category: '스포츠', met: 6.5 },
  { id: 'soccer', name: '축구', category: '스포츠', met: 7.0 },
  { id: 'tennis', name: '테니스', category: '스포츠', met: 7.3 },
  { id: 'badminton', name: '배드민턴', category: '스포츠', met: 5.5 },
  { id: 'golf', name: '골프 (카트 없이)', category: '스포츠', met: 4.8 },
  { id: 'bowling', name: '볼링', category: '스포츠', met: 3.0 },
  { id: 'table-tennis', name: '탁구', category: '스포츠', met: 4.0 },
  { id: 'volleyball', name: '배구', category: '스포츠', met: 4.0 },
  
  // 야외 활동
  { id: 'hiking', name: '등산 (보통)', category: '야외', met: 6.0 },
  { id: 'hiking-steep', name: '등산 (가파름)', category: '야외', met: 8.0 },
  { id: 'climbing', name: '암벽 등반', category: '야외', met: 8.0 },
  { id: 'skiing', name: '스키 (보통)', category: '야외', met: 7.0 },
  { id: 'snowboarding', name: '스노보드', category: '야외', met: 5.3 },
  
  // 실내 활동
  { id: 'yoga', name: '요가', category: '실내', met: 2.5 },
  { id: 'pilates', name: '필라테스', category: '실내', met: 3.0 },
  { id: 'stretching', name: '스트레칭', category: '실내', met: 2.3 },
  { id: 'treadmill', name: '러닝머신 (조깅)', category: '실내', met: 7.0 },
  { id: 'elliptical', name: '일립티컬', category: '실내', met: 5.0 },
  { id: 'stationary-bike', name: '실내 자전거 (보통)', category: '실내', met: 5.5 },
  { id: 'rowing', name: '로잉 머신', category: '실내', met: 7.0 },
  { id: 'stair-climbing', name: '계단 오르기', category: '실내', met: 9.0 },
  
  // 일상 활동
  { id: 'housework-light', name: '가사 (가벼운)', category: '일상', met: 2.5 },
  { id: 'housework-moderate', name: '가사 (청소, 빨래)', category: '일상', met: 3.5 },
  { id: 'gardening', name: '정원 가꾸기', category: '일상', met: 4.0 },
  { id: 'playing-kids', name: '아이와 놀기', category: '일상', met: 4.0 },
  { id: 'shopping', name: '쇼핑 (걸으면서)', category: '일상', met: 2.3 },
];

const i18n = {
  ko: {
    title: '운동 칼로리 소모 계산기',
    subtitle: '활동별 소모 칼로리 계산',
    description: '운동 종류, 시간, 체중을 입력하면 소모 칼로리를 계산합니다.',
    weightLabel: '체중 (kg)',
    activityLabel: '운동/활동',
    durationLabel: '운동 시간 (분)',
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    caloriesBurned: '소모 칼로리',
    fatBurned: '지방 연소량',
    equivalent: '이 칼로리는',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '칼로리 소모량은 어떻게 계산하나요?',
          answer: 'MET(대사당량) 값을 사용합니다. 칼로리 = MET × 체중(kg) × 시간(시간). MET은 운동 강도를 나타내며, 1 MET은 휴식 시 소비 에너지입니다.',
        },
        {
          question: 'MET 값이란 무엇인가요?',
          answer: 'MET(Metabolic Equivalent of Task)는 신체 활동의 에너지 소비량을 나타내는 단위입니다. 1 MET = 체중 1kg당 분당 1kcal 소비. 달리기는 약 10 MET, 걷기는 3.5 MET 정도입니다.',
        },
        {
          question: '지방 1kg을 태우려면 얼마나 운동해야 하나요?',
          answer: '지방 1kg = 약 7,700kcal입니다. 70kg 성인이 1시간 조깅하면 약 560kcal를 소모하므로, 약 14시간 조깅이 필요합니다. 하지만 식단 조절과 병행하는 것이 효과적입니다.',
        },
        {
          question: '운동 후에도 칼로리가 소모되나요?',
          answer: '네, EPOC(운동 후 초과 산소 소비) 효과로 고강도 운동 후 수 시간 동안 추가 칼로리가 소모됩니다. 이 계산기는 운동 중 소모량만 표시하며, 실제 효과는 더 클 수 있습니다.',
        },
      ],
    },
  },
};

export default function CalorieBurnCalculator() {
  const [weight, setWeight] = useState<string>('70');
  const [selectedActivity, setSelectedActivity] = useState<string>('jogging');
  const [duration, setDuration] = useState<string>('30');
  const [results, setResults] = useState<CalorieResult[]>([]);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'calorie-burn-calculator');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
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
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const activity = ACTIVITIES.find((a) => a.id === selectedActivity);

    if (isNaN(w) || isNaN(d) || w <= 0 || d <= 0 || !activity) return;

    // 칼로리 = MET × 체중(kg) × 시간(시간)
    const caloriesBurned = activity.met * w * (d / 60);
    
    // 지방 1g = 약 7.7kcal
    const fatBurned = caloriesBurned / 7.7;

    const newResult: CalorieResult = {
      activity,
      duration: d,
      weight: w,
      caloriesBurned: Math.round(caloriesBurned),
      fatBurned: Math.round(fatBurned * 10) / 10,
    };

    setResults([newResult, ...results.slice(0, 4)]); // 최근 5개 기록
  };

  const reset = () => {
    setWeight('70');
    setSelectedActivity('jogging');
    setDuration('30');
    setResults([]);
  };

  // 카테고리별 활동 그룹화
  const categories = [...new Set(ACTIVITIES.map((a) => a.category))];

  // 칼로리 환산 (음식)
  const getEquivalent = (calories: number) => {
    const items = [
      { name: '밥 한 공기', cal: 300 },
      { name: '삼겹살 1인분', cal: 500 },
      { name: '치킨 1조각', cal: 200 },
      { name: '피자 1조각', cal: 250 },
      { name: '아이스크림', cal: 200 },
      { name: '콜라 1캔', cal: 140 },
      { name: '맥주 500ml', cal: 200 },
      { name: '라면', cal: 500 },
    ];
    
    const matches = items.filter((item) => Math.abs(item.cal - calories) < calories * 0.3);
    if (matches.length > 0) {
      const item = matches[Math.floor(Math.random() * matches.length)];
      return `${item.name} 약 ${(calories / item.cal).toFixed(1)}개 분량`;
    }
    return `밥 약 ${(calories / 300).toFixed(1)}공기 분량`;
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['bmi-calculator', 'bmr-calculator', 'percent-calculator', 'unit-converter'].includes(tool.id)
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
              🏃 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.weightLabel}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.activityLabel}
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <optgroup key={category} label={category}>
                    {ACTIVITIES.filter((a) => a.category === category).map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name} (MET: {activity.met})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.durationLabel}
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateCalories}
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
          {results.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 {t.resultTitle}
              </h2>
              
              {/* 최신 결과 */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-6">
                <div className="text-center">
                  <p className="text-sm opacity-80 mb-1">{results[0].activity.name}</p>
                  <p className="text-sm opacity-80">{results[0].duration}분 | {results[0].weight}kg</p>
                  <p className="text-5xl font-bold my-4">
                    {results[0].caloriesBurned.toLocaleString()} kcal
                  </p>
                  <p className="text-sm opacity-80">
                    🔥 지방 연소량: 약 {results[0].fatBurned}g
                  </p>
                  <p className="text-sm opacity-80 mt-2">
                    🍚 {getEquivalent(results[0].caloriesBurned)}
                  </p>
                </div>
              </div>

              {/* 이전 기록 */}
              {results.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.slice(1).map((result, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">{result.activity.name}</p>
                      <p className="text-xs text-gray-400">{result.duration}분</p>
                      <p className="text-lg font-bold text-gray-800">
                        {result.caloriesBurned} kcal
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <AdBanner slot="calorie-burn-bottom" />

        {/* 인기 운동 칼로리 표 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 30분 운동별 소모 칼로리 (70kg 기준)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">운동</th>
                  <th className="px-4 py-2 text-center">MET</th>
                  <th className="px-4 py-2 text-center">소모 칼로리</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.filter((a) => ['jogging', 'swimming-moderate', 'cycling-moderate', 'hiking', 'weight-moderate', 'yoga', 'jump-rope', 'walking-fast'].includes(a.id))
                  .sort((a, b) => b.met - a.met)
                  .map((activity) => (
                    <tr key={activity.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{activity.name}</td>
                      <td className="px-4 py-3 text-center">{activity.met}</td>
                      <td className="px-4 py-3 text-center font-semibold text-orange-600">
                        {Math.round(activity.met * 70 * 0.5)} kcal
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 운동 칼로리 소모 알아보기</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              운동 칼로리 소모량은 MET(대사당량) 값을 기준으로 계산합니다. 
              MET은 운동의 강도를 나타내는 지표로, 휴식 시 에너지 소비를 1로 기준합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 계산 공식</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
              <p className="font-mono">칼로리(kcal) = MET × 체중(kg) × 시간(시간)</p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 효과적인 칼로리 소모 팁</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>고강도 인터벌 트레이닝(HIIT)</strong>: 짧은 시간에 높은 칼로리 소모</li>
              <li><strong>근력 운동</strong>: 운동 후에도 EPOC 효과로 추가 칼로리 소모</li>
              <li><strong>꾸준한 유산소</strong>: 지방 연소에 효과적</li>
              <li><strong>일상 활동량 늘리기</strong>: 계단 이용, 걸어서 출퇴근 등</li>
            </ul>
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
