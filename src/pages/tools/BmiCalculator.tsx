import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

type Gender = 'male' | 'female';

interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
  weightDiff: number;
  healthRisk: string;
}

const i18n = {
  ko: {
    title: 'BMI 계산기',
    subtitle: '체질량지수(비만도) 측정',
    description: '키와 몸무게를 입력하면 BMI(체질량지수)와 비만도를 확인할 수 있습니다.',
    heightLabel: '키 (cm)',
    weightLabel: '몸무게 (kg)',
    genderLabel: '성별',
    genders: {
      male: '남성',
      female: '여성',
    },
    calculateButton: '계산하기',
    resetButton: '초기화',
    resultTitle: '계산 결과',
    yourBmi: '당신의 BMI',
    category: '비만도',
    idealWeight: '적정 체중 범위',
    weightDiff: '적정 체중까지',
    healthRisk: '건강 위험도',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: 'BMI란 무엇인가요?',
          answer: 'BMI(Body Mass Index, 체질량지수)는 체중(kg)을 키(m)의 제곱으로 나눈 값으로, 비만도를 측정하는 가장 널리 사용되는 지표입니다. 세계보건기구(WHO)와 대한비만학회에서 비만 판정 기준으로 활용합니다.',
        },
        {
          question: 'BMI 계산 공식은 무엇인가요?',
          answer: 'BMI = 체중(kg) ÷ 키(m)² 입니다. 예를 들어 키 170cm, 체중 65kg인 경우 BMI = 65 ÷ (1.7 × 1.7) = 22.5 입니다.',
        },
        {
          question: 'BMI의 한계는 무엇인가요?',
          answer: 'BMI는 근육량, 체지방률, 골밀도 등을 반영하지 못합니다. 운동선수처럼 근육량이 많은 사람은 BMI가 높아도 비만이 아닐 수 있고, 반대로 근육량이 적은 마른 비만도 있을 수 있습니다.',
        },
        {
          question: '아시아인 BMI 기준이 다른가요?',
          answer: '네, 아시아인은 같은 BMI에서도 체지방률이 높고 내장지방이 많아 더 낮은 기준을 적용합니다. WHO 아시아-태평양 기준으로 BMI 23 이상을 과체중, 25 이상을 비만으로 분류합니다.',
        },
      ],
    },
  },
};

// 아시아-태평양 기준 BMI 분류
const BMI_CATEGORIES = [
  { max: 18.5, label: '저체중', color: 'text-blue-600', bgColor: 'bg-blue-50', risk: '영양 결핍, 면역력 저하 위험' },
  { max: 23, label: '정상', color: 'text-green-600', bgColor: 'bg-green-50', risk: '건강한 상태' },
  { max: 25, label: '과체중', color: 'text-yellow-600', bgColor: 'bg-yellow-50', risk: '대사증후군 주의' },
  { max: 30, label: '비만 (1단계)', color: 'text-orange-600', bgColor: 'bg-orange-50', risk: '당뇨, 고혈압, 심혈관 질환 위험 증가' },
  { max: 35, label: '비만 (2단계)', color: 'text-red-600', bgColor: 'bg-red-50', risk: '심각한 건강 문제 위험' },
  { max: Infinity, label: '고도비만', color: 'text-red-800', bgColor: 'bg-red-100', risk: '매우 높은 건강 위험, 전문의 상담 필요' },
];

