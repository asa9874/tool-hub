import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

interface BmrResult {
  bmr: number;
  tdee: number;
  maintainCalories: number;
  mildWeightLoss: number;
  weightLoss: number;
  extremeWeightLoss: number;
  mildWeightGain: number;
  weightGain: number;
}

const i18n = {
  ko: {
    title: '기초대사량(BMR) 계산기',
    subtitle: '하루 칼로리 소모량 계산',
    description: '나이, 성별, 키, 몸무게를 입력하면 기초대사량과 활동대사량을 계산합니다.',
    ageLabel: '나이',
    genderLabel: '성별',
    genders: {
      male: '남성',
      female: '여성',
    },
    heightLabel: '키 (cm)',
    weightLabel: '몸무게 (kg)',
    activityLabel: '활동량',
    activityLevels: {
      sedentary: '비활동적 (운동 거의 안 함)',
      light: '가벼운 활동 (주 1-3회 운동)',
      moderate: '보통 활동 (주 3-5회 운동)',
      active: '활동적 (주 6-7회 운동)',
      'very-active': '매우 활동적 (하루 2회 이상)',
    },
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    bmr: '기초대사량 (BMR)',
    tdee: '총 에너지 소비량 (TDEE)',
    calorieGoals: '목표별 권장 칼로리',
    maintain: '체중 유지',
    mildLoss: '느린 감량 (-0.25kg/주)',
    loss: '감량 (-0.5kg/주)',
    extremeLoss: '빠른 감량 (-1kg/주)',
    mildGain: '느린 증량 (+0.25kg/주)',
    gain: '증량 (+0.5kg/주)',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '기초대사량(BMR)이란 무엇인가요?',
          answer: 'BMR(Basal Metabolic Rate)은 생명 유지에 필요한 최소한의 에너지로, 24시간 동안 아무 활동 없이 누워만 있어도 소모되는 칼로리입니다. 호흡, 심장 박동, 체온 유지 등에 사용됩니다.',
        },
        {
          question: 'TDEE와 BMR의 차이는 무엇인가요?',
          answer: 'TDEE(Total Daily Energy Expenditure)는 BMR에 일상 활동과 운동으로 소모되는 칼로리를 더한 총 에너지 소비량입니다. 체중 조절을 위해서는 TDEE를 기준으로 칼로리를 섭취해야 합니다.',
        },
        {
          question: '다이어트할 때 얼마나 칼로리를 줄여야 하나요?',
          answer: '일반적으로 TDEE에서 500kcal를 줄이면 주당 약 0.5kg 감량이 가능합니다. 하지만 BMR 이하로 섭취하면 건강에 해로우므로, 최소 BMR 이상은 섭취해야 합니다.',
        },
        {
          question: 'BMR 계산 공식은 무엇인가요?',
          answer: '이 계산기는 정확도가 높은 Mifflin-St Jeor 공식을 사용합니다. 남성: (10 × 체중) + (6.25 × 키) - (5 × 나이) + 5, 여성: (10 × 체중) + (6.25 × 키) - (5 × 나이) - 161',
        },
      ],
    },
  },
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export default function BmrCalculator() {
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<BmrResult | null>(null);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'bmr-calculator');

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

  const calculateBmr = () => {
    const a = parseInt(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(a) || isNaN(h) || isNaN(w) || a <= 0 || h <= 0 || w <= 0) return;

    // Mifflin-St Jeor 공식
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintainCalories: Math.round(tdee),
      mildWeightLoss: Math.round(tdee - 250), // -0.25kg/주
      weightLoss: Math.round(tdee - 500), // -0.5kg/주
      extremeWeightLoss: Math.round(tdee - 1000), // -1kg/주
      mildWeightGain: Math.round(tdee + 250), // +0.25kg/주
      weightGain: Math.round(tdee + 500), // +0.5kg/주
    });
  };

  const reset = () => {
    setAge('30');
    setGender('male');
    setHeight('170');
    setWeight('70');
    setActivityLevel('moderate');
    setResult(null);
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['bmi-calculator', 'calorie-burn-calculator', 'percent-calculator', 'unit-converter'].includes(tool.id)
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
              🔥 {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.genderLabel}
              </label>
              <div className="flex gap-4">
                {Object.entries(t.genders).map(([key, label]) => (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={key}
                      checked={gender === key}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="mr-2"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.ageLabel}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.heightLabel}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="170"
              />
            </div>

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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.activityLabel}
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(t.activityLevels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateBmr}
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
              
              {/* 주요 결과 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">{t.bmr}</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {result.bmr.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">kcal/일</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">{t.tdee}</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {result.tdee.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">kcal/일</p>
                </div>
              </div>

              {/* 목표별 칼로리 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  🎯 {t.calorieGoals}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-red-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.extremeLoss}</p>
                    <p className="text-lg font-bold text-red-700">{result.extremeWeightLoss.toLocaleString()} kcal</p>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.loss}</p>
                    <p className="text-lg font-bold text-orange-700">{result.weightLoss.toLocaleString()} kcal</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.mildLoss}</p>
                    <p className="text-lg font-bold text-yellow-700">{result.mildWeightLoss.toLocaleString()} kcal</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.maintain}</p>
                    <p className="text-lg font-bold text-green-700">{result.maintainCalories.toLocaleString()} kcal</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.mildGain}</p>
                    <p className="text-lg font-bold text-blue-700">{result.mildWeightGain.toLocaleString()} kcal</p>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">{t.gain}</p>
                    <p className="text-lg font-bold text-purple-700">{result.weightGain.toLocaleString()} kcal</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                ⚠️ 빠른 감량(-1kg/주)은 건강에 해로울 수 있습니다. BMR({result.bmr} kcal) 이하로는 섭취하지 마세요.
              </p>
            </div>
          )}
        </div>

        <AdBanner slot="bmr-calculator-bottom" />

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 기초대사량(BMR) 알아보기</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              기초대사량(BMR)은 아무 활동 없이 누워만 있어도 생명 유지를 위해 소모되는 칼로리입니다. 
              호흡, 심장 박동, 체온 조절, 세포 활동 등에 사용되며, 하루 총 에너지 소비의 60~75%를 차지합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 Mifflin-St Jeor 공식</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm mb-2">남성: BMR = (10 × 체중kg) + (6.25 × 키cm) - (5 × 나이) + 5</p>
              <p className="font-mono text-sm">여성: BMR = (10 × 체중kg) + (6.25 × 키cm) - (5 × 나이) - 161</p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 활동계수 (Activity Factor)</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>비활동적 (1.2)</strong>: 사무직, 운동 거의 안 함</li>
              <li><strong>가벼운 활동 (1.375)</strong>: 주 1-3회 가벼운 운동</li>
              <li><strong>보통 활동 (1.55)</strong>: 주 3-5회 중간 강도 운동</li>
              <li><strong>활동적 (1.725)</strong>: 주 6-7회 고강도 운동</li>
              <li><strong>매우 활동적 (1.9)</strong>: 운동선수, 하루 2회 이상 운동</li>
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