export default function BmiCalculator() {
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [gender, setGender] = useState<Gender>('male');
  const [result, setResult] = useState<BmiResult | null>(null);
  
  const { t } = useLocalizedContent(i18n);
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'bmi-calculator');

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

  const calculateBmi = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    
    const category = BMI_CATEGORIES.find((cat) => bmi < cat.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
    
    // 정상 BMI 범위 (18.5 ~ 23)로 적정 체중 계산
    const idealWeightMin = 18.5 * heightM * heightM;
    const idealWeightMax = 23 * heightM * heightM;
    
    // 적정 체중 중간값과의 차이
    const idealMiddle = (idealWeightMin + idealWeightMax) / 2;
    const weightDiff = w - idealMiddle;

    setResult({
      bmi,
      category: category.label,
      categoryColor: category.color,
      idealWeightMin,
      idealWeightMax,
      weightDiff,
      healthRisk: category.risk,
    });
  };

  const reset = () => {
    setHeight('170');
    setWeight('65');
    setGender('male');
    setResult(null);
  };

  // BMI 게이지 위치 계산 (0-40 범위를 0-100%로)
  const getBmiPosition = (bmi: number) => {
    const min = 15;
    const max = 40;
    const position = ((bmi - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const relatedTools = siteConfig.tools.filter(
    (tool) => ['bmr-calculator', 'calorie-burn-calculator', 'unit-converter', 'percent-calculator'].includes(tool.id)
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
              ⚖️ {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </header>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                placeholder="65"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={calculateBmi}
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
              
              {/* BMI 숫자 */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 mb-2">{t.yourBmi}</p>
                <p className={`text-6xl font-bold ${result.categoryColor}`}>
                  {result.bmi.toFixed(1)}
                </p>
                <p className={`text-2xl font-semibold ${result.categoryColor} mt-2`}>
                  {result.category}
                </p>
              </div>

              {/* BMI 게이지 */}
              <div className="mb-8">
                <div className="relative h-8 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="bg-blue-400 flex-1" title="저체중"></div>
                    <div className="bg-green-400 flex-1" title="정상"></div>
                    <div className="bg-yellow-400 flex-1" title="과체중"></div>
                    <div className="bg-orange-400 flex-1" title="비만1"></div>
                    <div className="bg-red-400 flex-1" title="비만2"></div>
                    <div className="bg-red-600 flex-1" title="고도비만"></div>
                  </div>
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2 transition-all"
                    style={{ left: `${getBmiPosition(result.bmi)}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {result.bmi.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>15</span>
                  <span>18.5</span>
                  <span>23</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40</span>
                </div>
              </div>

              {/* 상세 결과 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.idealWeight}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result.idealWeightMin.toFixed(1)} ~ {result.idealWeightMax.toFixed(1)} kg
                  </p>
                </div>
                <div className={`rounded-xl p-4 text-center ${result.weightDiff > 0 ? 'bg-red-50' : result.weightDiff < 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">{t.weightDiff}</p>
                  <p className={`text-lg font-semibold ${result.weightDiff > 0 ? 'text-red-600' : result.weightDiff < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                    {result.weightDiff > 0 ? '+' : ''}{result.weightDiff.toFixed(1)} kg
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.healthRisk}</p>
                  <p className="text-sm font-medium text-yellow-800">
                    {result.healthRisk}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <AdBanner slot="bmi-calculator-bottom" />

        {/* BMI 분류표 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 BMI 분류표 (아시아-태평양 기준)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">BMI</th>
                  <th className="px-4 py-2 text-left">분류</th>
                  <th className="px-4 py-2 text-left">건강 위험</th>
                </tr>
              </thead>
              <tbody>
                {BMI_CATEGORIES.map((cat, idx) => (
                  <tr key={idx} className={`border-b ${cat.bgColor}`}>
                    <td className="px-4 py-3">
                      {idx === 0 ? `18.5 미만` : 
                       idx === BMI_CATEGORIES.length - 1 ? `35 이상` :
                       `${BMI_CATEGORIES[idx - 1].max} ~ ${cat.max}`}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${cat.color}`}>{cat.label}</td>
                    <td className="px-4 py-3 text-gray-600">{cat.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 BMI 알아보기</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              BMI(Body Mass Index, 체질량지수)는 비만도를 측정하는 국제적 표준 지표입니다. 
              세계보건기구(WHO)와 대한비만학회에서 비만 판정 기준으로 사용하며, 
              건강검진 시에도 BMI를 기준으로 비만 여부를 판단합니다.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 BMI 계산 공식</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
              <p className="font-mono text-lg">BMI = 체중(kg) ÷ 키(m)²</p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">📌 아시아인 기준이 다른 이유</h3>
            <p className="text-gray-600 leading-relaxed">
              아시아인은 같은 BMI에서도 서양인보다 체지방률이 높고 내장지방이 많습니다. 
              따라서 WHO 아시아-태평양 지역에서는 더 엄격한 기준(BMI 23 이상 과체중, 25 이상 비만)을 
              적용합니다.
            </p>
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
